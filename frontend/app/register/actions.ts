"use server";

import { z } from "zod";

const registerSchema = z.object({
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    email: z.email("Introduce un correo electrónico válido"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[a-zA-Z]/, "La contraseña debe contener al menos una letra")
        .regex(/[0-9]/, "La contraseña debe contener al menos un número")
});

export async function registerUser(formData: FormData) {
    const rawData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password")
    };

    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
        return {
            error: validatedData.error.issues[0].message
        };
    }

    const { username, email, password } = validatedData.data;

    try {
        const apiUrl = process.env.API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                error: data.error || "Error en registro"
            };
        }

        return {
            success: true,
            token: data.token,
            userId: data.user.id
        };

    } catch (error: any) {
        console.error("Error en registro:", error);
        return {
            error: error.message
        };
    }
}

export async function updateUserPlan(userId: string, plan: string) {
    const planMap: Record<string, string> = {
        'BÁSICO': 'BASIC',
        'PREMIUM': 'PREMIUM',
        'STUDIO PASS': 'STUDIO'
    };

    const prismaPlan = planMap[plan] || 'BASIC';

    try {
        const apiUrl = process.env.API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/usuarios/${userId}/plan`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                plan: prismaPlan
            })
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                error: data.error || "Error al actualizar plan"
            };
        }

        return {
            success: true
        };

    } catch (error: any) {
        console.error("Error al actualizar plan:", error);
        return {
            error: error.message
        };
    }
}