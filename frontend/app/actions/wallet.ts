"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

interface Transaction {
  id: string;
  usuarioId: string;
  monto: number;
  descripcion: string;
  fecha: string;
}

/**
 * Obtiene la lista de transacciones del usuario logeado
 */
export async function getWalletTransactionsAction(): Promise<Transaction[]> {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil/transacciones", {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return [];
  }
}

/**
 * Solicita un retiro de fondos simulado
 */
export async function requestWithdrawAction(amount: number): Promise<{ success: boolean; error?: string; saldoBilletera?: number }> {
  try {
    const res = await fetchWithAuth("http://gateway-service:8000/api/perfil/retirar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monto: amount }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "No se pudo procesar el retiro." };
    }

    revalidatePath("/studio/ingresos");
    return { success: true, saldoBilletera: data.saldoBilletera };
  } catch (error) {
    console.error("Error al solicitar retiro:", error);
    return { success: false, error: "Error de conexión al procesar el retiro." };
  }
}
