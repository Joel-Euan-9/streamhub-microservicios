import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions/profile";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Studio | StreamHub",
  description: "Panel de creador de StreamHub Studio",
};

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();

  // Guardia de seguridad: Si no hay perfil o no es STUDIO, redirigir
  if (!profile || profile.plan !== "STUDIO") {
    redirect("/inicio");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0c15] text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
