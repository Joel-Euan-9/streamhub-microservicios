import Link from "next/link";

interface GenreCardProps {
  name: string;
  href: string;
  bg: string; // Ejemplo: "from-cyan-900/70 to-slate-700/80"
}

export default function GenreCard({ name, href, bg }: GenreCardProps) {
  return (
    <Link
      href={href}
      className={`flex h-[110px] min-w-[220px] shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-r ${bg} px-6 text-center text-xl md:text-2xl font-extrabold tracking-wide text-white transition hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(58,134,255,0.25)] md:min-w-0`}
    >
      {name}
    </Link>
  );
}