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
    const comentarios = await prisma.comentario.findMany({
      where: { peliculaId: req.params.peliculaId },
      orderBy: { fecha: 'desc' }
    });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

// Crear un nuevo comentario
app.post('/comentarios', async (req, res) => {
  const { usuarioId, peliculaId, contenido } = req.body;
  try {
    const nuevoComentario = await prisma.comentario.create({
      data: { usuarioId, peliculaId, contenido }
    });
    res.json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el comentario" });
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