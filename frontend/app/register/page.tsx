"use client";

import Link from "next/link";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import { registerUser } from "./actions";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form"; // Importamos el hook
import { zodResolver } from "@hookform/resolvers/zod"; // Importamos el puente con Zod

// Definimos el esquema de validación (¡Se queda igual!)
const registerSchema = z.object({
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    email: z.email("Introduce un correo electrónico válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

// Inferimos el tipo de Typescript basado en tu esquema de Zod
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Page() {
    const [serverError, setServerError] = useState("");

    // Configuración mágica de React Hook Form
    const {
        register, // Para conectar los inputs
        handleSubmit, // Para manejar el envío
        formState: { errors, isSubmitting } // Errores y estado de carga automáticos
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur", // <--- ¡LA MAGIA! Valida cuando el usuario sale del input (puedes cambiarlo a "onChange" para validar en cada tecla)
    });

    // Esta función SOLO se ejecuta si NO hay errores de Zod
    const onSubmit = async (data: RegisterFormValues) => {
        setServerError("");

        // Como tu Server Action (registerUser) probablemente espera un FormData,
        // lo construimos rápidamente con los datos ya validados:
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);

        // Enviamos al servidor
        const response = await registerUser(formData);

        if (response?.error) {
            setServerError(response.error);
            toast.error(response.error);
            return;
        }

        toast.success("¡Cuenta creada!", {
            description: "Te estamos redirigiendo al login...",
            duration: 3000,
        });

        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="max-w-lg w-full">
                {/* Cambiamos 'action' por 'onSubmit' usando el handleSubmit de la librería */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    <div className="flex flex-col items-center justify-center">
                        <img src="https://i.ibb.co/sZgKPTr/logo.png" alt="Logo" className="w-12 mb-2" />
                        <h1 className="text-3xl font-black">
                            Stream<span className="text-blue-400">Hub</span>
                        </h1>
                    </div>

                    <p className="text-center">Crea una cuenta para acceder.</p>

                    {/* 1. Username */}
                        <div>
                            <Input 
                                label="Username" 
                                type="text" 
                                {...register("username")} 
                                error={errors.username?.message} // <--- PASAMOS EL ERROR AQUÍ
                            />
                            {/* Ya no necesitas el <p> de afuera, porque el Input ya lo trae adentro */}
                        </div>

                        {/* 2. Email */}
                        <div>
                            <Input 
                                label="Correo electrónico" 
                                type="email" 
                                {...register("email")} 
                                error={errors.email?.message} 
                            />
                        </div>

                        {/* 3. Password */}
                        <div>
                            <Input 
                                label="Contraseña" 
                                type="password" 
                                {...register("password")} 
                                error={errors.password?.message} 
                            />
                        </div>

                        {/* 4. Confirm Password */}
                        <div>
                            <Input 
                                label="Repite tu contraseña" 
                                type="password" 
                                {...register("confirmPassword")} 
                                error={errors.confirmPassword?.message} 
                            />
                        </div>

                    {serverError && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{serverError}</p>}

                    <button 
                        type="submit" 
                        disabled={isSubmitting} // Desactiva el botón mientras carga
                        className="bg-blue-600 p-2.5 px-12 rounded-md font-bold w-full hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "Registrando..." : "Registrarte"}
                    </button>

                    <p className="text-sm font-semibold text-center">
                        ¿Ya tienes cuenta? 
                        <Link href="/login" className="ml-1 text-blue-600 hover:underline">Inicia sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}