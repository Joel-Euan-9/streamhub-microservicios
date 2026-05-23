import { getCanalesAction } from "@/app/actions/studio";
import Navbar from "@/app/components/ui/Navbar";
import CanalesListClient from "./CanalesListClient";

export default async function CanalesPage() {
  const canales = await getCanalesAction();

  return (
    <div className="min-h-screen bg-[#0b0c15] pb-20">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-20 md:pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Descubre Canales
          </h1>
          <p className="mt-2 text-[#aeb4c0]">
            Explora creadores de contenido independientes y sus catálogos exclusivos.
          </p>
        </div>

        <CanalesListClient inicialCanales={canales} />
      </div>
    </div>
  );
}
