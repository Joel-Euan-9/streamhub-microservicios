"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  CornerDownRight, 
  CornerUpLeft, 
  Send, 
  Sparkles, 
  CircleUser, 
  Film,
  UserCheck
} from "lucide-react";
import { getStudioMoviesAction } from "@/app/actions/studio";
import { getMovieComments, addMovieComment } from "@/app/actions/comments";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: string;
}

interface CommentReply {
  id: string;
  usuarioId: string;
  peliculaId: string;
  contenido: string;
  fecha: string;
  parentId: string;
  usuario: UserProfile;
}

interface MovieComment {
  id: string;
  usuarioId: string;
  peliculaId: string;
  contenido: string;
  fecha: string;
  parentId: string | null;
  usuario: UserProfile;
  respuestas: CommentReply[];
}

interface StudioMovie {
  id: string;
  title: string;
  image: string;
  creadorId: string;
  commentsCount: number;
}

export default function FeedbackPage() {
  const [movies, setMovies] = useState<StudioMovie[]>([]);
  const [creatorProfile, setCreatorProfile] = useState<UserProfile | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [comments, setComments] = useState<MovieComment[]>([]);
  
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  
  const [generalText, setGeneralText] = useState("");
  const [submittingGeneral, setSubmittingGeneral] = useState(false);

  // Cargar películas del creador
  const loadStudioMovies = async (selectFirst = true) => {
    try {
      if (selectFirst) setMoviesLoading(true);
      const res = await getStudioMoviesAction();
      if (res.success && res.movies) {
        setMovies(res.movies);
        setCreatorProfile(res.profile);
        if (selectFirst && res.movies.length > 0) {
          setSelectedMovieId(res.movies[0].id);
        }
      }
    } catch (err) {
      console.error("Error al cargar películas de Studio:", err);
    } finally {
      setMoviesLoading(false);
    }
  };

  // Cargar comentarios de la película seleccionada
  const loadComments = async (movieId: string) => {
    setCommentsLoading(true);
    try {
      const data = await getMovieComments(movieId);
      setComments(data);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    loadStudioMovies();
  }, []);

  useEffect(() => {
    if (selectedMovieId) {
      loadComments(selectedMovieId);
    } else {
      setComments([]);
    }
  }, [selectedMovieId]);

  const selectedMovie = movies.find(m => m.id === selectedMovieId);

  // Enviar respuesta a un comentario específico (hilo)
  const handleSendReply = async (commentId: string) => {
    if (!selectedMovieId || !replyText.trim() || submittingReply) return;
    setSubmittingReply(true);
    try {
      const res = await addMovieComment(selectedMovieId, replyText, commentId);
      if (res.success) {
        setReplyText("");
        setReplyingToCommentId(null);
        await loadComments(selectedMovieId);
        // Actualizar el conteo de la izquierda silenciosamente
        await loadStudioMovies(false);
      } else {
        alert(res.error || "Error al responder.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  };

  // Enviar anuncio o comentario general
  const handleSendGeneral = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMovieId || !generalText.trim() || submittingGeneral) return;
    setSubmittingGeneral(true);
    try {
      const res = await addMovieComment(selectedMovieId, generalText);
      if (res.success) {
        setGeneralText("");
        await loadComments(selectedMovieId);
        // Actualizar el conteo de la izquierda silenciosamente
        await loadStudioMovies(false);
      } else {
        alert(res.error || "Error al publicar comentario.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingGeneral(false);
    }
  };

  // Helper para generar iniciales
  const getInitials = (name: string) => {
    if (!name) return "SH";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Helper para color de fondo de avatar
  const getAvatarBg = (name: string) => {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(37,99,235,0.35)]",
      "from-blue-600 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.35)]",
      "from-pink-600 to-rose-500 shadow-[0_0_15px_rgba(236,72,153,0.35)]",
      "from-emerald-600 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]",
      "from-amber-600 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.35)]",
    ];
    return colors[hash % colors.length];
  };

  // Helper para formatear tiempo relativo en español
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Hace un momento";
    if (diffMin < 60) return `Hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    if (diffHr < 24) return `Hace ${diffHr} ${diffHr === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Helper para insignia de plan
  const renderPlanBadge = (plan: string) => {
    if (plan === "STUDIO") {
      return (
        <span className="flex items-center gap-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-black tracking-wider text-cyan-400 uppercase">
          Studio
        </span>
      );
    }
    if (plan === "PREMIUM") {
      return (
        <span className="flex items-center gap-1 rounded-full bg-yellow-950/60 border border-yellow-500/40 px-2 py-0.5 text-[10px] font-black tracking-wider text-yellow-400 uppercase">
          <Sparkles size={10} className="text-yellow-400" />
          Premium
        </span>
      );
    }
    return (
      <span className="rounded-full bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-400 uppercase">
        Básico
      </span>
    );
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
        <div className="w-1/3 min-w-[290px] border-r border-white/10 bg-[#121826]/50 flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#aeb4c0]">Tus Películas</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {moviesLoading ? (
              /* Skeletons de carga */
              <div className="space-y-2 p-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl animate-pulse">
                    <div className="h-14 w-10 bg-white/10 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-12 px-4 text-[#aeb4c0] flex flex-col items-center gap-2">
                <Film size={36} className="text-gray-500 animate-pulse" />
                <p className="font-bold text-sm">No has subido películas aún</p>
                <p className="text-xs text-gray-500">Sube películas en la pestaña "Mis Películas" para recibir feedback.</p>
              </div>
            ) : (
              movies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => {
                    setSelectedMovieId(movie.id);
                    setReplyingToCommentId(null);
                  }}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-all rounded-xl mb-1 border ${
                    selectedMovieId === movie.id 
                      ? "bg-blue-600/10 border-blue-500/30" 
                      : "hover:bg-white/5 border-transparent"
                  }`}
                >
                  <img 
                    src={movie.image} 
                    alt={movie.title} 
                    className="h-14 w-10 rounded object-cover shadow-sm bg-white/5"
                  />
                  <div className="flex-1 overflow-hidden">
                    <h3 className={`truncate font-bold text-sm ${selectedMovieId === movie.id ? "text-white" : "text-[#aeb4c0]"}`}>
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {movie.commentsCount} {movie.commentsCount === 1 ? 'comentario' : 'comentarios'}
                    </p>
                  </div>
                  {movie.commentsCount > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-black text-blue-400">
                      {movie.commentsCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* PANEL DERECHO: Hilo de Comentarios (DETALLE) */}
        <div className="flex-1 flex flex-col bg-[#0b0c15] relative overflow-hidden">
          {selectedMovie ? (
            <>
              {/* Detalle Header */}
              <div className="p-4 border-b border-white/10 bg-[#121826]/80 backdrop-blur flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <img src={selectedMovie.image} alt="poster" className="h-10 w-7 rounded object-cover" />
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">{selectedMovie.title}</h2>
                    <p className="text-xs text-[#aeb4c0] flex items-center gap-1 mt-0.5">
                      <MessageSquare size={12} /> {comments.reduce((acc, c) => acc + 1 + (c.respuestas?.length || 0), 0)} interacciones en total
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de Comentarios */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {commentsLoading ? (
                  /* Placeholder de carga de comentarios */
                  <div className="space-y-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="flex gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-white/5" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-white/10 rounded w-1/4" />
                          <div className="h-3 bg-white/5 rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center">
                    <MessageSquare size={48} className="text-gray-600 mb-3 animate-pulse" />
                    <p className="text-gray-400 font-bold">Sin comentarios aún</p>
                    <p className="text-xs text-gray-500 mt-1">Los comentarios de tu audiencia aparecerán aquí.</p>
                  </div>
                ) : (
                  comments.map((comment) => {
                    const isCommentCreator = comment.usuarioId === selectedMovie.creadorId;
                    return (
                      <div key={comment.id} className="flex gap-4">
                        
                        {/* Avatar */}
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${getAvatarBg(comment.usuario.name)} text-white font-extrabold text-sm border border-white/10 shadow-md`}>
                          {getInitials(comment.usuario.name)}
                        </div>

                        {/* Contenido del comentario */}
                        <div className="flex-1 min-w-0">
                          <div className={`rounded-2xl rounded-tl-none border p-4 shadow-sm transition-all duration-300 ${
                            isCommentCreator
                              ? "bg-blue-950/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.08)]"
                              : "bg-[#121826] border-white/5"
                          }`}>
                            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">{comment.usuario.name}</span>
                                {isCommentCreator ? (
                                  <span className="flex items-center gap-0.5 rounded-full bg-blue-950/80 border border-blue-500/50 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-blue-400 uppercase shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                                    <UserCheck size={9} />
                                    Creador
                                  </span>
                                ) : (
                                  renderPlanBadge(comment.usuario.plan)
                                )}
                              </div>
                              <span className="text-[11px] text-gray-500">{formatRelativeTime(comment.fecha)}</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {comment.contenido}
                            </p>
                          </div>

                          {/* Respuestas anidadas (Hilos) */}
                          {comment.respuestas && comment.respuestas.length > 0 && (
                            <div className="mt-3 space-y-3 ml-4 pl-3 border-l border-white/10">
                              {comment.respuestas.map((reply) => {
                                const isReplyCreator = reply.usuarioId === selectedMovie.creadorId;
                                return (
                                  <div key={reply.id} className="flex gap-3">
                                    
                                    {/* Avatar Respuesta */}
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${getAvatarBg(reply.usuario.name)} text-white font-extrabold text-xs border border-white/10 shadow-sm`}>
                                      {getInitials(reply.usuario.name)}
                                    </div>

                                    {/* Contenido Respuesta */}
                                    <div className="flex-1 min-w-0">
                                      <div className={`rounded-xl rounded-tl-none border p-3 shadow-sm transition-all duration-300 ${
                                        isReplyCreator
                                          ? "bg-blue-950/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.08)]"
                                          : "bg-[#121826]/60 border-white/5"
                                      }`}>
                                        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-xs text-white">{reply.usuario.name}</span>
                                            {isReplyCreator ? (
                                              <span className="flex items-center gap-0.5 rounded-full bg-blue-950/80 border border-blue-500/50 px-1.5 py-0.5 text-[8px] font-black tracking-wider text-blue-400 uppercase shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                                                <UserCheck size={8} />
                                                Respuesta del Estudio
                                              </span>
                                            ) : (
                                              renderPlanBadge(reply.usuario.plan)
                                            )}
                                          </div>
                                          <span className="text-[10px] text-gray-500">{formatRelativeTime(reply.fecha)}</span>
                                        </div>
                                        <p className="text-gray-300 text-xs leading-relaxed">
                                          {reply.contenido}
                                        </p>
                                      </div>
                                    </div>

                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Botón de Respuesta Inline */}
                          {replyingToCommentId !== comment.id && (
                            <div className="mt-2 ml-4">
                              <button 
                                onClick={() => {
                                  setReplyingToCommentId(comment.id);
                                  setReplyText("");
                                }}
                                className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline transition"
                              >
                                <CornerUpLeft size={12} /> Responder
                              </button>
                            </div>
                          )}

                          {/* Editor de Respuesta */}
                          {replyingToCommentId === comment.id && (
                            <div className="mt-3 ml-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                              <CornerDownRight size={18} className="text-blue-500 shrink-0 mt-2" />
                              <div className="flex-1 space-y-2">
                                <textarea
                                  autoFocus
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={`Responder a ${comment.usuario.name}...`}
                                  className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0c15] p-3 text-xs text-white placeholder:text-white/20 focus:border-blue-500 focus:outline-none transition"
                                  rows={2}
                                />
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => {
                                      setReplyingToCommentId(null);
                                      setReplyText("");
                                    }}
                                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition"
                                  >
                                    Cancelar
                                  </button>
                                  <button 
                                    onClick={() => handleSendReply(comment.id)}
                                    disabled={!replyText.trim() || submittingReply}
                                    className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-md flex items-center gap-1"
                                  >
                                    {submittingReply ? (
                                      <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                                    ) : (
                                      <>
                                        Responder
                                        <Send size={10} />
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input General Estilo WhatsApp (Anuncio o Comentario del Creador) */}
              <div className="border-t border-white/10 bg-[#121826]/80 backdrop-blur p-4 mt-auto">
                <form onSubmit={handleSendGeneral} className="flex items-center gap-3 rounded-full border border-white/10 bg-[#0b0c15] px-4 py-2 focus-within:border-blue-500 transition">
                  <input 
                    type="text" 
                    value={generalText}
                    onChange={(e) => setGeneralText(e.target.value)}
                    placeholder="Escribe un anuncio o respuesta general..." 
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
                    disabled={submittingGeneral}
                  />
                  <button 
                    type="submit"
                    disabled={!generalText.trim() || submittingGeneral}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:scale-105 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submittingGeneral ? (
                      <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
                    ) : (
                      <Send size={12} className="ml-0.5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center flex-col gap-2 p-6 text-center">
              <Film size={48} className="text-gray-600 animate-pulse" />
              <p className="text-gray-400 font-bold">Selecciona una película</p>
              <p className="text-xs text-gray-500">Elige una película de la lista de la izquierda para ver e interactuar con su feedback.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
