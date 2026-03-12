

export default function Footer() {
  return (
    <footer className="flex flex-col items-center text-center px-5 py-12" style={{ backgroundColor: '#151f2e' }}>
      <div className="mb-6">
        <img src="/assets/logo3.png" alt="StreamHub Logo" className="h-9 opacity-90" />
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-5">
        {['Términos y Aviso de privacidad', 'Envíanos tus comentarios', 'Ayuda'].map((link) => (
          <a key={link} href="#" className="text-base font-semibold transition-colors hover:text-white" style={{ color: 'var(--primary-blue)' }}>
            {link}
          </a>
        ))}
      </div>

      <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
        &copy; 1996-2026, StreamHub, Inc. o sus filiales
      </p>
    </footer>
  )
}