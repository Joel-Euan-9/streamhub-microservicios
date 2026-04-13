export default function DevicesSection() {
  return (
    <section className="px-10 py-20 text-center border-b border-white/5" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <h2 className="text-4xl font-bold mb-4">Cuando y donde quieras</h2>
      <p className="text-xl mb-16" style={{ color: 'var(--text-gray)' }}>Disfruta tus favoritos en cualquier momento y lugar.</p>

      <div className="relative max-w-[900px] h-[450px] mx-auto flex justify-center items-end">

        {/* TV Mockup */}
        <div className="absolute top-0 w-[600px] h-[360px] rounded-lg z-[1] overflow-hidden"
          style={{ background: '#111', border: '4px solid #222', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
          <div className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: "url('/assets/posters/avengerseradeultron.webp')" }}>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-3xl font-bold tracking-[2px] drop-shadow-lg">STREAMHUB TV</span>
            </div>
          </div>
          {/* Stand */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#333]" />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-1 bg-[#444]" />
        </div>

        {/* Laptop Mockup */}
        <div className="absolute w-[320px] h-[210px] rounded-t-lg z-[2] bottom-5 left-[10%]"
          style={{ background: '#1a1a1a', border: '3px solid #333', boxShadow: '-10px 10px 30px rgba(0,0,0,0.8)' }}>
          <div className="w-full h-full bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: "url('/assets/posters/jurassicworld2.webp')" }} />
          <div className="absolute -bottom-2.5 -left-5 w-[360px] h-2.5 bg-[#555] rounded-b-lg" />
        </div>

        {/* Phone Mockup */}
        <div className="absolute w-[120px] h-[240px] rounded-2xl z-[3] bottom-0 right-[15%] flex flex-col items-center pt-2 pb-5 px-1"
          style={{ background: '#000', border: '4px solid #333', boxShadow: '10px 10px 30px rgba(0,0,0,0.8)' }}>
          <div className="w-full flex-1 bg-cover bg-center rounded"
            style={{ backgroundImage: "url('/assets/posters/coco.webp')" }} />
          <div className="w-8 h-1 bg-[#222] rounded mt-2" />
        </div>
      </div>
    </section>
  )
}