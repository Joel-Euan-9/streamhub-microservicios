"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Importa redirect
import { revalidatePath } from "next/cache"; // Opcional pero recomendado

export async function logout() {
  const cookieStore = await cookies();

  // Opción A: Borrar explícitamente
  cookieStore.delete("token"); 

  // Opción B: Tu método (también funciona, pero delete es más limpio)
  /*
  cookieStore.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  });
  */

  // 1. Limpiar la caché de las rutas protegidas
  revalidatePath("/");

  // 2. Redirigir al usuario (esto debe ir al final)
  redirect("/login"); 
}