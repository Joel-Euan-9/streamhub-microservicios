// app/peliculas/[id]/page.tsx
import Navbar from '@/app/components/ui/Navbar';
import MovieHero from '@/app/components/peliculavista/MovieHero';
import MoviePlayer from '@/app/components/peliculavista/MoviePlayer';
import { notFound } from 'next/navigation';

// Función para traer datos de UNA sola película del Gateway
async function getMovieDetails(id: string) {
  try {
    // Ajusta la URL según tu Gateway (ej: /api/peliculas/{id})
    const res = await fetch(`http://gateway-service:8000/api/peliculas/${id}`, { 
      cache: 'no-store' // Datos frescos siempre
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error cargando detalles de película:", error);
    return null;
  }
}

interface Props {
  params: { id: string }; // Next.js nos pasa el [id] aquí
}

// Marcamos la página como async
export default async function PeliculaDetailPage({ params }: Props) {
  const { id } = params;
  
  // Hacemos el fetch de datos reales
  const movie = await getMovieDetails(id);

  // Si no se encuentra la película en la BD, mostramos error 404
  if (!movie) {
    notFound();
  }

  // URL Temporal para el reproductor (Imagen de fondo como pediste)
  const temporaryVideoUrl = movie.rutaImagenFondo; 
  // Cuando tengas la ruta real, cambiar por: movie.rutaVideo

  return (
    <>
      <Navbar />
      
      {/* Empujamos el contenido pt-[70px] por el Navbar fixed */}
      <main className="pt-[70px] bg-[#020817]">
        
        {/* PARTE 1: HERO (Detalles) */}
        <MovieHero movie={movie} />

        {/* PARTE 2: REPRODUCTOR */}
        <MoviePlayer 
          videoUrl={temporaryVideoUrl} 
          posterUrl={movie.rutaImagenFondo} 
        />

        {/* Aquí podrías añadir secciones extra como "Películas Similares" más adelante */}
      </main>
    </>
  );
}