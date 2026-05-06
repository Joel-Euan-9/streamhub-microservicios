"use server";

import { fetchWithAuth } from "@/lib/api";

export async function toggleFavoriteAction(peliculaId: string) {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/favoritos/toggle", {
      method: "POST",
      body: JSON.stringify({ peliculaId })
    });
    
    if (!res.ok) {
      return { success: false, error: "Error de servidor al alternar favorito" };
    }

    const data = await res.json();
    return { success: true, isFavorite: data.isFavorite, message: data.message };
  } catch (error) {
    console.error("Error toggleFavoriteAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}
