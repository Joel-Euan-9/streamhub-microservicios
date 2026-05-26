import UploadMovieButton from "../components/UploadMovieButton";
import { Pencil, Trash2 } from "lucide-react";
import { getStudioMoviesAction } from "@/app/actions/studio";
import Link from "next/link";

export default async function MisPeliculasPage() {
  const moviesRes = await getStudioMoviesAction();
  const movies = moviesRes.success ? moviesRes.movies : [];

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
              {movies.length > 0 ? movies.map((movie: any) => (
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
                        {movie.genres?.map((genre: string) => (
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
                    {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "No especificado"}
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
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No has subido ninguna película todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
