// components/peliculas/MoviePlayer.tsx
"use client";

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { saveProgressAction } from '@/app/actions/historial';

interface Props {
  videoUrl: string;
  posterUrl: string;
  peliculaId?: string;
  initialTime?: number;
  userPlan?: string; // Plan del usuario actual ('BASIC', 'PREMIUM', 'STUDIO')
}

// Pool de 8 IDs de anuncios de YouTube recopilados
const YOUTUBE_ADS = [
  "2NMzLEvyjeo", // Coca-Cola
  "gvF2lw5GoRs",
  "a5MkRxo3YIY",
  "Y7wu2PqOGEQ",
  "Qt2AN8QdZSI",
  "AlgDTup63GQ",
  "vZpD0p4rTXc",
  "EpK0P3vfDJc"
];

export default function MoviePlayer({ videoUrl, posterUrl, peliculaId, initialTime = 0, userPlan = 'BASIC' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Referencia para el temporizador
  const initialTimeSetRef = useRef(false);
  const lastSavedTimeRef = useRef(-1);
  const previousVolumeRef = useRef(1); // Guardar volumen antes de mutear

  // Estados estándar del reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Estados del sistema de anuncios
  const [showAd, setShowAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(15);
  const [currentAdId, setCurrentAdId] = useState<string | null>(null);
  const [preRollPlayed, setPreRollPlayed] = useState(false);
  const [midRollPlayed, setMidRollPlayed] = useState(false);

  // Sincronizar estados en referencias para evitar problemas de clousure en los event listeners
  const showAdRef = useRef(false);
  showAdRef.current = showAd;

  const preRollPlayedRef = useRef(false);
  preRollPlayedRef.current = preRollPlayed;

  // Escuchar la tecla 'Esc' para sincronizar el estado de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Función para disparar la lógica de un anuncio
  const triggerAd = () => {
    const randomIndex = Math.floor(Math.random() * YOUTUBE_ADS.length);
    setCurrentAdId(YOUTUBE_ADS[randomIndex]);
    setAdTimeLeft(15);
    setShowAd(true);
    setShowControls(false); // Ocultar controles durante el anuncio

    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Cuenta regresiva del anuncio
  useEffect(() => {
    if (!showAd) return;

    if (adTimeLeft <= 0) {
      setShowAd(false);
      setCurrentAdId(null);
      // Reanudar la película
      if (videoRef.current) {
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => console.error("Error al reanudar video:", err));
      }
      return;
    }

    const timer = setTimeout(() => {
      setAdTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showAd, adTimeLeft]);

  // Manejador central para reproducir la película y controlar pre-rolls
  const playVideo = () => {
    if (videoRef.current) {
      if (userPlan === 'BASIC' && !preRollPlayedRef.current) {
        setPreRollPlayed(true);
        triggerAd();
        return;
      }

      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => console.error("Error al reproducir video:", err));
    }
  };

  // Escuchar atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Si se está mostrando un anuncio, ignorar todos los atajos de teclado
      if (showAdRef.current) {
        e.preventDefault();
        return;
      }

      // Ignorar la tecla si el usuario está escribiendo en un input o textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Evita el scroll
          if (videoRef.current) {
            if (videoRef.current.paused) {
              playVideo();
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
              setShowControls(true);
            }
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime += 10;
            setShowControls(true);
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime -= 10;
            setShowControls(true);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current) {
            const newVolumeUp = Math.min(videoRef.current.volume + 0.1, 1);
            videoRef.current.volume = newVolumeUp;
            setVolume(newVolumeUp);
            setShowControls(true);
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current) {
            const newVolumeDown = Math.max(videoRef.current.volume - 0.1, 0);
            videoRef.current.volume = newVolumeDown;
            setVolume(newVolumeDown);
            setShowControls(true);
          }
          break;

        case 'KeyF':
          e.preventDefault();
          const playerContainer = videoRef.current?.parentElement;
          if (playerContainer) {
            if (!document.fullscreenElement) {
              playerContainer.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [userPlan]); // Actualizar si cambia el plan

  // Manejar el movimiento del mouse para mostrar/ocultar controles
  const handleMouseMove = () => {
    if (showAd) return; // Bloquear controles si hay anuncio

    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Ocultar controles después de 2.5 segundos de inactividad (solo si está reproduciendo)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  // Si el mouse sale del reproductor, ocultar controles inmediatamente
  const handleMouseLeave = () => {
    if (isPlaying && !showAd) {
      setShowControls(false);
    }
  };

  // Asegurarnos de limpiar el timeout si el componente se desmonta
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const saveProgress = async (time: number, dur: number) => {
    if (!peliculaId || time === lastSavedTimeRef.current) return;
    lastSavedTimeRef.current = time;
    const isCompleted = dur > 0 && (time / dur) >= 0.95;
    await saveProgressAction(peliculaId, Math.floor(time), isCompleted);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && duration > 0 && !showAd) {
      interval = setInterval(() => {
        if (videoRef.current) saveProgress(videoRef.current.currentTime, duration);
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, peliculaId, showAd]);

  const togglePlay = () => {
    if (showAd) return; // Deshabilitar interacción durante anuncios

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowControls(true); // Mostrar controles al pausar
        saveProgress(videoRef.current.currentTime, duration); // Guardar progreso al pausar
        setIsPlaying(false);
      } else {
        playVideo();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking && !showAd) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);

      // Lógica de anuncio Mid-roll al 50% de la duración
      if (userPlan === 'BASIC' && !midRollPlayed && duration > 0) {
        const midPoint = duration / 2;
        if (current >= midPoint) {
          setMidRollPlayed(true);
          triggerAd();
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (initialTime > 0 && !initialTimeSetRef.current) {
        videoRef.current.currentTime = initialTime;
        setCurrentTime(initialTime);
        initialTimeSetRef.current = true;
      }
    }
  };

  const skip = (amount: number) => {
    if (showAd) return;
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showAd) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) previousVolumeRef.current = newVolume;
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (showAd) return;
    if (volume > 0) {
      previousVolumeRef.current = volume;
      setVolume(0);
      if (videoRef.current) videoRef.current.volume = 0;
    } else {
      const restoreVol = previousVolumeRef.current > 0 ? previousVolumeRef.current : 1;
      setVolume(restoreVol);
      if (videoRef.current) videoRef.current.volume = restoreVol;
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showAd) return;
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const toggleFullscreen = () => {
    const playerContainer = videoRef.current?.parentElement;
    if (playerContainer) {
      if (!isFullscreen) {
        if (playerContainer.requestFullscreen) playerContainer.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <section className="bg-[#020817] pb-20 text-white">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold mb-8 border-l-4 border-[#3a86ff] pl-4">
          Reproductor de Película
        </h2>

        <div
          className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black ${!showControls && isFullscreen ? 'cursor-none' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* VIDEO PRINCIPAL */}
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            className={`w-full h-full object-contain ${showControls && !showAd ? 'cursor-pointer' : 'cursor-none'}`}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
          />

          {/* SUPERPOSICIÓN DE ANUNCIO DE YOUTUBE */}
          {showAd && (
            <div className="absolute inset-0 z-40 bg-black flex items-center justify-center pointer-events-auto">
              {/* Bloqueador de clics/interacción para evitar que pausen el anuncio */}
              <div className="absolute inset-0 z-50 bg-transparent cursor-not-allowed pointer-events-auto" />

              <iframe
                src={`https://www.youtube.com/embed/${currentAdId}?autoplay=1&controls=0&mute=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&disablekb=1&enablejsapi=1`}
                className="w-full h-full pointer-events-none"
                allow="autoplay; encrypted-media"
                frameBorder="0"
              />

              {/* Banner elegante del anuncio (Glassmorphism) */}
              <div className="absolute bottom-6 right-6 z-55 flex items-center gap-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 px-5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />
                <p className="text-sm font-semibold text-gray-200">
                  Anuncio Patrocinado • Tu video continuará en <span className="text-[#3a86ff] font-mono text-base font-bold ml-1">{adTimeLeft}s</span>
                </p>
              </div>
            </div>
          )}

          {/* CONTROLES DEL REPRODUCTOR */}
          <div className={`absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 z-10 pointer-events-none ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>

            {/* Fondo degradado oscuro solo en la base */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent -z-10 pointer-events-none" />

            {/* Contenedor de controles con pointer-events-auto para que sean clickeables */}
            <div className="pointer-events-auto w-full">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                onMouseDown={() => setIsSeeking(true)}
                onMouseUp={() => setIsSeeking(false)}
                className="w-full h-1.5 mb-4 accent-[#3a86ff] cursor-pointer"
                disabled={showAd}
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-full" disabled={showAd}>
                    {isPlaying ? <Pause className="fill-white" /> : <Play className="fill-white" />}
                  </button>

                  <button onClick={() => skip(-10)} className="p-2 hover:bg-white/10 rounded-full" disabled={showAd}>
                    <RotateCcw />
                  </button>
                  <button onClick={() => skip(10)} className="p-2 hover:bg-white/10 rounded-full" disabled={showAd}>
                    <RotateCw />
                  </button>

                  <div className="flex items-center group/volume">
                    <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-full transition-colors z-10 relative" disabled={showAd}>
                      {volume === 0 ? <VolumeX /> : <Volume2 />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-0 opacity-0 group-hover/volume:w-24 group-hover/volume:opacity-100 group-hover/volume:ml-2 transition-all duration-300 accent-white cursor-pointer"
                      disabled={showAd}
                    />
                  </div>

                  <span className="text-sm font-mono text-gray-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-full">
                  {isFullscreen ? <Minimize /> : <Maximize />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-400 italic">
          * Nota: El reproductor está cargando una imagen de fondo temporal hasta que la ruta del video en la base de datos esté completa.
        </p>
      </div>
    </section>
  );
}