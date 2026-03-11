import Link from "next/link";
import { Input } from "../components/ui/Input";

export default function page() {
    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="max-w-lg w-full">
                <form action="" className="space-y-4">
                    <div className="flex items-center justify-center">
                        <img src="img/logo.svg" alt="" className="w-8 mr-1" />
                        <h1 className="text-3xl font-black">Stream<span className="text-orange-400">Hub</span></h1>
                    </div>
                    <p className="text-center">Crea una cuenta para acceder a todas las películas.</p>

                    <div className="grid grid-cols-1 space-y-1">
                        <Input
                            label="Username"
                            type="text"
                            name="name"
                        />
                    </div>

                    <div className="grid grid-cols-1 space-y-1">
                        <Input
                            label="Correo electrónico"
                            type="email"
                            name="email"
                        />
                    </div>

                    <div className="grid grid-cols-1 space-y-1">
                        <Input
                            label="Contraseña"
                            type="password"
                            name="password"
                        />
                    </div>

                    <div className="grid grid-cols-1 space-y-1">
                        <Input
                            label="Repite tu contraseña"
                            type="password"
                            name="password_confirmation"
                        />
                    </div>

                    <div className="grid grid-cols-1 space-y-10">
                        <button className="bg-blue-600 p-2.5 px-12 rounded-md font-bold">
                            Registrarte
                        </button>

                        <p className="text-sm font-semibold">
                            Ya tienes cuenta?
                            <span className="ml-1 text-blue-600">
                                <Link href="/login">
                                    Inicia sesión
                                </Link>
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}