import Link from "next/link";

interface TopMovieCardProps {
  id: string;
  rank: number;
  title: string;
  img: string;
}

export default function TopMovieCard({ id, rank, title, img }: TopMovieCardProps) {
  const isTen = rank === 10;

  return (
    <Link
      href={`/peliculas/${id}`}
      className={`group relative flex shrink-0 items-end gap-2 pt-8 ${
        isTen 
          ? "min-w-[210px] sm:min-w-[250px] md:min-w-[280px]" 
          : "min-w-[180px] sm:min-w-[220px] md:min-w-[250px]"
      }`}
    >
      {/* El número gigante con borde (stroke) */}
      <span 
        className="pointer-events-none select-none text-[8rem] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.55)] sm:text-[9rem] md:text-[10rem]"
        style={{ letterSpacing: isTen ? "-0.12em" : "normal", marginLeft: isTen ? "-10px" : "0" }}
      >
        {rank}
      </span>

      {/* La carátula que flota sobre el número */}
      <div className={`absolute bottom-0 overflow-hidden rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.35)] transition duration-300 group-hover:-translate-y-4 ${
        isTen 
          ? "left-[115px] w-[95px] sm:left-[130px] sm:w-[110px] md:left-[145px] md:w-[120px]" 
          : "left-[72px] w-[95px] sm:left-[88px] sm:w-[110px] md:left-[100px] md:w-[120px]"
      }`}>
        <img
          src={img}
          alt={title}
          className="aspect-[2/3] h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}