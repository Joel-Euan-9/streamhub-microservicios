"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Obtiene el perfil completo del usuario autenticado actual.
 */
export async function getUserProfile() {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil", {
      cache: "no-store", // Evita caché antigua, queremos siempre el plan más actual
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return null;
  }
}

/**
 * Actualiza el plan del usuario actual.
 */
export async function upgradePlan(plan: string) {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil/plan", {
      method: "PUT",
      body: JSON.stringify({ plan }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, error: errorData.error || "Error al actualizar plan" };
    }

    // Refrescar caché de la ruta de inicio para forzar actualizaciones de estado (como el Navbar)
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error en upgradePlan:", error);
    return { success: false, error: "Error de conexión" };
  }
}
