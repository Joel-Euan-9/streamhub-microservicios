import UploadMovieButton from "../components/UploadMovieButton";
import MisPeliculasClient from "../components/MisPeliculasClient";
import { getStudioMoviesAction } from "@/app/actions/studio";

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

      {/* TABLA INTERACTIVA (editar / eliminar) */}
      <MisPeliculasClient movies={movies as any} />

    </div>
  );
}

