const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Obtener todas las películas (Home page)
app.get('/peliculas', async (req, res) => {
  const peliculas = await prisma.pelicula.findMany({ include: { generos: true } });
  res.json(peliculas);
});

// Obtener detalles de una lista de IDs (Para cuando el Gateway pida detalles del historial)
app.post('/peliculas/batch', async (req, res) => {
  const { ids } = req.body; // Espera un array de IDs ej: ["uuid-1", "uuid-2"]
  const peliculas = await prisma.pelicula.findMany({
    where: { id: { in: ids } }
  });
  res.json(peliculas);
});

// Obtener una película específica
app.get('/peliculas/:id', async (req, res) => {
  const pelicula = await prisma.pelicula.findUnique({
    where: { id: req.params.id },
    include: { generos: true }
  });
  res.json(pelicula);
});

app.listen(8000, () => console.log('Catalog Service running on port 8000'));