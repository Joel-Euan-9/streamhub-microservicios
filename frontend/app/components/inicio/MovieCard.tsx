// components/inicio/MovieCard.tsx
import Link from "next/link";
import { Star } from "lucide-react";

interface MovieCardProps {
  id: string; // <-- Añadimos el id aquí
  title: string;
  year: string;
  genre: string;
  img: string;
  requierePremium?: boolean; // Prop opcional para contenido premium
}

// Recibimos el id en los parámetros
export default function MovieCard({ id, title, year, genre, img, requierePremium = false }: MovieCardProps) {
  return (
    // Cambiamos el href para que use el id dinámico
    <Link href={`/peliculas/${id}`} className="group block w-[160px] shrink-0 transition hover:-translate-y-2 sm:w-[180px] md:w-[200px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
        <img src={img} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        
        {/* Etiqueta Premium si requiere suscripción */}
        {requierePremium && (
          <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-[0_4px_10px_rgba(245,158,11,0.55)] border border-amber-300/30">
            <Star size={10} fill="currentColor" className="text-black" />
            Premium
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
          <button className="translate-y-5 rounded-full bg-[#3a86ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(58,134,255,0.45)] transition group-hover:translate-y-0">
            ▶ Reproducir
          </button>
        </div>
      </div>
      <div className="pt-3">
        <h3 className="truncate text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-[#aeb4c0]">{year} • {genre}</p>
      </div>
    </Link>
  );
}