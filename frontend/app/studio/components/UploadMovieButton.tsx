"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function UploadMovieButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] px-6 py-2.5 font-bold text-[#0b0c15] shadow-[0_0_15px_rgba(79,172,254,0.4)] transition hover:scale-105 hover:shadow-[0_0_25px_rgba(79,172,254,0.6)]"
      >
        <span className="text-xl leading-none">+</span> Subir Película
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121826] shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white">Subir Nueva Película</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-[#aeb4c0] transition hover:bg-white/5 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-6">
                
                {/* Nombre */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Nombre de la película
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej: Matrix" 
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Descripción
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Sinopsis de la película..." 
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                  ></textarea>
                </div>

                {/* Fecha y Duración */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                      Fecha de lanzamiento
                    </label>
                    <input 
                      type="date" 
                      className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                      Duración (minutos)
                    </label>
                    <input 
                      type="number" 
                      placeholder="Ej: 120"
                      className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                    />
                  </div>
                </div>

                {/* Géneros */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Géneros
                  </label>
                  <select 
                    multiple
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] p-2 text-white outline-none transition focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                    size={4}
                  >
                    <option value="accion" className="rounded p-2 hover:bg-[#00f2fe]/20">Acción</option>
                    <option value="animacion" className="rounded p-2 hover:bg-[#00f2fe]/20">Animación</option>
                    <option value="aventura" className="rounded p-2 hover:bg-[#00f2fe]/20">Aventura</option>
                    <option value="ciencia_ficcion" className="rounded p-2 hover:bg-[#00f2fe]/20">Ciencia Ficción</option>
                    <option value="comedia" className="rounded p-2 hover:bg-[#00f2fe]/20">Comedia</option>
                    <option value="drama" className="rounded p-2 hover:bg-[#00f2fe]/20">Drama</option>
                    <option value="terror" className="rounded p-2 hover:bg-[#00f2fe]/20">Terror</option>
                  </select>
                  <p className="mt-2 text-xs text-[#aeb4c0]">Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar varios</p>
                </div>

                {/* Links */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Link de imagen de carátula
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Link de imagen de fondo
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Link de la película (Video)
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Link del tráiler
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                  />
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 border-t border-white/10 bg-[#0b0c15] p-6">
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-bold text-white transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert("Película guardada exitosamente (Solo UI de momento)");
                  setIsOpen(false);
                }}
                className="rounded-xl bg-[#3a86ff] px-6 py-2.5 font-bold text-white shadow-[0_0_15px_rgba(58,134,255,0.4)] transition hover:bg-[#2563eb]"
              >
                Guardar Película
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
