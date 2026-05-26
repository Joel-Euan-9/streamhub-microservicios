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
      commentsCount: countsMap[m.id] || 0,
      releaseDate: m.fechaLanzamiento || "",
      genres: m.generos ? m.generos.map((g: any) => g.nombre) : []
    }));

    return { success: true, movies: enrichedMovies, profile };
  } catch (error) {
    console.error("Error en getStudioMoviesAction:", error);
    return { success: false, error: "Error de conexión", movies: [], profile: null };
  }
}

export async function getStudioSummaryAction() {
  try {
    const profile = await getUserProfile();
    if (!profile || profile.plan !== 'STUDIO') {
      return { success: false, error: "No autorizado" };
    }

    // Obtener las películas creadas por este usuario
    const resMovies = await fetchWithAuth(`http://gateway-service:8000/api/peliculas?creadorId=${profile.id}`, {
      cache: "no-store"
    });

    let movies = [];
    if (resMovies.ok) {
      movies = await resMovies.json();
    }

    const activeMovies = movies.length;
    const totalViews = movies.reduce((sum: number, m: any) => sum + (m.vistasTotales || 0), 0);

    // Obtener transacciones para ganancias del mes
    const resTrans = await fetchWithAuth(`http://gateway-service:8000/api/perfil/transacciones`, {
      cache: "no-store"
    });
    
    let earnings = 0;
    if (resTrans.ok) {
      const transacciones = await resTrans.json();
      const now = new Date();
      earnings = transacciones.reduce((sum: number, t: any) => {
        const tDate = new Date(t.fecha);
        if (tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear() && t.monto > 0) {
          return sum + t.monto;
        }
        return sum;
      }, 0);
    }

    return {
      success: true,
      data: {
        earnings,
        totalViews,
        activeMovies
      }
    };
  } catch (error) {
    console.error("Error en getStudioSummaryAction:", error);
    return { success: false, error: "Error al obtener resumen" };
  }
}

export async function getStudioEstadisticasAction() {
  try {
    const profile = await getUserProfile();
    if (!profile || profile.plan !== 'STUDIO') {
      return { success: false, error: "No autorizado" };
    }

    const res = await fetchWithAuth(`http://gateway-service:8000/api/studio/estadisticas`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return { success: false, error: "Error al obtener estadísticas" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error en getStudioEstadisticasAction:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function uploadStudioMovieAction(data: any) {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/peliculas`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const text = await res.text();
      console.error("Error response from gateway:", res.status, text);
      return { success: false, error: "Error al subir película" };
    }
    
    const movie = await res.json();
    revalidatePath("/studio/peliculas");
    revalidatePath("/studio");
    return { success: true, movie };
  } catch (error) {
    console.error("Error en uploadStudioMovieAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}

import { revalidatePath } from "next/cache";

// Obtener la configuración del perfil del usuario logueado (si es STUDIO)
export async function getStudioProfileAction() {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/studio/perfil`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return { success: false, error: 'No se pudo obtener el perfil de studio' };
    }

    const data = await res.json();
    return { success: true, profile: data };
  } catch (error) {
    console.error("Error en getStudioProfileAction:", error);
    return { success: false, error: 'Error de servidor' };
  }
}

// Actualizar el perfil del canal
export async function updateStudioProfileAction(data: {
  nombreCanal?: string;
  descripcion?: string;
  fotoPerfilUrl?: string;
  fotoPortadaUrl?: string;
  metodoPago?: string;
  datosPago?: string;
}) {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/studio/perfil`, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      return { success: false, error: 'No se pudo actualizar el perfil' };
    }

    revalidatePath('/studio/configuracion');
    revalidatePath('/canales');
    
    return { success: true };
  } catch (error) {
    console.error("Error en updateStudioProfileAction:", error);
    return { success: false, error: 'Error de servidor' };
  }
}

// Obtener todos los canales públicos
export async function getCanalesAction() {
  try {
    const res = await fetch(`http://gateway-service:8000/api/canales`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getCanalesAction:", error);
    return [];
  }
}

// Obtener un canal público específico por ID de perfilStudio
export async function getCanalByIdAction(id: string) {
  try {
    const res = await fetch(`http://gateway-service:8000/api/canales/${id}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error en getCanalByIdAction:", error);
    return null;
  }
}
