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

// Registrar, cambiar o quitar un Like o Dislike
app.post('/interaccion', async (req, res) => {
  const { usuarioId, peliculaId, tipo } = req.body; 
  try {
    // Buscar si ya existe una interacción
    const interaccionExistente = await prisma.interaccion.findUnique({
      where: {
        usuarioId_peliculaId: { usuarioId, peliculaId }
      }
    });

    let likesDiff = 0;
    let dislikesDiff = 0;
    let nuevaInteraccion = null;
    let accion = ""; // "CREADO", "ACTUALIZADO", "ELIMINADO"

    if (interaccionExistente) {
      if (interaccionExistente.tipo === tipo) {
        // Si es el mismo tipo, significa que quiere quitar su voto
        await prisma.interaccion.delete({
          where: { id: interaccionExistente.id }
        });
        accion = "ELIMINADO";
        if (tipo === 'LIKE') likesDiff = -1;
        if (tipo === 'DISLIKE') dislikesDiff = -1;
      } else {
        // Cambiar de LIKE a DISLIKE o viceversa
        nuevaInteraccion = await prisma.interaccion.update({
          where: { id: interaccionExistente.id },
          data: { tipo }
        });
        accion = "ACTUALIZADO";
        if (tipo === 'LIKE') {
          likesDiff = 1;
          dislikesDiff = -1; // Quitamos el dislike anterior
        } else {
          dislikesDiff = 1;
          likesDiff = -1; // Quitamos el like anterior
        }
      }
    } else {
      // Crear nueva interacción
      nuevaInteraccion = await prisma.interaccion.create({
        data: { usuarioId, peliculaId, tipo }
      });
      accion = "CREADO";
      if (tipo === 'LIKE') likesDiff = 1;
      if (tipo === 'DISLIKE') dislikesDiff = 1;
    }
    
    // 2. Le avisamos al Catálogo de las diferencias
    if (likesDiff !== 0 || dislikesDiff !== 0) {
      await axios.patch(`${CATALOG_URL}/peliculas/${peliculaId}/estadisticas/diff`, {
        likesDiff,
        dislikesDiff
      });
    }
    
    res.json({ interaccion: nuevaInteraccion, accion, likesDiff, dislikesDiff });
  } catch (error) {
    console.error("Error capturado en interaccion:", error.message);
    res.status(500).json({ error: "Error al registrar la interacción" });
  }
});

// Obtener estado de interacción del usuario actual para una película
app.get('/interaccion/status/:peliculaId/:usuarioId', async (req, res) => {
  try {
    const { peliculaId, usuarioId } = req.params;
    const interaccion = await prisma.interaccion.findUnique({
      where: {
        usuarioId_peliculaId: { usuarioId, peliculaId }
      }
    });
    res.json({ tipo: interaccion ? interaccion.tipo : null });
  } catch (error) {
    console.error("Error al obtener estado de interacción:", error);
    res.status(500).json({ error: "Error al obtener estado de interacción" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Interactions Service corriendo en el puerto ${PORT}`);
});