import Link from "next/link";
import Navbar from "../components/ui/Navbar";
import HeroCarousel from "../components/ui/HeroCarousel";

const NEW_MOVIES = [
  {
    title: "Coco",
    year: "2017",
    genre: "Animación",
    img: "https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg",
  },
  {
    title: "Grandes Héroes",
    year: "2014",
    genre: "Animación",
    img: "https://image.tmdb.org/t/p/w500/2mxS4wUimwlLmI1xp6QW6NSU361.jpg",
  },
  {
    title: "Jurassic World 2",
    year: "2018",
    genre: "Aventura",
    img: "https://image.tmdb.org/t/p/w500/2L8ehd95eSW9x7KINYtZmRkAlrZ.jpg",
  },
  {
    title: "El Planeta de los Simios",
    year: "2017",
    genre: "Sci-Fi",
    img: "https://image.tmdb.org/t/p/w500/2C9vywwbXjE0nF5hP7sD8sW5mLQ.jpg",
  },
  {
    title: "Cigüeñas",
    year: "2016",
    genre: "Animación",
    img: "https://image.tmdb.org/t/p/w500/9pYB8V7M8G6D5Q7m0J7M8mJ4lQk.jpg",
  },
  {
    title: "Como ser un Latin Lover",
    year: "2017",
    genre: "Comedia",
    img: "https://image.tmdb.org/t/p/w500/edL4j8xJw4G8H1hN8e4M3K5L0x.jpg",
  },
  {
    title: "Boxtrolls",
    year: "2014",
    genre: "Animación",
    img: "https://image.tmdb.org/t/p/w500/8D7d3Q0j3sZ0p7P0gZk9Q5rW7fY.jpg",
  },
];

const TOP_MOVIES = [
  {
    rank: 1,
    title: "Avengers: Era de Ultrón",
    img: "https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg",
  },
  {
    rank: 2,
    title: "Jurassic World 2",
    img: "https://image.tmdb.org/t/p/w500/2L8ehd95eSW9x7KINYtZmRkAlrZ.jpg",
  },
  {
    rank: 3,
    title: "Coco",
    img: "https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg",
  },
  {
    rank: 4,
    title: "Thor: Ragnarok",
    img: "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
  },
  {
    rank: 5,
    title: "El Planeta de los Simios",
    img: "https://image.tmdb.org/t/p/w500/2C9vywwbXjE0nF5hP7sD8sW5mLQ.jpg",
  },
];

const MY_LIST = [
  {
    title: "Jurassic World: El Reino Caído",
    subtitle: "Agregado recientemente",
    large: true,
    img: "https://image.tmdb.org/t/p/w780/2L8ehd95eSW9x7KINYtZmRkAlrZ.jpg",
  },
  {
    title: "Coco",
    subtitle: "Animación",
    img: "https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg",
  },
  {
    title: "Thor: Ragnarok",
    subtitle: "Acción",
    img: "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
  },
  {
    title: "Grandes Héroes",
    subtitle: "Familiar",
    img: "https://image.tmdb.org/t/p/w500/2mxS4wUimwlLmI1xp6QW6NSU361.jpg",
  },
  {
    title: "El Planeta de los Simios",
    subtitle: "Sci-Fi",
    img: "https://image.tmdb.org/t/p/w500/2C9vywwbXjE0nF5hP7sD8sW5mLQ.jpg",
  },
];

const GENRES = [
  {
    name: "ACCIÓN",
    href: "/peliculas?genre=accion",
    bg: "from-cyan-900/70 to-slate-700/80",
  },
  {
    name: "TERROR",
    href: "/peliculas?genre=terror",
    bg: "from-slate-800 to-slate-700",
  },
  {
    name: "COMEDIA",
    href: "/peliculas?genre=comedia",
    bg: "from-amber-900/80 to-yellow-700/70",
  },
  {
    name: "DRAMA",
    href: "/peliculas?genre=drama",
    bg: "from-blue-950 to-blue-700",
  },
  {
    name: "INFANTIL",
    href: "/peliculas?genre=infantil",
    bg: "from-fuchsia-900/70 to-orange-500/80",
  },
];

const CONTINUE_WATCHING = [
  {
    title: "Jurassic World 2",
    remaining: "Restan 24 min",
    img: "https://image.tmdb.org/t/p/w500/2L8ehd95eSW9x7KINYtZmRkAlrZ.jpg",
    progress: 72,
  },
  {
    title: "Coco",
    remaining: "Restan 58 min",
    img: "https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg",
    progress: 35,
  },
  {
    title: "Grandes Héroes",
    remaining: "Restan 1h 12m",
    img: "https://image.tmdb.org/t/p/w500/2mxS4wUimwlLmI1xp6QW6NSU361.jpg",
    progress: 48,
  },
  {
    title: "El Planeta de los Simios",
    remaining: "Restan 12 min",
    img: "https://image.tmdb.org/t/p/w500/2C9vywwbXjE0nF5hP7sD8sW5mLQ.jpg",
    progress: 91,
  },
];

function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="border-l-4 border-[#3a86ff] pl-4 text-[1.45rem] font-bold text-white drop-shadow-[0_0_10px_rgba(58,134,255,0.4)] md:text-[1.8rem]">
        {title}
      </h2>
      {action}
    </div>
  );
}

function MovieCard({
  title,
  year,
  genre,
  img,
}: {
  title: string;
  year: string;
  genre: string;
  img: string;
}) {
  return (
    <Link
      href="/peliculas"
      className="group block w-[160px] shrink-0 transition hover:-translate-y-2 sm:w-[180px] md:w-[200px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            className="translate-y-5 rounded-full bg-[#3a86ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(58,134,255,0.45)] transition group-hover:translate-y-0"
          >
            ▶ Reproducir
          </button>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="truncate text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-[#aeb4c0]">
          {year} • {genre}
        </p>
      </div>
    </Link>
  );
}

function TopMovieCard({
  rank,
  title,
  img,
}: {
  rank: number;
  title: string;
  img: string;
}) {
  return (
    <Link
      href="/peliculas"
      className="group relative flex min-w-[180px] shrink-0 items-end gap-2 sm:min-w-[220px] md:min-w-[250px]"
    >
      <span className="pointer-events-none select-none text-[8rem] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.55)] sm:text-[9rem] md:text-[10rem]">
        {rank}
      </span>

      <div className="absolute left-[72px] bottom-0 w-[95px] overflow-hidden rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.35)] transition duration-300 group-hover:-translate-y-2 sm:left-[88px] sm:w-[110px] md:left-[100px] md:w-[120px]">
        <img
          src={img}
          alt={title}
          className="aspect-[2/3] h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}

function ContinueCard({
  title,
  remaining,
  img,
  progress,
}: {
  title: string;
  remaining: string;
  img: string;
  progress: number;
}) {
  return (
    <div className="group w-[160px] shrink-0 sm:w-[180px] md:w-[200px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
          <div
            className="h-full bg-[#3a86ff] shadow-[0_0_10px_#3a86ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="pt-3">
        <h3 className="truncate text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-[#aeb4c0]">{remaining}</p>
      </div>
    </div>
  );
}

function GenreCard({
  name,
  href,
  bg,
}: {
  name: string;
  href: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className={`flex h-[110px] min-w-[220px] shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-r ${bg} px-6 text-center text-2xl font-extrabold tracking-wide text-white transition hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(58,134,255,0.25)] md:min-w-0`}
    >
      {name}
    </Link>
  );
}

export default function InicioPage() {
  const featuredMyList = MY_LIST[0];
  const gridMyList = MY_LIST.slice(1);

  return (
    <>
      <Navbar />

      <main className="bg-[#020817] pb-12 text-white">
        <HeroCarousel />

        <div className="relative z-10 space-y-12 px-5 md:px-10">
          <section>
            <SectionTitle title="Lo Nuevo" />
            <div className="flex gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {NEW_MOVIES.map((movie) => (
                <MovieCard key={movie.title} {...movie} />
              ))}
            </div>
          </section>

          <section>
            <SectionTitle title="Top 10 Películas Más Vistas" />
            <div className="flex gap-6 overflow-x-auto pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {TOP_MOVIES.map((movie) => (
                <TopMovieCard key={movie.rank} {...movie} />
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              title="Mi Lista"
              action={
                <Link
                  href="/peliculas"
                  className="text-sm font-semibold text-[#3a86ff] transition hover:text-white"
                >
                  Ver todo (12) →
                </Link>
              }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
              <Link
                href="/peliculas"
                className="group relative block overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              >
                <img
                  src={featuredMyList.img}
                  alt={featuredMyList.title}
                  className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[320px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="text-2xl font-bold">{featuredMyList.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">
                    {featuredMyList.subtitle}
                  </p>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-4">
                {gridMyList.map((movie) => (
                  <Link
                    key={movie.title}
                    href="/peliculas"
                    className="group relative overflow-hidden rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                  >
                    <img
                      src={movie.img}
                      alt={movie.title}
                      className="h-[152px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[152px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3">
                      <h3 className="truncate text-sm font-bold md:text-base">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-[#aeb4c0]">{movie.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section>
            <SectionTitle title="Explorar por Géneros" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {GENRES.map((genre) => (
                <GenreCard key={genre.name} {...genre} />
              ))}
            </div>
          </section>

          <section>
            <SectionTitle title="Seguir Viendo" />
            <div className="flex gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {CONTINUE_WATCHING.map((movie) => (
                <ContinueCard key={movie.title} {...movie} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}