import { DollarSign, Eye, Film, Bell, CheckCircle2, TrendingUp, BarChart2, MessageSquare } from "lucide-react";
import UploadMovieButton from "./components/UploadMovieButton";
import { getStudioSummaryAction, getStudioNotificationsAction } from "@/app/actions/studio";

export default async function StudioResumenPage() {
  const summaryRes = await getStudioSummaryAction();
  const summary = summaryRes.success && summaryRes.data ? summaryRes.data : { earnings: 0, totalViews: 0, activeMovies: 0 };

  const notificationsRes = await getStudioNotificationsAction();
  const notifications = notificationsRes.success && notificationsRes.notifications ? notificationsRes.notifications : [];

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
              <h3 className="text-2xl font-bold text-white">${summary.earnings.toFixed(2)} MXN</h3>
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
              <p className="text-sm font-medium text-[#aeb4c0]">Vistas Totales</p>
              <h3 className="text-2xl font-bold text-white">{summary.totalViews.toLocaleString()}</h3>
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
              <h3 className="text-2xl font-bold text-white">{summary.activeMovies}</h3>
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
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="text-white/20 mb-2" size={32} />
                <p className="text-sm text-[#aeb4c0]">No tienes notificaciones recientes.</p>
              </div>
            ) : (
              notifications.map((notif: any) => {
                let Icon = Bell;
                let colorClass = "text-[#aeb4c0] bg-white/5";
                
                if (notif.type === 'commission') {
                  Icon = DollarSign;
                  colorClass = "text-[#00f2fe] bg-[#00f2fe]/10";
                } else if (notif.type === 'withdrawal') {
                  Icon = CheckCircle2;
                  colorClass = "text-red-400 bg-red-400/10";
                } else if (notif.type === 'comment') {
                  Icon = MessageSquare;
                  colorClass = "text-[#3a86ff] bg-[#3a86ff]/10";
                }

                return (
                  <div key={notif.id} className="flex items-start gap-4 rounded-xl bg-white/5 p-4 border border-white/5 transition hover:bg-white/10">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white leading-normal break-words">{notif.description}</p>
                      <p className="mt-1 text-xs text-[#aeb4c0]">{notif.timeAgo}</p>
                    </div>
                  </div>
                );
              })
            )}
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
