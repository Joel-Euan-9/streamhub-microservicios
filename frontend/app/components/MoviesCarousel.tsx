"use client" // Obligatorio para usar useRef y onClick

import { useRef } from 'react'
import MovieCard from './MovieCardsCarousel'

// 1. Definimos las interfaces de lo que nos manda la base de datos
interface Genero {
  id: number;
  nombre: string;
}

interface Pelicula {
  id: string;
  titulo: string;
  rutaCaratula: string;
  generos?: Genero[];
}

// 2. Le decimos al componente que va a recibir un arreglo de películas
interface Props {
  peliculas: Pelicula[];
}

export default function MoviesCarousel({ peliculas }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 440, behavior: 'smooth' })
    }
  }

  // Si no hay películas aún, no renderizamos el carrusel para evitar errores
  if (!peliculas || peliculas.length === 0) return null;

  return (
    <div className="px-6 md:px-10 py-16" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <section>
        <div className="flex justify-between items-center mb-5 pr-5">
          <h2 className="text-[1.5rem] md:text-[1.8rem] font-bold text-white border-l-4 pl-4 drop-shadow-[0_0_10px_rgba(58,134,255,0.4)]"
            style={{ borderColor: 'var(--primary-blue)' }}>
            Estrenos en StreamHub
          </h2>
          
          {/* Las flechas se ocultan en móviles muy pequeños para no amontonar el título */}
          <div className="hidden sm:flex gap-2">
            {['&lt;', '&gt;'].map((label, i) => (
              <button key={i} onClick={() => scroll(i === 0 ? -1 : 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-all hover:scale-110 bg-white/10 hover:bg-[var(--primary-blue)]"
                dangerouslySetInnerHTML={{ __html: label }} />
            ))}
          </div>
        </div>

        {/* CONTENEDOR CON LA CORRECCIÓN DE LA BARRA (OPCIÓN 2) */}
        <div 
          ref={carouselRef} 
          className="carousel-container flex gap-5 overflow-x-auto pb-5 
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {peliculas.map((movie) => {
            // Adaptamos los datos de la BD al formato que espera tu MovieCard
            const generoTexto = movie.generos && movie.generos.length > 0 
              ? `${movie.generos[0].nombre} • Estreno` 
              : 'Estreno';

            const movieAdapted = {
              img: movie.rutaCaratula,
              title: movie.titulo,
              genre: generoTexto
            };

            return <MovieCard key={movie.id} movie={movieAdapted} />;
          })}
        </div>
      </section>
    </div>
  )
}