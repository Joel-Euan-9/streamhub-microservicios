"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalFooter() {
  const pathname = usePathname();

  // No mostrar en las vistas de login o registro
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="w-full bg-[#0b0c15] border-t border-white/5 py-12 px-6 md:px-10 text-[#aeb4c0] text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Columna 1: Logo y descripción */}
        <div className="flex flex-col gap-4">
          <Link href="/inicio" className="shrink-0">
            <img src="https://i.ibb.co/Vc4NzxG1/logo-completo.png" alt="StreamHub Logo" className="h-8 mb-2" />
          </Link>
          <p className="leading-relaxed text-xs">
            La mejor plataforma de streaming para ver tus películas y series favoritas en alta calidad.
          </p>
        </div>

        {/* Columna 2: Navegación */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Navegación</h3>
          <Link href="/inicio" className="hover:text-white transition">Inicio</Link>
          <Link href="/peliculas" className="hover:text-white transition">Películas</Link>
          <Link href="#" className="hover:text-white transition">Series</Link>
          <Link href="#" className="hover:text-white transition">Novedades</Link>
        </div>

        {/* Columna 3: Legal */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Legal</h3>
          <Link href="#" className="hover:text-white transition">Términos de uso</Link>
          <Link href="#" className="hover:text-white transition">Política de privacidad</Link>
          <Link href="#" className="hover:text-white transition">Cookies</Link>
          <Link href="#" className="hover:text-white transition">Ayuda</Link>
        </div>

        {/* Columna 4: Síguenos */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-semibold text-base mb-1">Síguenos</h3>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2024 StreamHub. Todos los derechos reservados.</p>
        <p>Hecho con <span className="text-[#3a86ff]">♥</span> para los amantes del cine.</p>
      </div>
    </footer>
  );
}
