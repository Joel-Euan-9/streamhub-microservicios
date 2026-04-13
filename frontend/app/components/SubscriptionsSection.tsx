'use client'

import { Check, Minus } from 'lucide-react' // Usaremos lucide-react para los iconos

const PLANS = [
  {
    name: 'BÁSICO',
    price: 'Gratis',
    features: [
      { text: 'Acceso al 40% del catálogo', included: true },
      { text: 'Con interrupciones publicitarias', included: true },
      { text: 'Límite de 5 películas por día', included: true },
      { text: 'Calidad de video HD', included: true },
      { text: 'Sin conexión (Descargas)', included: false },
      { text: 'Subir contenido propio', included: false },
    ]
  },
  {
    name: 'PREMIUM',
    price: '$149 MXN/mes',
    highlight: true,
    features: [
      { text: 'Catálogo completo ilimitado', included: true },
      { text: 'Sin publicidad', included: true },
      { text: 'Películas ilimitadas por día', included: true },
      { text: 'Calidad 4K UHD + HDR', included: true },
      { text: 'Descargas disponibles', included: true },
      { text: 'Subir contenido propio', included: false },
    ]
  },
  {
    name: 'STUDIO PASS', // El nombre para artistas
    price: '$299 MXN/mes',
    features: [
      { text: 'Todo lo incluido en Premium', included: true },
      { text: 'Sin publicidad', included: true },
      { text: 'Panel de Creador Independiente', included: true },
      { text: 'Sube y gestiona tus propias películas', included: true },
      { text: 'Estadísticas de visualización', included: true },
      { text: 'Soporte técnico prioritario', included: true },
    ]
  }
]

export default function SubscriptionsSection() {
  return (
    <section className="py-10 px-5 md:px-20 bg-[#0b0c15] text-white min-h-screen flex flex-col justify-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">¿Qué plan vas a elegir?</h2>
        <p className="text-sm text-gray-400">Cambia de plan o cancela en cualquier momento.</p>
      </div>

      {/* Contenedor principal más compacto */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        {PLANS.map((plan, i) => (
          <div 
            key={i} 
            className={`flex flex-col border-r border-white/10 last:border-0 ${plan.highlight ? 'bg-white/[0.03]' : ''}`}
          >
            {/* Cabecera reducida */}
            <div className={`p-5 text-center border-b border-white/10 ${plan.highlight ? 'bg-[#3a86ff]/10' : 'bg-white/[0.02]'}`}>
              <h3 className={`text-sm font-black tracking-widest mb-1 ${plan.highlight ? 'text-[#3a86ff]' : 'text-gray-400'}`}>
                {plan.name}
              </h3>
              <div className="text-xl font-bold">{plan.price}</div>
            </div>

            {/* Lista de características COMPACTA */}
            <div className="flex-grow flex flex-col">
              {plan.features.map((feature, idx) => (
                <div 
                  key={idx} 
                  className="px-5 py-3 border-b border-white/5 flex items-center gap-3 last:border-0 min-h-[50px]"
                >
                  {/* Icono más pequeño */}
                  <div className="flex-shrink-0 w-5">
                    {feature.included ? (
                      <Check className="text-[#3a86ff]" size={18} />
                    ) : (
                      <Minus className="text-gray-700" size={18} />
                    )}
                  </div>
                  {/* Texto a la derecha y más pequeño */}
                  <span className={`text-xs md:text-[13px] ${feature.included ? 'text-gray-200' : 'text-gray-600'}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Botón más pequeño */}
            <div className="p-5 bg-white/[0.01]">
              <button className={`w-full py-2.5 rounded-md font-bold text-sm transition-all ${
                plan.highlight 
                ? 'bg-[#3a86ff] hover:bg-[#3a86ff]/80 text-white shadow-[0_0_15px_rgba(58,134,255,0.3)]' 
                : 'bg-white/10 hover:bg-white/20 text-white'
              }`}>
                Elegir {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <p className="mt-6 text-[10px] text-gray-500 text-center max-w-2xl mx-auto leading-tight">
        * Acceso sujeto a disponibilidad. El plan Studio Pass requiere verificación. 
        Precios expresados en moneda nacional e incluyen impuestos.
      </p>
    </section>
  )
}