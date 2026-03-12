import Navbar from "../components/ui/Navbar";

const MOVIES = [
  {
    title: "Coco",
    year: "2017",
    genre: "Animación",
    img: "https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg",
  },
  {
    title: "Minions",
    year: "2015",
    genre: "Animación",
    img: "https://image.tmdb.org/t/p/w500/dr02BdCNAUPVU07aOodwPYv6HCf.jpg",
  },
  {
    title: "Avengers",
    year: "2012",
    genre: "Acción",
    img: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
  },
];

export default function PeliculasPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0b0c15] px-5 pb-10 pt-28 text-white md:px-10">
        <h2 className="mb-8 text-3xl font-bold text-[#3a86ff]">Películas</h2>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
          {MOVIES.map((movie) => (
            <div key={movie.title} className="group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl">
                <img
                  src={movie.img}
                  alt={movie.title}
                  className="h-full w-full object-cover transition group-hover:scale-110"
                />
              </div>

              <div className="pt-3">
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-[#aeb4c0]">
                  {movie.year} • {movie.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}