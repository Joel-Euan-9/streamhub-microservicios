const express = require('express');
const axios = require('axios');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

app.use(cors());
app.use(express.json());

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
        url: 'http://localhost:8000',
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
const STREAM_URL = process.env.STREAM_URL || 'http://streamhub.local/';

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
    const resp = await axios.get(`${CATALOG_URL}/peliculas`);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error conectando con el catálogo" });
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
app.post('/api/historial', async (req, res) => {
  try {
    const resp = await axios.post(`${USERS_URL}/historial`, req.body);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el historial" });
  }
});

/**
 * @swagger
 * /api/seguir-viendo/{usuarioId}:
 *   get:
 *     summary: Obtiene las películas que el usuario dejó a medias
 *     tags:
 *       - Seguir Viendo
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista combinada de historial y detalles de películas
 */
app.get('/api/seguir-viendo/:usuarioId', async (req, res) => {
  try {

    const historialResp = await axios.get(`${USERS_URL}/historial/${req.params.usuarioId}`);
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
app.get('/api/interacciones/comentarios/:peliculaId', async (req, res) => {
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
app.post('/api/interacciones/comentarios', async (req, res) => {
  try {
    const resp = await axios.post(`${INTERACTIONS_URL}/comentarios`, req.body);
    res.json(resp.data);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el comentario" });
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
app.post('/api/interacciones/votar', async (req, res) => {
  try {
    const resp = await axios.post(`${INTERACTIONS_URL}/interaccion`, req.body);
    res.json(resp.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return res.status(400).json({ error: error.response.data.error });
    }
    res.status(500).json({ error: "Error al registrar la interacción" });
  }
});

app.listen(8000, '0.0.0.0', () => {
  console.log('🚀 Gateway running on port 8000');
  console.log('📚 Documentación Swagger disponible en: http://localhost:8000/docs');
});