import Navbar from "../components/ui/Navbar";
import { logout } from "../actions/auth";

export default function MiCuentaPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0b0c15] px-5 pb-20 pt-28 text-white md:px-10">
        <div className="mx-auto max-w-6xl">
          {/* Encabezado */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Gestión de Cuenta</h1>
            <p className="mt-2 text-[#aeb4c0]">Administra tu información personal y seguridad</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Columna Izquierda: Perfil del Usuario */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-white/5 bg-[#161824] p-8 shadow-xl">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-[0_0_20px_rgba(79,172,254,0.3)]">
                    <span className="text-6xl font-bold text-[#0b0c15]">J</span>
                  </div>
                  
                  <h2 className="mt-6 text-2xl font-bold">Joel Usuario</h2>
                  <span className="mt-2 rounded-full bg-[#ffb703] px-3 py-1 text-xs font-bold tracking-wider text-[#0b0c15]">
                    PREMIUM
                  </span>
                </div>

                <div className="my-8 h-[1px] w-full bg-white/10"></div>

                {/* Información Personal */}
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-[#aeb4c0]">Nombre de Usuario</p>
                    <p className="mt-1 font-medium text-white">joele_streamhub</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#aeb4c0]">Correo Electrónico</p>
                    <p className="mt-1 font-medium text-white">joel@example.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#aeb4c0]">Miembro desde</p>
                    <p className="mt-1 font-medium text-white">Enero 2026</p>
                  </div>
                </div>

                {/* Botón de Cerrar Sesión en la vista */}
                <div className="mt-10">
                  <form action={logout}>
                    <button 
                      type="submit" 
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                      Cerrar Sesión
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Ajustes */}
            <div className="flex flex-col gap-8 lg:col-span-8">
              
              {/* Tarjeta de Seguridad */}
              <div className="rounded-2xl border border-white/5 bg-[#161824] p-8 shadow-xl">
                <h3 className="text-xl font-bold text-[#3a86ff]">Seguridad</h3>
                <div className="my-5 h-[1px] w-full bg-white/10"></div>
                
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm text-[#aeb4c0]">Contraseña Actual</label>
                    <input 
                      type="password" 
                      value="........" 
                      disabled 
                      className="w-full max-w-md rounded-lg border border-white/10 bg-[rgba(11,12,21,0.5)] px-4 py-3 text-white focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <button className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Suscripción / Plan */}
              <div className="rounded-2xl border border-white/5 bg-[#161824] p-8 shadow-xl">
                <h3 className="text-xl font-bold text-[#3a86ff]">Suscripción y Planes</h3>
                <div className="my-5 h-[1px] w-full bg-white/10"></div>
                
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-[#aeb4c0]">Plan Actual</p>
                    <p className="text-lg font-bold text-white">StreamHub Premium</p>
                    <p className="text-sm text-green-400">Activo</p>
                  </div>
                  
                  <div>
                    <button className="rounded-full bg-[#3a86ff] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(58,134,255,0.35)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[#3a86ff]">
                      Cambiar Plan
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 rounded-xl border border-white/5 bg-[rgba(11,12,21,0.5)] p-5">
                  <h4 className="mb-3 font-semibold text-white">Beneficios de tu plan:</h4>
                  <ul className="space-y-2 text-sm text-[#aeb4c0]">
                    <li className="flex items-center gap-2">
                      <svg className="text-green-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Películas ilimitadas al mes
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="text-green-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Resolución 4K HDR
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="text-green-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Sin anuncios
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
