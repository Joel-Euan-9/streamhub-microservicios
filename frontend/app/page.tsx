import Link from "next/link";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="text-white space-x-10">
        <Link href="/login">Iniciar sesión</Link>
        <Link href="/register">Registrate</Link>
      </main>
    </div>
  );
}
