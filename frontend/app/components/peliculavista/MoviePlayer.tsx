// components/peliculas/MoviePlayer.tsx
"use client";

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface Props {
  videoUrl: string; // URL del video (o link temporal de fondo)
  posterUrl: string; // Imagen de fondo mientras carga
}

export default function MoviePlayer({ videoUrl, posterUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Alternar Play/Pausa
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Actualizar el progreso del video
  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Cargar metadatos (duración total)
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Avanzar/Retroceder 10 segundos
  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  // Control de volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Control de la barra de progreso (seek)
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  // Alternar Pantalla Completa
  const toggleFullscreen = () => {
    const playerContainer = videoRef.current?.parentElement;
    if (playerContainer) {
      if (!isFullscreen) {
        if (playerContainer.requestFullscreen) playerContainer.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  // Formatear tiempo (mm:ss)
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

        {/* Contenedor del Reproductor con Controles */}
        <div className="relative group aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black">
          
          <video 
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay} // Play/Pausa al hacer clic en el video
          />

          {/* CONTROLES (Solo visibles en hover o pausa) */}
          <div className={`absolute inset-0 bg-black/60 flex flex-col justify-end p-4 transition-opacity duration-300 z-10 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            
            {/* Barra de Progreso (Seekbar) */}
            <input 
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeekChange}
              onMouseDown={() => setIsSeeking(true)}
              onMouseUp={() => setIsSeeking(false)}
              className="w-full h-1.5 mb-4 accent-[#3a86ff] cursor-pointer"
            />

            {/* Fila Inferior de Controles */}
            <div className="flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                {/* Botón Play/Pausa */}
                <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-full">
                  {isPlaying ? <Pause className="fill-white" /> : <Play className="fill-white" />}
                </button>

                {/* Botones -10s / +10s */}
                <button onClick={() => skip(-10)} className="p-2 hover:bg-white/10 rounded-full">
                  <RotateCcw />
                </button>
                <button onClick={() => skip(10)} className="p-2 hover:bg-white/10 rounded-full">
                  <RotateCw />
                </button>

                {/* Control de Volumen */}
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

                {/* Tiempo Actual / Total */}
                <span className="text-sm font-mono text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Botón Pantalla Completa */}
              <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-full">
                {isFullscreen ? <Minimize /> : <Maximize />}
              </button>
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