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
    update: {},
    create: {
      email: 'joel.euan@streamhub.com',
      name: 'Joel Euan',
      password: hashedPassword,
      plan: 'STUDIO',
      saldoBilletera: 25.50, // Saldo simulado inicial
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
    update: {},
    create: {
      email: 'julio.olivera@streamhub.com',
      name: 'Julio Olivera',
      password: hashedPassword,
      plan: 'STUDIO',
      saldoBilletera: 0.0,
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