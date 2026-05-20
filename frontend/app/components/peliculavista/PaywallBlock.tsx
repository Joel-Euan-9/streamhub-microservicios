"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upgradePlan } from "@/app/actions/profile";
import { ShieldAlert, Star, Sparkles, CheckCircle2 } from "lucide-react";

interface PaywallBlockProps {
  movieTitle: string;
}

export default function PaywallBlock({ movieTitle }: PaywallBlockProps) {
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setError(null);
    try {
      const res = await upgradePlan("PREMIUM");
      if (res.success) {
        // Redireccionar o refrescar la página actual para reflejar el cambio de plan y reproducir
        router.refresh();
      } else {
        setError(res.error || "Ocurrió un error al actualizar el plan.");
        setIsUpgrading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
      setIsUpgrading(false);
    }
  };

  return (
    <section className="bg-[#020817] pb-24 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-amber-500 pl-4">
          Contenido Premium Protegido
        </h2>

        <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-[#0c0f24] via-[#090b1c] to-[#04050d] p-8 md:p-12 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col items-center text-center">
          {/* Luces y brillos de fondo */}
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-500/10 blur-[60px]" />
          <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-purple-500/10 blur-[60px]" />

          {/* Icono de Candado / Corona Brillante */}
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse">
            <ShieldAlert size={36} className="text-black" />
            <Sparkles size={20} className="absolute -top-1 -right-1 text-yellow-200 animate-bounce" />
          </div>

          <h3 className="text-3xl font-black text-white tracking-tight md:text-4xl">
            Desbloquea "{movieTitle}"
          </h3>
          <p className="mt-3 text-lg text-amber-200/90 font-medium max-w-xl leading-relaxed">
            Esta película original exclusiva de la plataforma requiere una suscripción Premium activa.
          </p>

          <div className="w-full max-w-md my-8 border-t border-b border-white/10 py-6">
            <h4 className="text-left font-bold text-gray-300 mb-4 uppercase tracking-wider text-xs">
              Ventajas exclusivas al actualizar hoy:
            </h4>
            <ul className="space-y-3.5 text-left">
              {[
                "Acceso al 100% de las producciones originales y estrenos",
                "Reproducción totalmente libre de anuncios en todas las películas",
                "Soporte de streaming en Ultra HD 4K y sonido envolvente",
                "Permite descargas y reproducción en hasta 4 dispositivos en simultáneo"
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-400" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="mb-4 text-sm font-bold text-red-400 bg-red-950/40 border border-red-500/30 px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              disabled={isUpgrading}
              onClick={handleUpgrade}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 py-4 font-bold text-black shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] hover:opacity-95 disabled:opacity-50"
            >
              {isUpgrading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Actualizando a Premium...
                </div>
              ) : (
                "Mejorar a Plan Premium"
              )}
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Suscripción mensual recurrente. Puedes cambiar o cancelar tu plan en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
}
