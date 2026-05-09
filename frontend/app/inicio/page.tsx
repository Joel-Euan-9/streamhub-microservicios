import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import { fetchWithAuth } from "@/lib/api";
import HeroCarousel from "@/app/components/inicio/HeroCarousel";
import MovieCard from "@/app/components/inicio/MovieCard";
import TopMovieCard from "@/app/components/inicio/TopMovieCard";
import GenreCard from "@/app/components/inicio/GenreCard";
import ContinueCard from "@/app/components/inicio/ContinueCard";
import CarouselContainer from "@/app/components/inicio/CarouselContainer";
import { getHistorialAction } from "@/app/actions/historial";

// --- DATOS ESTATICOS (Mocks para secciones que aún no tienen API) ---
const GENRES = [
  { name: "Acción", href: "/generos?genre=Acción", bg: "from-red-900/80 to-red-600/90" },
  { name: "Comedia", href: "/generos?genre=Comedia", bg: "from-yellow-900/80 to-yellow-600/90" },
  { name: "Drama", href: "/generos?genre=Drama", bg: "from-blue-900/80 to-blue-600/90" },
  { name: "Sci-Fi", href: "/generos?genre=Ciencia Ficción", bg: "from-purple-900/80 to-purple-600/90" },
  { name: "Terror", href: "/generos?genre=Terror", bg: "from-zinc-900/80 to-zinc-600/90" },
  { name: "Fantasía", href: "/generos?genre=Fantasía", bg: "from-emerald-900/80 to-emerald-600/90" },
  { name: "Romance", href: "/generos?genre=Romance", bg: "from-pink-900/80 to-pink-600/90" },
  { name: "Aventura", href: "/generos?genre=Aventura", bg: "from-orange-900/80 to-orange-600/90" },
  { name: "Misterio", href: "/generos?genre=Misterio", bg: "from-indigo-900/80 to-indigo-600/90" },
  { name: "Animación", href: "/generos?genre=Animación", bg: "from-sky-900/80 to-sky-600/90" },
];

// --- FETCH DATA ---
async function getEstrenos() {
  try {
    const res = await fetchWithAuth('http://gateway-service:8000/api/peliculas/estrenos', { 
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

  const historialRes = await getHistorialAction();
  const historial = Array.isArray(historialRes) ? historialRes.slice(0, 10) : [];

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

          {/* SECCIÓN: SEGUIR VIENDO */}
          {historial.length > 0 && (
            <CarouselContainer title="Seguir Viendo">
              {historial.map((item: any) => {
                const durationSeconds = (item.pelicula?.duracion || 120) * 60;
                let progress = Math.floor((item.minutoPausa / durationSeconds) * 100);
                if (progress > 100) progress = 100;

                const remainingSeconds = Math.max(0, durationSeconds - item.minutoPausa);
                const remainingMinutes = Math.ceil(remainingSeconds / 60);
                
                const isCompleted = item.completada || remainingMinutes <= 0 || progress >= 95;
                const remainingText = isCompleted ? "Completada" : `Quedan ${remainingMinutes} min`;

                return (
                  <ContinueCard 
                    key={item.pelicula.id || item.id} 
                    id={item.pelicula.id}
                    title={item.pelicula.titulo} 
                    remaining={remainingText}
                    img={item.pelicula.rutaCaratula} 
                    progress={progress} 
                  />
                );
              })}
            </CarouselContainer>
          )}

        </div>
      </main>
    </>
  );
}