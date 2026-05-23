const express = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Caché en memoria para los creadores STUDIO activos
let cacheStudioIds = null;
let cacheTimestamp = 0;

const getActiveStudioIds = async () => {
  const now = Date.now();
  // Caché de 5 segundos para alto rendimiento
  if (cacheStudioIds && (now - cacheTimestamp < 5000)) {
    return cacheStudioIds;
  }
  try {
    const resp = await axios.get('http://users-service:8000/usuarios/studio-ids');
    cacheStudioIds = resp.data;
    cacheTimestamp = now;
    return cacheStudioIds;
  } catch (error) {
    console.error("Error al obtener creadores STUDIO en el catálogo:", error.message);
    return cacheStudioIds || []; // Si falla, reusamos el último caché o vacío
  }
};

// 1. RUTAS ESTÁTICAS (Nombres fijos) - SIEMPRE ARRIBA
app.get('/peliculas', async (req, res) => {
  const { creadorId } = req.query;
  let where = {};
  
  if (creadorId) {
    // Si se consulta un creador específico (ej: panel Studio administrativo), no filtramos visibilidad
    where = { creadorId };
  } else {
    // Catálogo público: Ocultar películas de creadores que no tengan plan STUDIO activo
    const activeStudioIds = await getActiveStudioIds();
    where = {
      OR: [
        { creadorId: null },
        { creadorId: { in: activeStudioIds } }
      ]
    };
  }

  try {
    const peliculas = await prisma.pelicula.findMany({ 
      where,
      include: { generos: true } 
    });
    res.json(peliculas);
  } catch (error) {
    console.error("Error al obtener películas:", error);
    res.status(500).json({ error: "Error al obtener películas" });
  }
});

// Estrenos con filtro de creadores activos
app.get('/peliculas/estrenos', async (req, res) => {
  try {
    const activeStudioIds = await getActiveStudioIds();
    const estrenos = await prisma.pelicula.findMany({
      where: {
        OR: [
          { creadorId: null },
          { creadorId: { in: activeStudioIds } }
        ]
      },
      orderBy: { 
        fechaLanzamiento: 'desc' 
      },
      take: 10, 
      include: {
        generos: true 
      }
    });
    res.json(estrenos);
  } catch (error) {
    console.error("Error obteniendo estrenos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Top 10 películas más vistas con filtro de creadores activos
app.get('/peliculas/top', async (req, res) => {
  try {
    const activeStudioIds = await getActiveStudioIds();
    const topPeliculas = await prisma.pelicula.findMany({
      where: {
        OR: [
          { creadorId: null },
          { creadorId: { in: activeStudioIds } }
        ]
      },
      orderBy: { 
        vistasTotales: 'desc' 
      },
      take: 10, 
      include: {
        generos: true 
      }
    });
    res.json(topPeliculas);
  } catch (error) {
    console.error("Error obteniendo top 10:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 2. RUTAS DE ACCIÓN (POST)
app.post('/peliculas/batch', async (req, res) => {
  const { ids } = req.body;
  try {
    const activeStudioIds = await getActiveStudioIds();
    const peliculas = await prisma.pelicula.findMany({
      where: { 
        id: { in: ids },
        OR: [
          { creadorId: null },
          { creadorId: { in: activeStudioIds } }
        ]
      },
      include: { generos: true }
    });
    res.json(peliculas);
  } catch (error) {
    console.error("Error en batch películas:", error);
    res.status(500).json({ error: "Error en batch películas" });
  }
});

// 3. RUTAS DINÁMICAS (Parámetros con :) - SIEMPRE AL FINAL
app.get('/peliculas/:id', async (req, res) => {
  try {
    const pelicula = await prisma.pelicula.findUnique({
      where: { id: req.params.id },
      include: { generos: true }
    });
    
    if (!pelicula) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    // Si tiene un creador y no está en la lista de creadores STUDIO activos
    if (pelicula.creadorId) {
      const activeStudioIds = await getActiveStudioIds();
      if (!activeStudioIds.includes(pelicula.creadorId)) {
        return res.status(403).json({ 
          error: "content_suspended", 
          message: "Este contenido no se encuentra disponible temporalmente porque el creador no cuenta con una suscripción activa." 
        });
      }
    }

    res.json(pelicula);
  } catch (error) {
    res.status(400).json({ error: "ID no válido o no encontrado" });
  } 
});

app.patch('/peliculas/:id/estadisticas', async (req, res) => {
  const { tipo } = req.body; // Puede ser "LIKE", "DISLIKE" o "VISTA"
  try {
    const dataUpdate = {};
    if (tipo === 'LIKE') dataUpdate.likesTotales = { increment: 1 };
    if (tipo === 'DISLIKE') dataUpdate.dislikesTotales = { increment: 1 };
    if (tipo === 'VISTA') dataUpdate.vistasTotales = { increment: 1 };

    const peliculaActualizada = await prisma.pelicula.update({
      where: { id: req.params.id },
      data: dataUpdate
    });
    
    res.json({ creadorId: peliculaActualizada.creadorId, tipoContenido: peliculaActualizada.tipoContenido });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estadísticas" });
  }
});

app.patch('/peliculas/:id/estadisticas/diff', async (req, res) => {
  const { likesDiff, dislikesDiff } = req.body;
  try {
    const dataUpdate = {};
    if (likesDiff) dataUpdate.likesTotales = { increment: likesDiff };
    if (dislikesDiff) dataUpdate.dislikesTotales = { increment: dislikesDiff };

    const peliculaActualizada = await prisma.pelicula.update({
      where: { id: req.params.id },
      data: dataUpdate
    });
    
    res.json({ success: true, likesTotales: peliculaActualizada.likesTotales, dislikesTotales: peliculaActualizada.dislikesTotales });
  } catch (error) {
    console.error("Error al actualizar estadísticas por diff:", error);
    res.status(500).json({ error: "Error al actualizar estadísticas" });
  }
});

app.listen(8000, () => console.log('Catalog Service running on port 8000'));