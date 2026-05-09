"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Genero {
  id: number;
  nombre: string;
}

interface Pelicula {
  id: string;
  titulo: string;
  rutaCaratula: string;
  fechaLanzamiento: string;
  generos: Genero[];
}

interface Props {
  peliculas: Pelicula[];
  generos: Genero[];
}

function GenerosViewContent({ peliculas, generos }: Props) {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'Todos';
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);

  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam) {
      setSelectedGenre(genreParam);
    }
  }, [searchParams]);

  // Filtrar películas según el género seleccionado
  const filteredPeliculas = selectedGenre === "Todos" 
    ? peliculas 
    : peliculas.filter(p => p.generos?.some(g => g.nombre === selectedGenre));

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* ─── SIDEBAR (IZQUIERDA) ─── */}
      <aside className="md:w-[250px] shrink-0">
        <div className="sticky top-[100px] flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setSelectedGenre("Todos")}
            className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition text-left
              ${selectedGenre === "Todos" 
                ? "bg-gradient-to-r from-[#3a86ff] to-[#00f2fe] text-white shadow-[0_0_15px_rgba(58,134,255,0.4)]" 
                : "bg-white/5 text-[#aeb4c0] hover:bg-white/10 hover:text-white border border-white/5"}`}
          >
            Todos
          </button>
          
          {generos.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.nombre)}
              className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition text-left
                ${selectedGenre === g.nombre 
                  ? "bg-gradient-to-r from-[#3a86ff] to-[#00f2fe] text-white shadow-[0_0_15px_rgba(58,134,255,0.4)]" 
                  : "bg-white/5 text-[#aeb4c0] hover:bg-white/10 hover:text-white border border-white/5"}`}
            >
              {g.nombre}
            </button>
          ))}
        </div>
      </aside>

      {/* ─── CUADRÍCULA DE PELÍCULAS (DERECHA) ─── */}
      <main className="flex-1">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {selectedGenre === "Todos" ? "Todas las Películas" : `Películas de ${selectedGenre}`}
          </h2>
          <p className="text-sm text-[#aeb4c0]">{filteredPeliculas.length} resultados encontrados</p>
        </div>

        {filteredPeliculas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredPeliculas.map((movie) => (
              <Link href={`/peliculas/${movie.id}`} key={movie.id} className="group flex flex-col gap-3">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#11131f] transition-all duration-300 group-hover:scale-[1.03] group-hover:border-white/20 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  {movie.rutaCaratula ? (
                    <img 
                      src={movie.rutaCaratula} 
                      alt={movie.titulo} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800">
                      <span className="text-xs text-gray-500">Sin carátula</span>
                    </div>
                  )}
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  {/* Play Button Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3a86ff] shadow-[0_0_20px_rgba(58,134,255,0.6)] backdrop-blur-md transition-transform group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-[#3a86ff]">
                    {movie.titulo}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#aeb4c0]">
                    <span>{movie.fechaLanzamiento ? new Date(movie.fechaLanzamiento).getFullYear() : 'N/A'}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20"></span>
                    <span className="line-clamp-1">{movie.generos?.slice(0, 2).map((g) => g.nombre).join(' / ') || 'Varios'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] rounded-2xl border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-[#aeb4c0]/50">
              <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0z"/><path d="M12 8v4l3 3"/>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron películas</h3>
            <p className="text-[#aeb4c0]">No hay películas disponibles para este género actualmente.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GenerosView({ peliculas, generos }: Props) {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Cargando géneros...</div>}>
      <GenerosViewContent peliculas={peliculas} generos={generos} />
    </Suspense>
  );
}
