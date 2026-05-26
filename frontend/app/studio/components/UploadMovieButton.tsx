"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { uploadStudioMovieAction } from "@/app/actions/studio";

export default function UploadMovieButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaLanzamiento: "",
    duracion: "",
    generos: [] as string[],
    rutaCaratula: "",
    rutaImagenFondo: "",
    rutaVideo: "",
    rutaTrailer: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenresChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map(opt => opt.value);
    setFormData(prev => ({ ...prev, generos: values }));
  };

  const handleSubmit = async () => {
    if (!formData.titulo) {
      alert("El título es requerido");
      return;
    }
    
    setIsSubmitting(true);
    const res = await uploadStudioMovieAction(formData);
    setIsSubmitting(false);
    
    if (res.success) {
      alert("Película subida exitosamente");
      setIsOpen(false);
      // Reset form
      setFormData({
        titulo: "",
        descripcion: "",
        fechaLanzamiento: "",
        duracion: "",
        generos: [],
        rutaCaratula: "",
        rutaImagenFondo: "",
        rutaVideo: "",
        rutaTrailer: ""
      });
    } else {
      alert(res.error || "Error al subir la película");
    }
  };

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
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
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
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
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
                      name="fechaLanzamiento"
                      value={formData.fechaLanzamiento}
                      onChange={handleInputChange}
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
                      name="duracion"
                      value={formData.duracion}
                      onChange={handleInputChange}
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
                    value={formData.generos}
                    onChange={handleGenresChange}
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] p-2 text-white outline-none transition focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                    size={4}
                  >
                    <option value="Acción" className="rounded p-2 hover:bg-[#00f2fe]/20">Acción</option>
                    <option value="Animación" className="rounded p-2 hover:bg-[#00f2fe]/20">Animación</option>
                    <option value="Aventura" className="rounded p-2 hover:bg-[#00f2fe]/20">Aventura</option>
                    <option value="Ciencia Ficción" className="rounded p-2 hover:bg-[#00f2fe]/20">Ciencia Ficción</option>
                    <option value="Comedia" className="rounded p-2 hover:bg-[#00f2fe]/20">Comedia</option>
                    <option value="Drama" className="rounded p-2 hover:bg-[#00f2fe]/20">Drama</option>
                    <option value="Terror" className="rounded p-2 hover:bg-[#00f2fe]/20">Terror</option>
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
                    name="rutaCaratula"
                    value={formData.rutaCaratula}
                    onChange={handleInputChange}
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
                    name="rutaImagenFondo"
                    value={formData.rutaImagenFondo}
                    onChange={handleInputChange}
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
                    name="rutaVideo"
                    value={formData.rutaVideo}
                    onChange={handleInputChange}
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
                    name="rutaTrailer"
                    value={formData.rutaTrailer}
                    onChange={handleInputChange}
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-[#3a86ff] px-6 py-2.5 font-bold text-white shadow-[0_0_15px_rgba(58,134,255,0.4)] transition hover:bg-[#2563eb] disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Guardar Película"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
