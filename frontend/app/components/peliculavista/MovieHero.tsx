"use client"; // 1. OBLIGATORIO: Añadimos esto para poder usar useState

import { useState } from 'react';
import { Play, Star, CalendarDays, Youtube, X, Heart } from 'lucide-react'; // 2. Importamos 'X', 'Heart'
import { toggleFavoriteAction } from '@/app/actions/favoritos';

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
  };
  initialIsFavorite?: boolean;
}

export default function MovieHero({ movie, initialIsFavorite = false }: Props) {
  // 3. Estado para controlar si el modal del tráiler está abierto
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  
  // Estado para Favoritos
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  // Formatear fecha completa
  const fechaCompleta = new Date(movie.fechaLanzamiento).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleToggleFavorite = async () => {
    if (isLoadingFav) return;
    setIsLoadingFav(true);
    
    // Optimistic UI (opcional, pero lo haremos con la respuesta real para mayor seguridad)
    const res = await toggleFavoriteAction(movie.id);
    
    if (res.success) {
      setIsFavorite(res.isFavorite);
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3000); // Ocultar toast a los 3s
    } else {
      setToastMessage("Error al actualizar favoritos");
      setTimeout(() => setToastMessage(null), 3000);
    }
    
    setIsLoadingFav(false);
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

            <div className="flex flex-row flex-wrap md:flex-nowrap items-center gap-2 sm:gap-4 pt-4 w-full">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-full bg-[#3a86ff] px-3 py-3 sm:px-6 sm:py-3 md:px-10 md:py-4 font-bold text-sm sm:text-base md:text-lg hover:scale-105 transition-all shadow-[0_0_25px_rgba(58,134,255,0.4)]">
                <Play fill="white" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> Ver Ahora
              </button>
              
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
                aria-label="Agregar a favoritos"
                className="shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all active:scale-90"
              >
                <Heart 
                  className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                />
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