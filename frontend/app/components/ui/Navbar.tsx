"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Definimos lo que necesitamos de la película para el buscador
interface SearchResult {
  id: string;
  titulo: string;
  rutaCaratula: string;
  fechaLanzamiento: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  // --- NUEVOS ESTADOS PARA EL BUSCADOR ---
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Ref para detectar clics fuera del buscador y cerrarlo
  const searchRef = useRef<HTMLDivElement>(null);

  // Cierra el menú móvil y limpia el buscador cuando cambias de página
  useEffect(() => {
    setOpen(false);
    setSearchTerm("");
    setResults([]);
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isInicio = pathname === "/inicio";
  const isPeliculas = pathname === "/peliculas";

  return (
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
          <li><a href="#" onClick={(e) => e.preventDefault()} className="text-xl font-semibold text-[#aeb4c0] transition hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff] md:text-base">Favoritos</a></li>
        </ul>
      </div>

      {/* --- SECCIÓN DEL BUSCADOR --- */}
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

          {/* Animación de carga opcional */}
          {isSearching && (
            <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-[#3a86ff] border-t-transparent"></div>
          )}

          {/* MENÚ DESPLEGABLE DE RESULTADOS */}
          {results.length > 0 && (
            <div className="absolute left-0 top-[110%] w-full overflow-hidden rounded-xl border border-white/10 bg-[rgba(11,12,21,0.95)] shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              {results.map((movie) => (
                <Link
                  href={`/peliculas/${movie.id}`}
                  key={movie.id}
                  onClick={() => {
                    setSearchTerm(""); // Limpia el buscador al hacer clic
                    setResults([]);
                  }}
                  className="flex items-center gap-4 border-b border-white/5 p-3 transition hover:bg-white/10 last:border-0"
                >
                  <img
                    src={movie.rutaCaratula}
                    alt={movie.titulo}
                    className="h-14 w-10 shrink-0 rounded object-cover shadow-sm"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-bold text-white">{movie.titulo}</span>
                    <span className="text-xs text-[#aeb4c0]">{new Date(movie.fechaLanzamiento).getFullYear()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Mensaje de no encontrado */}
          {!isSearching && searchTerm.length > 1 && results.length === 0 && (
            <div className="absolute left-0 top-[110%] w-full rounded-xl border border-white/10 bg-[rgba(11,12,21,0.95)] p-4 text-center text-sm text-[#aeb4c0] shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              No se encontraron resultados para "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#3a86ff] px-3 py-2 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(58,134,255,0.35)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[#3a86ff] sm:px-4">
          <svg className="h-[18px] w-[18px] shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>
          <span className="hidden sm:inline">Iniciar sesión</span>
        </Link>
      </div>
    </nav>
  );
}