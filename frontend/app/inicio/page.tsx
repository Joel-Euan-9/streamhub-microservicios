import Link from "next/link";
import Navbar from "@/app/components/ui/Navbar";
import { fetchWithAuth } from "@/lib/api";
import HeroCarousel from "@/app/components/inicio/HeroCarousel";
import MovieCard from "@/app/components/inicio/MovieCard";
import TopMovieCard from "@/app/components/inicio/TopMovieCard";
import GenreCard from "@/app/components/inicio/GenreCard";
import ContinueCard from "@/app/components/inicio/ContinueCard";
import CarouselContainer from "@/app/components/inicio/CarouselContainer";
import BentoGrid from "@/app/components/inicio/BentoGrid";
import { getHistorialAction } from "@/app/actions/historial";
import { getFavoritosAction } from "@/app/actions/favoritos";
import { getUserProfile } from "@/app/actions/profile";

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

async function getTopPeliculas() {
  try {
    const res = await fetchWithAuth('http://gateway-service:8000/api/peliculas/top', { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error cargando top 10:", error);
    return [];
  }
}

export default async function InicioPage() {
  const userProfile = await getUserProfile();
  
  const peliculas = await getEstrenos();
  const peliculasHero = peliculas.slice(0, 4);

  const topPeliculas = await getTopPeliculas();

  const historialRes = await getHistorialAction();
  const historial = Array.isArray(historialRes) 
    ? historialRes.filter((item: any) => item && item.pelicula).slice(0, 10) 
    : [];

  const favoritosAll = await getFavoritosAction();
  const validFavoritosAll = Array.isArray(favoritosAll) 
    ? favoritosAll.filter((fav: any) => fav && fav.pelicula) 
    : [];
  const favoritos = validFavoritosAll.slice(0, 5);
  const favoritosTotal = validFavoritosAll.length;

  return (
    <>
      <Navbar />

      <main className="bg-[#020817] pb-12 text-white pt-[70px]">
        {/* CARRUSEL PRINCIPAL */}
        <HeroCarousel peliculas={peliculasHero} />

        <div className="relative z-10 space-y-12 px-5 md:px-10">

          {/* SECCIÓN: LO NUEVO */}
          <CarouselContainer title="Lo Nuevo">
            {peliculas.map((movie: any) => {
              const showPremiumBadge = movie.requierePremium && (!userProfile || userProfile.plan === "BASIC");
              return (
              <MovieCard
                key={movie.id}
                id={movie.id} // <-- ¡Esta es la línea nueva que debes agregar!
                title={movie.titulo}
                year={new Date(movie.fechaLanzamiento).getFullYear().toString()}
                genre={movie.generos?.[0]?.nombre || "Estreno"}
                img={movie.rutaCaratula}
                requierePremium={showPremiumBadge}
              />
            )})}
          </CarouselContainer>

          {/* SECCIÓN: TOP 10 (Usando CarouselContainer) */}
          <CarouselContainer title="Top 10 Películas Más Vistas">
            {topPeliculas.map((movie: any, index: number) => (
              <TopMovieCard
                key={movie.id}
                id={movie.id}
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

          {/* SECCIÓN: FAVORITOS (Mi Lista) */}
          {favoritos.length > 0 && (
            <BentoGrid
              title="Mis Favoritos"
              total={favoritosTotal}
              viewAllLink="/miactividad#favoritos"
              items={favoritos.map((fav: any, idx: number) => ({
                id: fav.pelicula.id,
                title: fav.pelicula.titulo,
                // The first item can say "Agregado recientemente", others use genre
                subtitle: idx === 0 ? "Agregado recientemente" : (fav.pelicula.generos?.[0]?.nombre || "Favorito"),
                img: fav.pelicula.rutaImagenFondo || fav.pelicula.rutaCaratula
              }))}
            />
          )}

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