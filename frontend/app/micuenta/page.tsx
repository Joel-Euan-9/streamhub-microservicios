import Navbar from "../components/ui/Navbar";
import MiCuentaClient from "../components/micuenta/MiCuentaClient";
import { fetchWithAuth } from "@/lib/api";

async function getUserProfile() {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil", {
      cache: "no-store"
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return null;
  }
}

export default async function MiCuentaPage() {
  const user = await getUserProfile();

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0b0c15] px-5 pb-20 pt-28 text-white flex items-center justify-center">
          <p className="text-xl">No se pudo cargar el perfil del usuario. Por favor intenta iniciar sesión nuevamente.</p>
        </main>
      </>
    );
  }

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

          <MiCuentaClient user={user} />
        </div>
      </main>
    </>
  );
}
