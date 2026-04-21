'use client'

import { useState } from 'react'
import { Menu, X, Search, User } from 'lucide-react' // Usaremos lucide para los iconos
import { logout } from '../actions/auth' // Importamos la función de logout

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  
  const menuItems = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Estrenos', id: 'estrenos' },
    { name: 'Plataformas', id: 'plataformas' },
    { name: 'Suscripciones', id: 'suscripciones' },
    { name: 'Beneficios', id: 'beneficios' },
    { name: 'Ayuda', id: 'ayuda' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false); // Cerramos el menú al hacer clic en un item
    const element = document.getElementById(id);
    if (element) {
      const offset = 70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="principal-navbar fixed top-0 left-0 w-full h-[70px] flex items-center justify-between px-6 md:px-10 z-[1000] border-b border-white/5"
      style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)' }}>

      {/* Left side */}
      <div className="flex items-center gap-4 md:gap-10">
        {/* Botón Sandwichito (Solo móvil) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <a href="/principal" className="flex items-center">
          <img src="https://i.ibb.co/Vc4NzxG1/logo-completo.png" alt="StreamHub Logo" className="h-[40px] md:h-[50px] drop-shadow-[0_0_10px_rgba(58,134,255,0.5)]" />
        </a>
        
        {/* Menú Desktop */}
        <ul className="hidden md:flex gap-6">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`} 
                onClick={(e) => handleScroll(e, item.id)}
                className="font-semibold text-[var(--text-gray)] hover:text-white transition-all cursor-pointer"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 md:gap-6">
        <button className="cursor-pointer hover:scale-110 transition-transform">
          <Search size={20} color="white" />
        </button>

        <a href="/login" className="hover:scale-110 transition-transform">
          <User size={24} color="white" />
        </a>

        <a 
          href="#suscripciones"
          onClick={(e) => handleScroll(e, 'suscripciones')}
          className="hidden sm:block px-5 py-2 rounded text-sm font-bold text-white transition-all shadow-[0_0_15px_rgba(0,140,204,0.3)]"
          style={{ backgroundColor: '#008ccc' }}>
          Suscribirse
        </a>
        
      </div>

      {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
      <div className={`absolute top-[70px] left-0 w-full bg-[#0b0c15] border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden md:hidden ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <ul className="flex flex-col p-6 gap-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`} 
                onClick={(e) => handleScroll(e, item.id)}
                className="block text-lg font-medium text-gray-300 hover:text-[#3a86ff]"
              >
                {item.name}
              </a>
            </li>
          ))}
          <li className="mt-2 sm:hidden">
            <a 
              href="#suscripciones"
              onClick={(e) => handleScroll(e, 'suscripciones')}
              className="block text-center p-3 rounded-md font-bold bg-[#008ccc] text-white"
            >
              Suscribirse a StreamHub
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}