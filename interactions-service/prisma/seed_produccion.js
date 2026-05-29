// interactions-service/prisma/seed_produccion.js
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de producción de INTERACCIONES (Vistas y Comentarios)...');

  // 1. Limpiar datos antiguos
  try {
    await prisma.registroVistaMensual.deleteMany({});
    await prisma.comentario.deleteMany({});
    console.log('Registros antiguos de interacciones de producción eliminados.');
  } catch (e) {
    console.log('No se pudieron borrar los registros antiguos.');
  }

  // 2. Obtener películas del catálogo
  let movies = [];
  const urls = [
    'http://localhost:8001/peliculas',
    'http://catalog-service:8000/peliculas',
    'http://localhost:8000/api/peliculas'
  ];

  for (const url of urls) {
    try {
      console.log(`Intentando conectar con el catálogo en: ${url}...`);
      const resp = await axios.get(url, { timeout: 3000 });
      if (resp.data && Array.isArray(resp.data)) {
        movies = resp.data;
        console.log(`¡Conexión exitosa! Se obtuvieron ${movies.length} películas del catálogo.`);
        break;
      }
    } catch (err) {
      console.log(`No se pudo conectar a ${url}: ${err.message}`);
    }
  }

  // Si no pudimos obtener películas de forma dinámica, usamos la lista oficial de producción
  if (movies.length === 0) {
    console.log('⚠️ No se pudo obtener el catálogo dinámicamente. Usando listado estático oficial...');
    movies = [
      { id: '11aa11aa-11aa-11aa-11aa-11aa11aa11aa', vistasTotales: 1250, titulo: 'Burlesque on Car Men' },
      { id: '22bb22bb-22bb-22bb-22bb-22bb22bb22bb', vistasTotales: 4200, titulo: 'Jack and the Beanstalk' },
      { id: '33cc33cc-33cc-33cc-33cc-33cc33cc33cc', vistasTotales: 8900, titulo: 'guliver’s travels' },
      { id: '44dd44dd-44dd-44dd-44dd-44dd44dd44dd', vistasTotales: 5600, titulo: 'house on haunted hill' },
      { id: '55ee55ee-55ee-55ee-55ee-55ee55ee55ee', vistasTotales: 3200, titulo: 'lost world' },
      { id: '66ff66ff-66ff-66ff-66ff-66ff66ff66ff', vistasTotales: 1540, titulo: 'phantom of the opera', creadorId: 'b274e4fe-64fb-4021-a076-e1a820f5c569' },
      { id: '77aa77aa-77aa-77aa-77aa-77aa77aa77aa', vistasTotales: 980, titulo: 'sita sings the blues small', creadorId: 'a6fc9406-6c13-44ca-801d-8e429c1d19df' }
    ];
  }

  // 3. Generar distribución mensual de vistas para los últimos 6 meses
  const fechaActual = new Date();
  const distribucion = [0.03, 0.07, 0.12, 0.18, 0.25, 0.35];

  console.log('📈 Generando estadísticas mensuales de vistas...');
  for (const movie of movies) {
    const totalViews = movie.vistasTotales || movie.vistas || 1000;
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1);
      const mes = d.getMonth() + 1;
      const anio = d.getFullYear();
      
      const factor = distribucion[5 - i];
      const cantidadVistas = Math.round(totalViews * factor);

      try {
        await prisma.registroVistaMensual.create({
          data: {
            peliculaId: movie.id,
            mes,
            anio,
            cantidadVistas
          }
        });
      } catch (err) {
        console.error(`Error al insertar vistas mensuales para película ${movie.titulo || movie.id}:`, err.message);
      }
    }
  }

  // 4. Obtener usuarios espectadores reales de la base de datos "users" para los comentarios
  console.log('👥 Consultando usuarios espectadores...');
  let commenters = [];
  try {
    commenters = await prisma.$queryRaw`
      SELECT id, name, email FROM "users"."users" 
      WHERE email NOT IN ('joel.euan@streamhub.com', 'julio.olivera@streamhub.com')
    `;
    console.log(`Se encontraron ${commenters.length} usuarios espectadores para comentar.`);
  } catch (err) {
    console.log('No se pudo consultar la tabla de usuarios directamente. Usando fallback de IDs de producción...', err.message);
  }

  if (commenters.length === 0) {
    commenters = [
      { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', name: 'Lalo Heredia', email: 'lalo.heredia@streamhub.com' },
      { id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', name: 'Moises Perez', email: 'moises.perez@streamhub.com' }
    ];
  }

  // 5. Crear comentarios realistas en las películas de terceros de los creadores
  console.log('💬 Sembrando comentarios de producción...');
  
  const phantomMovies = movies.filter(m => m.id === '66ff66ff-66ff-66ff-66ff-66ff66ff66ff' || m.titulo.toLowerCase().includes('phantom'));
  const sitaMovies = movies.filter(m => m.id === '77aa77aa-77aa-77aa-77aa-77aa77aa77aa' || m.titulo.toLowerCase().includes('sita'));

  const phantomComments = [
    { text: '¡Espectacular clásico de terror! La atmósfera del teatro de la ópera es inigualable.', hrsAgo: 1 },
    { text: 'Excelente restauración de este clásico mudo. El audio acompaña de forma perfecta la tensión.', hrsAgo: 6 },
    { text: 'Un gran aporte al canal de Anime Films. ¡Sigan subiendo obras de esta calidad histórica!', hrsAgo: 24 }
  ];

  const sitaComments = [
    { text: 'Me encantó la combinación de la mitología hindú con las canciones de blues clásico.', hrsAgo: 2 },
    { text: 'La animación tiene un estilo sumamente único, colorido y atrevido. Muy recomendada.', hrsAgo: 10 },
    { text: 'Increíble película independiente. Qué joya haberla descubierto en StreamHub.', hrsAgo: 48 }
  ];

  // Insertar comentarios para el fantasma de la ópera (Joel Euan)
  for (let idx = 0; idx < phantomMovies.length; idx++) {
    const movie = phantomMovies[idx];
    for (let cIdx = 0; cIdx < phantomComments.length; cIdx++) {
      const comm = phantomComments[cIdx];
      const commenter = commenters[(idx + cIdx) % commenters.length];
      const fechaComentario = new Date(fechaActual.getTime() - comm.hrsAgo * 60 * 60 * 1000);

      try {
        await prisma.comentario.create({
          data: {
            usuarioId: commenter.id,
            peliculaId: movie.id,
            contenido: comm.text,
            fecha: fechaComentario
          }
        });
      } catch (err) {
        console.error(`Error al insertar comentario en película de Joel:`, err.message);
      }
    }
  }

  // Insertar comentarios para Sita Sings the Blues (Julio Olivera)
  for (let idx = 0; idx < sitaMovies.length; idx++) {
    const movie = sitaMovies[idx];
    for (let cIdx = 0; cIdx < sitaComments.length; cIdx++) {
      const comm = sitaComments[cIdx];
      const commenter = commenters[(idx + cIdx + 1) % commenters.length];
      const fechaComentario = new Date(fechaActual.getTime() - comm.hrsAgo * 60 * 60 * 1000);

      try {
        await prisma.comentario.create({
          data: {
            usuarioId: commenter.id,
            peliculaId: movie.id,
            contenido: comm.text,
            fecha: fechaComentario
          }
        });
      } catch (err) {
        console.error(`Error al insertar comentario en película de Julio:`, err.message);
      }
    }
  }

  console.log('✅ Base de datos de Interacciones de producción poblada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error al poblar las interacciones de producción:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
