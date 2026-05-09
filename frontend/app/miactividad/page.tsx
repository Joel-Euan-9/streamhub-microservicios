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

import { fetchWithAuth } from "@/lib/api";

// ─── DATA FETCHING ────────────────────────────────────────────────────────────
async function getFavoritos() {
  try {
    const res = await fetchWithAuth('http://gateway-service:8000/api/favoritos', { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    
    const data = await res.json();
    
    // Map the backend data to match the FavoritoItem interface expected by FavoritosGrid
    return data.map((item: any) => ({
      id: item.peliculaId,
      title: item.pelicula?.titulo || 'Película Desconocida',
      img: item.pelicula?.rutaCaratula || 'https://via.placeholder.com/400x600?text=No+Image',
      year: item.pelicula?.fechaLanzamiento ? new Date(item.pelicula.fechaLanzamiento).getFullYear().toString() : 'N/A',
      genre: item.pelicula?.generos?.[0]?.nombre || 'Varios',
    }));
  } catch (error) {
    console.error("Error cargando favoritos:", error);
    return [];
  }
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default async function MiActividadPage() {
  const favoritosReales = await getFavoritos();
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0b0c15] text-white pt-[72px] md:pt-20">
        
        {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/5 bg-[#0b0c15]">
          {/* Subtle glow behind the icon, matched to the site's primary accent color but very dark */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-64 h-64 rounded-full bg-[#3a86ff]/5 blur-[80px] pointer-events-none" />

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
                <span className="text-xs font-semibold text-white">{favoritosReales.length} favoritos</span>
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

            <FavoritosGrid items={favoritosReales} />
          </section>

        </div>
      </main>
    </>
  );
}
