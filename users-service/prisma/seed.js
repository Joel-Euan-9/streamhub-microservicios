// users-service/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el seeding de usuarios...');

  // Encriptamos una contraseña genérica para todos los usuarios de prueba
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Usuario con Plan STUDIO (Con saldo y transacciones)
  const userStudio1 = await prisma.user.upsert({
    where: { email: 'joel.euan@streamhub.com' },
    update: {
      saldoBilletera: 600.00,
      perfilStudio: {
        upsert: {
          create: {
            nombreCanal: 'Anime Films',
            fotoPerfilUrl: 'https://www.shutterstock.com/shutterstock/photos/204052951/display_1500/stock-vector-animation-movies-stamp-204052951.jpg',
            fotoPortadaUrl: 'https://p4.wallpaperbetter.com/wallpaper/444/729/235/dragon-ball-z-shenron-film-grain-hd-wallpaper-preview.jpg',
            descripcion: 'Este es un espacio pensado para quienes disfrutan del anime y quieren conocer más de sus series favoritas.\n\nEn este canal encontrarás:\nResúmenes claros, completos y fáciles de seguir\nTeorías interesantes y profundas que expanden cada historia\nAnálisis detallados de personajes, tramas y universos\n Curiosidades, datos ocultos y contenido extra sobre distintos animes\nTodo explicado de forma sencilla y entretenida',
          },
          update: {
            nombreCanal: 'Anime Films',
            fotoPerfilUrl: 'https://www.shutterstock.com/shutterstock/photos/204052951/display_1500/stock-vector-animation-movies-stamp-204052951.jpg',
            fotoPortadaUrl: 'https://p4.wallpaperbetter.com/wallpaper/444/729/235/dragon-ball-z-shenron-film-grain-hd-wallpaper-preview.jpg',
            descripcion: 'Este es un espacio pensado para quienes disfrutan del anime y quieren conocer más de sus series favoritas.\n\nEn este canal encontrarás:\nResúmenes claros, completos y fáciles de seguir\nTeorías interesantes y profundas que expanden cada historia\nAnálisis detallados de personajes, tramas y universos\n Curiosidades, datos ocultos y contenido extra sobre distintos animes\nTodo explicado de forma sencilla y entretenida',
          }
        }
      }
    },
    create: {
      id: 'b274e4fe-64fb-4021-a076-e1a820f5c569',
      email: 'joel.euan@streamhub.com',
      name: 'Joel Euan',
      password: hashedPassword,
      plan: 'STUDIO',
      saldoBilletera: 600.00, // Saldo simulado inicial (600 según la petición)
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
    },
  });

  // 2. Otro Usuario con Plan STUDIO (Recién iniciado, sin saldo)
  const userStudio2 = await prisma.user.upsert({
    where: { email: 'julio.olivera@streamhub.com' },
    update: {
      perfilStudio: {
        upsert: {
          create: {
            nombreCanal: 'Julio Air Force',
            fotoPerfilUrl: 'https://static.vecteezy.com/system/resources/previews/014/184/860/non_2x/fighter-air-force-logo-flat-style-vector.jpg',
            fotoPortadaUrl: 'https://img.magnific.com/vector-gratis/aviones-militares-fondo-escena-al-aire-libre_1308-127792.jpg?semt=ais_hybrid&w=740&q=80',
            descripcion: 'Somos un estudio de cine animado que produce películas sobre la historia. Intentamos llevar al espectador a la acción junto a las personas increíbles que vivieron estos eventos.',
          },
          update: {
            nombreCanal: 'Julio Air Force',
            fotoPerfilUrl: 'https://static.vecteezy.com/system/resources/previews/014/184/860/non_2x/fighter-air-force-logo-flat-style-vector.jpg',
            fotoPortadaUrl: 'https://img.magnific.com/vector-gratis/aviones-militares-fondo-escena-al-aire-libre_1308-127792.jpg?semt=ais_hybrid&w=740&q=80',
            descripcion: 'Somos un estudio de cine animado que produce películas sobre la historia. Intentamos llevar al espectador a la acción junto a las personas increíbles que vivieron estos eventos.',
          }
        }
      }
    },
    create: {
      id: 'a6fc9406-6c13-44ca-801d-8e429c1d19df',
      email: 'julio.olivera@streamhub.com',
      name: 'Julio Olivera',
      password: hashedPassword,
      plan: 'STUDIO',
      saldoBilletera: 0.0,
      perfilStudio: {
        create: {
          nombreCanal: 'Julio Air Force',
          fotoPerfilUrl: 'https://static.vecteezy.com/system/resources/previews/014/184/860/non_2x/fighter-air-force-logo-flat-style-vector.jpg',
          fotoPortadaUrl: 'https://img.magnific.com/vector-gratis/aviones-militares-fondo-escena-al-aire-libre_1308-127792.jpg?semt=ais_hybrid&w=740&q=80',
          descripcion: 'Somos un estudio de cine animado que produce películas sobre la historia. Intentamos llevar al espectador a la acción junto a las personas increíbles que vivieron estos eventos.',
        }
      }
    },
  });

  // 3. Usuario con Plan PREMIUM (Sin límites)
  const userPremium = await prisma.user.upsert({
    where: { email: 'lalo.heredia@streamhub.com' },
    update: {},
    create: {
      email: 'lalo.heredia@streamhub.com',
      name: 'Lalo Heredia',
      password: hashedPassword,
      plan: 'PREMIUM',
    },
  });

  // 4. Usuario con Plan BASIC (Con películas vistas hoy)
  const userBasic1 = await prisma.user.upsert({
    where: { email: 'moises.perez@streamhub.com' },
    update: {},
    create: {
      email: 'moises.perez@streamhub.com',
      name: 'Moises Perez',
      password: hashedPassword,
      plan: 'BASIC',
      peliculasVistasHoy: 3, // Ya vio 3 de sus 5 permitidas hoy
      fechaUltimaVista: new Date(),
    },
  });

  // 5. Usuario con Plan BASIC (Al límite de sus vistas de hoy)
  const userBasic2 = await prisma.user.upsert({
    where: { email: 'jean.herrera@streamhub.com' },
    update: {},
    create: {
      email: 'jean.herrera@streamhub.com',
      name: 'Jean Herrera',
      password: hashedPassword,
      plan: 'BASIC',
      peliculasVistasHoy: 5, // Límite alcanzado
      fechaUltimaVista: new Date(),
    },
  });

  console.log('Seeding completado con éxito:');
  console.log({ userStudio1, userStudio2, userPremium, userBasic1, userBasic2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });