export default function Navbar() {
  return (
    <nav className="principal-navbar fixed top-0 left-0 w-full h-[70px] flex items-center justify-between px-10 z-[1000] border-b border-white/5"
      style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)' }}>

      {/* Left */}
      <div className="flex items-center gap-10">
        <a href="/principal" className="flex items-center">
          <img src="/assets/logo3.png" alt="StreamHub Logo" className="h-[50px] drop-shadow-[0_0_10px_rgba(58,134,255,0.5)]" />
        </a>
        <ul className="hidden md:flex gap-6">
          {['Inicio', 'Películas', 'Géneros', 'Deportes', 'TV en directo', 'Suscripciones'].map((item) => (
            <li key={item}>
              <a href="#" className="font-semibold text-[var(--text-gray)] hover:text-white hover:drop-shadow-[0_0_8px_var(--primary-blue)] transition-all">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search icon */}
        <div className="cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* User icon */}
        <a href="/login" className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </a>

        {/* Subscribe button */}
        <a href="/register"
          className="hidden sm:block px-4 py-2 rounded text-sm font-bold text-white transition-colors hover:bg-[var(--accent-cyan)] hover:text-[var(--bg-dark)]"
          style={{ backgroundColor: '#0a6165' }}>
          Suscribirse a StreamHub
        </a>
      </div>
    </nav>
  )
}