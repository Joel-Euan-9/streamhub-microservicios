'use client'

import { useRef } from 'react'
import Link from 'next/link'

interface HistorialItem {
  id: string
  title: string
  img: string
  progress: number   // 0–100
  watchedAt: string  // e.g. "Hace 2 horas"
  genre: string
}

interface Props {
  items: HistorialItem[]
}

export default function HistorialCarousel({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="relative group/carousel">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll('left')}
        aria-label="Anterior"
        className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 w-10 h-10 rounded-full bg-[rgba(11,12,21,0.9)] border border-white/10 flex items-center justify-center text-white hover:bg-[#3a86ff] hover:border-[#3a86ff] shadow-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll('right')}
        aria-label="Siguiente"
        className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 w-10 h-10 rounded-full bg-[rgba(11,12,21,0.9)] border border-white/10 flex items-center justify-center text-white hover:bg-[#3a86ff] hover:border-[#3a86ff] shadow-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Track scrollable */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {items.map((item, idx) => (
          <Link
            key={item.id}
            href={`/peliculas/${item.id}`}
            className="group relative shrink-0 w-[200px] sm:w-[220px] md:w-[240px] block"
          >
            {/* Poster */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
              <img
                src={item.img}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Ícono "número de orden" */}
              <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[rgba(11,12,21,0.85)] border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                {idx + 1}
              </div>

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="w-14 h-14 rounded-full bg-[#3a86ff] flex items-center justify-center shadow-[0_0_25px_rgba(58,134,255,0.6)] scale-75 group-hover:scale-100 transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
                <div
                  className="h-full bg-gradient-to-r from-[#3a86ff] to-[#00f2fe] shadow-[0_0_8px_#3a86ff] transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="pt-3 px-0.5">
              <h3 className="truncate text-sm font-semibold text-white group-hover:text-[#3a86ff] transition">{item.title}</h3>
              <div className="mt-1 flex items-center justify-between text-xs text-[#aeb4c0]">
                <span>{item.genre}</span>
                <span>{item.watchedAt}</span>
              </div>
              {/* Texto de progreso */}
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#3a86ff]"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#aeb4c0] shrink-0">{item.progress}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
