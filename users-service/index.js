require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
    const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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
  try {
    const { username, email, password } = req.body;

    console.log("BODY:", req.body); // 👈 DEBUG

    if (!email || !password) {
      return res.status(400).json({ error: "Email y password requeridos" });
    }

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: username
      }
    });

    res.json({
      message: "Usuario creado",
      userId: user.id
    });

  } catch (error) {
    console.error("ERROR REGISTER:", error); // 👈 CLAVE
    res.status(500).json({
      error: "Error en registro",
      detalle: error.message
    });
  }
});

// Autenticar de usuario
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    console.log("USER:", user);

    if (!user) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    console.log("HASH:", user.password);
    console.log("COMPARE:", isValid);

    if (!isValid) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    // 👇 AGREGA ESTO TAMBIÉN


    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // 👈 importante
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) { 

    res.status(500).json({
      error: error,
      detalle: error.message
    });
  }
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

// --- FAVORITOS ---

// Verificar si una película es favorita
app.get('/favoritos/check/:usuarioId/:peliculaId', async (req, res) => {
  try {
    const { usuarioId, peliculaId } = req.params;
    const favorito = await prisma.favorito.findUnique({
      where: {
        usuarioId_peliculaId: { usuarioId, peliculaId }
      }
    });
    res.json({ isFavorite: !!favorito });
  } catch (error) {
    console.error("Error check favorito:", error);
    res.status(500).json({ error: "Error verificando favorito" });
  }
});

// Alternar favorito (agregar o eliminar)
app.post('/favoritos/toggle', async (req, res) => {
  try {
    console.log("BODY REQ FAVORITOS TOGGLE:", req.body);
    const { usuarioId, peliculaId } = req.body;
    
    // Verificar si existe
    const existente = await prisma.favorito.findUnique({
      where: {
        usuarioId_peliculaId: { usuarioId, peliculaId }
      }
    });

    if (existente) {
      // Eliminar
      await prisma.favorito.delete({
        where: {
          usuarioId_peliculaId: { usuarioId, peliculaId }
        }
      });
      console.log("Favorito eliminado");
      return res.json({ isFavorite: false, message: "Eliminado de favoritos" });
    } else {
      // Crear
      await prisma.favorito.create({
        data: { usuarioId, peliculaId }
      });
      console.log("Favorito agregado");
      return res.json({ isFavorite: true, message: "Agregado a favoritos" });
    }
  } catch (error) {
    console.error("Error toggle favorito:", error);
    res.status(500).json({ error: "Error alternando favorito", detalle: error.message });
  }
});

app.listen(8000, () => console.log('Users Service running on port 8000'));