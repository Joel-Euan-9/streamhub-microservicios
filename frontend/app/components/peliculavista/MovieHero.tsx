"use client"; // 1. OBLIGATORIO: Añadimos esto para poder usar useState

import { useState } from 'react';
import { Play, Star, CalendarDays, Youtube, X, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toggleFavoriteAction } from '@/app/actions/favoritos';
import { toggleVotoAction } from '@/app/actions/interacciones';
import { useRouter } from 'next/navigation';
import { upgradePlan } from '@/app/actions/profile';

interface Props {
  movie: {
    id: string; // Añadido para favoritos
    titulo: string;
    descripcion: string;
    rutaCaratula: string;
    rutaImagenFondo: string;
    fechaLanzamiento: string;
    rutaTrailer: string;
    duracion: number;
    generos?: { nombre: string }[];
    requierePremium?: boolean; // Prop para saber si es premium
    likesTotales?: number;
    dislikesTotales?: number;
    tipoContenido?: string;
  };
  initialIsFavorite?: boolean;
  initialFavoritosCount?: number;
  initialVotoStatus?: 'LIKE' | 'DISLIKE' | null;
  userPlan?: string; // Plan del usuario logueado
  isDailyLimitReached?: boolean; // Prop para saber si llegó al límite
  creatorChannel?: any; // Datos del canal del creador si existe
}

export default function MovieHero({
  movie,
  initialIsFavorite = false,
  initialFavoritosCount = 0,
  initialVotoStatus = null,
  userPlan = 'BASIC',
  isDailyLimitReached = false,
  creatorChannel = null
}: Props) {
  const router = useRouter();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoritosCount, setFavoritosCount] = useState(initialFavoritosCount);

  const [votoStatus, setVotoStatus] = useState<'LIKE' | 'DISLIKE' | null>(initialVotoStatus);
  const [likesCount, setLikesCount] = useState(movie.likesTotales || 0);
  const [dislikesCount, setDislikesCount] = useState(movie.dislikesTotales || 0);
  const [isLoadingVoto, setIsLoadingVoto] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Formatear fecha completa
  const fechaCompleta = new Date(movie.fechaLanzamiento).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleToggleFavorite = async () => {
    if (isLoadingFav) return;
    setIsLoadingFav(true);

    const wasFavorite = isFavorite;

    // UI Optimista para respuesta instantánea
    setIsFavorite(!wasFavorite);
    setFavoritosCount(prev => wasFavorite ? prev - 1 : prev + 1);

    const res = await toggleFavoriteAction(movie.id);

    if (res.success) {
      // Re-sincronizamos con el estado real del servidor por seguridad
      if (res.isFavorite !== !wasFavorite) {
        setIsFavorite(res.isFavorite);
        setFavoritosCount(prev => res.isFavorite ? prev + 1 : prev - 1);
      }
      // Restaurar el mensaje de éxito
      setToastMessage(res.message || (res.isFavorite ? "Agregado a favoritos" : "Eliminado de favoritos"));
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      // Revertimos en caso de error
      setIsFavorite(wasFavorite);
      setFavoritosCount(prev => wasFavorite ? prev + 1 : prev - 1);
      setToastMessage("Error al actualizar favoritos");
      setTimeout(() => setToastMessage(null), 3000);
    }

    setIsLoadingFav(false);
  };

  const handleToggleVoto = async (tipo: 'LIKE' | 'DISLIKE') => {
    if (isLoadingVoto) return;
    setIsLoadingVoto(true);

    const prevVoto = votoStatus;
    const prevLikes = likesCount;
    const prevDislikes = dislikesCount;

    // Lógica optimista
    let nextVoto: 'LIKE' | 'DISLIKE' | null = tipo;
    let nextLikes = likesCount;
    let nextDislikes = dislikesCount;

    if (prevVoto === tipo) {
      // Si ya tenía el mismo voto, significa que lo quita
      nextVoto = null;
      if (tipo === 'LIKE') nextLikes -= 1;
      if (tipo === 'DISLIKE') nextDislikes -= 1;
    } else {
      // Cambia o agrega el voto
      if (tipo === 'LIKE') {
        nextLikes += 1;
        if (prevVoto === 'DISLIKE') nextDislikes -= 1;
      } else {
        nextDislikes += 1;
        if (prevVoto === 'LIKE') nextLikes -= 1;
      }
    }

    setVotoStatus(nextVoto);
    setLikesCount(nextLikes);
    setDislikesCount(nextDislikes);

    const res = await toggleVotoAction(movie.id, tipo);

    if (!res.success) {
      // Revertir si hay error
      setVotoStatus(prevVoto);
      setLikesCount(prevLikes);
      setDislikesCount(prevDislikes);
      setToastMessage("Error al registrar el voto");
      setTimeout(() => setToastMessage(null), 3000);
    }

    setIsLoadingVoto(false);
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const res = await upgradePlan("PREMIUM");
      if (res.success) {
        router.refresh();
      } else {
        setToastMessage(res.error || "Error al actualizar plan");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Error de conexión");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsUpgrading(false);
    }
  };

  // Función para convertir link normal de YT a link de "embed" (reutilizada del reproductor)
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      // Añadimos ?autoplay=1 para que inicie solo al abrir el modal
      return url.replace('watch?v=', 'embed/') + '?autoplay=1';
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1';
    }
    return url;
  };

  const isLocked = (movie.requierePremium && userPlan === 'BASIC') || isDailyLimitReached;

  return (
    <>
      <section className="relative w-full min-h-[70vh] flex items-center bg-[#020817] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={movie.rutaImagenFondo} alt="" className="w-full h-full object-cover opacity-30 blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-center">
          <div className="mx-auto w-[160px] sm:w-[220px] md:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5">
            <img src={movie.rutaCaratula} alt={movie.titulo} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">{movie.titulo}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400"><Star size={18} fill="currentColor" /> 9.2</span>
              <span>•</span>
              <span suppressHydrationWarning className="flex items-center gap-1.5 text-gray-300"><CalendarDays size={18} /> {fechaCompleta}</span>
              <span>•</span>
              <span className="text-gray-300">{movie.duracion} min</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.generos?.map((g, i) => (
                <span key={i} className="bg-[#3a86ff]/20 px-3 py-1 rounded-full border border-[#3a86ff]/30 text-[#3a86ff] text-xs uppercase tracking-wider">
                  {g.nombre}
                </span>
              ))}
            </div>

            <p className="text-lg text-gray-200 leading-relaxed max-w-3xl">
              {movie.descripcion}
            </p>

            {/* Mostrar Creador si es de terceros */}
            {movie.tipoContenido === 'TERCEROS' && creatorChannel && (
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 w-fit">
                <img
                  src={creatorChannel.fotoPerfilUrl || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'}
                  alt={creatorChannel.nombreCanal}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#3a86ff]"
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Socio de Studio</p>
                  <p className="font-bold text-white text-base leading-tight">{creatorChannel.nombreCanal}</p>
                </div>
                <button
                  onClick={() => router.push(`/canales/${creatorChannel.id}`)}
                  className="ml-4 px-4 py-2 bg-[#3a86ff]/20 hover:bg-[#3a86ff]/40 border border-[#3a86ff]/50 text-[#3a86ff] rounded-full text-sm font-semibold transition-colors"
                >
                  Ver Canal
                </button>
              </div>
            )}

            <div className="flex flex-row flex-wrap md:flex-nowrap items-center gap-2 sm:gap-4 pt-4 w-full">
              {isLocked ? (
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-3 py-3 sm:px-6 sm:py-3 md:px-10 md:py-4 font-black text-sm sm:text-base md:text-lg text-black hover:scale-105 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] disabled:opacity-50"
                >
                  {isUpgrading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Star fill="black" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Mejorar a Premium
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    const playerElement = document.getElementById("movie-player");
                    if (playerElement) {
                      playerElement.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-full bg-[#3a86ff] px-3 py-3 sm:px-6 sm:py-3 md:px-10 md:py-4 font-bold text-sm sm:text-base md:text-lg hover:scale-105 transition-all shadow-[0_0_25px_rgba(58,134,255,0.4)]"
                >
                  <Play fill="white" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Ver Ahora
                </button>
              )}
              {/* 4. Cambiamos la etiqueta <a> por un <button> que actualiza el estado */}
              {movie.rutaTrailer && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-full bg-red-600/20 px-3 py-3 sm:px-6 sm:py-3 md:px-10 md:py-4 font-bold text-sm sm:text-base md:text-lg border border-red-600/50 hover:bg-red-600/40 transition-all"
                >
                  <Youtube className="text-red-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Ver Trailer
                </button>
              )}

              {/* Botón de Favorito */}
              <button
                onClick={handleToggleFavorite}
                disabled={isLoadingFav}
                aria-label="Guardar en favoritos"
                className="shrink-0 flex items-center justify-center gap-2 px-4 h-11 sm:h-12 md:h-14 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all active:scale-90"
              >
                <Bookmark
                  className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-white'}`}
                />
                <span className="font-semibold">{favoritosCount}</span>
              </button>

              {/* Botón Like */}
              <button
                onClick={() => handleToggleVoto('LIKE')}
                disabled={isLoadingVoto}
                aria-label="Me gusta"
                className={`shrink-0 flex items-center justify-center gap-2 px-4 h-11 sm:h-12 md:h-14 rounded-full border transition-all active:scale-90
                  ${votoStatus === 'LIKE'
                    ? 'bg-[#3a86ff]/20 border-[#3a86ff] text-[#3a86ff]'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'}`}
              >
                <ThumbsUp
                  className={`w-5 h-5 md:w-6 md:h-6 ${votoStatus === 'LIKE' ? 'fill-[#3a86ff]' : ''}`}
                />
                <span className="font-semibold">{likesCount}</span>
              </button>

              {/* Botón Dislike */}
              <button
                onClick={() => handleToggleVoto('DISLIKE')}
                disabled={isLoadingVoto}
                aria-label="No me gusta"
                className={`shrink-0 flex items-center justify-center gap-2 px-4 h-11 sm:h-12 md:h-14 rounded-full border transition-all active:scale-90
                  ${votoStatus === 'DISLIKE'
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'}`}
              >
                <ThumbsDown
                  className={`w-5 h-5 md:w-6 md:h-6 ${votoStatus === 'DISLIKE' ? 'fill-red-500' : ''}`}
                />
                <span className="font-semibold">{dislikesCount}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-black/80 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* 5. MODAL DEL TRÁILER */}
      {isTrailerOpen && movie.rutaTrailer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setIsTrailerOpen(false)} // Cierra al hacer clic en el fondo oscuro
        >
          {/* Contenedor del video - Evitamos que el clic aquí cierre el modal */}
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar (X) */}
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-red-600 rounded-full text-white transition-colors backdrop-blur-md"
            >
              <X size={24} />
            </button>

            <iframe
              src={getEmbedUrl(movie.rutaTrailer)}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}
    </>
  );
}