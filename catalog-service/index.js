const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// 1. RUTAS ESTÁTICAS (Nombres fijos) - SIEMPRE ARRIBA
app.get('/peliculas', async (req, res) => {
  const peliculas = await prisma.pelicula.findMany({ include: { generos: true } });
  res.json(peliculas);
});

// Agregamos estrenos aquí, arriba de los parámetros dinámicos
app.get('/peliculas/estrenos', async (req, res) => {
  try {
    const estrenos = await prisma.pelicula.findMany({
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

app.get('/peliculas/top', async (req, res) => {
  try {
    const topPeliculas = await prisma.pelicula.findMany({
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
  const peliculas = await prisma.pelicula.findMany({
    where: { id: { in: ids } },
    include: { generos: true }
  });
  res.json(peliculas);
});

// 3. RUTAS DINÁMICAS (Parámetros con :) - SIEMPRE AL FINAL
app.get('/peliculas/:id', async (req, res) => {
  try {
    const pelicula = await prisma.pelicula.findUnique({
      where: { id: req.params.id },
      include: { generos: true }
    });
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
    
    // Devolvemos el creadorId para que el servicio que llamó sepa a quién pagarle
    res.json({ creadorId: peliculaActualizada.creadorId, tipoContenido: peliculaActualizada.tipoContenido });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estadísticas" });
  }
});

app.listen(8000, () => console.log('Catalog Service running on port 8000'));