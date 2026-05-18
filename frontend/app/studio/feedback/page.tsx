"use client";

import { useState } from "react";
import { MessageSquare, User, CornerDownRight, CheckCircle2, CornerUpLeft, Send } from "lucide-react";

// Mock Data Complejo
const mockFeedbackData = [
  {
    id: "m1",
    title: "Thor: Ragnarok",
    image: "https://image.tmdb.org/t/p/w500/rzRwTcFvttce1VKwLyvqpsqDTIz.jpg",
    unreadCount: 2,
    comments: [
      {
        id: "c1",
        user: "GamerPro99",
        date: "Hace 2 horas",
        content: "¡Excelente calidad de video! ¿Subirán la versión extendida?",
        creatorReply: null
      },
      {
        id: "c2",
        user: "Cinefilo_23",
        date: "Ayer",
        content: "El audio se desincroniza un poco en el minuto 45.",
        creatorReply: "¡Hola! Gracias por el aviso. Ya subimos un parche corrigiendo el desfase de audio. Saludos."
      },
      {
        id: "c3",
        user: "MarvelFan",
        date: "Hace 3 días",
        content: "La mejor peli de Thor sin duda alguna.",
        creatorReply: null
      }
    ]
  },
  {
    id: "m2",
    title: "Coco",
    image: "https://image.tmdb.org/t/p/w500/eKi8dIrr8ca28IQZivEza1zRaSA.jpg",
    unreadCount: 1,
    comments: [
      {
        id: "c4",
        user: "MariaLopez",
        date: "Hace 5 horas",
        content: "Me hizo llorar, hermosa película. Ojalá traigan más contenido de Pixar.",
        creatorReply: null
      }
    ]
  },
  {
    id: "m3",
    title: "Jurassic World",
    image: "https://image.tmdb.org/t/p/w500/c9XxwwhHU33KT8Xym9YRs19bA3B.jpg",
    unreadCount: 0,
    comments: [
      {
        id: "c5",
        user: "RexHunter",
        date: "Hace 1 semana",
        content: "Buenos efectos especiales pero prefiero la original.",
        creatorReply: "¡Es difícil superar al clásico de Spielberg! Gracias por comentar."
      }
    ]
  }
];

export default function FeedbackPage() {
  const [selectedMovieId, setSelectedMovieId] = useState(mockFeedbackData[0].id);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const selectedMovie = mockFeedbackData.find(m => m.id === selectedMovieId);

  const handleSendReply = (commentId: string) => {
    alert(`Respuesta enviada (Solo UI):\n"${replyText}"`);
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* HEADER */}
      <div className="mb-6 flex-shrink-0 mt-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Centro de Feedback
        </h1>
        <p className="mt-1 text-[#aeb4c0]">
          Interactúa con tu audiencia respondiendo a sus comentarios y sugerencias.
        </p>
      </div>

      {/* MAESTRO-DETALLE GRID */}
      <div className="flex flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c15] shadow-xl">
        
        {/* PANEL IZQUIERDO: Lista de Películas (MAESTRO) */}
        <div className="w-1/3 min-w-[280px] border-r border-white/10 bg-[#121826]/50 flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#aeb4c0]">Tus Películas</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {mockFeedbackData.map((movie) => (
              <button
                key={movie.id}
                onClick={() => {
                  setSelectedMovieId(movie.id);
                  setReplyingTo(null);
                }}
                className={`w-full flex items-center gap-3 p-3 text-left transition-all rounded-xl mb-1 ${
                  selectedMovieId === movie.id 
                    ? "bg-[#00f2fe]/10 border border-[#00f2fe]/30" 
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="h-14 w-10 rounded object-cover shadow-sm"
                />
                <div className="flex-1 overflow-hidden">
                  <h3 className={`truncate font-bold ${selectedMovieId === movie.id ? "text-white" : "text-[#aeb4c0]"}`}>
                    {movie.title}
                  </h3>
                  <p className="text-xs text-[#aeb4c0] truncate">
                    {movie.comments.length} comentarios
                  </p>
                </div>
                {movie.unreadCount > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00f2fe] text-xs font-bold text-[#0b0c15] shadow-[0_0_10px_rgba(0,242,254,0.5)]">
                    {movie.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO: Hilo de Comentarios (DETALLE) */}
        <div className="flex-1 flex flex-col bg-[#0b0c15] relative">
          {selectedMovie ? (
            <>
              {/* Detalle Header */}
              <div className="p-6 border-b border-white/10 bg-[#121826]/80 backdrop-blur flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <img src={selectedMovie.image} alt="poster" className="h-12 w-8 rounded object-cover" />
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedMovie.title}</h2>
                    <p className="text-sm text-[#aeb4c0] flex items-center gap-1">
                      <MessageSquare size={14} /> Mostrando {selectedMovie.comments.length} interacciones
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de Comentarios */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {selectedMovie.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    
                    {/* Avatar Usuario */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#aeb4c0]">
                      <User size={20} />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                      <div className="rounded-2xl rounded-tl-none border border-white/10 bg-[#121826] p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white">{comment.user}</span>
                          <span className="text-xs text-[#aeb4c0]">{comment.date}</span>
                        </div>
                        <p className="text-[#aeb4c0] text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>

                      {/* Respuesta del Creador (Si existe) */}
                      {comment.creatorReply && (
                        <div className="mt-3 flex gap-3 ml-4">
                          <CornerDownRight size={20} className="text-[#00f2fe] shrink-0 mt-2" />
                          <div className="flex-1 rounded-2xl rounded-tl-none border border-[#00f2fe]/30 bg-[#00f2fe]/5 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 size={16} className="text-[#00f2fe]" />
                              <span className="font-bold text-[#00f2fe] text-sm">Respuesta de tu Estudio</span>
                            </div>
                            <p className="text-white text-sm leading-relaxed">
                              {comment.creatorReply}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Botón / Caja para Responder (Si no hay respuesta) */}
                      {!comment.creatorReply && replyingTo !== comment.id && (
                        <div className="mt-2 ml-4">
                          <button 
                            onClick={() => setReplyingTo(comment.id)}
                            className="flex items-center gap-1 text-xs font-bold text-[#3a86ff] hover:underline"
                          >
                            <CornerUpLeft size={14} /> Responder
                          </button>
                        </div>
                      )}

                      {/* Editor de Respuesta */}
                      {replyingTo === comment.id && (
                        <div className="mt-3 ml-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                          <CornerDownRight size={20} className="text-[#3a86ff] shrink-0 mt-2" />
                          <div className="flex-1 space-y-3">
                            <textarea
                              autoFocus
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Respondiendo a ${comment.user}...`}
                              className="w-full resize-none rounded-xl border border-[#3a86ff]/50 bg-[#0b0c15] p-3 text-sm text-white placeholder:text-white/30 focus:border-[#3a86ff] focus:outline-none focus:ring-1 focus:ring-[#3a86ff]"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                className="rounded-lg px-4 py-2 text-xs font-bold text-[#aeb4c0] hover:bg-white/5 transition"
                              >
                                Cancelar
                              </button>
                              <button 
                                onClick={() => handleSendReply(comment.id)}
                                disabled={!replyText.trim()}
                                className="rounded-lg bg-[#3a86ff] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#2563eb] disabled:opacity-50"
                              >
                                Enviar Respuesta
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>

              {/* Input General Estilo WhatsApp (Fijo Abajo) */}
              <div className="border-t border-white/10 bg-[#121826]/80 backdrop-blur p-4 mt-auto">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#0b0c15] px-4 py-2 focus-within:border-[#00f2fe] focus-within:ring-1 focus-within:ring-[#00f2fe] transition">
                  <input 
                    type="text" 
                    placeholder="Escribe un anuncio o respuesta general..." 
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        alert(`Mensaje general enviado:\n"${e.currentTarget.value}"`);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Escribe un anuncio o respuesta general..."]') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        alert(`Mensaje general enviado:\n"${input.value}"`);
                        input.value = "";
                      }
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00f2fe] text-[#0b0c15] transition hover:scale-105 hover:bg-[#3a86ff] hover:text-white"
                  >
                    <Send size={14} className="ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-[#aeb4c0]">Selecciona una película para ver su feedback</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
