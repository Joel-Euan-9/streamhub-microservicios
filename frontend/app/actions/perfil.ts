"use server";

import { fetchWithAuth } from "@/lib/api";

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Error de servidor al cambiar contraseña" };
    }

    const data = await res.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error changePasswordAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}

export async function changePlanAction(plan: string) {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil/plan", {
      method: "PUT",
      body: JSON.stringify({ plan })
    });
    
    if (!res.ok) {
      return { success: false, error: "Error de servidor al cambiar el plan" };
    }

    const data = await res.json();
    return { success: true, message: data.message, plan: data.plan };
  } catch (error) {
    console.error("Error changePlanAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}

export async function changeNameAction(name: string) {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil/name", {
      method: "PUT",
      body: JSON.stringify({ name })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Error de servidor al cambiar el nombre" };
    }

    const data = await res.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error changeNameAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}

export async function verifyPasswordAction(currentPassword: string) {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil/password/verify", {
      method: "POST",
      body: JSON.stringify({ currentPassword })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Contraseña incorrecta" };
    }

    const data = await res.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error verifyPasswordAction:", error);
    return { success: false, error: "Error de conexión" };
  }
}
