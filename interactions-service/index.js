// interactions-service/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios'); // <-- 1. FALTABA IMPORTAR AXIOS
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- 2. FALTABA DEFINIR LA RUTA DEL CATÁLOGO ---
const CATALOG_URL = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:8000';

// Ruta de prueba (Health Check)
app.get('/', (req, res) => {
  res.json({ message: 'Interactions Service está funcionando 🚀' });
});

// Obtener comentarios de una película específica
app.get('/comentarios/:peliculaId', async (req, res) => {
  try {
    // 1. Obtener todos los comentarios de la película (de más viejos a más nuevos para ordenar respuestas cronológicamente)
    const todosComentarios = await prisma.comentario.findMany({
      where: { peliculaId: req.params.peliculaId },
      orderBy: { fecha: 'asc' }
    });

    if (todosComentarios.length === 0) {
      return res.json([]);
    }

    // 2. Extraer IDs únicos de usuario
    const usuarioIds = [...new Set(todosComentarios.map(c => c.usuarioId))];

    // 3. Consultar los perfiles en bloque (batch) a users-service
    let perfilesMap = {};
    try {
      const USERS_URL = process.env.USERS_SERVICE_URL || 'http://users-service:8000';
      const response = await axios.post(`${USERS_URL}/profile/batch`, { ids: usuarioIds });
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(u => {
          perfilesMap[u.id] = u;
        });
      }
    } catch (err) {
      console.error("Error al consultar perfiles en lote desde interactions-service:", err.message);
    }

    // 4. Hidratar los comentarios con los datos de usuario
    const comentariosHidratados = todosComentarios.map(c => ({
      ...c,
      usuario: perfilesMap[c.usuarioId] || { name: "Usuario de StreamHub", email: "", plan: "BASIC" }
    }));

    // 5. Agrupar comentarios principales y sus respuestas
    const comentariosPrincipales = comentariosHidratados.filter(c => !c.parentId);
    const respuestas = comentariosHidratados.filter(c => c.parentId);

    const tree = comentariosPrincipales.map(principal => {
      return {
        ...principal,
        respuestas: respuestas.filter(r => r.parentId === principal.id)
      };
    });

    // Ordenar los comentarios principales por fecha descendente (más nuevos arriba)
    tree.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.json(tree);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

// Crear un nuevo comentario
app.post('/comentarios', async (req, res) => {
  const { usuarioId, peliculaId, contenido, parentId } = req.body;
  if (!contenido || contenido.trim() === "") {
    return res.status(400).json({ error: "El contenido del comentario no puede estar vacío" });
  }
  try {
    const nuevoComentario = await prisma.comentario.create({
      data: { 
        usuarioId, 
        peliculaId, 
        contenido,
        parentId: parentId || null
      }
    });
    res.json(nuevoComentario);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: "Error al crear el comentario" });
  }
});

// Obtener cantidades de comentarios en lote
app.post('/comentarios/count-batch', async (req, res) => {
  try {
    const { peliculaIds } = req.body;
    if (!peliculaIds || !Array.isArray(peliculaIds)) {
      return res.status(400).json({ error: "peliculaIds debe ser un arreglo" });
    }

    const counts = await prisma.comentario.groupBy({
      by: ['peliculaId'],
      where: {
        peliculaId: { in: peliculaIds }
      },
      _count: {
        id: true
      }
    });

    const countsMap = {};
    peliculaIds.forEach(id => {
      countsMap[id] = 0;
    });
    counts.forEach(c => {
      countsMap[c.peliculaId] = c._count.id;
    });

    res.json(countsMap);
  } catch (error) {
    console.error("Error en count-batch de comentarios:", error);
    res.status(500).json({ error: "Error interno al calcular conteo de comentarios" });
  }
});

// Registrar un Like o Dislike
app.post('/interaccion', async (req, res) => {
  const { usuarioId, peliculaId, tipo } = req.body; 
  try {
    // 1. Guardamos la interacción localmente para que no vote dos veces
    const nuevaInteraccion = await prisma.interaccion.create({
      data: { usuarioId, peliculaId, tipo }
    });
    
    // 2. Le avisamos al Catálogo que sume 1 a las estadísticas (Likes/Dislikes)
    await axios.patch(`${CATALOG_URL}/peliculas/${peliculaId}/estadisticas`, {
      tipo: tipo
    });
    
    // Devolvemos el registro exitoso sin pagar comisiones
    res.json(nuevaInteraccion);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Este usuario ya interactuó con esta película" });
    }
    console.error("Error capturado:", error.message);
    res.status(500).json({ error: "Error al registrar la interacción" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Interactions Service corriendo en el puerto ${PORT}`);
});