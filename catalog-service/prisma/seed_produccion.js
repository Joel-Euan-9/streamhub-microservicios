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
  const suspenso = await prisma.genero.create({ data: { nombre: 'Suspenso' } });

  // --- 3. CREAR PELÍCULAS ORIGINALES DE LA PLATAFORMA ---
  console.log('   🎬 Creando las 20 películas originales...');

  await prisma.pelicula.create({
    data: {
      titulo: 'Burlesque on Car Men ',
      descripcion: 'Una seductora gitana es enviada a consentir a un oficial bofado para permitir una carrera de contrabando.',
      fechaLanzamiento: new Date('1915-12-18'),
      duracion: 37,
      rutaCaratula: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzS90MQuzWT2aBWrBa5LkvbZ6maCNZV2WTR-onWKaNTXtbxP20VPHbebuXRiTZcCQ2_fUYuIk7C3NYIi5_dYhVk_4tQeReigyWs8SQhw&s=10.jpg',
      rutaVideo: 'CC_1915_12_18_ABurlesqueOnCarmen_512kb',
      rutaImagenFondo: 'https://www.youtube.com/watch?v=ofHUIgb3oOo.jpg',
      rutaTrailer: 'https://youtu.be/0RfS1b-QRZk?si=oA5tL4RXhkasFlkI',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 10000, likesTotales: 2000, dislikesTotales: 15,
      generos: { connect: [{id:comedia.id}] }
    }
  });

   await prisma.pelicula.create({
    data: {
      titulo: ' Jack and the Beanstalk',
      descripcion: 'Jack y las habichuelas mágicas es un cuento inglés de tradición oral, convertido en mito universal, ​que sigue inspirando ediciones, espectáculos de teatro y películas de cine.',
      fechaLanzamiento: new Date('2010-05-20'),
      duracion: 121,
      rutaCaratula: 'https://static.wikia.nocookie.net/disneyypixar/images/5/59/Jack_and_the_Beanstalk_%28Restaurado%29.jpg/revision/latest/scale-to-width-down/250?cb=20260322163820&path-prefix=es.jpg',
      rutaVideo: 'ccoPublicDomainJack_and_the_Beanstalk_512kb',
      rutaImagenFondo: 'https://cdn-imgix.headout.com/media/images/51170f35-38e6-479b-94fa-31f7927e3d1d-1751895967348-289742.jpg?auto=format&w=876.6&h=374.4&q=90&fit=crop.jpg',
      rutaTrailer: 'https://youtu.be/IsUvHKwTZkQ?si=p9uaDWe618_X-FiP',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 10000, likesTotales: 2000, dislikesTotales: 15,
      generos: { connect: [{id:aventura.id}, {id:accion.id}] }
    }
  });


  await prisma.pelicula.create({
    data: {
      titulo: ' guliver’s travels',
      descripcion: 'Gulliver’s Travels es una película de animación de 1939 dirigida por Rob Letterman y protagonizada por Jack Black, Jason Segel, Emily Blunt y Amanda Peet. La película es una adaptación libre de la novela homónima de Jonathan Swift, que sigue las aventuras del personaje principal, Lemuel Gulliver, mientras viaja a diferentes lugares fantásticos.',
      fechaLanzamiento: new Date('1939-05-20'),
      duracion: 121,
      rutaCaratula: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/CC_No_16_Gullivers_Travels.jpg/250px-CC_No_16_Gullivers_Travels.jpg',
      rutaVideo: 'gullivers_travels1939_512kb',
      rutaImagenFondo: 'https://i.ytimg.com/vi/YqwC2jTYedg/maxresdefault.jpg',
      rutaTrailer: 'https://youtu.be/_F_WwefYLIs?si=dS5p4HR8J_HRo9Ce',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 10000, likesTotales: 2000, dislikesTotales: 15,
      generos: { connect: [{id:aventura.id}, {id:accion.id}] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: ' house on haunted hill',
      descripcion: 'House on Haunted Hill es una película de terror de 1959 dirigida por William Castle y protagonizada por Vincent Price, Carol Ohmart, Richard Long y Elisha Cook Jr. La película sigue a un millonario excéntrico que invita a cinco personas a pasar la noche en una mansión embrujada, ofreciéndoles una recompensa si logran sobrevivir hasta el amanecer.',
      fechaLanzamiento: new Date('1959-10-01'),
      duracion: 105,
      rutaCaratula: 'https://upload.wikimedia.org/wikipedia/commons/2/24/House_on_Haunted_Hill.jpg',
      rutaVideo: 'house_on_haunted_hill_512kb',
      rutaImagenFondo: 'https://i.ytimg.com/vi/YqwC2jTYedg/maxresdefault.jpg',
      rutaTrailer: 'https://youtu.be/nfhy9nWG6Gw?si=-f7O25kiXbMSyajx',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 10000, likesTotales: 2000, dislikesTotales: 15,
      generos: { connect: [{id:terror.id}, {id:accion.id}, {id:misterio.id}, {id:suspenso.id}] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: ' lost world',
      descripcion: 'The Lost World es una película de aventuras de 1925 dirigida por Harry O. Hoyt y basada en la novela homónima de Arthur Conan Doyle. La película sigue a un grupo de exploradores que viajan a una meseta remota en América del Sur, donde descubren un mundo perdido habitado por dinosaurios y otras criaturas prehistóricas.',
      fechaLanzamiento: new Date('1925-01-01'),
      duracion: 90,
      rutaCaratula: 'https://m.media-amazon.com/images/M/MV5BZjgzZWZhMDYtMDA2YS00MDQ5LWFiNTEtNjRkOTc1MDY5Mzg3XkEyXkFqcGc@._V1_.jpg',
      rutaVideo: 'lost_world_512kb',
      rutaImagenFondo: 'https://m.media-amazon.com/images/S/pv-target-images/2b1611f6d0d55b29cc4c01a07d633305e965d9c189cddc354d006bcdf7c3bf11.jpg',
      rutaTrailer: 'https://youtu.be/tYJ9-kgAfU0?si=TWOoo8vGtXQJorDk',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 10000, likesTotales: 2000, dislikesTotales: 15,
      generos: { connect: [{ id: aventura.id }, { id: cienciaFiccion.id }, { id: accion.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: ' phantom of the opera',
      descripcion: 'The Phantom of the Opera es una película de terror de 1925 dirigida por Rupert Julian y basada en la novela homónima de Gaston Leroux. La película sigue a un misterioso hombre enmascarado que acecha los pasillos del Teatro de la Ópera de París, causando terror entre los empleados y artistas. A medida que la historia se desarrolla, se revelan secretos oscuros sobre el pasado del fantasma y su obsesión por una joven cantante de ópera.',
      fechaLanzamiento: new Date('1925-01-01'),
      duracion: 90,
      rutaCaratula: 'https://m.media-amazon.com/images/M/MV5BMGE4MDQ0ZjEtMWIwNi00YWVlLTk3NTQtMzViMGRlYjA4NzdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      rutaVideo: 'Phantom_of_the_Opera_512kb',
      rutaImagenFondo: 'https://i.ytimg.com/vi/-5hpf-OgGAU/hqdefault.jpg',
      rutaTrailer: 'https://youtu.be/5gncmKoTXB8?si=nWi8Fo_wbua-q5kG',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 10000, likesTotales: 2000, dislikesTotales: 15,
      generos: { connect: [{ id: terror.id }, { id: drama.id }, { id: suspenso.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: ' sita sings the blues small',
      descripcion: 'Sita Sings the Blues es una película de animación independiente de 2008 dirigida por Nina Paley. La película es una reinterpretación moderna del Ramayana, un antiguo poema épico indio, y sigue la historia de Sita, la esposa del héroe Rama, mientras enfrenta desafíos y adversidades. La película combina animación tradicional con música de jazz y blues para contar la historia de Sita de una manera única y emotiva.',
      fechaLanzamiento: new Date('2008-10-01'),
      duracion: 82,
      rutaCaratula: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Sita_STB_Poster.jpg/250px-Sita_STB_Poster.jpg',
      rutaVideo: 'Sita_Sings_the_Blues_small',
      rutaImagenFondo: 'https://www.google.com/imgres?q=sita%20sings%20the%20blues%20small%20trailer&imgurl=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FS%2Fpv-target-images%2Fcef3a872126aff1c1e10c888315f40674e526574d4c33ed23ce12e775321b10d._SX1080_FMjpg_.jpg&imgrefurl=https%3A%2F%2Fwww.primevideo.com%2Fdetail%2F0JZNI5VIOM9UAB9H38QSFI8RB3&docid=fueoazHkLsfIrM&tbnid=2ybW8JzOKIW4nM&vet=12ahUKEwiNkbzCotiUAxXonGoFHQjLLSsQnPAOegQIHxAB..i&w=1080&h=608&hcb=2&ved=2ahUKEwiNkbzCotiUAxXonGoFHQjLLSsQnPAOegQIHxAB.jpg',
      rutaTrailer: 'https://youtu.be/bbLdhJdL6Mg?si=MmNpsKDHpYQH16vk',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 10000, likesTotales: 2000, dislikesTotales: 15,
      generos: { connect: [{ id: animacion.id }, { id: musica.id }, { id: drama.id }] }
    }
  });

  

  console.log('✅ Base de datos de Catálogo poblada con éxito. Total: 24 películas.');
}

main()
  .catch((e) => {
    console.error('❌ Error al poblar el catálogo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });