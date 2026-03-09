const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de USUARIOS...');

  // 1. Limpiar datos anteriores (Opcional, para evitar errores de duplicados al re-ejecutar)
  // Borramos primero tablas dependientes si las hubiera (Visualizacion, Favorito)
  try {
    await prisma.visualizacion.deleteMany({});
    await prisma.favorito.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Datos antiguos eliminados.');
  } catch (e) {
    console.log('No se pudieron borrar datos antiguos (quizás es la primera vez).');
  }

  // 2. Crear Usuarios
  console.log('Creando usuarios...');
  
  const usuario1 = await prisma.user.create({
    data: {
      name: 'Maverick',
      email: 'maverick@gmail.com',
      password: 'maverick123' 
    }
  });

  const usuario2 = await prisma.user.create({
    data: {
      name: 'Maik',
      email: 'maik@gmail.com',
      password: 'maik123',
    }
  });

  console.log(`   ✅ Usuarios creados: ${usuario1.email}, ${usuario2.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed de usuarios:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });