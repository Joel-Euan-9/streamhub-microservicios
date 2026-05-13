import Navbar from "@/app/components/ui/Navbar";
import GenerosView from "@/app/components/generos/GenerosView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Géneros | StreamHub",
  description: "Explora todas las películas por su género en StreamHub.",
};

async function getPeliculas() {
  try {
    const res = await fetch("http://gateway-service:8000/api/peliculas", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error cargando películas:", error);
    return [];
  }
}

export default async function GenerosPage() {
  const peliculas = await getPeliculas();

  // Extraer géneros únicos
  const generosMap = new Map();
  peliculas.forEach((p: any) => {
    if (p.generos && Array.isArray(p.generos)) {
      p.generos.forEach((g: any) => {
        if (!generosMap.has(g.id)) {
          generosMap.set(g.id, g);
        }
      });
    }
  });
  
  // Convertir a array y ordenar alfabéticamente
  const generosUnicos = Array.from(generosMap.values()).sort((a, b) => 
    a.nombre.localeCompare(b.nombre)
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0b0c15] text-white pt-[72px] md:pt-20">
        
        {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/5 bg-[#0b0c15]">
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-64 h-64 rounded-full bg-[#3a86ff]/5 blur-[80px] pointer-events-none" />

          <div className="relative z-10 px-5 md:px-10 py-12 md:py-16">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3a86ff] to-[#00f2fe] flex items-center justify-center shadow-[0_0_20px_rgba(58,134,255,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-[#aeb4c0] bg-clip-text text-transparent">
                  Explorar Géneros
                </h1>
                <p className="text-sm text-[#aeb4c0] mt-0.5">Encuentra tu próxima película favorita navegando por categorías</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENIDO PRINCIPAL ────────────────────────────────────────────── */}
        <div className="px-5 md:px-10 py-8">
          <GenerosView peliculas={peliculas} generos={generosUnicos} />
        </div>
      </main>
    </>
  );
}
