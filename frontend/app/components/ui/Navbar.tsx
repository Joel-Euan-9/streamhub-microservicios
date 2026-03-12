"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <Link href="/inicio" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo3.png"
            alt="StreamHub Logo"
            className="h-9 drop-shadow-[0_0_10px_rgba(58,134,255,0.45)] sm:h-10 md:h-12"
          />
        </Link>

        <ul
          className={`fixed left-0 top-[72px] z-40 flex h-[calc(100vh-72px)] w-full flex-col items-center justify-center gap-10 border-t border-white/5 bg-[rgba(11,12,21,0.98)] backdrop-blur-2xl transition-transform duration-300 md:static md:h-auto md:w-auto md:flex-row md:justify-start md:gap-6 md:border-0 md:bg-transparent md:backdrop-blur-0 ${
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <li>
            <Link
              href="/inicio"
              className={`text-xl font-semibold transition md:text-base ${
                isInicio
                  ? "text-white drop-shadow-[0_0_8px_#3a86ff]"
                  : "text-[#aeb4c0] hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff]"
              }`}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/peliculas"
              className={`text-xl font-semibold transition md:text-base ${
                isPeliculas
                  ? "text-white drop-shadow-[0_0_8px_#3a86ff]"
                  : "text-[#aeb4c0] hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff]"
              }`}
            >
              Películas
            </Link>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-xl font-semibold text-[#aeb4c0] transition hover:text-white hover:drop-shadow-[0_0_8px_#3a86ff] md:text-base"
            >
              Series
            </a>
          </li>
        </ul>
      </div>

      <div className="mx-2 hidden min-w-0 flex-1 justify-center md:flex">
        <div className="relative flex w-full max-w-[400px] items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-4 text-[#aeb4c0]"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>

          <input
            type="text"
            placeholder="Buscar..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-[#aeb4c0] focus:border-[#3a86ff] focus:bg-white/10 focus:shadow-[0_0_15px_rgba(58,134,255,0.20)]"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-full bg-[#3a86ff] px-3 py-2 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(58,134,255,0.35)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[#3a86ff] sm:px-4"
        >
          <svg
            className="h-[18px] w-[18px] shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="hidden sm:inline">Iniciar sesión</span>
        </Link>
      </div>
    </nav>
  );
}