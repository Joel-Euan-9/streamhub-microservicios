import Navbar from '@/app/components/ui/Navbar';
import MovieHero from '@/app/components/peliculavista/MovieHero';
import MoviePlayer from '@/app/components/peliculavista/MoviePlayer';
import { notFound } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import { getProgressAction } from '@/app/actions/historial';

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
    const res = await fetch(`http://gateway-service:8000/api/peliculas/${id}`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error cargando detalles de película:", error);
    return null;
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PeliculaDetailPage({ params }: Props) {
  const { id } = await params;
  
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  const initialIsFavorite = await checkIsFavorite(id);
  const progressData = await getProgressAction(id);
  const initialTime = progressData.completada ? 0 : (progressData.minutoPausa || 0);

  return (
    <>
      <Navbar />
      
      <main className="pt-[70px] bg-[#020817]">
        
        <MovieHero movie={{ ...movie, id }} initialIsFavorite={initialIsFavorite} />

        <MoviePlayer 
          videoUrl={movie.rutaVideoCompleta}
          posterUrl={movie.rutaImagenFondo}
          peliculaId={id}
          initialTime={initialTime}
        />

        {/* Aquí podrías añadir secciones extra como "Películas Similares" más adelante */}
      </main>
    </>
  );
}