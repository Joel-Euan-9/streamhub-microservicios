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

// Obtener todos los usuarios (Para el panel de administración / Swagger)
app.get('/usuarios', async (req, res) => {
  try {
    // Usamos prisma.user por tu modelo, y filtramos la contraseña por seguridad
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,              
        peliculasVistasHoy: true,
        fechaUltimaVista: true,
        saldoBilletera: true,
        createdAt: true,
        updatedAt: true
        // Ignoramos intencionalmente el campo 'password' y los arreglos relacionales
      }
    });
    
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios en la BD:", error);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
});

// Simular el pago de una comisión al creador
app.post('/billetera/comision', async (req, res) => {
  const { creadorId, monto, descripcion } = req.body;
  try {
    // 1. Verificar que el usuario exista y sea STUDIO
    const usuario = await prisma.user.findUnique({ where: { id: creadorId } });
    if (!usuario || usuario.plan !== 'STUDIO') {
      return res.status(400).json({ error: "Usuario no elegible para comisiones" });
    }

    // 2. Transacción de Prisma: Actualiza saldo y crea el historial al mismo tiempo
    const resultado = await prisma.$transaction([
      prisma.user.update({
        where: { id: creadorId },
        data: { saldoBilletera: { increment: monto } }
      }),
      prisma.transaccion.create({
        data: { usuarioId: creadorId, monto: monto, descripcion: descripcion }
      })
    ]);

    res.json(resultado[0]); // Devolvemos el usuario actualizado
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la comisión" });
  }
});

app.listen(8000, () => console.log('Users Service running on port 8000'));