const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de CATÁLOGO (Películas y Géneros)...');

  // 1. Limpiar datos anteriores
  try {
    await prisma.pelicula.deleteMany({});
    await prisma.genero.deleteMany({});
    console.log('Datos antiguos eliminados.');
  } catch (e) {
    console.log('No se pudieron borrar datos antiguos.');
  }

  // --- 2. CREAR GÉNEROS ---
  console.log('   🎭 Creando géneros...');
  const animacion = await prisma.genero.create({ data: { nombre: 'Animación' } });
  const familia = await prisma.genero.create({ data: { nombre: 'Familia' } });
  const musica = await prisma.genero.create({ data: { nombre: 'Música' } });
  const accion = await prisma.genero.create({ data: { nombre: 'Acción' } });
  const cienciaFiccion = await prisma.genero.create({ data: { nombre: 'Ciencia Ficción' } });
  const aventura = await prisma.genero.create({ data: { nombre: 'Aventura' } });
  const misterio = await prisma.genero.create({ data: { nombre: 'Misterio' } });
  const terror = await prisma.genero.create({ data: { nombre: 'Terror' } });
  const comedia = await prisma.genero.create({ data: { nombre: 'Comedia' } });
  const fantasia = await prisma.genero.create({ data: { nombre: 'Fantasía' } });
  const romance = await prisma.genero.create({ data: { nombre: 'Romance' } });
  const drama = await prisma.genero.create({ data: { nombre: 'Drama' } });
  const belica = await prisma.genero.create({ data: { nombre: 'Bélica' } });
  const crimen = await prisma.genero.create({ data: { nombre: 'Crimen' } });
  const documental = await prisma.genero.create({ data: { nombre: 'Documental' } }); // Agregado para los creadores

  // --- 3. CREAR PELÍCULAS ORIGINALES DE LA PLATAFORMA ---
  console.log('   🎬 Creando las 10 películas originales...');

  await prisma.pelicula.create({
    data: {
      titulo: 'Coco',
      descripcion: 'Un joven aspirante a músico llamado Miguel se embarca en un viaje extraordinario a la mágica tierra de sus ancestros.',
      fechaLanzamiento: new Date('2017-10-27'),
      duracion: 109,
      rutaCaratula: 'https://image.tmdb.org/t/p/w600_and_h900_face/vwsFGblLYxWBNjg9pdWN1Mm5YfW.jpg',
      rutaVideo: 'coco.mp4',
      rutaImagenFondo: 'https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtY40Yb.jpg',
      rutaTrailer: 'https://youtu.be/4o4ovPKvTOI',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 8500, likesTotales: 1200, dislikesTotales: 15,
      generos: { connect: [{ id: animacion.id }, { id: familia.id }, { id: musica.id }, { id: aventura.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Max steel vs la amenaza mutante',
      descripcion: 'Tras ser reconstruido, Cytro se convierte en compañero de misión de Max.',
      fechaLanzamiento: new Date('2009-06-11'),
      duracion: 47,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w600_and_h900_face/1j6Aa39ErfBQaCvHTYOlTJDxrSz.jpg',
      rutaVideo: 'max-steel-vs-la-amenaza-mutante.mp4',
      rutaImagenFondo: 'https://i.ytimg.com/vi/-U1m_4BU0dg/maxresdefault.jpg',
      rutaTrailer: 'https://youtu.be/sz3PpqUAjGE',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 3200, likesTotales: 450, dislikesTotales: 22,
      generos: { connect: [{ id: accion.id }, { id: cienciaFiccion.id }, { id: animacion.id }, { id: aventura.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Prometeo',
      descripcion: 'Un grupo de científicos y exploradores emprende un viaje espacial a un remoto planeta.',
      fechaLanzamiento: new Date('2012-06-15'),
      duracion: 124,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w600_and_h900_face/5oYpDom6T7c1YiL2j5IImKklws7.jpg',
      rutaVideo: 'prometeo.mp4',
      rutaImagenFondo: 'https://media.revistagq.com/photos/62a9b84f95ef49f9257c92c1/16:9/w_2560%2Cc_limit/Prometheus-sci-fi-movie_2880x1800.jpg',
      rutaTrailer: 'https://youtu.be/MldbTQFVE6c',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 12500, likesTotales: 3100, dislikesTotales: 410,
      generos: { connect: [{ id: misterio.id }, { id: cienciaFiccion.id }, { id: terror.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Hotel Transilvania 3: Unas vacaciones monstruosas',
      descripcion: 'Nuestra familia de monstruos favorita se embarca en un crucero de lujo.',
      fechaLanzamiento: new Date('2018-07-13'),
      duracion: 90,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w600_and_h900_face/r69lcBWIqjN1wU0sKuxyubbtyF.jpg',
      rutaVideo: 'hotel-transilvania-3.mp4',
      rutaImagenFondo: 'https://i.blogs.es/0473f4/transilvania-hotel-3-cartel/1366_2000.jpg',
      rutaTrailer: 'https://youtu.be/9c44MV4vw9c',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 6700, likesTotales: 890, dislikesTotales: 45,
      generos: { connect: [{ id: animacion.id }, { id: comedia.id }, { id: familia.id }, { id: fantasia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Jumanji: Bienvenidos a la jungla',
      descripcion: 'Cuatro estudiantes de secundaria se quedan atrapados en la selva dentro de un videojuego.',
      fechaLanzamiento: new Date('2017-12-21'),
      duracion: 118,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/1uQaSgtHyTN3r2fecL0mSs6geQO.jpg',
      rutaVideo: 'jumanji.mp4',
      rutaImagenFondo: 'https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABfScdYEnEI_xFBPhl_YUFwv3Frs-IHIL77zy0gWoVd0kwmUG5-NOxGBys2RkIo_SLXudQT02T4GmvQU3LbnvhePVFYHNq1VDwoWu.jpg?r=1fe',
      rutaTrailer: 'https://youtu.be/leIrosWRbYQ',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 9200, likesTotales: 1500, dislikesTotales: 80,
      generos: { connect: [{ id: aventura.id }, { id: comedia.id }, { id: accion.id }, { id: fantasia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Cigüeñas',
      descripcion: 'En Montaña Cigüeña, viven las cigüeñas que hace tiempo enviaban bebés.',
      fechaLanzamiento: new Date('2016-09-23'),
      duracion: 89,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/eEyLLrcUAvmAn6OoZwEvzCUG6Z6.jpg',
      rutaVideo: 'ciguenias.mp4',
      rutaImagenFondo: 'https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/a8b36b0b-5644-4179-84a7-cce257ff8205/13c58693244ae002cf2a4c302eab3e27464e9afd.jpg?host=wbd-images.prod-vod.h264.io&partner=beamcom',
      rutaTrailer: 'https://youtu.be/_2DO65R2Kds',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 4100, likesTotales: 600, dislikesTotales: 30,
      generos: { connect: [{ id: aventura.id }, { id: animacion.id }, { id: comedia.id }, { id: familia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Maléfica: Maestra del mal',
      descripcion: 'Maléfica: Maestra del mal, de Disney, es una aventura de fantasía.',
      fechaLanzamiento: new Date('2019-10-18'),
      duracion: 119,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/eZOkXqHXWCKytd78TggAtJ0M3gU.jpg',
      rutaVideo: 'malefica-maestra-del-mal.mp4',
      rutaImagenFondo: 'https://sm.ign.com/t/ign_es/screenshot/default/blob_3q2v.1280.jpg',
      rutaTrailer: 'https://youtu.be/KyoDGNYUimM',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 8800, likesTotales: 1350, dislikesTotales: 110,
      generos: { connect: [{ id: fantasia.id }, { id: aventura.id }, { id: familia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'El hogar de Miss Peregrine para niños peculiares',
      descripcion: 'Una horrible tragedia familiar lleva a Jacob, de 16 años, a viajar por la costa de Gales.',
      fechaLanzamiento: new Date('2016-09-30'),
      duracion: 127,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/b4585PS4VZEqvwvVZiqeYZkpxhC.jpg',
      rutaVideo: 'miss-pregrine-y-los-ninios-peculiares.mp4',
      rutaImagenFondo: 'https://m.media-amazon.com/images/S/pv-target-images/0a8d2e7dcb0d71d5a71829e5f453c5fc66870bd06900894216e475938e04ca5b.jpg',
      rutaTrailer: 'https://youtu.be/6WgCZWiCkOg',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 5600, likesTotales: 920, dislikesTotales: 40,
      generos: { connect: [{ id: fantasia.id }, { id: aventura.id }, { id: familia.id }, { id: drama.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'La guerra del planeta de los simios',
      descripcion: 'César y sus monos son forzados a encarar un conflicto mortal contra un ejército de humanos.',
      fechaLanzamiento: new Date('2017-07-27'),
      duracion: 140,
      rutaCaratula: 'https://m.media-amazon.com/images/M/MV5BZDFiNTc4ZDktOTI5YS00NGI0LWJlZjYtNzFhMDgxZWNmMjQyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      rutaVideo: 'el-planeta-de-los-simios-la-guerra.mp4',
      rutaImagenFondo: 'https://m.media-amazon.com/images/S/pv-target-images/354a24e271f93a2287ac6a36518d86f98475752af42f18b4ffad1dabdee2775c.jpg',
      rutaTrailer: 'https://youtu.be/3d3rAJ8R0Fg',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 11000, likesTotales: 2100, dislikesTotales: 150,
      generos: { connect: [{ id: drama.id }, { id: cienciaFiccion.id }, { id: belica.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'El lobo de Wall Street',
      descripcion: 'Película basada en hechos reales del corredor de bolsa neoyorquino Jordan Belfort.',
      fechaLanzamiento: new Date('2014-01-10'),
      duracion: 180,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/uthRoUeTtiep5HCoySlOjQSPCbJ.jpg',
      rutaVideo: 'el-lobo-de-wall-street.mp4',
      rutaImagenFondo: 'https://media.revistagq.com/photos/5f5f50fa09c89c3fca562703/16:9/w_2560%2Cc_limit/leonardo-dicaprio-el-lobo-de-wall-street.jpg',
      rutaTrailer: 'https://youtu.be/DEMZSa0esCU',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 22000, likesTotales: 5400, dislikesTotales: 320,
      generos: { connect: [{ id: drama.id }, { id: comedia.id }, { id: crimen.id }] }
    }
  });

  // --- 4. CREAR PELÍCULAS DE TERCEROS (STUDIO) ---
  console.log('   📹 Creando películas independientes de usuarios Studio...');

  const ID_JOEL = 'b274e4fe-64fb-4021-a076-e1a820f5c569';
  const ID_JULIO = 'a6fc9406-6c13-44ca-801d-8e429c1d19df';

  // Película 1 de Joel
  await prisma.pelicula.create({
    data: {
      titulo: 'Cenotes: Ecos del Inframundo',
      descripcion: 'Un viaje documental profundo a los místicos cenotes de Yucatán, explorando su belleza y las leyendas mayas que los rodean.',
      fechaLanzamiento: new Date('1999-05-12'),
      duracion: 45,
      rutaCaratula: 'https://images.unsplash.com/photo-1580228491851-f402c01990cc?auto=format&fit=crop&q=80&w=600&h=900',
      rutaVideo: 'cenotes-doc.mp4',
      rutaImagenFondo: 'https://images.unsplash.com/photo-1502622796232-e88458466c33?auto=format&fit=crop&q=80&w=1920&h=1080',
      rutaTrailer: 'https://youtu.be/F4a0s0d1D6s', // Video genérico de cenotes
      requierePremium: false,
      tipoContenido: 'TERCEROS',
      creadorId: ID_JOEL,
      vistasTotales: 1540, likesTotales: 310, dislikesTotales: 5,
      generos: { connect: [{ id: documental.id }, { id: misterio.id }, { id: aventura.id }] }
    }
  });

  // Película 2 de Joel
  await prisma.pelicula.create({
    data: {
      titulo: 'Código y Café: La vida del desarrollador',
      descripcion: 'Un cortometraje cómico y dramático sobre los retos de un estudiante de ingeniería de software a punto de graduarse y su proyecto final.',
      fechaLanzamiento: new Date('1999-01-20'),
      duracion: 32,
      rutaCaratula: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600&h=900',
      rutaVideo: 'codigo-y-cafe.mp4',
      rutaImagenFondo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1920&h=1080',
      rutaTrailer: 'https://youtu.be/mKWJqP8KEMg',
      requierePremium: false,
      tipoContenido: 'TERCEROS',
      creadorId: ID_JOEL,
      vistasTotales: 3200, likesTotales: 850, dislikesTotales: 12,
      generos: { connect: [{ id: comedia.id }, { id: drama.id }] }
    }
  });

  // Película 1 de Julio
  await prisma.pelicula.create({
    data: {
      titulo: 'El Último Tren',
      descripcion: 'Un cortometraje de suspenso psicológico sobre un joven que toma el último tren a casa, pero descubre que no está solo en el vagón.',
      fechaLanzamiento: new Date('1999-11-03'),
      duracion: 25,
      rutaCaratula: 'https://images.unsplash.com/photo-1533038676646-7c0abec28fbf?auto=format&fit=crop&q=80&w=600&h=900',
      rutaVideo: 'ultimo-tren.mp4',
      rutaImagenFondo: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1920&h=1080',
      rutaTrailer: 'https://youtu.be/wXhThhJ_R5w',
      requierePremium: false,
      tipoContenido: 'TERCEROS',
      creadorId: ID_JULIO,
      vistasTotales: 890, likesTotales: 150, dislikesTotales: 20,
      generos: { connect: [{ id: misterio.id }, { id: terror.id }] }
    }
  });

  // Película 2 de Julio
  await prisma.pelicula.create({
    data: {
      titulo: 'Operación: Fénix',
      descripcion: 'Un proyecto independiente de acción desenfrenada donde un ex-agente debe recuperar unos documentos robados antes del amanecer.',
      fechaLanzamiento: new Date('1999-08-14'),
      duracion: 55,
      rutaCaratula: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&q=80&w=600&h=900',
      rutaVideo: 'operacion-fenix.mp4',
      rutaImagenFondo: 'https://images.unsplash.com/photo-1497911270199-1c552ee64aa4?auto=format&fit=crop&q=80&w=1920&h=1080',
      rutaTrailer: 'https://youtu.be/v22oG9Z-U7Y',
      requierePremium: false,
      tipoContenido: 'TERCEROS',
      creadorId: ID_JULIO,
      vistasTotales: 4100, likesTotales: 920, dislikesTotales: 45,
      generos: { connect: [{ id: accion.id }, { id: crimen.id }] }
    }
  });

  console.log('✅ Base de datos de Catálogo poblada con éxito. Total: 14 películas.');
}

main()
  .catch((e) => {
    console.error('❌ Error al poblar el catálogo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });