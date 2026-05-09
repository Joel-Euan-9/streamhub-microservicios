"use server";

import { fetchWithAuth } from "@/lib/api";

export async function getHistorialAction() {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/historial", {
      cache: "no-store",
    });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error getHistorialAction:", error);
    return [];
  }
}

export async function getProgressAction(peliculaId: string) {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/historial/${peliculaId}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { minutoPausa: 0, completada: false };
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error getProgressAction:", error);
    return { minutoPausa: 0, completada: false };
  }
}

export async function saveProgressAction(peliculaId: string, minutoPausa: number, completada: boolean) {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/historial", {
      method: "POST",
      body: JSON.stringify({ peliculaId, minuto: minutoPausa, completada }),
    });
    
    if (!res.ok) {
      return { success: false, error: "Error al guardar progreso" };
    }
    return { success: true };
  } catch (error) {
    console.error("Error saveProgressAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}

export async function clearHistorialAction() {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/historial", {
      method: "DELETE"
    });
    if (!res.ok) return { success: false, error: "Error al limpiar historial" };
    return { success: true };
  } catch (error) {
    console.error("Error clearHistorialAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}
