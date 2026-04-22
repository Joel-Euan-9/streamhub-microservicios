"use server";

export async function registerUser(formData: FormData) {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const apiUrl = process.env.API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
            success: true
        };

    } catch (error: any) {
        console.error("Error en registro:", error);
        return {
            error: error.message
        };
    }
}