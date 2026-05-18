import UploadMovieButton from "../components/UploadMovieButton";
import { Pencil, Trash2 } from "lucide-react";

// Datos simulados basados en tu captura de pantalla
const mockMovies = [
  {
    id: 1,
    title: "Jurassic World: El Reino Caído",
    genres: ["Aventura", "Sci-Fi"],
    releaseDate: "22 de Junio, 2018",
    image: "https://image.tmdb.org/t/p/w500/c9XxwwhHU33KT8Xym9YRs19bA3B.jpg",
  },
  {
    id: 2,
    title: "Thor: Ragnarok",
    genres: ["Acción", "Fantasía"],
    releaseDate: "3 de Noviembre, 2017",
    image: "https://image.tmdb.org/t/p/w500/rzRwTcFvttce1VKwLyvqpsqDTIz.jpg",
  },
  {
    id: 3,
    title: "Coco",
    genres: ["Animación", "Familiar"],
    releaseDate: "27 de Octubre, 2017",
    image: "https://image.tmdb.org/t/p/w500/eKi8dIrr8ca28IQZivEza1zRaSA.jpg",
  },
  {
    id: 4,
    title: "Cómo ser un Latin Lover",
    genres: ["Comedia"],
    releaseDate: "28 de Abril, 2017",
    image: "https://image.tmdb.org/t/p/w500/tS7WkYV6XmQxZ1n0XUaO2s2W8nQ.jpg",
  },
];

export default function MisPeliculasPage() {
  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8 mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Mi Studio
          </h1>
          <p className="mt-1 text-[#aeb4c0]">
            Administra tus películas subidas a la plataforma.
          </p>
        </div>
        <UploadMovieButton />
      </div>

      {/* TABLA DE PELÍCULAS */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c15] shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-[#aeb4c0]">
            <thead className="border-b border-white/5 bg-white/5 text-xs uppercase text-[#aeb4c0]">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Carátula</th>
                <th scope="col" className="px-6 py-4 font-semibold">Película</th>
                <th scope="col" className="px-6 py-4 font-semibold">Lanzamiento</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockMovies.map((movie) => (
                <tr key={movie.id} className="transition-colors hover:bg-white/[0.02]">
                  {/* Carátula */}
                  <td className="px-6 py-4">
                    <img 
                      src={movie.image} 
                      alt={movie.title} 
                      className="h-20 w-14 rounded object-cover shadow-md"
                    />
                  </td>

                  {/* Película */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-base font-bold text-white">{movie.title}</span>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                          <span 
                            key={genre} 
                            className="rounded-full border border-white/10 bg-[#3a86ff]/10 px-2.5 py-0.5 text-xs font-medium text-[#3a86ff]"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Lanzamiento */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {movie.releaseDate}
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        className="rounded-lg p-2 text-[#aeb4c0] transition hover:bg-white/5 hover:text-[#3a86ff]"
                        title="Editar película"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        className="rounded-lg p-2 text-[#aeb4c0] transition hover:bg-red-500/10 hover:text-red-500"
                        title="Eliminar película"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
