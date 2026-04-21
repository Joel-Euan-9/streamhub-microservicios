"use client";

import Link from "next/link";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import { loginUser } from "./actions";

export default function Page() {
    const [error, setError] = useState("");

    const handleSubmit = async (formData: FormData) => {

        const result = await loginUser(formData);

        if (result?.error) {
            setError(result.error);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="max-w-lg w-full">
                <form action={handleSubmit} className="space-y-4">

                    <div className="flex flex-col items-center justify-center">
                        <img src="https://i.ibb.co/sZgKPTr/logo.png" alt="Logo" className="w-12 mb-2" />
                        <h1 className="text-3xl font-black">
                            Stream<span className="text-blue-400">Hub</span>
                        </h1>
                    </div>

                    <p className="text-center">
                        Inicia sesión para continuar
                    </p>

                    <Input label="Correo electrónico" type="email" name="email" />
                    <Input label="Contraseña" type="password" name="password" />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button className="bg-blue-600 p-2.5 px-12 rounded-md font-bold w-full">
                        Iniciar sesión
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