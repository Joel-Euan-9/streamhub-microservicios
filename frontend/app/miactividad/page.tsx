import Navbar from "@/app/components/ui/Navbar";
import HistorialCarousel from "@/app/components/miactividad/HistorialCarousel";
import FavoritosGrid from "@/app/components/miactividad/FavoritosGrid";
import LimpiarHistorialBoton from "@/app/components/miactividad/LimpiarHistorialBoton";
import type { Metadata } from "next";
import { fetchWithAuth } from "@/lib/api";
import { getHistorialAction } from "@/app/actions/historial";

export const metadata: Metadata = {
  title: "Mi Actividad | StreamHub",
  description: "Revisa tu historial de películas vistas y gestiona tus favoritos en StreamHub.",
};

// ─── DATA FETCHING ────────────────────────────────────────────────────────────
async function getFavoritos() {
  try {
    const res = await fetchWithAuth('http://gateway-service:8000/api/favoritos', { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    
    const data = await res.json();
    
    // Filtrar registros que no tengan una película válida en catálogo
    const dataValida = Array.isArray(data) ? data.filter((item: any) => item && item.pelicula) : [];
    
    // Map the backend data to match the FavoritoItem interface expected by FavoritosGrid
    return dataValida.map((item: any) => ({
      id: item.peliculaId,
      title: item.pelicula?.titulo || 'Película Desconocida',
      img: item.pelicula?.rutaCaratula || 'https://via.placeholder.com/400x600?text=No+Image',
      year: item.pelicula?.fechaLanzamiento ? new Date(item.pelicula.fechaLanzamiento).getFullYear().toString() : 'N/A',
      genre: item.pelicula?.generos?.slice(0, 2).map((g: any) => g.nombre).join(' / ') || 'Varios',
    }));
  } catch (error) {
    console.error("Error cargando favoritos:", error);
    return [];
  }
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default async function MiActividadPage() {
  const favoritosReales = await getFavoritos();
  const rawHistorial = await getHistorialAction();
  
  const rawHistorialArray = Array.isArray(rawHistorial) ? rawHistorial : [];
  const historialValido = rawHistorialArray.filter((item: any) => item && item.pelicula);

  const historialFormateado = historialValido.map((item: any) => {
    const pelicula = item.pelicula || {};
    let progress = 0;
    
    if (item.completada) {
      progress = 100;
    } else if (pelicula.duracion && item.minutoPausa) {
      const durationSeconds = pelicula.duracion * 60;
      progress = Math.floor((item.minutoPausa / durationSeconds) * 100);
      if (progress > 100) progress = 100;
    }
  
    const lastView = new Date(item.ultimaVezVisto);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastView.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let watchedAt = "Recientemente";
    if (diffDays === 0) watchedAt = "Hoy";
    else if (diffDays === 1) watchedAt = "Ayer";
    else if (diffDays > 1) watchedAt = `Hace ${diffDays} días`;
  
    return {
      id: item.peliculaId,
      title: pelicula.titulo || 'Desconocido',
      img: pelicula.rutaCaratula || 'https://via.placeholder.com/400x600?text=No+Image',
      progress: progress,
      watchedAt: watchedAt,
      genre: pelicula.generos?.slice(0, 2).map((g: any) => g.nombre).join(' / ') || 'Varios',
    };
  });

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
                <span className="text-xs font-semibold text-white">{historialFormateado.length} vistas recientes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
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
              <LimpiarHistorialBoton />
            </div>

            <HistorialCarousel items={historialFormateado} />
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
                  <p className="text-xs text-[#aeb4c0] mt-0.5">Toca el icono 🔖 amarillo para quitar una película de tus favoritos</p>
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
