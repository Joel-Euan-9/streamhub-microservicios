"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getUserProfile, upgradePlan } from "@/app/actions/profile";

// Definimos lo que necesitamos de la película para el buscador
interface SearchResult {
  id: string;
  titulo: string;
  rutaCaratula: string;
  fechaLanzamiento: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    getUserProfile().then((data) => {
      if (data) setUserPlan(data.plan);
    });
  }, []);
  
  // --- NUEVOS ESTADOS PARA EL BUSCADOR ---
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Ref para detectar clics fuera del buscador y cerrarlo
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Cierra el menú móvil y limpia el buscador cuando cambias de página
  useEffect(() => {
    setOpen(false);
    setSearchTerm("");
    setResults([]);
    setShowMobileSearch(false);
  }, [pathname]);

  // --- LÓGICA DE BÚSQUEDA (Debounce) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setIsSearching(true);
        try {
          // Hacemos fetch a tu Gateway. 
          // Nota: Para este proyecto filtramos localmente. En una app gigante, 
          // el backend debería tener una ruta tipo /api/peliculas/buscar?q=termino
          const res = await fetch('http://localhost:8000/api/peliculas');
          if (res.ok) {
            const data = await res.json();
            // Filtramos las películas que incluyan el texto (ignorando mayúsculas)
            const filtered = data.filter((m: SearchResult) => 
              m.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            // Mostramos solo los primeros 5 resultados para no llenar la pantalla
            setResults(filtered.slice(0, 5));
          }
        } catch (error) {
          console.error("Error buscando películas:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]); // Si hay menos de 2 letras, limpiamos
      }
    }, 300); // Espera 300ms después de que dejas de escribir

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Cerrar el buscador al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedDesktop = searchRef.current && searchRef.current.contains(target);
      const clickedMobile = mobileSearchRef.current && mobileSearchRef.current.contains(target);
      
      if (!clickedDesktop && !clickedMobile) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isInicio = pathname === "/inicio";
  const isPeliculas = pathname === "/peliculas";
  const isGeneros = pathname === "/generos";
  const isActividad = pathname === "/miactividad";
  const isCanales = pathname.startsWith("/canales");

  return (
    <>
    <nav className="fixed left-0 top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-white/5 bg-[rgba(11,12,21,0.85)] px-4 backdrop-blur-xl sm:px-5 md:h-20 md:px-10">
      <div className="flex min-w-0 items-center gap-3 md:gap-10">
        <button
          className="flex items-center justify-center rounded-lg border border-white/10 bg-transparent p-2 text-white transition hover:border-[#3a86ff] hover:bg-[rgba(58,134,255,0.10)] hover:text-[#3a86ff] md:hidden"
          aria-label="Menú"
          type="button"
          onClick={() => setOpen((v) => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <Link href="/inicio" className="shrink-0">
          <img src="https://i.ibb.co/Vc4NzxG1/logo-completo.png" alt="StreamHub Logo" className="h-9 drop-shadow-[0_0_10px_rgba(58,134,255,0.45)] sm:h-10 md:h-12" />
        </Link>

        {/* ... Menú de navegación (Inicio, Películas, Favoritos) se mantiene igual ... */}
        <ul className={`fixed left-0 top-[72px] z-40 flex h-[calc(100vh-72px)] w-full flex-col items-center justify-center gap-10 border-t border-white/5 bg-[rgba(11,12,21,0.98)] backdrop-blur-2xl transition-transform duration-300 md:static md:h-auto md:w-auto md:flex-row md:justify-start md:gap-6 md:border-0 md:bg-transparent md:backdrop-blur-0 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <li><Link href="/inicio" className={`text-xl font-semibold transition md:text-base ${isInicio ? "text-white drop-shadow-[0_0_8px_#3a86ff]" : "text-[#aeb4c0] hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff]"}`}>Inicio</Link></li>
          <li><Link href="/peliculas" className={`text-xl font-semibold transition md:text-base ${isPeliculas ? "text-white drop-shadow-[0_0_8px_#3a86ff]" : "text-[#aeb4c0] hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff]"}`}>Películas</Link></li>
          <li><Link href="/generos" className={`text-xl font-semibold transition md:text-base ${isGeneros ? "text-white drop-shadow-[0_0_8px_#3a86ff]" : "text-[#aeb4c0] hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff]"}`}>Géneros</Link></li>
          <li><Link href="/miactividad" className={`text-xl font-semibold transition md:text-base ${isActividad ? "text-white drop-shadow-[0_0_8px_#3a86ff]" : "text-[#aeb4c0] hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff]"}`}>Mi Actividad</Link></li>
          <li><Link href="/canales" className={`text-xl font-semibold transition md:text-base ${isCanales ? "text-white drop-shadow-[0_0_8px_#3a86ff]" : "text-[#aeb4c0] hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff]"}`}>Canales</Link></li>
        </ul>
      </div>

      {/* --- SECCIÓN DEL BUSCADOR (Escritorio) --- */}
      <div className="mx-2 hidden min-w-0 flex-1 justify-center md:flex" ref={searchRef}>
        <div className="relative flex w-full max-w-[400px] items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`pointer-events-none absolute left-4 transition-colors ${searchTerm ? 'text-[#3a86ff]' : 'text-[#aeb4c0]'}`}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>

          <input
            type="text"
            placeholder="Buscar películas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-[#aeb4c0] focus:border-[#3a86ff] focus:bg-white/10 focus:shadow-[0_0_15px_rgba(58,134,255,0.20)]"
          />

          {isSearching && (
            <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-[#3a86ff] border-t-transparent"></div>
          )}

          {results.length > 0 && (
            <div className="absolute left-0 top-[110%] w-full overflow-hidden rounded-xl border border-white/10 bg-[rgba(11,12,21,0.95)] shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              {results.map((movie) => (
                <Link
                  href={`/peliculas/${movie.id}`}
                  key={movie.id}
                  onClick={() => {
                    setSearchTerm("");
                    setResults([]);
                  }}
                  className="flex items-center gap-4 border-b border-white/5 p-3 transition hover:bg-white/10 last:border-0"
                >
                  <img src={movie.rutaCaratula} alt={movie.titulo} className="h-14 w-10 shrink-0 rounded object-cover shadow-sm" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-bold text-white">{movie.titulo}</span>
                    <span className="text-xs text-[#aeb4c0]">{new Date(movie.fechaLanzamiento).getFullYear()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isSearching && searchTerm.length > 1 && results.length === 0 && (
            <div className="absolute left-0 top-[110%] w-full rounded-xl border border-white/10 bg-[rgba(11,12,21,0.95)] p-4 text-center text-sm text-[#aeb4c0] shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              No se encontraron resultados para "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {/* Botón Lupa para Móvil */}
        <button 
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setShowMobileSearch(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (userPlan === "STUDIO") {
              router.push("/studio");
            } else {
              setShowStudioModal(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.05)] py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 sm:pr-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-[0_0_10px_rgba(79,172,254,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0b0c15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          </div>
          <span className="hidden xl:inline">Studio</span>
        </button>

        <Link href="/micuenta" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.05)] py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 sm:pr-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-[0_0_10px_rgba(79,172,254,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0b0c15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span className="hidden xl:inline">Mi cuenta</span>
        </Link>
      </div>

      {/* --- SECCIÓN DEL BUSCADOR (Móvil - Overlay) --- */}
      {showMobileSearch && (
        <div className="absolute inset-0 z-50 flex items-center justify-between gap-3 bg-[rgba(11,12,21,0.98)] px-4 md:hidden" ref={mobileSearchRef}>
          <div className="relative flex w-full items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`pointer-events-none absolute left-4 transition-colors ${searchTerm ? 'text-[#3a86ff]' : 'text-[#aeb4c0]'}`}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar películas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-[#aeb4c0] focus:border-[#3a86ff] focus:bg-white/10 focus:shadow-[0_0_15px_rgba(58,134,255,0.20)]"
            />
            
            {isSearching && (
              <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-[#3a86ff] border-t-transparent"></div>
            )}

            {results.length > 0 && (
              <div className="absolute left-0 top-[110%] w-full overflow-hidden rounded-xl border border-white/10 bg-[rgba(11,12,21,0.95)] shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                {results.map((movie) => (
                  <Link
                    href={`/peliculas/${movie.id}`}
                    key={movie.id}
                    onClick={() => {
                      setSearchTerm("");
                      setResults([]);
                      setShowMobileSearch(false);
                    }}
                    className="flex items-center gap-4 border-b border-white/5 p-3 transition hover:bg-white/10 last:border-0"
                  >
                    <img src={movie.rutaCaratula} alt={movie.titulo} className="h-14 w-10 shrink-0 rounded object-cover shadow-sm" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-bold text-white">{movie.titulo}</span>
                      <span className="text-xs text-[#aeb4c0]">{new Date(movie.fechaLanzamiento).getFullYear()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isSearching && searchTerm.length > 1 && results.length === 0 && (
              <div className="absolute left-0 top-[110%] w-full rounded-xl border border-white/10 bg-[rgba(11,12,21,0.95)] p-4 text-center text-sm text-[#aeb4c0] shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                No se encontraron resultados para "{searchTerm}"
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              setShowMobileSearch(false);
              setSearchTerm("");
              setResults([]);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </nav>

      {/* --- MODAL DE STUDIO --- */}
      {showStudioModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c15] p-6 shadow-2xl">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#00f2fe]/20 blur-[50px]" />
            
            <button 
              onClick={() => setShowStudioModal(false)}
              className="absolute right-4 top-4 text-[#aeb4c0] hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-[0_0_20px_rgba(79,172,254,0.4)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0b0c15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Desbloquea StreamHub Studio</h3>
              <p className="mt-2 text-sm text-[#aeb4c0]">Lleva tu experiencia al siguiente nivel y conviértete en un creador.</p>
            </div>

            <ul className="mb-8 space-y-3">
              {[
                "Sube y monetiza tus propias películas",
                "Accede a métricas avanzadas de tu audiencia",
                "Recibe comisiones directas a tu billetera",
                "Destaca tu contenido en la página principal"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00f2fe]/20 text-[#00f2fe]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>

            <button
              disabled={isUpgrading}
              onClick={async () => {
                setIsUpgrading(true);
                const res = await upgradePlan("STUDIO");
                if (res.success) {
                  setUserPlan("STUDIO");
                  setShowStudioModal(false);
                  router.push("/studio");
                } else {
                  alert(res.error);
                  setIsUpgrading(false);
                }
              }}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] py-3 text-sm font-bold text-[#0b0c15] transition hover:opacity-90 disabled:opacity-50"
            >
              {isUpgrading ? "Actualizando..." : "Mejorar a Plan Studio"}
            </button>
            
            <button
              onClick={() => setShowStudioModal(false)}
              className="mt-3 flex w-full items-center justify-center rounded-xl bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Quizás más tarde
            </button>

            <p className="mt-4 text-center text-xs text-[#aeb4c0]">
              Al mejorar tu plan, aceptas los términos de creadores.
            </p>
          </div>
        </div>
      )}
    </>
  );
}