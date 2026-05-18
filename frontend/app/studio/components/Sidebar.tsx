"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Film, 
  DollarSign, 
  BarChart2, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu,
  X
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Resumen", href: "/studio", icon: LayoutDashboard },
  { name: "Mis Películas", href: "/studio/peliculas", icon: Film },
  { name: "Ingresos ($)", href: "/studio/ingresos", icon: DollarSign },
  { name: "Estadísticas", href: "/studio/estadisticas", icon: BarChart2 },
  { name: "Feedback", href: "/studio/feedback", icon: MessageSquare },
  { name: "Configuración", href: "/studio/configuracion", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* HEADER MÓVIL (Solo visible en pantallas pequeñas) */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0b0c15] px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-[0_0_10px_rgba(79,172,254,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b0c15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          </div>
          <span className="text-lg font-bold text-white">Mi Studio</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-md p-2 text-[#aeb4c0] hover:bg-white/5 hover:text-white"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY MÓVIL */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR PRINCIPAL */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-[#0b0c15] transition-all duration-300 md:static ${
          isExpanded ? "w-64" : "w-20"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Header del Sidebar (Logo y Botón) */}
        <div className="hidden h-20 items-center justify-between border-b border-white/5 px-4 md:flex">
          <div className={`flex items-center transition-all duration-300 overflow-hidden ${isExpanded ? "w-32 opacity-100" : "w-0 opacity-0"}`}>
            <img src="https://i.ibb.co/Vc4NzxG1/logo-completo.png" alt="StreamHub" className="h-8 shrink-0 object-contain" />
          </div>
          
          {/* Cuando está colapsado, mostramos una versión recortada del logo como icono que sirve de botón */}
          {!isExpanded && (
            <button 
              onClick={() => setIsExpanded(true)}
              className="absolute left-4 w-8 h-8 overflow-hidden rounded-md cursor-pointer transition-transform hover:scale-105"
            >
               <img src="https://i.ibb.co/Vc4NzxG1/logo-completo.png" alt="ST" className="absolute left-0 top-0 h-8 max-w-none object-cover object-left pointer-events-none" />
            </button>
          )}

          {/* El botón hamburguesa solo se muestra si está expandido (en escritorio) */}
          {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#aeb4c0] transition hover:bg-white/5 hover:text-white z-10"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Enlaces de navegación */}
        <nav className="flex-1 space-y-2 p-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                  isActive 
                    ? "bg-[#3a86ff]/10 text-[#3a86ff]" 
                    : "text-[#aeb4c0] hover:bg-white/5 hover:text-white"
                }`}
                title={!isExpanded ? item.name : undefined}
              >
                <item.icon size={20} className="shrink-0" />
                <span className={`whitespace-nowrap font-medium transition-opacity duration-200 ${
                  isExpanded ? "opacity-100" : "opacity-0 hidden md:block"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer del Sidebar (Regresar) */}
        <div className="border-t border-white/5 p-3">
          <Link
            href="/inicio"
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-[#aeb4c0] transition-colors hover:bg-white/5 hover:text-white"
            title={!isExpanded ? "Regresar a StreamHub" : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`whitespace-nowrap font-medium transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0 hidden md:block"
            }`}>
              Regresar a StreamHub
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
