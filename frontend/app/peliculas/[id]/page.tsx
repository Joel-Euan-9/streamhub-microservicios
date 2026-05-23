import Navbar from '@/app/components/ui/Navbar';
import MovieHero from '@/app/components/peliculavista/MovieHero';
import MoviePlayer from '@/app/components/peliculavista/MoviePlayer';
import PaywallBlock from '@/app/components/peliculavista/PaywallBlock';
import DailyLimitPaywall from '@/app/components/peliculavista/DailyLimitPaywall';
import MovieComments from '@/app/components/peliculavista/MovieComments';
import { notFound } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import { getProgressAction } from '@/app/actions/historial';
import { getUserProfile, registerMovieView } from '@/app/actions/profile';
import { getFavoritosCountAction } from '@/app/actions/favoritos';
import { getVotoStatusAction } from '@/app/actions/interacciones';

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

  // Obtener perfil y plan del usuario
  const profile = await getUserProfile();
  const userPlan = profile?.plan || 'BASIC';

  // Obtener info del canal del creador si es película de TERCEROS
  let creatorChannel = null;
  if (movie.tipoContenido === 'TERCEROS' && movie.creadorId) {
    try {
      const res = await fetch(`http://gateway-service:8000/api/canales/usuario/${movie.creadorId}`, { cache: 'no-store' });
      if (res.ok) {
        creatorChannel = await res.json();
      }
    } catch (e) {
      console.error("Error al obtener canal del creador:", e);
    }
  }

  // Validar límite diario si el usuario tiene plan básico
  let isDailyLimitReached = false;
  if (userPlan === 'BASIC') {
    const viewRegistration = await registerMovieView(id);
    if (viewRegistration && viewRegistration.allowed === false && viewRegistration.error === 'daily_limit_reached') {
      isDailyLimitReached = true;
    }
  }

  const initialIsFavorite = await checkIsFavorite(id);
  const favoritosCountData = await getFavoritosCountAction(id);
  const initialFavoritosCount = favoritosCountData.success ? favoritosCountData.count : 0;

  const votoStatusData = await getVotoStatusAction(id);
  const initialVotoStatus = votoStatusData.success ? votoStatusData.tipo : null;

  const progressData = await getProgressAction(id);
  const initialTime = progressData.completada ? 0 : (progressData.minutoPausa || 0);

  const isLocked = movie.requierePremium && userPlan === 'BASIC';

  return (
    <>
      <Navbar />

      <main className="pt-[70px] bg-[#020817]">

        <MovieHero
          movie={{ ...movie, id }}
          initialIsFavorite={initialIsFavorite}
          initialFavoritosCount={initialFavoritosCount}
          initialVotoStatus={initialVotoStatus}
          userPlan={userPlan}
          isDailyLimitReached={isDailyLimitReached}
          creatorChannel={creatorChannel}
        />

        <div id="movie-player">
          {isLocked ? (
            <PaywallBlock movieTitle={movie.titulo} />
          ) : isDailyLimitReached ? (
            <DailyLimitPaywall />
          ) : (
            <MoviePlayer
              videoUrl={movie.rutaVideoCompleta}
              posterUrl={movie.rutaImagenFondo}
              peliculaId={id}
              initialTime={initialTime}
              userPlan={userPlan}
            />
          )}
        </div>

        {/* Panel de Comentarios Estilo YouTube */}
        <MovieComments peliculaId={id} currentUserPlan={userPlan} movieCreatorId={movie.creadorId} />

        {/* Aquí podrías añadir secciones extra como "Películas Similares" más adelante */}
      </main>
    </>
  );
}