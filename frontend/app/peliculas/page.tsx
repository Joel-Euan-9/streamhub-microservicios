import Navbar from "../components/ui/Navbar";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/api";
import { Star } from "lucide-react";
import { getUserProfile } from "@/app/actions/profile";

// 1. Definimos las interfaces de lo que nos devuelve el Gateway
interface Genero {
  id: number;
  nombre: string;
}

interface Pelicula {
  id: string;
  titulo: string;
  descripcion: string;
  fechaLanzamiento: string; 
  duracion: number;
  rutaCaratula: string;
  rutaVideo: string;
  rutaImagenFondo: string;
  rutaTrailer: string;
  generos?: Genero[]; // Opcional por si alguna peli no tiene género aún
  requierePremium?: boolean; // Campo que indica si es premium
}

// 2. Función para obtener los datos desde TU GATEWAY
async function getPeliculas(): Promise<Pelicula[]> {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/peliculas");

    if (!res.ok) return [];

    return res.json();
  } catch (error) {
    console.error("Error de conexión con el Gateway:", error);
    return [];
  }
}

export default async function PeliculasPage() {
  const peliculas = await getPeliculas();
  const userProfile = await getUserProfile();

  // 3. Lógica para agrupar películas por orden alfabético
  const peliculasAgrupadas = peliculas.reduce((grupos: Record<string, Pelicula[]>, pelicula) => {
    const letraInicial = pelicula.titulo.charAt(0).toUpperCase();
    
    if (!grupos[letraInicial]) {
      grupos[letraInicial] = [];
    }
    grupos[letraInicial].push(pelicula);
    
    return grupos;
  }, {});

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0b0c15] px-5 pb-10 pt-28 text-white md:px-10">
        <h2 className="mb-8 text-4xl font-bold text-[#3a86ff]">Películas</h2>

        {/* 4. Renderizamos iterando sobre las letras en orden alfabético */}
        {Object.keys(peliculasAgrupadas).length === 0 ? (
          <p className="text-[#aeb4c0]">No hay películas disponibles en el catálogo.</p>
        ) : (
          Object.keys(peliculasAgrupadas).sort().map((letra) => (
            <div key={letra} className="mb-12">
              
              {/* Encabezado de la Letra con divisor estético */}
              <div className="mb-6 flex items-center gap-4">
                <h3 className="text-3xl font-bold text-white">{letra}</h3>
                <div className="h-[1px] flex-grow bg-white/20"></div>
              </div>

              {/* Grid de Películas de esa letra */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
                {peliculasAgrupadas[letra].map((movie) => {
                  const showPremiumBadge = movie.requierePremium && (!userProfile || userProfile.plan === "BASIC");
                  return (
                  <Link 
                    href={`/peliculas/${movie.id}`} 
                    key={movie.id} 
                    className="group cursor-pointer block"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-800 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                      <img
                        src={movie.rutaCaratula}
                        alt={movie.titulo}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />
                      
                      {/* Etiqueta Premium si requiere suscripción */}
                      {showPremiumBadge && (
                        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-black shadow-[0_4px_10px_rgba(245,158,11,0.55)] border border-amber-300/30">
                          <Star size={9} fill="currentColor" className="text-black" />
                          Premium
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
                        <button className="translate-y-5 rounded-full bg-[#3a86ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(58,134,255,0.45)] transition group-hover:translate-y-0">
                          ▶ Reproducir
                        </button>
                      </div>
                    </div>

                    <div className="pt-3">
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-[#3a86ff] transition-colors">{movie.titulo}</h3>
                      <p className="text-sm text-[#aeb4c0] line-clamp-1">
                        {new Date(movie.fechaLanzamiento).getFullYear()} 
                        {movie.generos && movie.generos.length > 0 
                          ? ` • ${movie.generos.map(g => g.nombre).join(', ')}`
                          : ''}
                      </p>
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}