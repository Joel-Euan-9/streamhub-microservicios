"use client";

import Link from "next/link";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import { loginUser } from "./actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";


const loginSchema = z.object({
    email: z.email("Introduce un correo electrónico válido"),
    password: z.string().min(1, "Ingresa una contraseña")
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Page() {
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur"
    })

    const onSubmit = async (data: LoginFormValues) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password)
        const result = await loginUser(formData);

        if (result?.error) {
            setError(result.error);

            return;
        }

        toast.success("Bienvenido!", {
            description: "Que bueno verte de nuevo!",
            duration: 2000,
        })

        router.push("/inicio");
    }


    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="max-w-lg w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="flex flex-col items-center justify-center">
                        <img src="https://i.ibb.co/sZgKPTr/logo.png" alt="Logo" className="w-12 mb-2" />
                        <h1 className="text-3xl font-black">
                            Stream<span className="text-blue-400">Hub</span>
                        </h1>
                    </div>

                    <p className="text-center">
                        Inicia sesión para continuar
                    </p>

                    {error && (
                        <div className="bg-red-500/15 border border-red-500/50 text-white p-3 rounded-md text-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
                            <span className="flex-1 text-center">
                                {error}
                            </span>
                            <button
                                onClick={() => setError("")}
                                className="text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}


                    <Input
                        label="Correo electrónico"
                        type="email"
                        {...register("email")} // El name ya viene aquí dentro
                        error={errors.email?.message}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        {...register("password")}
                        error={errors.password?.message}
                    />


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 p-2.5 px-12 rounded-md font-bold w-full disabled:opacity-50">
                        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>

                    <p className="text-sm font-semibold text-center">
                        ¿No tienes cuenta?
                        <span className="ml-1 text-blue-600">
                            <Link href="/register">Regístrate</Link>
                        </span>
                    </p>

                </form>
            </div>
        </div>
    );
}