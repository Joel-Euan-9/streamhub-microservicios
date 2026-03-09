const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Actualizar progreso (Seguir viendo)
app.post('/historial', async (req, res) => {
  const { usuarioId, peliculaId, minuto, completada } = req.body;
  
  const visualizacion = await prisma.visualizacion.upsert({
    where: { usuarioId_peliculaId: { usuarioId, peliculaId } },
    update: { minutoPausa: minuto, completada, ultimaVezVisto: new Date() },
    create: { usuarioId, peliculaId, minutoPausa: minuto, completada }
  });
  
  res.json(visualizacion);
});

// Obtener historial de un usuario (Solo devuelve IDs y minutos)
app.get('/historial/:usuarioId', async (req, res) => {
  const historial = await prisma.visualizacion.findMany({
    where: { usuarioId: req.params.usuarioId },
    orderBy: { ultimaVezVisto: 'desc' },
    take: 10 // Los últimos 10 vistos
  });
  res.json(historial);
});

// Crear usuario (simplificado)
app.post('/register', async (req, res) => {
    // ... lógica de registro
});

app.listen(8000, () => console.log('Users Service running on port 8000'));