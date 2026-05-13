// app/peliculas/[id]/page.tsx
import Navbar from '@/app/components/ui/Navbar';
import MovieHero from '@/app/components/peliculavista/MovieHero';
import MoviePlayer from '@/app/components/peliculavista/MoviePlayer';
import { notFound } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';

// Función para consultar si la película es favorita
async function checkIsFavorite(id: string) {
  try {
    const res = await fetchWithAuth(`http://gateway-service:8000/api/favoritos/check/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.isFavorite;
  } catch (error) {
    return false;
  }
}

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

  // Verificamos si es favorita
  const initialIsFavorite = await checkIsFavorite(id);

  // URL Temporal para el reproductor (Imagen de fondo como pediste)
  const temporaryVideoUrl = movie.rutaImagenFondo; 
  // Cuando tengas la ruta real, cambiar por: movie.rutaVideo

  return (
    <>
      <Navbar />
      
      {/* Empujamos el contenido pt-[70px] por el Navbar fixed */}
      <main className="pt-[70px] bg-[#020817]">
        
        {/* PARTE 1: HERO (Detalles) */}
        <MovieHero movie={{ ...movie, id }} initialIsFavorite={initialIsFavorite} />

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