import Navbar from "../components/ui/Navbar";
import Link from "next/link"; // 1. Importamos Link de Next.js

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
}

// 2. Función para obtener los datos desde TU GATEWAY
async function getPeliculas(): Promise<Pelicula[]> {
  try {
    const res = await fetch('http://gateway-service:8000/api/peliculas', { cache: 'no-store' });
    
    if (!res.ok) {
      console.error("Error en la respuesta del servidor");
      return [];
    }
   
    return res.json();
  } catch (error) {
    console.error("Error haciendo fetch a las películas:", error);
    return []; 
  }
}

export default async function PeliculasPage() {
  const peliculas = await getPeliculas();

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
                {peliculasAgrupadas[letra].map((movie) => (
                  // 2. AQUI ESTÁ LA MAGIA: Cambiamos <div> por <Link> y añadimos el href dinámico
                  <Link 
                    href={`/peliculas/${movie.id}`} 
                    key={movie.id} 
                    className="group cursor-pointer block"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-800">
                      <img
                        src={movie.rutaCaratula}
                        alt={movie.titulo}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    </div>

                    <div className="pt-3">
                      <h3 className="font-semibold text-lg line-clamp-1">{movie.titulo}</h3>
                      <p className="text-sm text-[#aeb4c0] line-clamp-1">
                        {new Date(movie.fechaLanzamiento).getFullYear()} 
                        {movie.generos && movie.generos.length > 0 
                          ? ` • ${movie.generos.map(g => g.nombre).join(', ')}`
                          : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}