import { useEffect, useState } from 'react'
const SLIDES = [
  { bg: '/assets/posters/hotelfondo3.jpg' },
  { bg: '/assets/posters/maleficafondo.jpeg' },
  { bg: '/assets/posters/ragnarok.webp' },
  { bg: '/assets/posters/coco.webp' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative flex min-h-[85vh]" style={{ backgroundColor: 'var(--bg-dark)' }}>

      {/* Background slider */}
      <div className="absolute top-0 right-0 w-[65%] h-full z-[1] overflow-hidden" style={{ backgroundColor: 'var(--bg-dark)' }}>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`principal-slide ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide.bg}')` }}
          />
        ))}
        {/* Gradient overlay */}
        <div className="hero-gradient-overlay absolute inset-0 pointer-events-none" />
      </div>

      {/* Hero content */}
      <div className="relative z-[2] w-full md:w-[60%] px-10 md:px-20 py-20 flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">StreamHub</h1>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Películas, series y mucho más</h1>
        <p className="text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl" style={{ color: 'var(--text-gray)' }}>
          Disfruta de series, películas y envíos gratis en millones de productos por $99MXN al mes,
          o ahorra 24 % con una suscripción anual de $899MXN. Ve contenido sin anuncios por $50MXN al mes adicionales.
        </p>

        <div className="flex flex-col gap-4 mb-8 max-w-[420px]">
          <a href="/login"
            className="block text-center py-4 px-5 rounded font-semibold text-lg bg-white text-[#0b0c15] transition-colors hover:bg-gray-200">
            Iniciar sesión
          </a>
          <a href="/register"
            className="block text-center py-4 px-5 rounded font-semibold text-lg bg-white text-[#0b0c15] transition-colors hover:bg-gray-200">
            Empieza tu periodo de prueba de 30 días gratis*
          </a>
        </div>

        <div className="space-y-3">
          {[
            '* Solo se aplica con una tarjeta de crédito o débito. Cancela cuando quieras.',
            'Obtén más información sobre cómo pagar tu membresía de StreamHub y las suscripciones adicionales a través de StreamHub Video aquí.',
            'También puedes pagar tu suscripción a StreamHub con una tarjeta regalo. Más información.',
          ].map((text, i) => (
            <p key={i} className="text-sm leading-relaxed max-w-[550px]" style={{ color: 'var(--text-gray)' }}>{text}</p>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-10 z-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-11 h-[3px] transition-all duration-300 cursor-pointer ${i === current ? 'bg-white/90' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  )
}