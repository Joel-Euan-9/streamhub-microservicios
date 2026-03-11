import Link from "next/link";
import { Input } from "../components/ui/Input";

export default function page() {
    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="max-w-lg w-full">
                <form action="" className="space-y-4">
                    <h1 className="text-3xl font-black">PornHub</h1>
                    <p>Crea una cuenta para acceder a todas las películas.</p>

                    <div className="grid grid-cols-1 space-y-1">
                        <Input
                            label="Nombre"
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

                    <div className="grid grid-cols-1 space-y-2">
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