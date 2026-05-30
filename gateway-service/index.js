require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const authMiddleware = require('./middleware/authMiddleware.js');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
  origin: "http://18.188.19.21:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// --- CONFIGURACIÓN DE SWAGGER ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Streamhub API Gateway',
      version: '1.0.0',
      description: 'Documentación interactiva de los endpoints principales de Streamhub',
    },
    servers: [
      {
        url: 'http://18.188.19.21:8000',
      },
    ],
    tags: [
      { name: 'Catálogo', description: 'Operaciones relacionadas con películas' },
      { name: 'Usuarios', description: 'Gestión de usuarios' },
      { name: 'Historial', description: 'Seguimiento de reproducción' },
      { name: 'Seguir Viendo', description: 'Películas en progreso' },
      { name: 'Interacciones', description: 'Comentarios y votos' }
    ],
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- VARIABLES DE ENTORNO ---
const CATALOG_URL = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:8000';
const USERS_URL = process.env.USERS_SERVICE_URL || 'http://users-service:8000';
const INTERACTIONS_URL = process.env.INTERACTIONS_SERVICE_URL || 'http://interactions-service:8000';
const STREAM_URL = process.env.STREAM_URL || 'http://streamhub.local/media/';

// --- RUTAS DEL GATEWAY ---

/**
 * @swagger
 * /api/peliculas:
 *   get:
 *     summary: Obtiene el catálogo completo de películas
 *     tags:
 *       - Catálogo
 *     responses:
 *       200:
 *         description: Lista de películas obtenida con éxito
 */
app.get('/api/peliculas', async (req, res) => {
  try {
    const resp = await axios.get(`${CATALOG_URL}/peliculas`, { params: req.query });
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error conectando con el catálogo" });
  }
});

/**
 * @swagger
 * /api/peliculas:
 *   post:
 *     summary: Crea una nueva película
 *     tags:
 *       - Catálogo
 */
app.post('/api/peliculas', authMiddleware, async (req, res) => {
  try {
    const payload = { ...req.body, creadorId: req.user.userId };
    const resp = await axios.post(`${CATALOG_URL}/peliculas`, payload);
    res.json(resp.data);
  } catch (error) {
    console.error("Error creando pelicula en gateway:", error.message);
    res.status(500).json({ error: "Error al crear la película" });
  }
});

/**
 * @swagger
 * /api/peliculas/estrenos:
 *   get:
 *     summary: Obtiene el top 10 de películas más recientes
 *     tags:
 *      - Catálogo
 *     responses:
 *       200:
 *         description: Lista de estrenos
 */
app.get('/api/peliculas/estrenos', async (req, res) => {
  try {
    const resp = await axios.get(`${CATALOG_URL}/peliculas/estrenos`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error conectando con el catálogo para los estrenos" });
  }
});

/**
 * @swagger
 * /api/peliculas/top:
 *   get:
 *     summary: Obtiene el top 10 de películas más vistas
 *     tags:
 *      - Catálogo
 *     responses:
 *       200:
 *         description: Lista de películas top
 */
app.get('/api/peliculas/top', async (req, res) => {
  try {
    const resp = await axios.get(`${CATALOG_URL}/peliculas/top`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error conectando con el catálogo para el top 10" });
  }
});

/**
 * @swagger
 * /api/peliculas/{id}:
 *   get:
 *     summary: Obtiene los detalles de una película específica
 *     tags:
 *       - Catálogo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la película obtenidos con éxito
 *       404:
 *         description: Película no encontrada
 */
app.get('/api/peliculas/:id', async (req, res) => {
  try {
    const resp = await axios.get(`${CATALOG_URL}/peliculas/${req.params.id}`);
    let pelicula = resp.data;

    // MAGIA DE STREAMING: Concatenamos el dominio de Nginx con el nombre del archivo
    if (pelicula && pelicula.rutaVideo) {
      // Creamos un nuevo campo llamado "rutaVideoCompleta" para el frontend
      pelicula.rutaVideoCompleta = `${STREAM_URL}${pelicula.rutaVideo}`;
    }

    res.json(pelicula);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    if (error.response && error.response.status === 400) {
      return res.status(400).json({ error: "ID no válido o no encontrado" });
    }
    res.status(500).json({ error: "Error conectando con el catálogo" });
  }
});

/**
 * @swagger
 * /api/peliculas/{id}:
 *   put:
 *     summary: Actualiza una película existente del creador autenticado
 *     tags:
 *       - Catálogo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Película actualizada con éxito
 *       403:
 *         description: No autorizado
 */
app.put('/api/peliculas/:id', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.put(`${CATALOG_URL}/peliculas/${req.params.id}`, req.body);
    res.json(resp.data);
  } catch (error) {
    console.error("Error al actualizar película en gateway:", error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: "Error al actualizar la película" });
  }
});

/**
 * @swagger
 * /api/peliculas/{id}:
 *   delete:
 *     summary: Elimina una película del creador autenticado
 *     tags:
 *       - Catálogo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Película eliminada con éxito
 *       403:
 *         description: No autorizado
 */
app.delete('/api/peliculas/:id', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.delete(`${CATALOG_URL}/peliculas/${req.params.id}`);
    res.json(resp.data);
  } catch (error) {
    console.error("Error al eliminar película en gateway:", error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: "Error al eliminar la película" });
  }
});


/**
 * @swagger
 * /api/historial:
 *   post:
 *     summary: Registra el progreso de visualización de un usuario
 *     tags:
 *       - Historial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: string
 *               peliculaId:
 *                 type: string
 *               minutoPausa:
 *                 type: number
 *     responses:
 *       200:
 *         description: Historial actualizado
 */
app.post('/api/historial', authMiddleware, async (req, res) => {
  try {
    req.body.usuarioId = req.user.userId;
    const resp = await axios.post(`${USERS_URL}/historial`, req.body);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el historial" });
  }
});

/**
 * @swagger
 * /api/historial:
 *   get:
 *     summary: Obtiene las películas que el usuario dejó a medias
 *     tags:
 *       - Seguir Viendo
 *     responses:
 *       200:
 *         description: Lista combinada de historial y detalles de películas
 */
app.get('/api/historial', authMiddleware, async (req, res) => {
  try {

    const historialResp = await axios.get(`${USERS_URL}/historial/${req.user.userId}`);
    const historial = historialResp.data;

    if (historial.length === 0) {
      return res.json([]);
    }

    const idsPeliculas = historial.map(item => item.peliculaId);

    const detallesResp = await axios.post(`${CATALOG_URL}/peliculas/batch`, {
      ids: idsPeliculas
    });

    const detallesPeliculas = detallesResp.data;

    const resultado = historial.map(item => {
      const detalle = detallesPeliculas.find(p => p.id === item.peliculaId);

      return {
        ...item,
        pelicula: detalle || null
      };
    });

    res.json(resultado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error componiendo historial" });
  }
});

/**
 * @swagger
 * /api/historial/{peliculaId}:
 *   get:
 *     summary: Obtiene el progreso de una película para el usuario actual
 *     tags:
 *       - Historial
 */
app.get('/api/historial/:peliculaId', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/historial/${req.user.userId}/${req.params.peliculaId}`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener progreso de la película" });
  }
});

/**
 * @swagger
 * /api/historial:
 *   delete:
 *     summary: Borra el historial del usuario actual
 *     tags:
 *       - Historial
 */
app.delete('/api/historial', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.delete(`${USERS_URL}/historial/${req.user.userId}`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al limpiar el historial" });
  }
});

// --- NUEVA RUTA DE USUARIOS ---

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene la lista completa de usuarios registrados
 *     tags:
 *      - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 */
app.get('/api/usuarios', async (req, res) => {
  try {
    // Le pedimos al microservicio de usuarios que nos devuelva todos
    const resp = await axios.get(`${USERS_URL}/usuarios`);
    res.json(resp.data);
  } catch (error) {
    console.error("Error en /api/usuarios:", error.message);
    res.status(500).json({ error: "Error conectando con el servicio de usuarios" });
  }
});

/**
 * @swagger
 * /api/usuarios/{id}/plan:
 *   put:
 *     summary: Actualiza el plan de un usuario
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Plan actualizado
 */
app.put('/api/usuarios/:id/plan', async (req, res) => {
  try {
    const resp = await axios.put(`${USERS_URL}/usuarios/${req.params.id}/plan`, req.body);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el plan" });
  }
});

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Crea un nuevo usuario al registrarse
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 */

app.post('/api/auth/register', async (req, res) => {
  try {
    const resp = await axios.post(`${USERS_URL}/register`, req.body, {
      withCredentials: true
    });
    const cookies = resp.headers['set-cookie'];

    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }
    res.json(resp.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    console.error("gateway error:", error.message);
    res.status(500).json({ error: "Error en gateway" });
  }
});

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Verifica si un usuario puede ingresar a la plataforma
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */

app.post('/api/auth/login', async (req, res) => {
  try {
    const resp = await axios.post(`${USERS_URL}/login`, req.body);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Correo o contraseña incorrectos" })
  }
})

/**
 * @swagger
 * /api/interacciones/comentarios/{peliculaId}:
 *   get:
 *     summary: Obtiene todos los comentarios de una película específica
 *     tags:
 *       - Interacciones
 *     parameters:
 *       - in: path
 *         name: peliculaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida con éxito
 */
app.get('/api/interacciones/comentarios/:peliculaId', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.get(`${INTERACTIONS_URL}/comentarios/${req.params.peliculaId}`);
    res.json(resp.data);
  } catch (error) {
    console.error("Error en /api/interacciones/comentarios:", error.message);
    res.status(500).json({ error: "Error conectando con el servicio de interacciones" });
  }
});

/**
 * @swagger
 * /api/interacciones/comentarios:
 *   post:
 *     summary: Agrega un nuevo comentario a una película
 *     tags:
 *       - Interacciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: string
 *               peliculaId:
 *                 type: string
 *               contenido:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario creado con éxito
 */
app.post('/api/interacciones/comentarios', authMiddleware, async (req, res) => {
  try {
    const { peliculaId, contenido, parentId } = req.body;
    const resp = await axios.post(`${INTERACTIONS_URL}/comentarios`, {
      usuarioId: req.user.userId,
      peliculaId,
      contenido,
      parentId
    });
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el comentario" });
  }
});

// Proxy para obtener el conteo de comentarios por lote
app.post('/api/interacciones/comentarios/count-batch', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.post(`${INTERACTIONS_URL}/comentarios/count-batch`, req.body);
    res.json(resp.data);
  } catch (error) {
    console.error("Error en /api/interacciones/comentarios/count-batch:", error.message);
    res.status(500).json({ error: "Error al calcular el lote de comentarios" });
  }
});

/**
 * @swagger
 * /api/interacciones/votar:
 *   post:
 *     summary: Registra un Like o Dislike en una película
 *     tags:
 *       - Interacciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: string
 *               peliculaId:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum:
 *                   - LIKE
 *                   - DISLIKE
 *     responses:
 *       200:
 *         description: Interacción registrada con éxito
 *       400:
 *         description: El usuario ya votó en esta película
 */
app.post('/api/interacciones/votar', authMiddleware, async (req, res) => {
  try {
    const payload = {
      usuarioId: req.user.userId,
      peliculaId: req.body.peliculaId,
      tipo: req.body.tipo
    };
    const resp = await axios.post(`${INTERACTIONS_URL}/interaccion`, payload);
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return res.status(400).json({ error: error.response.data.error });
    }
    res.status(500).json({ error: "Error al registrar la interacción" });
  }
});

/**
 * @swagger
 * /api/interacciones/status/{peliculaId}:
 *   get:
 *     summary: Obtiene el estado del voto del usuario actual en una película
 *     tags:
 *       - Interacciones
 */
app.get('/api/interacciones/status/:peliculaId', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.get(`${INTERACTIONS_URL}/interaccion/status/${req.params.peliculaId}/${req.user.userId}`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estado de la interacción" });
  }
});

// --- RUTAS DE PERFIL ---

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags:
 *       - Perfil
 */
app.get('/api/perfil', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/profile/${req.user.userId}`);
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

/**
 * @swagger
 * /api/perfil/name:
 *   put:
 *     summary: Cambia el nombre del usuario autenticado
 *     tags:
 *       - Perfil
 */
app.put('/api/perfil/name', authMiddleware, async (req, res) => {
  try {
    console.log("BODY EN GATEWAY (name):", req.body, "USER ID:", req.user.userId);
    const resp = await axios.put(`${USERS_URL}/profile/name/${req.user.userId}`, req.body);
    res.json(resp.data);
  } catch (error) {
    console.error("ERROR GATEWAY NAME:", error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 400) {
      return res.status(400).json({ error: error.response.data.error });
    }
    res.status(500).json({ error: "Error al cambiar el nombre" });
  }
});

/**
 * @swagger
 * /api/perfil/password/verify:
 *   post:
 *     summary: Verifica si la contraseña actual es correcta
 *     tags:
 *       - Perfil
 */
app.post('/api/perfil/password/verify', authMiddleware, async (req, res) => {
  try {
    console.log("BODY EN GATEWAY (verify):", req.body, "USER ID:", req.user.userId);
    const resp = await axios.post(`${USERS_URL}/profile/password/verify/${req.user.userId}`, req.body);
    res.json(resp.data);
  } catch (error) {
    console.error("ERROR GATEWAY VERIFY:", error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 400) {
      return res.status(400).json({ error: error.response.data.error });
    }
    res.status(500).json({ error: "Error al verificar la contraseña" });
  }
});

/**
 * @swagger
 * /api/perfil/password:
 *   put:
 *     summary: Cambia la contraseña del usuario autenticado
 *     tags:
 *       - Perfil
 */
app.put('/api/perfil/password', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.put(`${USERS_URL}/profile/password/${req.user.userId}`, req.body);
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return res.status(400).json({ error: error.response.data.error });
    }
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
});

/**
 * @swagger
 * /api/perfil/plan:
 *   put:
 *     summary: Cambia el plan del usuario autenticado
 *     tags:
 *       - Perfil
 */
app.put('/api/perfil/plan', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.put(`${USERS_URL}/profile/plan/${req.user.userId}`, req.body);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar el plan" });
  }
});

/**
 * @swagger
 * /api/perfil/ver-pelicula:
 *   post:
 *     summary: Registra y valida la reproducción diaria para usuarios BASIC
 *     tags:
 *       - Perfil
 */
app.post('/api/perfil/ver-pelicula', authMiddleware, async (req, res) => {
  try {
    const { peliculaId } = req.body;
    const resp = await axios.post(`${USERS_URL}/usuarios/${req.user.userId}/ver-pelicula`, { peliculaId });
    res.json(resp.data);
  } catch (error) {
    console.error("Error en gateway al validar reproducción diaria:", error.message);
    res.status(500).json({ error: "Error al registrar reproducción diaria" });
  }
});

// --- RUTAS DE FAVORITOS ---

/**
 * @swagger
 * /api/favoritos/check/{peliculaId}:
 *   get:
 *     summary: Verifica si una película está en favoritos
 *     tags:
 *       - Favoritos
 */
app.get('/api/favoritos/check/:peliculaId', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/favoritos/check/${req.user.userId}/${req.params.peliculaId}`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al verificar favorito" });
  }
});

/**
 * @swagger
 * /api/favoritos/count/{peliculaId}:
 *   get:
 *     summary: Obtiene la cantidad total de veces que una película fue agregada a favoritos
 *     tags:
 *       - Favoritos
 */
app.get('/api/favoritos/count/:peliculaId', async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/favoritos/count/${req.params.peliculaId}`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al contar favoritos" });
  }
});

/**
 * @swagger
 * /api/favoritos:
 *   get:
 *     summary: Obtiene las películas favoritas del usuario autenticado con sus detalles
 *     tags:
 *       - Favoritos
 */
app.get('/api/favoritos', authMiddleware, async (req, res) => {
  try {
    // 1. Obtener los IDs de las películas favoritas
    const favsResp = await axios.get(`${USERS_URL}/favoritos/${req.user.userId}`);
    const favoritos = favsResp.data;

    if (favoritos.length === 0) {
      return res.json([]);
    }

    const idsPeliculas = favoritos.map(f => f.peliculaId);

    // 2. Traer los detalles de esas películas desde el catálogo
    const detallesResp = await axios.post(`${CATALOG_URL}/peliculas/batch`, {
      ids: idsPeliculas
    });

    const detallesPeliculas = detallesResp.data;

    // 3. Combinar datos
    const resultado = favoritos.map(fav => {
      const detalle = detallesPeliculas.find(p => p.id === fav.peliculaId);
      return {
        ...fav,
        pelicula: detalle || null
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener favoritos completos:", error);
    res.status(500).json({ error: "Error al obtener lista de favoritos" });
  }
});

/**
 * @swagger
 * /api/favoritos/toggle:
 *   post:
 *     summary: Alterna el estado de favorito de una película
 *     tags:
 *       - Favoritos
 */
app.post('/api/favoritos/toggle', authMiddleware, async (req, res) => {
  try {
    const payload = {
      usuarioId: req.user.userId,
      peliculaId: req.body.peliculaId
    };
    const resp = await axios.post(`${USERS_URL}/favoritos/toggle`, payload);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al alternar favorito" });
  }
});

/**
 * @swagger
 * /api/perfil/transacciones:
 *   get:
 *     summary: Obtiene el historial de transacciones del creador en sesión
 *     tags:
 *       - Perfil
 */
app.get('/api/perfil/transacciones', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/usuarios/${req.user.userId}/transacciones`);
    res.json(resp.data);
  } catch (error) {
    console.error("Error al obtener transacciones en gateway:", error.message);
    res.status(500).json({ error: "Error al obtener historial de transacciones" });
  }
});

/**
 * @swagger
 * /api/perfil/retirar:
 *   post:
 *     summary: Procesa una solicitud de retiro simulado para el creador en sesión
 *     tags:
 *       - Perfil
 */
app.post('/api/perfil/retirar', authMiddleware, async (req, res) => {
  try {
    const { monto } = req.body;
    const resp = await axios.post(`${USERS_URL}/usuarios/${req.user.userId}/retirar`, { monto });
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return res.status(400).json({ error: error.response.data.error });
    }
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ error: error.response.data.error });
    }
    console.error("Error al retirar fondos en gateway:", error.message);
    res.status(500).json({ error: "Error al procesar el retiro de fondos" });
  }
});

// --- RUTAS DE STUDIO Y CANALES ---

app.get('/api/studio/perfil', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/studio/perfil/${req.user.userId}`);
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return res.status(403).json(error.response.data);
    }
    res.status(500).json({ error: "Error obteniendo perfil de studio" });
  }
});

app.post('/api/studio/perfil', authMiddleware, async (req, res) => {
  try {
    const resp = await axios.post(`${USERS_URL}/studio/perfil/${req.user.userId}`, req.body);
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return res.status(403).json(error.response.data);
    }
    res.status(500).json({ error: "Error actualizando perfil de studio" });
  }
});

app.get('/api/canales', async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/canales`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo canales" });
  }
});

app.get('/api/canales/:id', async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/canales/${req.params.id}`);
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json(error.response.data);
    }
    res.status(500).json({ error: "Error obteniendo canal" });
  }
});

app.get('/api/canales/usuario/:usuarioId', async (req, res) => {
  try {
    const resp = await axios.get(`${USERS_URL}/canales/usuario/${req.params.usuarioId}`);
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json(error.response.data);
    }
    res.status(500).json({ error: "Error obteniendo canal por usuario" });
  }
});

app.get('/api/studio/estadisticas', authMiddleware, async (req, res) => {
  try {
    // 1. Obtener películas creadas por el usuario
    const catResp = await axios.get(`${CATALOG_URL}/peliculas?creadorId=${req.user.userId}`);
    const movies = catResp.data || [];

    if (movies.length === 0) {
      return res.json({
        viewsData: [],
        approvalData: [
          { name: "Likes", value: 0, color: "#00f2fe" },
          { name: "Dislikes", value: 0, color: "#3a86ff" }
        ],
        topMovies: []
      });
    }

    const movieIds = movies.map(m => m.id);

    // 2. Aprobación Global y Top Películas
    let totalLikes = 0;
    let totalDislikes = 0;

    movies.forEach(m => {
      totalLikes += (m.likesTotales || 0);
      totalDislikes += (m.dislikesTotales || 0);
    });

    const approvalData = [
      { name: "Likes", value: totalLikes, color: "#00f2fe" },
      { name: "Dislikes", value: totalDislikes, color: "#3a86ff" }
    ];

    // Ordenar por vistasTotales descendente y tomar top 4
    const topMovies = [...movies]
      .sort((a, b) => (b.vistasTotales || 0) - (a.vistasTotales || 0))
      .slice(0, 4)
      .map(m => ({
        id: m.id,
        title: m.titulo,
        vistas: m.vistasTotales || 0,
        tendencia: "+5%" // Mock simplificado
      }));

    // 3. Obtener vistas mensuales
    const viewsResp = await axios.post(`${INTERACTIONS_URL}/vistas/mensual/batch`, { peliculaIds: movieIds });
    const registrosMensuales = viewsResp.data || [];

    // Agrupar vistas por mes
    const mesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const vistasPorMes = {};

    // Inicializar últimos 6 meses en 0 para asegurar que la gráfica siempre muestre datos
    const fechaActual = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1);
      const clave = `${d.getFullYear()}-${d.getMonth() + 1}`;
      vistasPorMes[clave] = {
        name: mesNombres[d.getMonth()],
        vistas: 0,
        anio: d.getFullYear(),
        mesNum: d.getMonth() + 1
      };
    }

    registrosMensuales.forEach(reg => {
      const clave = `${reg.anio}-${reg.mes}`;
      if (vistasPorMes[clave]) {
        vistasPorMes[clave].vistas += reg.cantidadVistas;
      }
    });

    const viewsData = Object.values(vistasPorMes).sort((a, b) => {
      if (a.anio !== b.anio) return a.anio - b.anio;
      return a.mesNum - b.mesNum;
    });

    res.json({
      viewsData,
      approvalData,
      topMovies
    });

  } catch (error) {
    console.error("Error al obtener estadísticas de studio:", error.message);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

app.listen(8000, '0.0.0.0', () => {
  console.log('🚀 Gateway running on port 8000');
  console.log('📚 Documentación Swagger disponible en: http://localhost:8000/docs');
});