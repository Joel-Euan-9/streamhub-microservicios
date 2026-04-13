'use client'
import { useEffect, useState } from 'react'

interface Pelicula {
  id: string;
  rutaImagenFondo: string;
}

interface Props {
  peliculas: Pelicula[];
}

export default function HeroSection({ peliculas }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (peliculas.length > 0) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % peliculas.length)
      }, 6000)
      return () => clearInterval(timer)
    }
  }, [peliculas.length])

  return (
    <section className="relative flex flex-col md:flex-row min-h-[85vh] w-full overflow-hidden bg-[#0b0c15]">

      {/* --- CONTENEDOR DE IMÁGENES --- */}
      {/* En móvil: relativo y altura fija (40vh). En PC: absoluto a la derecha */}
      <div className="relative md:absolute top-0 right-0 w-full md:w-[70%] h-[40vh] md:h-full overflow-hidden z-0">
        {peliculas.map((pelicula, i) => (
          <div
            key={pelicula.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ 
                backgroundImage: `url('${pelicula.rutaImagenFondo}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: i === current ? 1 : 0,
            }}
          />
        ))}
        
        {/* Degradado responsivo: 
            En móvil: De transparente arriba a negro abajo.
            En PC: De negro izquierda a transparente derecha. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] via-transparent to-transparent md:bg-gradient-to-r md:from-[#0b0c15] md:via-[#0b0c15]/60 md:to-transparent z-10" />
      </div>

      {/* --- CONTENIDO DE TEXTO --- */}
      {/* En móvil: se posiciona debajo de la imagen. En PC: flota a la izquierda */}
      <div className="relative z-20 w-full md:w-[60%] px-6 md:px-20 py-10 md:py-20 flex flex-col justify-center bg-transparent">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 text-white">StreamHub</h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">Películas, series y mucho más</h2>
        
        <p className="text-base md:text-xl font-light leading-relaxed mb-10 max-w-xl text-gray-300">
          Disfruta de series, películas y envíos gratis en millones de productos por $99MXN al mes,
          o ahorra 24 % con una suscripción anual de $899MXN.
        </p>

        <div className="flex flex-col gap-4 mb-8 w-full max-w-[420px]">
          <a href="/login" className="block text-center py-4 px-5 rounded font-semibold text-lg bg-white text-[#0b0c15] hover:bg-gray-200">
            Iniciar sesión
          </a>
          <a href="/register" className="block text-center py-4 px-5 rounded font-semibold text-lg bg-white text-[#0b0c15] hover:bg-gray-200">
            Empieza tu periodo de prueba gratis*
          </a>
        </div>

        <div className="space-y-3">
          <p className="text-xs md:text-sm leading-relaxed max-w-[550px] text-gray-400">
            * Solo se aplica con una tarjeta de crédito o débito. Cancela cuando quieras.
          </p>
        </div>
      </div>

      {/* Indicadores: Los movemos un poco para que no estorben en móvil */}
      <div className="absolute bottom-4 md:bottom-8 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 z-30 flex gap-2">
        {peliculas.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-8 md:w-11 h-[3px] transition-all duration-300 ${i === current ? 'bg-[#3a86ff]' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  )
}