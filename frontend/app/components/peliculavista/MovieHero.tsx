import { Play, Star, CalendarDays, Clapperboard, Youtube } from 'lucide-react';

interface Props {
  movie: {
    titulo: string;
    descripcion: string; // Cambiado de sinopsis a descripcion
    rutaCaratula: string;
    rutaImagenFondo: string;
    fechaLanzamiento: string;
    rutaTrailer: string; // Cambiado de trailerUrl a rutaTrailer
    duracion: number;    // Añadido según esquema
    generos?: { nombre: string }[];
  }
}

export default function MovieHero({ movie }: Props) {
  // Formatear fecha completa (ej: 15 de marzo de 2024)
  const fechaCompleta = new Date(movie.fechaLanzamiento).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className="relative w-full min-h-[70vh] flex items-center bg-[#020817] text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={movie.rutaImagenFondo} alt="" className="w-full h-full object-cover opacity-30 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-[300px_1fr] gap-12 items-center">
        <div className="hidden md:block aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5">
          <img src={movie.rutaCaratula} alt={movie.titulo} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">{movie.titulo}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400"><Star size={18} fill="currentColor" /> 9.2</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-gray-300"><CalendarDays size={18} /> {fechaCompleta}</span>
            <span>•</span>
            <span className="text-gray-300">{movie.duracion} min</span>
          </div>

          {/* MAPEO DE TODOS LOS GÉNEROS */}
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

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="flex items-center gap-2.5 rounded-full bg-[#3a86ff] px-10 py-4 font-bold text-lg hover:scale-105 transition-all">
              <Play size={24} fill="white" /> Ver Ahora
            </button>
            
            {/* BOTÓN DE TRAILER DEDICADO */}
            {movie.rutaTrailer && (
              <a href={movie.rutaTrailer} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-2.5 rounded-full bg-red-600/20 px-10 py-4 font-bold text-lg border border-red-600/50 hover:bg-red-600/40 transition-all">
                <Youtube size={24} className="text-red-500" /> Ver Trailer
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}