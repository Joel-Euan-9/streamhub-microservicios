const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de INTERACCIONES (Vistas y Comentarios)...');

  // 1. Limpiar datos antiguos
  try {
    await prisma.registroVistaMensual.deleteMany({});
    await prisma.comentario.deleteMany({});
    console.log('Registros antiguos de interacciones eliminados.');
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

  // Si no pudimos obtener películas del catálogo dinámicamente, usamos una lista de fallback
  if (movies.length === 0) {
    console.log('⚠️ No se pudo obtener el catálogo de forma dinámica. Usando fallback con IDs conocidos de creadores...');
    movies = [
      { id: 'b274e4fe-64fb-4021-a076-e1a820f5c569', vistasTotales: 890, titulo: 'El Verdadero Origen de Freezer Teoría | Parte 1', creadorId: 'b274e4fe-64fb-4021-a076-e1a820f5c569' },
      { id: 'a6fc9406-6c13-44ca-801d-8e429c1d19df', vistasTotales: 4100, titulo: 'El Verdadero Origen de Freezer Teoría | Parte 2', creadorId: 'b274e4fe-64fb-4021-a076-e1a820f5c569' },
      { id: 'f15e-eagle-mig-29', vistasTotales: 1540, titulo: 'F15 Eagle vs MiG-29 Fulcrum: La Batalla de los Cielos', creadorId: 'a6fc9406-6c13-44ca-801d-8e429c1d19df' },
      { id: 'f16-falcon-vs-hawk', vistasTotales: 3200, titulo: 'F-16 Falcon vs Hawk: El Desayuno de los Cielos', creadorId: 'a6fc9406-6c13-44ca-801d-8e429c1d19df' }
    ];
  }

  // 3. Generar distribución mensual de vistas para los últimos 6 meses
  const fechaActual = new Date();
  const distribucion = [0.03, 0.07, 0.12, 0.18, 0.25, 0.35];

  console.log('📈 Generando estadísticas mensuales...');
  for (const movie of movies) {
    const totalViews = movie.vistasTotales || movie.vistas || Math.floor(Math.random() * 3000) + 500;
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - i, 1);
      const mes = d.getMonth() + 1; // 1 al 12
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

  // 4. Obtener usuarios espectadores reales del esquema "users" para simular comentarios reales
  console.log('👥 Obteniendo usuarios del sistema...');
  let commenters = [];
  try {
    commenters = await prisma.$queryRaw`
      SELECT id, name, email FROM "users"."users" 
      WHERE email NOT IN ('joel.euan@streamhub.com', 'julio.olivera@streamhub.com')
    `;
    console.log(`Se encontraron ${commenters.length} usuarios espectadores para comentar.`);
  } catch (err) {
    console.log('No se pudo consultar la tabla de usuarios directamente. Usando fallback de IDs de prueba...', err.message);
    commenters = [
      { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', name: 'Lalo Heredia', email: 'lalo.heredia@streamhub.com' },
      { id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', name: 'Moises Perez', email: 'moises.perez@streamhub.com' },
      { id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', name: 'Jean Herrera', email: 'jean.herrera@streamhub.com' }
    ];
  }

  // 5. Crear comentarios realistas en las películas de los creadores
  console.log('💬 Sembrando comentarios interactivos...');
  
  // Películas de Joel (Dragon Ball)
  const joelMovies = movies.filter(m => m.creadorId === 'b274e4fe-64fb-4021-a076-e1a820f5c569' || m.titulo.includes('Freezer'));
  // Películas de Julio (Aviones)
  const julioMovies = movies.filter(m => m.creadorId === 'a6fc9406-6c13-44ca-801d-8e429c1d19df' || m.titulo.includes('F15') || m.titulo.includes('F-16'));

  // Comentarios para Joel
  const joelComments = [
    { text: '¡Excelente teoría! El final de la parte 1 me dejó con muchísimas dudas. ¡Espero con ansias la parte 3!', hrsAgo: 1 },
    { text: 'Wow, la calidad del audio y los gráficos que usas en este video son excelentes. Gran trabajo.', hrsAgo: 4 },
    { text: 'Esta es por mucho la teoría de Dragon Ball más coherente que he visto en años. ¡Suscrito!', hrsAgo: 24 }
  ];

  // Comentarios para Julio
  const julioComments = [
    { text: 'Increíble simulación de combate aéreo. Las maniobras tácticas del F-15 son brutales.', hrsAgo: 2 },
    { text: '¿Harás uno comparando el F-22 Raptor contra el Su-57? Sería fantástico.', hrsAgo: 12 },
    { text: 'Qué buena explicación táctica del enfrentamiento MiG-29 vs F-15.', hrsAgo: 48 }
  ];

  // Insertar comentarios para Joel
  for (let idx = 0; idx < joelMovies.length; idx++) {
    const movie = joelMovies[idx];
    for (let cIdx = 0; cIdx < joelComments.length; cIdx++) {
      const comm = joelComments[cIdx];
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

  // Insertar comentarios para Julio
  for (let idx = 0; idx < julioMovies.length; idx++) {
    const movie = julioMovies[idx];
    for (let cIdx = 0; cIdx < julioComments.length; cIdx++) {
      const comm = julioComments[cIdx];
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

  console.log('✅ Base de datos de Interacciones (Vistas y Comentarios) poblada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error al poblar las interacciones:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
