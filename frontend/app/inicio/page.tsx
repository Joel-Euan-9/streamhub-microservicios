import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import HeroCarousel from "@/app/components/inicio/HeroCarousel";
import MovieCard from "@/app/components/inicio/MovieCard";
import TopMovieCard from "@/app/components/inicio/TopMovieCard";
import GenreCard from "@/app/components/inicio/GenreCard";
import ContinueCard from "@/app/components/inicio/ContinueCard";
import CarouselContainer from "@/app/components/inicio/CarouselContainer";

// --- DATOS ESTATICOS (Mocks para secciones que aún no tienen API) ---
const GENRES = [
  { name: "Acción", href: "#", bg: "from-red-900/70 to-red-600/80" },
  { name: "Comedia", href: "#", bg: "from-yellow-900/70 to-yellow-600/80" },
  { name: "Drama", href: "#", bg: "from-blue-900/70 to-blue-600/80" },
  { name: "Sci-Fi", href: "#", bg: "from-purple-900/70 to-purple-600/80" },
  { name: "Terror", href: "#", bg: "from-zinc-900/70 to-zinc-600/80" }
];

const CONTINUE_WATCHING = [
  { title: "La Trampa", remaining: "Quedan 20 min", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200&auto=format&fit=crop", progress: 45 },
  { title: "Secretos", remaining: "Quedan 5 min", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop", progress: 80 }
];

// --- FETCH DATA ---
async function getEstrenos() {
  try {
    const res = await fetch('http://gateway-service:8000/api/peliculas/estrenos', { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error cargando estrenos:", error);
    return [];
  }
}

export default async function InicioPage() {
  const peliculas = await getEstrenos();
  const peliculasHero = peliculas.slice(0, 4);

  return (
    <>
      <Navbar />

      <main className="bg-[#020817] pb-12 text-white pt-[70px]">
        {/* CARRUSEL PRINCIPAL */}
        <HeroCarousel peliculas={peliculasHero} />

        <div className="relative z-10 space-y-12 px-5 md:px-10">
          
          {/* SECCIÓN: LO NUEVO */}
          <CarouselContainer title="Lo Nuevo">
            {peliculas.map((movie: any) => (
              <MovieCard 
                key={movie.id} 
                id={movie.id} // <-- ¡Esta es la línea nueva que debes agregar!
                title={movie.titulo} 
                year={new Date(movie.fechaLanzamiento).getFullYear().toString()} 
                genre={movie.generos?.[0]?.nombre || "Estreno"} 
                img={movie.rutaCaratula} 
              />
            ))}
          </CarouselContainer>

          {/* SECCIÓN: TOP 10 (Usando CarouselContainer) */}
          <CarouselContainer title="Top 10 Películas Más Vistas">
            {peliculas.map((movie: any, index: number) => (
              <TopMovieCard 
                key={movie.id} 
                rank={index + 1} 
                title={movie.titulo} 
                img={movie.rutaCaratula} 
              />
            ))}
          </CarouselContainer>

          {/* SECCIÓN: GÉNEROS (Grid estático por ahora) */}
          <section>
            <CarouselContainer title="Explorar por Géneros">
              {GENRES.map((genre) => (
                <GenreCard key={genre.name} {...genre} />
              ))}
            </CarouselContainer>
          </section>

          {/* SECCIÓN: SEGUIR VIENDO (Usando CarouselContainer) */}
          <CarouselContainer title="Seguir Viendo">
            {CONTINUE_WATCHING.map((movie) => (
              <ContinueCard key={movie.title} {...movie} />
            ))}
          </CarouselContainer>

        </div>
      </main>
    </>
  );
}