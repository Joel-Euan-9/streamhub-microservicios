"use server";

import { fetchWithAuth } from "@/lib/api";

export async function toggleVotoAction(peliculaId: string, tipo: 'LIKE' | 'DISLIKE') {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/interacciones/votar", {
      method: "POST",
      body: JSON.stringify({ peliculaId, tipo })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Error al registrar la interacción" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error toggleVotoAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}

export async function getVotoStatusAction(peliculaId: string) {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/interacciones/status/${peliculaId}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return { success: false, error: "Error al obtener estado del voto" };
    }

    const data = await res.json();
    return { success: true, tipo: data.tipo };
  } catch (error) {
    console.error("Error getVotoStatusAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}
