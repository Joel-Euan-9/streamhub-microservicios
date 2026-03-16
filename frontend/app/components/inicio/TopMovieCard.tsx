import Link from "next/link";

interface TopMovieCardProps {
  rank: number;
  title: string;
  img: string;
}

export default function TopMovieCard({ rank, title, img }: TopMovieCardProps) {
  return (
    <Link
      href="/peliculas"
      className="group relative flex min-w-[180px] shrink-0 items-end gap-2 sm:min-w-[220px] md:min-w-[250px]"
    >
      {/* El número gigante con borde (stroke) */}
      <span className="pointer-events-none select-none text-[8rem] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.55)] sm:text-[9rem] md:text-[10rem]">
        {rank}
      </span>

      {/* La carátula que flota sobre el número */}
      <div className="absolute left-[72px] bottom-0 w-[95px] overflow-hidden rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.35)] transition duration-300 group-hover:-translate-y-2 sm:left-[88px] sm:w-[110px] md:left-[100px] md:w-[120px]">
        <img
          src={img}
          alt={title}
          className="aspect-[2/3] h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}