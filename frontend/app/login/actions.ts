"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers"

export async function loginUser(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    let success = false

    try {
        const res = await fetch("http://gateway-service:8000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            return { error: data.error || "Credenciales inválidas" };
        }

        // 🔥 AQUÍ ESTÁ EL CAMBIO
        const cookieStore = await cookies();

        cookieStore.set("token", data.token, {
            httpOnly: true,
            //secure true en producción, diferente en desarrollo para facilitar testing sin HTTPS 
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 día
            path: "/"
        });

        return { success: true };

    } catch (error: any) {
        console.error("LOGIN ERROR:", error);
        return { error: "Error de conexión" };
    }


}