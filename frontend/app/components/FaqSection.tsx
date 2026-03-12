import { useState } from 'react'

const FAQ_ITEMS = [
  {
    q: '¿Qué incluye StreamHub?',
    a: 'StreamHub incluye acceso a miles de películas, series, documentales y contenido exclusivo de tus estudios favoritos. Puedes disfrutar de todo el catálogo sin anuncios y en la mejor calidad disponible según el plan que elijas.',
  },
  {
    q: '¿Cómo puedo pagar?',
    a: 'Aceptamos tarjetas de crédito, de débito y métodos de pago electrónicos respaldados. El cobro se realiza mensualmente o de forma anual, dependiendo de la suscripción que prefieras. Cancela cuando quieras.',
  },
  {
    q: '¿Dónde puedo ver StreamHub?',
    a: 'Puedes disfrutar de StreamHub en tu Smart TV, computadora, tablet, smartphone y consolas de videojuegos compatibles. Tienes la opción de reproducir contenido en hasta 3 pantallas al mismo tiempo con una sola cuenta.',
  },
]

export default function FAQSection() {
    const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="flex flex-col items-center px-10 py-20 border-t border-white/5" style={{ backgroundColor: '#0b0f15' }}>
      <h2 className="text-4xl font-bold mb-10 text-center">Preguntas frecuentes</h2>

      <div className="w-full max-w-[900px] flex flex-col gap-4">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="rounded overflow-hidden" style={{ backgroundColor: '#1c2027' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-6 py-6 bg-transparent border-none text-white text-xl font-semibold flex justify-between items-center cursor-pointer transition-colors hover:bg-[#252a33]"
            >
              {item.q}
              <span className={`text-3xl font-light leading-none transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
            </button>

            <div className={`faq-answer overflow-hidden transition-all duration-300 ${open === i ? 'max-h-96' : 'max-h-0'}`}>
              <p className="px-6 pb-6 text-lg leading-relaxed" style={{ color: 'var(--text-gray)' }}>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
