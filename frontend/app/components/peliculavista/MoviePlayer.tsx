// components/peliculas/MoviePlayer.tsx
"use client";

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface Props {
  videoUrl: string;
  posterUrl: string;
}

export default function MoviePlayer({ videoUrl, posterUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Referencia para el temporizador
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true); // Nuevo estado para controlar la visibilidad

  // Escuchar la tecla 'Esc' para sincronizar el estado de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Escuchar atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ignorar la tecla si el usuario está escribiendo en un input o textarea
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // 2. Usamos un switch para manejar múltiples teclas
      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Evita el scroll
          if (videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play();
              setIsPlaying(true);
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
              setShowControls(true);
            }
          }
          break;

        case 'ArrowRight':
          e.preventDefault(); // Evita el scroll horizontal
          if (videoRef.current) {
            videoRef.current.currentTime += 10;
            setShowControls(true); // Muestra los controles para que el usuario vea el progreso
          }
          break;

        case 'ArrowLeft':
          e.preventDefault(); // Evita el scroll horizontal
          if (videoRef.current) {
            videoRef.current.currentTime -= 10;
            setShowControls(true);
          }
          break;

        case 'ArrowUp':
          e.preventDefault(); // Evita el scroll vertical
          if (videoRef.current) {
            // Usamos Math.min para asegurar que el volumen no pase de 1 (100%)
            const newVolumeUp = Math.min(videoRef.current.volume + 0.1, 1);
            videoRef.current.volume = newVolumeUp;
            setVolume(newVolumeUp);
            setShowControls(true); // Muestra la barrita de volumen ajustándose
          }
          break;

        case 'ArrowDown':
          e.preventDefault(); // Evita el scroll vertical
          if (videoRef.current) {
            // Usamos Math.max para asegurar que el volumen no baje de 0 (Mute)
            const newVolumeDown = Math.max(videoRef.current.volume - 0.1, 0);
            videoRef.current.volume = newVolumeDown;
            setVolume(newVolumeDown);
            setShowControls(true);
          }
          break;
          
        case 'KeyF':
          // Extra: Atajo clásico para pantalla completa con la letra F
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
  }, []); // El array vacío es correcto porque interactuamos directamente con el DOM (videoRef)

  // Manejar el movimiento del mouse para mostrar/ocultar controles
  const handleMouseMove = () => {
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
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // Asegurarnos de limpiar el timeout si el componente se desmonta
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowControls(true); // Mostrar controles al pausar
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        {/* 1. Se agregó onMouseMove y onMouseLeave
          2. Se oculta el cursor (cursor-none) cuando los controles no están visibles
        */}
        <div 
          className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black ${!showControls && isFullscreen ? 'cursor-none' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          
          <video 
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            className={`w-full h-full object-contain ${showControls ? 'cursor-pointer' : 'cursor-none'}`}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay} 
          />

          {/* 1. Se eliminó la dependencia de group-hover.
            2. La opacidad ahora depende del estado showControls.
            3. Se cambió de 'bg-black/60' a un degradado para no oscurecer el centro de la pantalla.
          */}
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
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-full">
                    {isPlaying ? <Pause className="fill-white" /> : <Play className="fill-white" />}
                  </button>

                  <button onClick={() => skip(-10)} className="p-2 hover:bg-white/10 rounded-full">
                    <RotateCcw />
                  </button>
                  <button onClick={() => skip(10)} className="p-2 hover:bg-white/10 rounded-full">
                    <RotateCw />
                  </button>

                  <div className="flex items-center gap-2 group/volume">
                    {volume === 0 ? <VolumeX /> : <Volume2 />}
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/volume:w-20 transition-all accent-white cursor-pointer"
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