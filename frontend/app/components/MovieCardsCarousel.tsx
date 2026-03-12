
type Movie = { img: string; title: string; genre: string }
export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <a href="/register" className="movie-card flex-shrink-0 w-[200px] rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-2 group block">
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
        <img src={movie.img} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="text-white font-semibold px-5 py-2 rounded-full translate-y-5 group-hover:translate-y-0 transition-transform duration-300"
            style={{ backgroundColor: 'var(--primary-blue)', boxShadow: '0 0 15px rgba(58,134,255,0.5)' }}>
            ▶ Ver Ahora
          </button>
        </div>
      </div>
      <div className="pt-3">
        <h3 className="text-base font-semibold text-white truncate">{movie.title}</h3>
        <p className="text-sm" style={{ color: 'var(--text-gray)' }}>{movie.genre}</p>
      </div>
    </a>
  )
}