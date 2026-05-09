"use client";

import { useState } from 'react';
import { clearHistorialAction } from '@/app/actions/historial';

export default function LimpiarHistorialBoton() {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClear = async () => {
    setIsDeleting(true);
    const res = await clearHistorialAction();
    if (res.success) {
      window.location.reload();
    } else {
      setIsDeleting(false);
      setShowModal(false);
      alert(res.error || "Error al limpiar historial");
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="hidden sm:flex items-center gap-1.5 text-xs text-[#aeb4c0] hover:text-red-400 transition border border-white/10 hover:border-red-500/30 rounded-full px-3 py-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
        </svg>
        Limpiar historial
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#11131f] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">¿Estás seguro?</h3>
            <p className="text-sm text-gray-400 mb-6">Esta acción es irreversible y eliminará todo tu historial de visualización. ¿Deseas continuar?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleClear}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? "Borrando..." : "Aceptar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
