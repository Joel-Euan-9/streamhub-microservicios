import { useRef } from 'react'
import MovieCard from './MovieCardsCarousel'

const MOVIES = [
  { img: '/assets/posters/coco.webp', title: 'Coco', genre: 'Animación • Estreno' },
  { img: '/assets/posters/grandesheroes.jpg', title: 'Grandes Heroes', genre: 'Animación • Estreno' },
  { img: '/assets/posters/jurassicworld2.webp', title: 'Jurassic World 2', genre: 'Aventura • Estreno' },
  { img: '/assets/posters/elplanetadelossimioslaguerra.jpg', title: 'La Guerra de los Simios', genre: 'Sci-Fi • Estreno' },
  { img: '/assets/posters/cigueñas.jpg', title: 'Cigueñas', genre: 'Animación • Estreno' },
  { img: '/assets/posters/comoserunlatinlover.jpg', title: 'Como Ser un Latin Lover', genre: 'Comedia • Estreno' },
  { img: '/assets/posters/boxtrolls.jpg', title: 'Boxtrolls', genre: 'Animación • Estreno' },
]


export default function MoviesCarousel() {
const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 440, behavior: 'smooth' })
    }
  }

  return (
    <div className="px-10 py-16" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <section>
        <div className="flex justify-between items-center mb-5 pr-5">
          <h2 className="text-[1.8rem] font-bold text-white border-l-4 pl-4 drop-shadow-[0_0_10px_rgba(58,134,255,0.4)]"
            style={{ borderColor: 'var(--primary-blue)' }}>
            Estrenos en StreamHub
          </h2>
          <div className="flex gap-2">
            {['&lt;', '&gt;'].map((label, i) => (
              <button key={i} onClick={() => scroll(i === 0 ? -1 : 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-all hover:scale-110 bg-white/10 hover:bg-[var(--primary-blue)]"
                dangerouslySetInnerHTML={{ __html: label }} />
            ))}
          </div>
        </div>

        <div ref={carouselRef} className="carousel-container flex gap-5 overflow-x-auto pb-5">
          {MOVIES.map((m, i) => <MovieCard key={i} movie={m} />)}
        </div>
      </section>
    </div>
  )
}
