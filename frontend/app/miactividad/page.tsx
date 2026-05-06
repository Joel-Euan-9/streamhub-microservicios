import Navbar from "@/app/components/ui/Navbar";
import HistorialCarousel from "@/app/components/miactividad/HistorialCarousel";
import FavoritosGrid from "@/app/components/miactividad/FavoritosGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Actividad | StreamHub",
  description: "Revisa tu historial de películas vistas y gestiona tus favoritos en StreamHub.",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Historial: de más reciente (índice 0) a más antigua (último)
const HISTORIAL = [
  {
    id: "1",
    title: "Oppenheimer",
    img: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=400&auto=format&fit=crop",
    progress: 100,
    watchedAt: "Hace 1 hora",
    genre: "Drama / Historia",
  },
  {
    id: "2",
    title: "Dune: Parte Dos",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
    progress: 68,
    watchedAt: "Hace 3 horas",
    genre: "Sci-Fi / Aventura",
  },
  {
    id: "3",
    title: "La Zona de Interés",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop",
    progress: 100,
    watchedAt: "Ayer",
    genre: "Drama / Guerra",
  },
  {
    id: "4",
    title: "Pobres Criaturas",
    img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=400&auto=format&fit=crop",
    progress: 45,
    watchedAt: "Hace 2 días",
    genre: "Fantasía / Drama",
  },
  {
    id: "5",
    title: "Past Lives",
    img: "https://images.unsplash.com/photo-1560759226-14da22a643ef?q=80&w=400&auto=format&fit=crop",
    progress: 100,
    watchedAt: "Hace 3 días",
    genre: "Romance / Drama",
  },
  {
    id: "6",
    title: "Maestro",
    img: "https://images.unsplash.com/photo-1520423465871-0866049bfbf9?q=80&w=400&auto=format&fit=crop",
    progress: 100,
    watchedAt: "Hace 4 días",
    genre: "Biográfica / Drama",
  },
  {
    id: "7",
    title: "El Conde",
    img: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=400&auto=format&fit=crop",
    progress: 22,
    watchedAt: "Hace 5 días",
    genre: "Sátira / Terror",
  },
  {
    id: "8",
    title: "Ferrari",
    img: "https://images.unsplash.com/photo-1616788494672-ec7ca25fdda9?q=80&w=400&auto=format&fit=crop",
    progress: 100,
    watchedAt: "Hace 1 semana",
    genre: "Acción / Biográfica",
  },
];

// Favoritos: cuadrícula estilo TikTok
const FAVORITOS = [
  {
    id: "10",
    title: "Oppenheimer",
    img: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=400&auto=format&fit=crop",
    year: "2023",
    genre: "Drama",
  },
  {
    id: "11",
    title: "Dune: Parte Dos",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
    year: "2024",
    genre: "Sci-Fi",
  },
  {
    id: "12",
    title: "Spider-Man: No Way Home",
    img: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=400&auto=format&fit=crop",
    year: "2021",
    genre: "Acción",
  },
  {
    id: "13",
    title: "Interstellar",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400&auto=format&fit=crop",
    year: "2014",
    genre: "Sci-Fi",
  },
  {
    id: "14",
    title: "The Batman",
    img: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=400&auto=format&fit=crop",
    year: "2022",
    genre: "Acción",
  },
  {
    id: "15",
    title: "Pobres Criaturas",
    img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=400&auto=format&fit=crop",
    year: "2023",
    genre: "Fantasía",
  },
  {
    id: "16",
    title: "Past Lives",
    img: "https://images.unsplash.com/photo-1560759226-14da22a643ef?q=80&w=400&auto=format&fit=crop",
    year: "2023",
    genre: "Romance",
  },
  {
    id: "17",
    title: "La La Land",
    img: "https://images.unsplash.com/photo-1520423465871-0866049bfbf9?q=80&w=400&auto=format&fit=crop",
    year: "2016",
    genre: "Musical",
  },
  {
    id: "18",
    title: "Everything Everywhere",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop",
    year: "2022",
    genre: "Comedia",
  },
  {
    id: "19",
    title: "Tár",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop",
    year: "2022",
    genre: "Drama",
  },
  {
    id: "20",
    title: "The Whale",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&auto=format&fit=crop",
    year: "2022",
    genre: "Drama",
  },
  {
    id: "21",
    title: "Ferrari",
    img: "https://images.unsplash.com/photo-1616788494672-ec7ca25fdda9?q=80&w=400&auto=format&fit=crop",
    year: "2023",
    genre: "Biográfica",
  },
];

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function MiActividadPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#020817] text-white pt-[72px] md:pt-20">
        
        {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/5">
          {/* Fondo degradado animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b3e] via-[#020817] to-[#0a0a1a]" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#3a86ff]/20 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#00f2fe]/10 blur-[80px]" />
          </div>

          <div className="relative z-10 px-5 md:px-10 py-12 md:py-16">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3a86ff] to-[#00f2fe] flex items-center justify-center shadow-[0_0_20px_rgba(58,134,255,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-[#aeb4c0] bg-clip-text text-transparent">
                  Mi Actividad
                </h1>
                <p className="text-sm text-[#aeb4c0] mt-0.5">Tu historial y películas favoritas en un solo lugar</p>
              </div>
            </div>

            {/* Stats rápidas */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a86ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="text-xs font-semibold text-white">{HISTORIAL.length} vistas recientes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span className="text-xs font-semibold text-white">{FAVORITOS.length} favoritos</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENIDO PRINCIPAL ────────────────────────────────────────────── */}
        <div className="px-5 md:px-10 py-10 space-y-14">

          {/* ── SECCIÓN: MI HISTORIAL ──────────────────────────────────────── */}
          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#3a86ff] to-[#00f2fe]" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Mi Historial</h2>
                  <p className="text-xs text-[#aeb4c0] mt-0.5">Desde la última película hasta la primera que viste</p>
                </div>
              </div>
              <button className="hidden sm:flex items-center gap-1.5 text-xs text-[#aeb4c0] hover:text-red-400 transition border border-white/10 hover:border-red-500/30 rounded-full px-3 py-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                </svg>
                Limpiar historial
              </button>
            </div>

            <HistorialCarousel items={HISTORIAL} />
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* ── SECCIÓN: MIS FAVORITOS ─────────────────────────────────────── */}
          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#ef4444] to-[#f97316]" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Mis Favoritos</h2>
                  <p className="text-xs text-[#aeb4c0] mt-0.5">Toca el ❤️ rojo para quitar una película de tus favoritos</p>
                </div>
              </div>
            </div>

            <FavoritosGrid items={FAVORITOS} />
          </section>

        </div>
      </main>
    </>
  );
}
