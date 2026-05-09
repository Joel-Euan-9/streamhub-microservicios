import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  img: string;
  genre: string;
}

interface Props {
  movies: Movie[];
  total: number;
}

export default function FavoritesSection({ movies, total }: Props) {
  if (movies.length === 0) return null;

  const mainMovie = movies[0];
  const sideMovies = movies.slice(1, 5);

  return (
    <section className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold border-l-4 border-[#3a86ff] pl-3 text-white flex items-center">
          Mi Lista
        </h2>
        <Link href="/miactividad" className="text-sm text-[#3a86ff] hover:text-white transition flex items-center gap-1 font-medium">
          Ver todo ({total}) <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[350px]">
        {/* Main Card */}
        <Link href={`/peliculas/${mainMovie.id}`} className="block group relative rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)] h-[300px] md:h-full">
          <img 
            src={mainMovie.img} 
            alt={mainMovie.title} 
            className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/20 to-transparent opacity-90"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-1 group-hover:text-[#3a86ff] transition">
              {mainMovie.title}
            </h3>
            <p className="text-[#00f2fe] text-sm md:text-base font-semibold">
              {mainMovie.genre}
            </p>
          </div>
        </Link>
        
        {/* Side Cards (Grid 2x2) */}
        {sideMovies.length > 0 && (
          <div className={`grid gap-4 h-full ${sideMovies.length > 2 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1 grid-rows-2'}`}>
            {sideMovies.map(m => (
              <Link key={m.id} href={`/peliculas/${m.id}`} className="block group relative rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.3)] h-[150px] md:h-auto">
                <img 
                  src={m.img} 
                  alt={m.title} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817] to-transparent opacity-80 group-hover:opacity-100 transition"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-base md:text-lg font-bold text-white truncate w-full group-hover:text-[#3a86ff] transition">
                    {m.title}
                  </h3>
                  <p className="text-[#00f2fe] text-xs font-semibold">
                    {m.genre}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
