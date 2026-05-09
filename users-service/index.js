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

// Obtener el minuto de pausa de una película específica
app.get('/historial/:usuarioId/:peliculaId', async (req, res) => {
  try {
    const visualizacion = await prisma.visualizacion.findUnique({
      where: {
        usuarioId_peliculaId: {
          usuarioId: req.params.usuarioId,
          peliculaId: req.params.peliculaId
        }
      }
    });
    if (!visualizacion) {
      return res.json({ minutoPausa: 0, completada: false });
    }
    res.json(visualizacion);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener historial de la película" });
  }
});

// Borrar todo el historial de un usuario
app.delete('/historial/:usuarioId', async (req, res) => {
  try {
    await prisma.visualizacion.deleteMany({
      where: { usuarioId: req.params.usuarioId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al limpiar historial" });
  }
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

// --- PERFIL DE USUARIO ---

// Obtener perfil de usuario
app.get('/profile/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        createdAt: true,
      }
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

// Cambiar nombre
app.put('/profile/name/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }
    
    await prisma.user.update({
      where: { id: req.params.id },
      data: { name: name.trim() }
    });

    res.json({ message: "Nombre actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar nombre:", error);
    res.status(500).json({ error: "Error al actualizar nombre" });
  }
});

// Verificar contraseña actual
app.post('/profile/password/verify/:id', async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ error: "La contraseña actual es incorrecta" });

    res.json({ success: true, message: "Contraseña correcta" });
  } catch (error) {
    console.error("Error al verificar contraseña:", error);
    res.status(500).json({ error: "Error al verificar contraseña" });
  }
});

// Cambiar contraseña
app.put('/profile/password/:id', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ error: "La contraseña actual es incorrecta" });

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la anterior" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: req.params.id },
      data: { password: hashedPassword }
    });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
});

// Cambiar plan
app.put('/profile/plan/:id', async (req, res) => {
  try {
    const { plan } = req.body; // 'BASIC', 'PREMIUM', o 'STUDIO'
    
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { plan: plan },
      select: { id: true, plan: true }
    });

    res.json({ message: "Plan actualizado", plan: user.plan });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar plan" });
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

// Obtener todos los favoritos de un usuario
app.get('/favoritos/:usuarioId', async (req, res) => {
  try {
    const favoritos = await prisma.favorito.findMany({
      where: { usuarioId: req.params.usuarioId },
      orderBy: { fechaAgregado: 'desc' }
    });
    res.json(favoritos);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
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