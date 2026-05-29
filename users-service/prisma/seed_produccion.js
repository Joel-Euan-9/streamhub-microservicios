// users-service/prisma/seed_produccion.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de producción de USUARIOS...');

  // Encriptamos la contraseña genérica
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Limpiar datos antiguos si los hay
  try {
    await prisma.transaccionRetiro.deleteMany({});
    await prisma.transaccionBilletera.deleteMany({});
    await prisma.perfilStudio.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Registros de usuarios antiguos eliminados.');
  } catch (e) {
    console.log('No se pudieron borrar los datos antiguos de usuarios.');
  }

  // 2. Crear Espectador de Plan BÁSICO
  const userBasic = await prisma.user.create({
    data: {
      email: 'moises.perez@streamhub.com',
      name: 'Moises Perez',
      password: hashedPassword,
      plan: 'BASIC',
      peliculasVistasHoy: 3,
      fechaUltimaVista: new Date(),
    }
  });

  // 3. Crear Espectador de Plan PREMIUM
  const userPremium = await prisma.user.create({
    data: {
      email: 'lalo.heredia@streamhub.com',
      name: 'Lalo Heredia',
      password: hashedPassword,
      plan: 'PREMIUM',
    }
  });

  // 4. Crear Creador Studio 1 (Joel Euan)
  const userStudio1 = await prisma.user.create({
    data: {
      id: 'b274e4fe-64fb-4021-a076-e1a820f5c569',
      email: 'joel.euan@streamhub.com',
      name: 'Joel Euan',
      password: hashedPassword,
      plan: 'STUDIO',
      saldoBilletera: 600.00,
      perfilStudio: {
        create: {
          nombreCanal: 'Anime Films',
          fotoPerfilUrl: 'https://www.shutterstock.com/shutterstock/photos/204052951/display_1500/stock-vector-animation-movies-stamp-204052951.jpg',
          fotoPortadaUrl: 'https://p4.wallpaperbetter.com/wallpaper/444/729/235/dragon-ball-z-shenron-film-grain-hd-wallpaper-preview.jpg',
          descripcion: 'Este es un espacio pensado para quienes disfrutan del anime y quieren conocer más de sus series favoritas.\n\nEn este canal encontrarás:\nResúmenes claros, completos y fáciles de seguir\nTeorías interesantes y profundas que expanden cada historia\nAnálisis detallados de personajes, tramas y universos\n Curiosidades, datos ocultos y contenido extra sobre distintos animes\nTodo explicado de forma sencilla y entretenida',
        }
      },
      transacciones: {
        create: [
          {
            monto: 10.00,
            descripcion: 'Comisión por 1000 visualizaciones globales',
          },
          {
            monto: 15.50,
            descripcion: 'Bono de bienvenida a StreamHub Studio',
          }
        ]
      }
    }
  });

  // 5. Crear Creador Studio 2 (Julio Olivera)
  const userStudio2 = await prisma.user.create({
    data: {
      id: 'a6fc9406-6c13-44ca-801d-8e429c1d19df',
      email: 'julio.olivera@streamhub.com',
      name: 'Julio Olivera',
      password: hashedPassword,
      plan: 'STUDIO',
      saldoBilletera: 0.00,
      perfilStudio: {
        create: {
          nombreCanal: 'Julio Air Force',
          fotoPerfilUrl: 'https://static.vecteezy.com/system/resources/previews/014/184/860/non_2x/fighter-air-force-logo-flat-style-vector.jpg',
          fotoPortadaUrl: 'https://img.magnific.com/vector-gratis/aviones-militares-fondo-escena-al-aire-libre_1308-127792.jpg?semt=ais_hybrid&w=740&q=80',
          descripcion: 'Somos un estudio de cine animado que produce películas sobre la historia. Intentamos llevar al espectador a la acción junto a las personas increíbles que vivieron estos eventos.',
        }
      }
    }
  });

  console.log('✅ Base de datos de Usuarios poblada con éxito.');
  console.log({
    basic: userBasic.email,
    premium: userPremium.email,
    studio1: userStudio1.email,
    studio2: userStudio2.email
  });
}

main()
  .catch((e) => {
    console.error('❌ Error al poblar los usuarios de producción:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
