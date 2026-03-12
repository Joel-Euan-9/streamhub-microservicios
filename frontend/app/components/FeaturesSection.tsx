const FEATURES = [
  {
    bg: '#008ccc',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Crea tu lista de favoritas',
    desc: 'Guarda todos los títulos que te encantan en un solo lugar y tenlos siempre listos para disfrutar cuando tú quieras.',
  },
  {
    bg: '#111720',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Sigue viendo',
    desc: 'Retoma tu película o serie exactamente donde la dejaste. Tu entretenimiento fluye a tu propio ritmo, sin interrupciones.',
  },
  {
    bg: '#111720',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: 'Top más vistas',
    desc: 'Descubre fácilmente el contenido más popular. Mantente al día con las tendencias y nunca te pierdas los éxitos del momento.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="flex flex-wrap justify-center gap-10 px-10 py-16 text-center max-w-[1200px] mx-auto" style={{ backgroundColor: 'var(--bg-dark)' }}>
      {FEATURES.map((f, i) => (
        <div key={i} className="flex flex-col items-center min-w-[250px] max-w-[320px] flex-1">
          <div className="w-44 h-44 rounded-full flex items-center justify-center mb-6" style={{ background: f.bg }}>
            {f.icon}
          </div>
          <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-gray)' }}>{f.desc}</p>
        </div>
      ))}
    </section>
  )
}