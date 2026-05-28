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
      titulo: 'Coco',
      descripcion: 'Un joven aspirante a músico llamado Miguel se embarca en un viaje extraordinario a la mágica tierra de sus ancestros. Allí, el encantador embaucador Héctor se convierte en su inesperado amigo y le ayuda a descubrir los misterios detrás de las historias y tradiciones de su familia.',
      fechaLanzamiento: new Date('2017-10-27'),
      duracion: 109,
      rutaCaratula: 'https://image.tmdb.org/t/p/w600_and_h900_face/vwsFGblLYxWBNjg9pdWN1Mm5YfW.jpg',
      rutaVideo: 'coco.mp4',
      rutaImagenFondo: 'https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtY40Yb.jpg',
      rutaTrailer: 'https://youtu.be/6JIZIwfrZ7g',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 8500, likesTotales: 1200, dislikesTotales: 15,
      generos: { connect: [{ id: animacion.id }, { id: familia.id }, { id: musica.id }, { id: aventura.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Max Steel vs La Amenaza Mutante',
      descripcion: 'Tras su reconstrucción, Cytro se convierte en el compañero de misión de Max, pero ahora ambos están bajo las órdenes directas de Forge Ferrous, un nuevo comandante de campo de N-Tek que sustituye a Jefferson. Este nuevo jefe es un controlador excéntrico con una actitud agresiva y de lealtad al equipo que contrasta con el espíritu libre de Max, lo que provoca varios conflictos entre ellos. En respuesta a una llamada de emergencia, Max y Cytro son enviados a un laboratorio subterráneo en la Antártida que también sirve de prisión para un agente inestable de N-Tek que sufre una mutación debido a una fuerte exposición a la contaminación química.',
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
      descripcion: 'Un grupo de científicos y exploradores emprende un viaje espacial a un remoto planeta, en el que sus límites físicos y mentales serán puestos a prueba. El motivo de la misión es que los humanos creen que allá podrán encontrar las respuestas a las preguntas más profundas y al mayor de los misterios: el origen de la vida en la Tierra.',
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
      descripcion: 'Nuestra familia de monstruos favorita se embarca en un crucero de lujo para que por fin Drac pueda tomarse un descanso de proveer de vacaciones al resto en el hotel. Es una navegación tranquila para la pandilla de Drac, ya que los monstruos se entregan a toda la diversión a bordo que ofrece el crucero, desde el voleibol de monstruos y las excursiones exóticas, a ponerse al día con sus bronceados de luna. Pero las vacaciones de ensueño se convierten en una pesadilla cuando Mavis se da cuenta de que Drac se ha enamorado de la misteriosa capitana de la nave, Ericka, quien esconde un peligroso secreto que podría destruir a todos los monstruos.',
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
      descripcion: 'Cuatro estudiantes de secundaria se quedan atrapados en la selva dentro de un videojuego, donde viven una aventura convertidos en avatares adultos arquetípicos.',
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
      descripcion: 'En Montaña Cigüeña, viven las cigüeñas que hace tiempo enviaban bebés a los padres de todo el mundo. Ahora distribuyen los paquetes de una compañía mundial de Internet. Junior, la mejor cigüeña repartidora de la compañía, está a punto de conseguir un ascenso, pero accidentalemete activa la Máquina de Producción de Bebés y el resultado es una adorable niña ilegal. Para evitar que su jefe se entere, Junior y su amiga Tulip, el único ser humano de Montaña Cigüeña, se apresuran a entregar el bebé en un viaje salvaje que podría afectar a la integridad de más de una familia y restablecer la verdadera misión de las cigüeñas en el mundo. Debut en el largometraje de Doug Sweetland, responsable del corto de Pixar "Presto" (2008).',
      fechaLanzamiento: new Date('2016-09-23'),
      duracion: 89,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/eEyLLrcUAvmAn6OoZwEvzCUG6Z6.jpg',
      rutaVideo: 'ciguenias.mp4',
      rutaImagenFondo: 'https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/a8b36b0b-5644-4179-84a7-cce257ff8205/13c58693244ae002cf2a4c302eab3e27464e9afd.jpg?host=wbd-images.prod-vod.h264.io&partner=beamcom',
      rutaTrailer: 'https://youtu.be/_2DO65R2Kds',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 4100, likesTotales: 600, dislikesTotales: 30,
      generos: { connect: [{ id: aventura.id }, { id: animacion.id }, { id: comedia.id }, { id: familia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Maléfica: Maestra del mal',
      descripcion: 'Maléfica: Maestra del mal, de Disney, es una aventura de fantasía que retoma la historia de Maléfica varios años más tarde —en la que se dieron a conocer los hechos que endurecieron el corazón de la villana más emblemática de Disney y la llevaron a arrojar una maldición sobre la princesa recién nacida: Aurora. La película continúa explorando la compleja relación entre el hada de enormes cuernos y la futura reina, mientras forjan nuevas alianzas y se enfrentan a nuevos adversarios en su lucha por proteger el páramo y las criaturas mágicas que lo habitan.',
      fechaLanzamiento: new Date('2019-10-18'),
      duracion: 119,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/eZOkXqHXWCKytd78TggAtJ0M3gU.jpg',
      rutaVideo: 'malefica-maestra-del-mal.mp4',
      rutaImagenFondo: 'https://sm.ign.com/t/ign_es/screenshot/default/blob_3q2v.1280.jpg',
      rutaTrailer: 'https://youtu.be/KyoDGNYUimM',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 8800, likesTotales: 1350, dislikesTotales: 110,
      generos: { connect: [{ id: fantasia.id }, { id: aventura.id }, { id: familia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'El hogar de Miss Peregrine para niños peculiares',
      descripcion: 'Una horrible tragedia familiar lleva a Jacob, de 16 años, a viajar por la costa de Gales, donde descubre las ruinas del hogar para niños especiales de Miss Peregrine. Mientras explora los destartalados cuartos y pasillos, se da cuenta que los niños que vivieron allí (uno de los cuales fue su abuelo) eran excepcionales. Quizá eran peligrosos, quizá había una buena razón para ponerlos en cuarentena en una isla desierta; incluso podría ocurrir que todavía estuvieran vivos.',
      fechaLanzamiento: new Date('2016-09-30'),
      duracion: 127,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/b4585PS4VZEqvwvVZiqeYZkpxhC.jpg',
      rutaVideo: 'miss-pregrine-y-los-ninios-peculiares.mp4',
      rutaImagenFondo: 'https://m.media-amazon.com/images/S/pv-target-images/0a8d2e7dcb0d71d5a71829e5f453c5fc66870bd06900894216e475938e04ca5b.jpg',
      rutaTrailer: 'https://youtu.be/6WgCZWiCkOg',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 5600, likesTotales: 920, dislikesTotales: 40,
      generos: { connect: [{ id: fantasia.id }, { id: aventura.id }, { id: familia.id }, { id: drama.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'La guerra del planeta de los simios',
      descripcion: 'César y sus monos son forzados a encarar un conflicto mortal contra un ejército de humanos liderado por un brutal coronel. Después de sufrir pérdidas enormes, César lucha con sus instintos más oscuros en una búsqueda por vengar a su especie. Cuando finalmente se encuentren, Cesar y el Coronel protagonizarán una batalla que pondrá en juego el futuro de ambas especies y el del mismo planeta. Tercera película de la nueva saga de El Planeta de los Simios.',
      fechaLanzamiento: new Date('2017-07-27'),
      duracion: 140,
      rutaCaratula: 'https://m.media-amazon.com/images/M/MV5BZDFiNTc4ZDktOTI5YS00NGI0LWJlZjYtNzFhMDgxZWNmMjQyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      rutaVideo: 'el-planeta-de-los-simios-la-guerra.mp4',
      rutaImagenFondo: 'https://m.media-amazon.com/images/S/pv-target-images/354a24e271f93a2287ac6a36518d86f98475752af42f18b4ffad1dabdee2775c.jpg',
      rutaTrailer: 'https://youtu.be/3d3rAJ8R0Fg',
      requierePremium: false,
      tipoContenido: 'ORIGINAL',
      vistasTotales: 11000, likesTotales: 2100, dislikesTotales: 150,
      generos: { connect: [{ id: drama.id }, { id: cienciaFiccion.id }, { id: belica.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'El lobo de Wall Street',
      descripcion: 'Película basada en hechos reales del corredor de bolsa neoyorquino Jordan Belfort. A mediados de los años 80, Belfort era un joven honrado que perseguía el sueño americano, pero pronto en la agencia de valores aprendió que lo más importante no era hacer ganar a sus clientes, sino ser ambicioso y ganar una buena comisión. Su enorme éxito y fortuna le valió el mote de "El lobo de Wall Street". Dinero. Poder. Mujeres. Drogas. Las tentaciones abundaban y el temor a la ley era irrelevante. Jordan y su manada de lobos consideraban que la discreción era una cualidad anticuada; nunca se conformaban con lo que tenían.',
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

  await prisma.pelicula.create({
    data: {
      titulo: 'Los Caballeros del Zodiaco: La Leyenda del Santuario',
      descripcion: 'Los Caballeros del Zodiaco: La Leyenda del Santuario sigue de cerca a cinco jóvenes guerreros conocidos como Los Caballeros de Bronce (Seiya, Shiryu, Shun, Hyoga e Ikki), los cuales tienen la misión de proteger a Saori Kido, una joven con misteriosos poderes que resulta ser la reencarnación de la diosa Atenea. Cuando la muchacha es atacada con una flecha mágica, estos santos protectores, para salvar su vida, deben atravesar, en doce horas, los doce Templos del Zodiaco en el Santuario de Atenea, cada uno de ellos custodiados por un Caballero de Oro. Una vez en el Santuario, deberán enfrentarse al Patriarca, y coger la cura que salve a Atenea de una muerte inminente.',
      fechaLanzamiento: new Date('2014-06-21'),
      duracion: 95,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w600_and_h900_face/eo7HY3DtwPOd9JIDInoDQdBwInZ.jpg',
      rutaVideo: 'cbz-la-leyenda-del-santuario.webm',
      rutaImagenFondo: 'https://filasiete.com/wp-content/uploads/2015/03/Caballeros.jpg',
      rutaTrailer: 'https://youtu.be/jIVxsgSVfRs',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 15400, likesTotales: 4200, dislikesTotales: 150,
      generos: { connect: [{ id: accion.id }, { id: animacion.id }, { id: fantasia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Five Nights at Freddys 2',
      descripcion: 'Un año después de la pesadilla sobrenatural en Freddy Fazbears Pizza, las historias sobre lo ocurrido allí se han convertido en una leyenda local extravagante, inspirando el primer Fazfest del pueblo. Con la verdad oculta, Abby se escapa para reencontrarse con Freddy, Bonnie, Chica y Foxy, desencadenando una serie de eventos aterradores que revelarán oscuros secretos sobre el verdadero origen de Freddys y desatarán un horror oculto durante décadas.',
      fechaLanzamiento: new Date('2025-12-04'),
      duracion: 104,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/egHOFSRXrAaugFUD7VMEnXlTnzJ.jpg',
      rutaVideo: 'fnaf2-la-pelicula.webm',
      rutaImagenFondo: 'https://media.themoviedb.org/t/p/w1066_and_h600_face/igxgTccNiUGmIBVO9kjivuVPp52.jpg',
      rutaTrailer: 'https://youtu.be/YiWXTkpP9j0',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 9800, likesTotales: 2100, dislikesTotales: 95,
      generos: { connect: [{ id: terror.id }, { id: suspenso.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Interstellar',
      descripcion: 'Un grupo de exploradores hacen uso de un agujero de gusano recientemente descubierto para superar las limitaciones de los viajes espaciales tripulados y vencer las inmensas distancias que tiene un viaje interestelar.',
      fechaLanzamiento: new Date('2014-11-06'),
      duracion: 169,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/oBvINgU5r10WHvG6VSopCOlWtJP.jpg',
      rutaVideo: 'interestelar.webm',
      rutaImagenFondo: 'https://image.tmdb.org/t/p/original/gg12Nnz7YETfC2Nwb6jGM5sif6X.jpg',
      rutaTrailer: 'https://youtu.be/LYS2O1nl9iM',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 25600, likesTotales: 8900, dislikesTotales: 410,
      generos: { connect: [{ id: aventura.id }, { id: drama.id }, { id: cienciaFiccion.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Jeruzalem',
      descripcion: 'Durante el Yom Kipur, dos jóvenes americanas visitan Jerusalén de la mano de un atractivo estudiante de antropología. El momento no podía ser más desacertado: las vacaciones y las fiestas desembocarán en un apocalipsis bíblico y el trío deberá encontrar la manera de salir de una ciudad santa convertida en un auténtico infierno.',
      fechaLanzamiento: new Date('2016-01-22'),
      duracion: 87,
      rutaCaratula: 'https://media.themoviedb.org/t/p/w440_and_h660_face/hYkfUKjWlVP6GVqIW5wL2ruREGZ.jpg',
      rutaVideo: 'jeruzalem.webm',
      rutaImagenFondo: 'https://media.themoviedb.org/t/p/w1066_and_h600_face/zsMj0CHsy2iqVwWde3U6alVfuEM.jpg',
      rutaTrailer: 'https://youtu.be/Cio7sYBJo28',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 4300, likesTotales: 850, dislikesTotales: 60,
      generos: { connect: [{ id: terror.id }, { id: accion.id }, { id: cienciaFiccion.id }, { id: suspenso.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'El Frijol Invencible',
      descripcion: 'En Villacafé, un mundo de granos de café gamberros que bailan breakdance y juegan con sus armas, asesinos secretos, granos de café mafiosos gandules, batallones de granos de café mercenarios y policías grano de café de gatillo fácil, la vida de Grano Asesino cambiará para siempre. Película de animación independiente dirigida por Jeff Lew, responsable principal de los efectos especiales de Matrix Reloaded, X-Men o Looney Tunes Back in Action, entre otras.',
      fechaLanzamiento: new Date('2009-12-09'),
      duracion: 85,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/qZTCweihd6H8IM2W1Bgk7M3HKrf.jpg',
      rutaVideo: 'killer-bean.webm',
      rutaImagenFondo: 'https://media.themoviedb.org/t/p/w1066_and_h600_face/6Q51j0AZ1jLdpVLoZzYQOvn0iAb.jpg',
      rutaTrailer: 'https://youtu.be/lMJ0o5Znq6w',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 11200, likesTotales: 3400, dislikesTotales: 120,
      generos: { connect: [{ id: animacion.id }, { id: accion.id }, { id: suspenso.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'La Guerra de los Mundos',
      descripcion: 'Los aliens han invadido la Tierra, destruyendo toda existencia de vida humana a su paso. Sólo algunos supervivientes serán capaces de detenerles y salvar su mundo. Película de bajo presupuesto realizada por la productora The Asylum para aprovecharse del tirón de la superproducción de Hollywood "La guerra de los mundos", dirigida por Steven Spielberg y protagonizada por Tom Cruise.',
      fechaLanzamiento: new Date('2005-06-28'),
      duracion: 93,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/2Oz1iLPPcSPscWfZj0yh8pE5XHJ.jpg',
      rutaVideo: 'la-guerra-de-los-mundos.webm',
      rutaImagenFondo: 'https://imagenes.hobbyconsolas.com/files/image_1920_1080/uploads/imagenes/2023/04/25/69030ac8dd243.png',
      rutaTrailer: 'https://youtu.be/LCabeZVQ_9o',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 7600, likesTotales: 1800, dislikesTotales: 85,
      generos: { connect: [{ id: cienciaFiccion.id }, { id: accion.id }, { id: suspenso.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Max Steel: Alianza Monstruosa',
      descripcion: 'Descubre cómo Max Steel y su equipo N-Tek se enfrentan a los villanos más peligrosos al formar una Alianza Monstruosa. ¡Una película llena de desafíos, acción y adrenalina!',
      fechaLanzamiento: new Date('2012-11-29'),
      duracion: 72,
      rutaCaratula: 'https://media.themoviedb.org/t/p/w440_and_h660_face/aTIgQKnmIN4TPz22AX597TdgGTb.jpg',
      rutaVideo: 'max-steel-la-alianza-monstruosa.webm',
      rutaImagenFondo: 'https://i.ytimg.com/vi/iwUBociCT2Q/maxresdefault.jpg',
      rutaTrailer: 'https://youtu.be/TW9Fym_hRFs',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 18500, likesTotales: 5600, dislikesTotales: 210,
      generos: { connect: [{ id: animacion.id }, { id: accion.id }, { id: fantasia.id }, { id: aventura.id }, { id: familia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Max Steel: La Venganza de Makino',
      descripcion: 'Cuando las hazañas heroicas de Max Steel aparecen en televisión, su fama crece... al igual que su ego. Max desobedece las órdenes de Ferrus y cae en la trampa de un nuevo y peligroso enemigo: Makino. Mitad hombre, mitad máquina, Makino es superpoderoso y arrogante. Lo único que supera el ego de Makino es su odio hacia Max Steel. Usando su habilidad para controlar máquinas, Makino logra que la humanidad se vuelva contra Max.',
      fechaLanzamiento: new Date('2011-11-06'),
      duracion: 50,
      rutaCaratula: 'https://media.themoviedb.org/t/p/w440_and_h660_face/robHBI49rgQrOZ8k258MiOT9E60.jpg',
      rutaVideo: 'max-steel-la-venganza-de-makino.webm',
      rutaImagenFondo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjBSHgXoEAt97BBGLuMMwPKEdzE0LO3YNo9i-WqKhl08nWuh3ljs20dZ8DiwruXfyLR3ZeleYPWvE_lHHWX-Exi3JP-QOrf0ZGy5HNXb6fk8NhuEO8RsuyZSuu-mOZMDgbvpAiOXogQdD0/w1200-h630-p-k-no-nu/La+venganza+de+Makino+official.jpg',
      rutaTrailer: 'https://youtu.be/enKWjvHqRJw',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 14200, likesTotales: 4100, dislikesTotales: 180,
      generos: { connect: [{ id: animacion.id }, { id: accion.id }, { id: fantasia.id }, { id: aventura.id }, { id: familia.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'Pasajeros',
      descripcion: 'Un avión se estrella pero hay supervivientes. La joven terapeuta Claire, una brillante psicóloga, deberá ayudar a los supervivientes a superar el trauma. Pero, poco a poco, éstos empiezan a desaparecer misteriosamente... o a no aparecer en la sesiones. Nada está claro, ni siquiera qué pasó en el accidente. Además, entre los supervivientes está Eric, un pasajero que parece no necesitar terapia.',
      fechaLanzamiento: new Date('2008-10-24'),
      duracion: 93,
      rutaCaratula: 'https://media.themoviedb.org/t/p/w440_and_h660_face/gtkiSQJfkruQHN8qrAqRGkeVmzv.jpg',
      rutaVideo: 'pasajeros.webm',
      rutaImagenFondo: 'https://media.themoviedb.org/t/p/w1066_and_h600_face/a2oBd4B7x7Di8CVkDGCKcvy4TFm.jpg',
      rutaTrailer: 'https://youtu.be/CDB6r1s2pTU',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 6500, likesTotales: 1200, dislikesTotales: 70,
      generos: { connect: [{ id: drama.id }, { id: suspenso.id }, { id: misterio.id }, { id: romance.id }] }
    }
  });

  await prisma.pelicula.create({
    data: {
      titulo: 'The Terminators',
      descripcion: 'Un pequeño grupo de combatientes de la resistencia lucha contra los cíborgs que han tomado el control del planeta.',
      fechaLanzamiento: new Date('2009-04-28'),
      duracion: 89,
      rutaCaratula: 'https://www.themoviedb.org/t/p/w1280/hiGlhnaKvIbGeTd7VVPOyfA6mWc.jpg',
      rutaVideo: 'the-terminators.webm',
      rutaImagenFondo: 'https://media.themoviedb.org/t/p/w1066_and_h600_face/1wa173RFJfqudKJeJC0BSdzCQpP.jpg',
      rutaTrailer: 'https://youtu.be/0zJP4wmD4NQ',
      requierePremium: true, // ¡PREMIUM!
      tipoContenido: 'ORIGINAL',
      vistasTotales: 3100, likesTotales: 650, dislikesTotales: 40,
      generos: { connect: [{ id: accion.id }, { id: terror.id }, { id: cienciaFiccion.id }] }
    }
  });

  // --- 4. CREAR PELÍCULAS DE TERCEROS (STUDIO) ---
  console.log('   📹 Creando películas independientes de usuarios Studio...');

  const ID_JOEL = 'b274e4fe-64fb-4021-a076-e1a820f5c569';
  const ID_JULIO = 'a6fc9406-6c13-44ca-801d-8e429c1d19df';

  // Película 1 de Julio
  await prisma.pelicula.create({
    data: {
      titulo: 'F15 Eagle vs MiG-29 Fulcrum: La Batalla de los Cielos',
      descripcion: 'Cuando los MiG-29 tendieron una emboscada a los Eagles',
      fechaLanzamiento: new Date('1999-05-12'),
      duracion: 14,
      rutaCaratula: 'https://www.ausairpower.net/USAF/000-F-15A-2.jpg',
      rutaVideo: 'mig29-fulcrum-vs-f15-eagle.webm',
      rutaImagenFondo: 'https://i.ytimg.com/vi/OJtqNlqi8uE/maxresdefault.jpg',
      rutaTrailer: 'https://youtu.be/y69ERL0l9tg', // Video genérico de cenotes
      requierePremium: false,
      tipoContenido: 'TERCEROS',
      creadorId: ID_JULIO,
      vistasTotales: 1540, likesTotales: 310, dislikesTotales: 5,
      generos: { connect: [{ id: documental.id }, { id: aventura.id }] }
    }
  });

  // Película 2 de Julio
  await prisma.pelicula.create({
    data: {
      titulo: 'F-16 Falcon vs Hawk: El Desayuno de los Cielos',
      descripcion: 'Cuando los F-16 Falcon se comieron a unos Hawks para el desayuno',
      fechaLanzamiento: new Date('1999-01-20'),
      duracion: 12,
      rutaCaratula: 'https://www.hobbymaster.mx/cdn/shop/products/EFL87870_A12_DEY6BQMQ.jpg?v=1635648080&width=1445',
      rutaVideo: 'f16-falcons.webm',
      rutaImagenFondo: 'https://i0.wp.com/www.flyajetfighter.com/wp-content/uploads/2022/09/f-16-fighter-jet.jpg?ssl=1',
      rutaTrailer: 'https://youtu.be/WevXTsed_oc',
      requierePremium: false,
      tipoContenido: 'TERCEROS',
      creadorId: ID_JULIO,
      vistasTotales: 3200, likesTotales: 850, dislikesTotales: 12,
      generos: { connect: [{ id: documental.id }, { id: aventura.id }] }
    }
  });

  // Película 1 de Joel
  await prisma.pelicula.create({
    data: {
      titulo: 'El Verdadero Origen de Freezer Teoría | Parte 1',
      descripcion: 'Este es el primer capítulo de una teoría original de Dragon Ball basada en: ¿Qué hubiera pasado si Freezer encontraba su planeta natal?',
      fechaLanzamiento: new Date('1999-01-03'),
      duracion: 5,
      rutaCaratula: 'https://i.pinimg.com/736x/5d/ba/a2/5dbaa205ac0d3eb08763b8cf5f7b009e.jpg',
      rutaVideo: 'origen-de-freezer-parte1.webm',
      rutaImagenFondo: 'https://i.ytimg.com/vi/Ddcm3cUVdn0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD_BeWAp_oKsO3TggzlYwR8eXersQ',
      rutaTrailer: 'https://youtu.be/Ddcm3cUVdn0',
      requierePremium: false,
      tipoContenido: 'TERCEROS',
      creadorId: ID_JOEL,
      vistasTotales: 890, likesTotales: 150, dislikesTotales: 20,
      generos: { connect: [{ id: misterio.id }, { id: animacion.id }, { id: aventura.id }] }
    }
  });

  // Película 2 de Joel
  await prisma.pelicula.create({
    data: {
      titulo: 'El Verdadero Origen de Freezer Teoría | Parte 2',
      descripcion: 'Tras los impactantes eventos del primer capítulo, el destino del Emperador del Universo toma un giro inesperado. Tras recibir una señal que nunca debió ser activada, se adentra en un mundo de hielo cristalino donde las reglas de la fuerza han cambiado por completo.',
      fechaLanzamiento: new Date('1999-02-14'),
      duracion: 19,
      rutaCaratula: 'https://i.pinimg.com/736x/5d/ba/a2/5dbaa205ac0d3eb08763b8cf5f7b009e.jpg',
      rutaVideo: 'origen-de-freezer-parte2.webm',
      rutaImagenFondo: 'https://i.ytimg.com/vi/NwEsTJQDqo0/maxresdefault.jpg',
      rutaTrailer: 'https://youtu.be/NwEsTJQDqo0',
      requierePremium: false,
      tipoContenido: 'TERCEROS',
      creadorId: ID_JOEL,
      vistasTotales: 4100, likesTotales: 920, dislikesTotales: 45,
      generos: { connect: [{ id: misterio.id }, { id: animacion.id }, { id: aventura.id }] }
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