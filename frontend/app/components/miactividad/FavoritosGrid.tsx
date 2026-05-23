'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toggleFavoriteAction } from '@/app/actions/favoritos'

interface FavoritoItem {
  id: string
  title: string
  img: string
  year: string
  genre: string
}

interface Props {
  items: FavoritoItem[]
}

export default function FavoritosGrid({ items }: Props) {
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>(items)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleUnfavorite = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setRemovingId(id)
    
    try {
      const res = await toggleFavoriteAction(id);
      if (res.success && !res.isFavorite) {
        // Espera a que la animación de salida termine y luego elimina
        setTimeout(() => {
          setFavoritos((prev) => prev.filter((f) => f.id !== id))
          setRemovingId(null)
        }, 400)
      } else {
        // Falló o no lo quitó
        setRemovingId(null);
      }
    } catch (error) {
      console.error("Error quitando favorito:", error);
      setRemovingId(null);
    }
  }

  if (favoritos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#aeb4c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">No tienes favoritos aún</p>
          <p className="text-sm text-[#aeb4c0] mt-1">Agrega películas a tus favoritos para verlas aquí</p>
        </div>
        <Link
          href="/peliculas"
          className="mt-2 px-6 py-2.5 rounded-full bg-[#3a86ff] text-white text-sm font-semibold hover:bg-[#2a76ef] transition shadow-[0_0_15px_rgba(58,134,255,0.4)]"
        >
          Explorar Películas
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {favoritos.map((item) => (
        <Link
          key={item.id}
          href={`/peliculas/${item.id}`}
          className={`group relative block transition-all duration-400 ${
            removingId === item.id
              ? 'opacity-0 scale-90 pointer-events-none'
              : 'opacity-100 scale-100'
          }`}
          style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
        >
          {/* Poster */}
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <img
              src={item.img}
              alt={item.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />

            {/* Gradient overlay inferior */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-100 transition duration-300" />

            {/* Botón corazón (desmarcar favorito) */}
            <button
              onClick={(e) => handleUnfavorite(e, item.id)}
              aria-label="Quitar de favoritos"
              className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-[rgba(0,0,0,0.65)] backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:bg-amber-400/20 hover:border-amber-400/50 group/heart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="#fbbf24"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_6px_rgba(251,191,36,0.7)] transition-transform group-hover/heart:scale-125"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
            </button>

            {/* Play overlay en hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center scale-75 group-hover:scale-100 transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>

            {/* Info flotante abajo */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
              <p className="truncate text-xs font-bold text-white leading-tight">{item.title}</p>
              <p className="text-[10px] text-[#aeb4c0] mt-0.5">{item.year} • {item.genre}</p>
            </div>
          </div>

          {/* Título fuera del poster (siempre visible) */}
          <div className="pt-2 px-0.5">
            <p className="truncate text-xs font-semibold text-[#d1d5db] group-hover:text-white transition">{item.title}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
