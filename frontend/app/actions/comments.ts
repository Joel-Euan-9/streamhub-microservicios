"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Obtiene el árbol de comentarios hidratado para una película específica.
 */
export async function getMovieComments(peliculaId: string) {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/interacciones/comentarios/${peliculaId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data; // Retorna el árbol de comentarios [ { id, ..., usuario: {...}, respuestas: [...] } ]
  } catch (error) {
    console.error("Error en getMovieComments:", error);
    return [];
  }
}

/**
 * Crea un comentario o respuesta para una película.
 */
export async function addMovieComment(peliculaId: string, contenido: string, parentId?: string) {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/interacciones/comentarios", {
      method: "POST",
      body: JSON.stringify({
        peliculaId,
        contenido,
        parentId: parentId || null,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Error al crear el comentario." };
    }

    const data = await res.json();
    
    // Forzamos revalidación de la ruta para que Next.js actualice la página
    revalidatePath(`/peliculas/${peliculaId}`);

    return { success: true, comment: data };
  } catch (error) {
    console.error("Error en addMovieComment:", error);
    return { success: false, error: "Error de conexión con el servidor." };
  }
}
