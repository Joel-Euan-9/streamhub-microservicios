require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Actualizar progreso (Seguir viendo)
app.post('/historial', async (req, res) => {
  const { usuarioId, peliculaId, minuto, completada } = req.body;

  try {
    // 1. Verificar si ya existe el registro de visualización
    const existente = await prisma.visualizacion.findUnique({
      where: { usuarioId_peliculaId: { usuarioId, peliculaId } }
    });

    let markMonetizada = false;

    // Si el espectador ha visto 60 segundos o más y aún no ha sido monetizado
    if (minuto >= 60 && (!existente || !existente.monetizada)) {
      markMonetizada = true;
      
      try {
        // Registrar vista en catálogo y en interacciones mensuales
        try {
          await axios.patch(`http://catalog-service:8000/peliculas/${peliculaId}/estadisticas`, { tipo: 'VISTA' });
          await axios.post(`http://interactions-service:8000/vistas/mensual`, { peliculaId });
        } catch (vErr) {
          console.error("Error al registrar vista:", vErr.message);
        }

        // Obtener detalles de la película desde el catalog-service
        const catResp = await axios.get(`http://catalog-service:8000/peliculas/${peliculaId}`);
        const movie = catResp.data;

        // Si la película tiene un creador y no es el propio espectador que la está viendo
        if (movie && movie.creadorId && movie.creadorId !== usuarioId) {
          // Verificar que el creador exista y sea plan STUDIO
          const creador = await prisma.user.findUnique({
            where: { id: movie.creadorId }
          });

          if (creador && creador.plan === 'STUDIO') {
            // Acreditar comisión e insertar registro de transacción
            await prisma.$transaction([
              prisma.user.update({
                where: { id: movie.creadorId },
                data: { saldoBilletera: { increment: 10.0 } }
              }),
              prisma.transaccion.create({
                data: {
                  usuarioId: movie.creadorId,
                  monto: 10.0,
                  descripcion: `Comisión por visualización de la película "${movie.titulo}"`
                }
              })
            ]);
          }
        }
      } catch (err) {
        console.error("Error al acreditar comisión por visualización:", err.message);
      }
    }

    const visualizacion = await prisma.visualizacion.upsert({
      where: { usuarioId_peliculaId: { usuarioId, peliculaId } },
      update: { 
        minutoPausa: minuto, 
        completada, 
        monetizada: existente?.monetizada || markMonetizada,
        ultimaVezVisto: new Date() 
      },
      create: { 
        usuarioId, 
        peliculaId, 
        minutoPausa: minuto, 
        completada,
        monetizada: markMonetizada
      }
    });

    res.json(visualizacion);
  } catch (error) {
    console.error("Error en POST /historial:", error);
    res.status(500).json({ error: "Error al actualizar progreso" });
  }
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

// Crear usuario
app.post('/register', async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Normalizar email
    email = email?.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y password requeridos"
      });
    }

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: "El correo ya está registrado"
      });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: username
      }
    });

    // Generar token (autologin)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en producción con https
      sameSite: "lax",
      path: "/"
    });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("ERROR REGISTER:", error);

    return res.status(500).json({
      error: "Error interno en el registro"
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
app.put('/usuarios/:id/plan', async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;

  try {
    const validPlans = ['BASIC', 'PREMIUM', 'STUDIO'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: "Plan inválido" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { plan }
    });

    res.json({ message: "Plan actualizado exitosamente", user });
  } catch (error) {
    console.error("Error al actualizar el plan:", error);
    res.status(500).json({ error: "No se pudo actualizar el plan" });
  }
});

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
        saldoBilletera: true,
        createdAt: true,
      }
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

// Obtener perfil en lote (Batch Query)
app.post('/profile/batch', async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Se requiere un arreglo 'ids'" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { in: ids }
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error("Error en batch profile query:", error);
    res.status(500).json({ error: "Error al obtener perfiles" });
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
      select: { id: true, plan: true, name: true }
    });

    if (plan === 'STUDIO') {
      const existingPerfil = await prisma.perfilStudio.findUnique({
        where: { usuarioId: user.id }
      });
      if (!existingPerfil) {
        await prisma.perfilStudio.create({
          data: {
            usuarioId: user.id,
            nombreCanal: user.name || "Canal Nuevo",
            descripcion: "Canal independiente para películas y contenido exclusivo.",
          }
        });
      }
    }

    res.json({ message: "Plan actualizado", plan: user.plan });
  } catch (error) {
    console.error("Error al actualizar plan:", error);
    res.status(500).json({ error: "Error al actualizar plan" });
  }
});

// Validar y registrar límite diario de visualizaciones (Plan Básico)
app.post('/usuarios/:id/ver-pelicula', async (req, res) => {
  const { id } = req.params;
  const { peliculaId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si no es Básico, no aplica restricción
    if (user.plan !== 'BASIC') {
      return res.json({ success: true, allowed: true, viewsCount: 0 });
    }

    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastViewStr = user.fechaUltimaVista ? new Date(user.fechaUltimaVista).toISOString().split('T')[0] : null;

    let viewedIds = [];
    let isNewDay = todayStr !== lastViewStr;

    if (!isNewDay && user.peliculasVistasHoyIds) {
      viewedIds = user.peliculasVistasHoyIds.split(',').filter(x => x.trim() !== "");
    }

    const alreadyViewed = viewedIds.includes(peliculaId);

    if (alreadyViewed) {
      // Si ya la vio hoy, se le permite reproducir sin problemas
      return res.json({ success: true, allowed: true, viewsCount: viewedIds.length });
    }

    // Si es una nueva película en el mismo día y ya llegó a 5
    if (!isNewDay && viewedIds.length >= 5) {
      return res.json({ 
        success: false, 
        allowed: false, 
        error: "daily_limit_reached", 
        message: "Has alcanzado el límite diario de 5 películas en tu plan Básico.",
        viewsCount: viewedIds.length 
      });
    }

    // Agregar la nueva película a la lista de hoy
    let newViewedIds = [];
    if (isNewDay) {
      newViewedIds = [peliculaId];
    } else {
      newViewedIds = [...viewedIds, peliculaId];
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        peliculasVistasHoy: newViewedIds.length,
        peliculasVistasHoyIds: newViewedIds.join(','),
        fechaUltimaVista: new Date()
      }
    });

    return res.json({ 
      success: true, 
      allowed: true, 
      viewsCount: newViewedIds.length 
    });

  } catch (error) {
    console.error("Error al registrar visualización:", error);
    res.status(500).json({ error: "Error al registrar visualización diaria" });
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

// Obtener el conteo total de favoritos de una película
app.get('/favoritos/count/:peliculaId', async (req, res) => {
  try {
    const { peliculaId } = req.params;
    const count = await prisma.favorito.count({
      where: { peliculaId }
    });
    res.json({ count });
  } catch (error) {
    console.error("Error al contar favoritos:", error);
    res.status(500).json({ error: "Error al contar favoritos" });
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

// Obtener IDs de creadores con plan STUDIO activo
app.get('/usuarios/studio-ids', async (req, res) => {
  try {
    const creators = await prisma.user.findMany({
      where: { plan: 'STUDIO' },
      select: { id: true }
    });
    const ids = creators.map(c => c.id);
    res.json(ids);
  } catch (error) {
    console.error("Error al obtener creadores STUDIO:", error);
    res.status(500).json({ error: "Error al obtener creadores STUDIO" });
  }
});

// Obtener historial de transacciones de un usuario creador
app.get('/usuarios/:id/transacciones', async (req, res) => {
  const { id } = req.params;
  try {
    const transacciones = await prisma.transaccion.findMany({
      where: { usuarioId: id },
      orderBy: { fecha: 'desc' }
    });
    res.json(transacciones);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
});

// Solicitar retiro simulado (mínimo $500)
app.post('/usuarios/:id/retirar', async (req, res) => {
  const { id } = req.params;
  const { monto } = req.body;

  if (!monto || monto <= 0) {
    return res.status(400).json({ error: "Monto de retiro inválido." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    if (user.plan !== 'STUDIO') {
      return res.status(403).json({ error: "Solo los creadores en plan STUDIO pueden retirar fondos." });
    }

    if (user.saldoBilletera < 500) {
      return res.status(400).json({ error: "El monto mínimo de retiro es de $500.00 MXN." });
    }

    if (user.saldoBilletera < monto) {
      return res.status(400).json({ error: "Saldo insuficiente para retirar este monto." });
    }

    // Restar de la billetera e insertar registro de transacción de retiro (negativa)
    const resultado = await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: { saldoBilletera: { decrement: monto } }
      }),
      prisma.transaccion.create({
        data: {
          usuarioId: id,
          monto: -monto,
          descripcion: "Retiro de fondos transferido a cuenta bancaria (Simulado)"
        }
      })
    ]);

    res.json({ success: true, saldoBilletera: resultado[0].saldoBilletera });
  } catch (error) {
    console.error("Error al procesar retiro:", error);
    res.status(500).json({ error: "Error interno al procesar el retiro de fondos." });
  }
});

// --- RUTAS DEL PERFIL DE STUDIO (CANALES) ---

// Obtener o crear el perfil de studio del usuario
app.get('/studio/perfil/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: usuarioId }, include: { perfilStudio: true } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (user.plan !== 'STUDIO') {
      return res.status(403).json({ error: "El usuario no tiene plan STUDIO" });
    }

    if (user.perfilStudio) {
      return res.json(user.perfilStudio);
    } else {
      const nuevoPerfil = await prisma.perfilStudio.create({
        data: {
          usuarioId: user.id,
          nombreCanal: user.name || "Canal sin nombre",
          descripcion: "",
          fotoPerfilUrl: "",
          fotoPortadaUrl: ""
        }
      });
      return res.json(nuevoPerfil);
    }
  } catch (error) {
    console.error("Error obteniendo perfil studio:", error);
    res.status(500).json({ error: "Error interno al obtener perfil" });
  }
});

// Actualizar perfil de studio
app.post('/studio/perfil/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  const { nombreCanal, descripcion, fotoPerfilUrl, fotoPortadaUrl, metodoPago, datosPago } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: usuarioId } });
    if (!user || user.plan !== 'STUDIO') return res.status(403).json({ error: "Acceso denegado" });

    const perfil = await prisma.perfilStudio.upsert({
      where: { usuarioId },
      update: { nombreCanal, descripcion, fotoPerfilUrl, fotoPortadaUrl, metodoPago, datosPago },
      create: { usuarioId, nombreCanal: nombreCanal || user.name || "Canal sin nombre", descripcion, fotoPerfilUrl, fotoPortadaUrl, metodoPago, datosPago }
    });
    res.json(perfil);
  } catch (error) {
    console.error("Error actualizando perfil studio:", error);
    res.status(500).json({ error: "Error interno al actualizar perfil" });
  }
});

// Listar todos los canales públicos
app.get('/canales', async (req, res) => {
  try {
    const canales = await prisma.perfilStudio.findMany({
      include: {
        usuario: { select: { id: true, name: true, plan: true } }
      }
    });
    const validos = canales.filter(c => c.usuario.plan === 'STUDIO');
    res.json(validos);
  } catch (error) {
    console.error("Error obteniendo canales:", error);
    res.status(500).json({ error: "Error interno al obtener canales" });
  }
});

// Obtener un canal público específico
app.get('/canales/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const canal = await prisma.perfilStudio.findUnique({
      where: { id },
      include: { usuario: { select: { id: true, plan: true } } }
    });
    if (!canal || canal.usuario.plan !== 'STUDIO') return res.status(404).json({ error: "Canal no encontrado" });
    res.json(canal);
  } catch (error) {
    console.error("Error obteniendo canal:", error);
    res.status(500).json({ error: "Error interno al obtener canal" });
  }
});

// Obtener canal público por usuarioId
app.get('/canales/usuario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const canal = await prisma.perfilStudio.findUnique({
      where: { usuarioId },
      include: { usuario: { select: { id: true, name: true, plan: true } } }
    });
    if (!canal || canal.usuario.plan !== 'STUDIO') return res.status(404).json({ error: "Canal no encontrado" });
    res.json(canal);
  } catch (error) {
    console.error("Error obteniendo canal por usuarioId:", error);
    res.status(500).json({ error: "Error interno al obtener canal" });
  }
});

app.listen(8000, () => console.log('Users Service running on port 8000'));