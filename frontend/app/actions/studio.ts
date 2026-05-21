"use server";

import { fetchWithAuth } from "@/lib/api";
import { getUserProfile } from "./profile";

export async function getStudioMoviesAction() {
  try {
    const profile = await getUserProfile();
    if (!profile) {
      return { success: false, error: "Usuario no autenticado", movies: [], profile: null };
    }

    // Obtener las películas creadas por este usuario
    const resMovies = await fetchWithAuth(`http://gateway-service:8000/api/peliculas?creadorId=${profile.id}`, {
      cache: "no-store"
    });

    if (!resMovies.ok) {
      return { success: false, error: "Error al obtener películas del catálogo", movies: [], profile };
    }

    const movies = await resMovies.json();

    if (!movies || movies.length === 0) {
      return { success: true, movies: [], profile };
    }

    // Obtener los conteos de comentarios en lote
    const movieIds = movies.map((m: any) => m.id);
    const resCounts = await fetchWithAuth("http://gateway-service:8000/api/interacciones/comentarios/count-batch", {
      method: "POST",
      body: JSON.stringify({ peliculaIds: movieIds }),
      cache: "no-store"
    });

    let countsMap: Record<string, number> = {};
    if (resCounts.ok) {
      countsMap = await resCounts.json();
    }

    const enrichedMovies = movies.map((m: any) => ({
      id: m.id,
      title: m.titulo,
      image: m.rutaCaratula,
      creadorId: m.creadorId,
      commentsCount: countsMap[m.id] || 0
    }));

    return { success: true, movies: enrichedMovies, profile };
  } catch (error) {
    console.error("Error en getStudioMoviesAction:", error);
    return { success: false, error: "Error de conexión", movies: [], profile: null };
  }
}
