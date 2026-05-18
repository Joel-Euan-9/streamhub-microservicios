import { DollarSign, Eye, Film, Bell, CheckCircle2, TrendingUp, BarChart2 } from "lucide-react";
import UploadMovieButton from "./components/UploadMovieButton";

export default function StudioResumenPage() {
  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8 mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Resumen
          </h1>
          <p className="mt-1 text-[#aeb4c0]">
            Un vistazo rápido al rendimiento de tu contenido.
          </p>
        </div>
        <UploadMovieButton />
      </div>

      {/* STATS CARDS */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Ganancias */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#3a86ff]/20 blur-[30px]" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3a86ff]/20 text-[#3a86ff]">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#aeb4c0]">Ganancias Estimadas (Mes)</p>
              <h3 className="text-2xl font-bold text-white">$450.00 <span className="text-xs font-normal text-green-400 ml-1">+12%</span></h3>
            </div>
          </div>
        </div>

        {/* Vistas */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#00f2fe]/20 blur-[30px]" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00f2fe]/20 text-[#00f2fe]">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#aeb4c0]">Vistas Totales (30 días)</p>
              <h3 className="text-2xl font-bold text-white">12,540 <span className="text-xs font-normal text-green-400 ml-1">+5.2%</span></h3>
            </div>
          </div>
        </div>

        {/* Películas Activas */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 sm:col-span-2 lg:col-span-1">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#f97316]/20 blur-[30px]" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f97316]/20 text-[#f97316]">
              <Film size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#aeb4c0]">Películas Activas</p>
              <h3 className="text-2xl font-bold text-white">4</h3>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICACIONES Y ACTIVIDAD RECIENTE */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notificaciones */}
        <div className="rounded-2xl border border-white/10 bg-[#0b0c15] p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <Bell className="text-[#aeb4c0]" size={20} />
            <h2 className="text-lg font-bold text-white">Notificaciones</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl bg-white/5 p-4">
              <CheckCircle2 className="mt-0.5 shrink-0 text-green-400" size={18} />
              <div>
                <p className="text-sm font-medium text-white">Tu película "Hotel Transilvania 3" fue aprobada.</p>
                <p className="mt-1 text-xs text-[#aeb4c0]">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white/5 p-4">
              <DollarSign className="mt-0.5 shrink-0 text-[#00f2fe]" size={18} />
              <div>
                <p className="text-sm font-medium text-white">Has recibido un pago de comisiones ($150.00).</p>
                <p className="mt-1 text-xs text-[#aeb4c0]">Ayer</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white/5 p-4">
              <TrendingUp className="mt-0.5 shrink-0 text-[#3a86ff]" size={18} />
              <div>
                <p className="text-sm font-medium text-white">"Coco" está en tendencia en tu región.</p>
                <p className="mt-1 text-xs text-[#aeb4c0]">Hace 2 días</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acceso Rápido / Espacio para futuras gráficas */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 flex flex-col justify-center items-center text-center">
          <BarChart2 size={48} className="text-white/20 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Más estadísticas próximamente</h3>
          <p className="text-sm text-[#aeb4c0] max-w-xs">
            Estamos trabajando para traerte gráficas detalladas de retención, clics y rendimiento geográfico de tus películas.
          </p>
        </div>
      </div>

    </div>
  );
}
