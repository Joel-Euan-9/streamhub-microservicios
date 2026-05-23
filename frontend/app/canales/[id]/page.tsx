import { getCanalByIdAction } from "@/app/actions/studio";
import { notFound } from "next/navigation";
import { User, Film } from "lucide-react";
import MovieCard from "@/app/components/inicio/MovieCard";
import Navbar from "@/app/components/ui/Navbar";

async function getChannelMovies(usuarioId: string) {
  try {
    const res = await fetch(`http://gateway-service:8000/api/peliculas?creadorId=${usuarioId}`, {
      cache: "no-store"
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function CanalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const canal = await getCanalByIdAction(id);

  if (!canal) {
    notFound();
  }

  const peliculas = await getChannelMovies(canal.usuarioId);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0b0c15] pb-20 pt-[70px]">
        
        {/* HEADER / BANNER DEL CANAL */}
        <div className="relative h-64 md:h-80 w-full bg-[#121826] overflow-hidden">
          {canal.fotoPortadaUrl ? (
            <img 
              src={canal.fotoPortadaUrl} 
              alt={`Banner de ${canal.nombreCanal}`} 
              className="h-full w-full object-cover opacity-60" 
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#121826] to-[#0b0c15]"></div>
          )}
          {/* Gradiente inferior para suavizar la transición */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* INFO DEL PERFIL (Avatar y Nombre) */}
          <div className="relative -mt-20 flex flex-col items-start gap-6 sm:-mt-24 sm:flex-row sm:items-end">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-[#0b0c15] bg-[#121826] shadow-2xl sm:h-40 sm:w-40">
              {canal.fotoPerfilUrl ? (
                <img 
                  src={canal.fotoPerfilUrl} 
                  alt={`Avatar de ${canal.nombreCanal}`} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#aeb4c0]">
                  <User size={64} />
                </div>
              )}
            </div>
            
            <div className="mb-2 flex-1">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl drop-shadow-md">
                {canal.nombreCanal}
              </h1>
              {canal.descripcion && (
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#aeb4c0]">
                  {canal.descripcion}
                </p>
              )}
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-10">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
              <Film className="text-[#3a86ff]" /> Películas de este canal ({peliculas.length})
            </h2>

            {peliculas.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-16 text-center">
                <Film size={48} className="text-white/20 mb-4" />
                <h3 className="text-xl font-bold text-white">No hay contenido</h3>
                <p className="mt-2 text-[#aeb4c0]">Este canal aún no ha subido ninguna película.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pb-20">
                {peliculas.map((pelicula: any) => (
                  <MovieCard
                    key={pelicula.id}
                    id={pelicula.id}
                    title={pelicula.titulo}
                    year={pelicula.fechaLanzamiento ? new Date(pelicula.fechaLanzamiento).getFullYear().toString() : ""}
                    genre={pelicula.generos?.[0]?.nombre || "Contenido"}
                    img={pelicula.rutaCaratula}
                    requierePremium={pelicula.requierePremium}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
