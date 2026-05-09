import Link from "next/link";

interface ContinueCardProps {
  id: string;
  title: string;
  remaining: string;
  img: string;
  progress: number; // Porcentaje de 0 a 100
}

export default function ContinueCard({ id, title, remaining, img, progress }: ContinueCardProps) {
  return (
    <Link href={`/peliculas/${id}`} className="group w-[160px] shrink-0 cursor-pointer sm:w-[180px] md:w-[200px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-white/20">
          <div
            className="h-full bg-[#3a86ff] shadow-[0_0_10px_#3a86ff] transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Overlay de Play al hacer hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
             <div className="bg-[#3a86ff] p-3 rounded-full text-white shadow-lg">▶</div>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="truncate text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-[#aeb4c0]">{remaining}</p>
      </div>
    </Link>
  );
}