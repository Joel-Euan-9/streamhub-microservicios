"use client";

import { useEffect, useState } from "react";

// Definimos qué campos esperamos de la BD
interface Pelicula {
  id: string;
  titulo: string;
  sinopsis: string;
  fechaLanzamiento: string;
  rutaImagenFondo: string;
  generos?: { nombre: string }[];
}

interface Props {
  peliculas: Pelicula[];
}

export default function HeroCarousel({ peliculas }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (peliculas.length > 0) {
      const t = setInterval(() => {
        setIndex((i) => (i + 1) % peliculas.length);
      }, 5000);
      return () => clearInterval(t);
    }
  }, [peliculas.length]);

  if (!peliculas || peliculas.length === 0) return null;

  const currentMovie = peliculas[index];
  const year = new Date(currentMovie.fechaLanzamiento).getFullYear();
  const genre = currentMovie.generos?.[0]?.nombre || "Destacada";

  return (
    <section className="relative mb-10 h-[70vh] md:h-[80vh] w-full overflow-hidden">
      {/* Slides de fondo */}
      {peliculas.map((movie, i) => (
        <div
          key={movie.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${movie.rutaImagenFondo})` }}
        />
      ))}

      {/* Degradados para visibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-transparent to-transparent hidden md:block" />

      {/* Contenido del texto */}
      <div className="absolute bottom-16 left-6 md:left-12 max-w-2xl text-white z-10">
        <h1 className="mb-2 text-4xl md:text-6xl font-black drop-shadow-lg">
          {currentMovie.titulo}
        </h1>
        
        <div className="mb-4 flex items-center gap-3 text-sm md:text-base font-semibold text-[#3a86ff]">
          <span>{year}</span>
          <span>•</span>
          <span className="bg-[#3a86ff]/20 px-2 py-0.5 rounded border border-[#3a86ff]/30">
            {genre}
          </span>
        </div>

        <p className="mb-8 text-sm md:text-lg text-gray-300 line-clamp-3 md:line-clamp-none drop-shadow-md">
          {currentMovie.sinopsis}
        </p>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-full bg-[#3a86ff] px-8 py-3 font-bold transition-all hover:scale-105 hover:bg-[#3a86ff]/80 shadow-[0_0_20px_rgba(58,134,255,0.4)]">
            ▶ Ver ahora
          </button>
          <button className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-8 py-3 font-bold transition-all hover:bg-white/20 border border-white/10">
            + Mi Lista
          </button>
        </div>
      </div>

      {/* Indicadores de posición */}
      <div className="absolute bottom-10 right-10 flex gap-2 z-20">
        {peliculas.map((_, i) => (
          <div
            key={i}
            className={`h-1 transition-all duration-500 ${
              i === index ? "w-8 bg-[#3a86ff]" : "w-4 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}