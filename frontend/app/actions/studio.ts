"use server";

import { revalidatePath } from "next/cache";
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
      genres: m.generos ? m.generos.map((g: any) => g.nombre) : [],
      // raw fields needed for the edit modal
      descripcion: m.descripcion || "",
      duracion: m.duracion ? String(m.duracion) : "",
      rutaCaratula: m.rutaCaratula || "",
      rutaImagenFondo: m.rutaImagenFondo || "",
      rutaVideo: m.rutaVideo || "",
      rutaTrailer: m.rutaTrailer || "",
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

export async function updateStudioMovieAction(id: string, data: any) {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/peliculas/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error response from gateway:", res.status, text);
      return { success: false, error: "Error al actualizar película" };
    }

    const movie = await res.json();
    revalidatePath("/studio/peliculas");
    revalidatePath("/studio");
    return { success: true, movie };
  } catch (error) {
    console.error("Error en updateStudioMovieAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}

export async function deleteStudioMovieAction(id: string) {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/peliculas/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error response from gateway:", res.status, text);
      return { success: false, error: "Error al eliminar película" };
    }

    revalidatePath("/studio/peliculas");
    revalidatePath("/studio");
    return { success: true };
  } catch (error) {
    console.error("Error en deleteStudioMovieAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}

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

export async function getStudioNotificationsAction() {
  try {
    const profile = await getUserProfile();
    if (!profile) {
      return { success: false, error: "Usuario no autenticado", notifications: [] };
    }

    // 1. Obtener transacciones del usuario
    const resTrans = await fetchWithAuth(`http://gateway-service:8000/api/perfil/transacciones`, {
      cache: "no-store"
    });

    let transactions: any[] = [];
    if (resTrans.ok) {
      transactions = await resTrans.json();
    }

    // 2. Obtener las películas creadas por este usuario para buscar sus comentarios
    const resMovies = await fetchWithAuth(`http://gateway-service:8000/api/peliculas?creadorId=${profile.id}`, {
      cache: "no-store"
    });

    let movies: any[] = [];
    if (resMovies.ok) {
      movies = await resMovies.json();
    }

    // 3. Obtener comentarios de cada película en paralelo
    let flatComments: any[] = [];
    if (movies.length > 0) {
      const commentPromises = movies.map(async (m: any) => {
        try {
          const res = await fetchWithAuth(`http://gateway-service:8000/api/interacciones/comentarios/${m.id}`, {
            cache: "no-store"
          });
          if (res.ok) {
            const comments = await res.json();
            return comments.map((c: any) => ({
              ...c,
              movieTitle: m.titulo
            }));
          }
        } catch (e) {
          console.error("Error al obtener comentarios en notificaciones:", e);
        }
        return [];
      });

      const commentsResults = await Promise.all(commentPromises);
      flatComments = commentsResults.flat();
    }

    // Función auxiliar para calcular tiempo transcurrido de manera amigable
    const formatTimeAgo = (dateStr: string) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHrs = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffSec < 60) return "Hace un momento";
      if (diffMin < 60) return `Hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
      if (diffHrs < 24) return `Hace ${diffHrs} ${diffHrs === 1 ? 'hora' : 'horas'}`;
      if (diffDays === 1) return "Ayer";
      if (diffDays < 7) return `Hace ${diffDays} días`;
      
      // Formato DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // 4. Mapear transacciones a notificaciones
    const transactionNotifications = transactions.map((t: any) => {
      const isPositive = t.monto > 0;
      return {
        id: t.id,
        type: isPositive ? 'commission' : 'withdrawal',
        title: isPositive ? 'Comisión Recibida' : 'Retiro Procesado',
        description: t.descripcion,
        date: t.fecha,
        timeAgo: formatTimeAgo(t.fecha)
      };
    });

    // 5. Mapear comentarios externos (no hechos por el propio creador) a notificaciones
    const externalComments = flatComments.filter((c: any) => c.usuarioId !== profile.id);
    const commentNotifications = externalComments.map((c: any) => {
      const authorName = c.usuario?.name || "Un espectador";
      return {
        id: c.id,
        type: 'comment',
        title: 'Nuevo Comentario',
        description: `"${authorName}" comentó en "${c.movieTitle}": "${c.contenido}"`,
        date: c.fecha,
        timeAgo: formatTimeAgo(c.fecha)
      };
    });

    // 6. Combinar, ordenar de más reciente a más antigua y recortar a las 5 más recientes
    const notifications = [...transactionNotifications, ...commentNotifications]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return { success: true, notifications };
  } catch (error) {
    console.error("Error en getStudioNotificationsAction:", error);
    return { success: false, error: "Error de servidor", notifications: [] };
  }
}
