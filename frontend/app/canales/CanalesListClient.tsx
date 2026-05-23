"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Tv, Search } from "lucide-react";

export default function CanalesListClient({ inicialCanales }: { inicialCanales: any[] }) {
  const [query, setQuery] = useState("");

  const canalesFiltrados = inicialCanales.filter((canal) =>
    canal.nombreCanal.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Buscador de Canales */}
      <div className="mb-10 relative max-w-xl mx-auto md:mx-0">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-[#aeb4c0]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar canales por nombre..."
          className="w-full bg-[#121826] border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-[#aeb4c0] focus:outline-none focus:border-[#3a86ff] transition-colors"
        />
      </div>

      {inicialCanales.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0b0c15] py-20 text-center shadow-xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-[#aeb4c0]">
            <Tv size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">Aún no hay canales disponibles</h2>
          <p className="mt-2 text-[#aeb4c0] max-w-md">
            Sé el primero en crear tu propio canal de StreamHub Studio y comparte tus películas con el mundo.
          </p>
          <Link href="/studio" className="mt-6 inline-flex rounded-full bg-[#3a86ff] px-6 py-2.5 font-bold text-white transition hover:bg-[#00f2fe] hover:text-[#0b0c15]">
            Crear mi Canal
          </Link>
        </div>
      ) : canalesFiltrados.length === 0 ? (
        <div className="py-20 text-center text-[#aeb4c0]">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white">No se encontraron canales</h2>
          <p className="mt-2">No hay ningún canal que coincida con "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {canalesFiltrados.map((canal: any) => (
            <Link 
              key={canal.id} 
              href={`/canales/${canal.id}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c15] transition-all hover:scale-[1.02] hover:border-[#3a86ff] hover:shadow-[0_10px_30px_rgba(58,134,255,0.2)]"
            >
              {/* Banner */}
              <div className="h-28 w-full bg-[#121826] relative overflow-hidden">
                {canal.fotoPortadaUrl ? (
                  <img src={canal.fotoPortadaUrl} alt="Banner" className="h-full w-full object-cover transition duration-700 group-hover:scale-110 opacity-80" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#121826] to-[#0b0c15]"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c15] to-transparent"></div>
              </div>

              {/* Avatar y Contenido */}
              <div className="relative px-5 pb-5 -mt-10 flex flex-col items-center">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-[#0b0c15] bg-[#121826] shadow-lg">
                  {canal.fotoPerfilUrl ? (
                    <img src={canal.fotoPerfilUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#aeb4c0]">
                      <User size={32} />
                    </div>
                  )}
                </div>
                
                <h3 className="mt-3 text-lg font-bold text-white text-center line-clamp-1 group-hover:text-[#00f2fe] transition-colors">
                  {canal.nombreCanal}
                </h3>
                <p className="mt-1 text-sm text-[#aeb4c0] text-center line-clamp-2">
                  {canal.descripcion || "Sin descripción"}
                </p>

                <div className="mt-5 w-full rounded-xl bg-white/5 py-2 text-center text-xs font-semibold text-[#00f2fe] transition group-hover:bg-[#3a86ff] group-hover:text-white">
                  Ver Perfil
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
