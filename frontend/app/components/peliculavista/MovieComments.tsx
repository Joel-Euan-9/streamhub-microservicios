"use client";

import { useState, useEffect } from "react";
import { getMovieComments, addMovieComment } from "@/app/actions/comments";
import { MessageSquare, Send, Reply, ChevronDown, ChevronUp, Sparkles, CircleUser } from "lucide-react";

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

interface Props {
  peliculaId: string;
  currentUserPlan?: string;
  movieCreatorId?: string; // ID del creador de la película
}

export default function MovieComments({ peliculaId, currentUserPlan = "BASIC", movieCreatorId }: Props) {
  const [comments, setComments] = useState<MovieComment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para gestionar respuestas a nivel de comentario
  const [replyTexts, setReplyTexts] = useState<{ [commentId: string]: string }>({});
  const [activeReplyInputId, setActiveReplyInputId] = useState<string | null>(null);
  const [submittingReplies, setSubmittingReplies] = useState<{ [commentId: string]: boolean }>({});
  const [expandedComments, setExpandedComments] = useState<{ [commentId: string]: boolean }>({});

  const loadComments = async () => {
    try {
      const data = await getMovieComments(peliculaId);
      setComments(data);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [peliculaId]);

  const handlePostMainComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await addMovieComment(peliculaId, newCommentText);
      if (res.success) {
        setNewCommentText("");
        await loadComments();
      } else {
        alert(res.error || "Ocurrió un error al enviar tu comentario.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostReply = async (commentId: string) => {
    const text = replyTexts[commentId];
    if (!text || !text.trim() || submittingReplies[commentId]) return;

    setSubmittingReplies(prev => ({ ...prev, [commentId]: true }));
    try {
      const res = await addMovieComment(peliculaId, text, commentId);
      if (res.success) {
        setReplyTexts(prev => ({ ...prev, [commentId]: "" }));
        setActiveReplyInputId(null);
        setExpandedComments(prev => ({ ...prev, [commentId]: true })); // Expandir respuestas
        await loadComments();
      } else {
        alert(res.error || "Ocurrió un error al responder.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => ({ ...prev, [commentId]: !prev[commentId] }));
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
    <section className="bg-[#020817] pb-24 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-blue-500 pl-4 flex items-center gap-3">
          <MessageSquare className="text-blue-400" />
          Conversación ({comments.reduce((acc, c) => acc + 1 + (c.respuestas?.length || 0), 0)})
        </h2>

        {/* Formulario Principal de Comentarios */}
        <form onSubmit={handlePostMainComment} className="mb-10 flex gap-4 items-start bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <CircleUser size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <textarea
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="¿Qué te pareció la película? Escribe un comentario..."
              className="w-full resize-none bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-500 border-b border-white/10 pb-2 transition focus:border-blue-400"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={isSubmitting || !newCommentText.trim()}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02] shadow-[0_0_15px_rgba(59,130,246,0.25)]"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Comentar
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {loading ? (
          /* Placeholders de Carga */
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-4 animate-pulse">
                <div className="h-11 w-11 rounded-full bg-white/5" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
            <MessageSquare size={48} className="text-gray-500 mb-3 animate-bounce" />
            <p className="text-gray-400 font-medium">Sé el primero en comentar sobre esta película.</p>
            <p className="text-xs text-gray-500 mt-1">Comparte tus pensamientos y abre la conversación.</p>
          </div>
        ) : (
          /* Lista de Comentarios */
          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="group/item flex gap-4 items-start">
                
                {/* Avatar principal */}
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${getAvatarBg(comment.usuario.name)} text-white font-extrabold text-sm border border-white/10`}>
                  {getInitials(comment.usuario.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`rounded-2xl p-4 transition-all duration-300 ${
                    comment.usuarioId === movieCreatorId
                      ? "bg-blue-950/20 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.08)]"
                      : ""
                  }`}>
                    {/* Fila del autor */}
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span className="font-bold text-sm text-white hover:text-blue-400 transition cursor-pointer">
                        {comment.usuario.name}
                      </span>
                      {comment.usuarioId === movieCreatorId ? (
                        <span className="flex items-center gap-1 rounded-full bg-blue-950/80 border border-blue-500/50 px-2 py-0.5 text-[10px] font-black tracking-wider text-blue-400 uppercase shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                          Creador
                        </span>
                      ) : (
                        renderPlanBadge(comment.usuario.plan)
                      )}
                      <span className="text-xs text-gray-500">
                        • {formatRelativeTime(comment.fecha)}
                      </span>
                    </div>

                    {/* Contenido */}
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.contenido}
                    </p>
                  </div>

                  {/* Acciones del comentario */}
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => {
                        setActiveReplyInputId(activeReplyInputId === comment.id ? null : comment.id);
                        setReplyTexts(prev => ({ ...prev, [comment.id]: "" }));
                      }}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition"
                    >
                      <Reply size={13} />
                      Responder
                    </button>

                    {comment.respuestas && comment.respuestas.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                      >
                        {expandedComments[comment.id] ? (
                          <>
                            <ChevronUp size={14} />
                            Ocultar respuestas
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} />
                            Ver {comment.respuestas.length} {comment.respuestas.length === 1 ? 'respuesta' : 'respuestas'}
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Input de Respuesta Inline */}
                  {activeReplyInputId === comment.id && (
                    <div className="mt-4 flex gap-3 items-start bg-white/5 border border-white/10 rounded-xl p-3 max-w-2xl">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={replyTexts[comment.id] || ""}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                          placeholder={`Responder a ${comment.usuario.name}...`}
                          className="w-full bg-transparent outline-none text-xs text-gray-200 placeholder:text-gray-500 border-b border-white/10 pb-1.5 transition focus:border-blue-400"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => setActiveReplyInputId(null)}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handlePostReply(comment.id)}
                            disabled={submittingReplies[comment.id] || !(replyTexts[comment.id] || "").trim()}
                            className="flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-[0_0_10px_rgba(59,130,246,0.25)]"
                          >
                            {submittingReplies[comment.id] ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <>
                                Responder
                                <Send size={11} />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sublista de Respuestas (Hilos) */}
                  {expandedComments[comment.id] && comment.respuestas && comment.respuestas.length > 0 && (
                    <div className="mt-4 pl-4 border-l border-white/10 space-y-4">
                      {comment.respuestas.map((reply) => (
                        <div key={reply.id} className="flex gap-3 items-start">
                          
                          {/* Avatar de respuesta */}
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${getAvatarBg(reply.usuario.name)} text-white font-extrabold text-xs border border-white/10`}>
                            {getInitials(reply.usuario.name)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className={`rounded-xl p-3 transition-all duration-300 ${
                              reply.usuarioId === movieCreatorId
                                ? "bg-blue-950/20 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.08)]"
                                : ""
                            }`}>
                              {/* Fila del autor de respuesta */}
                              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                                <span className="font-bold text-xs text-white hover:text-blue-400 transition cursor-pointer">
                                  {reply.usuario.name}
                                </span>
                                {reply.usuarioId === movieCreatorId ? (
                                  <span className="flex items-center gap-1 rounded-full bg-blue-950/80 border border-blue-500/50 px-2 py-0.5 text-[9px] font-black tracking-wider text-blue-400 uppercase shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                                    Creador
                                  </span>
                                ) : (
                                  renderPlanBadge(reply.usuario.plan)
                                )}
                                <span className="text-[10px] text-gray-500">
                                  • {formatRelativeTime(reply.fecha)}
                                </span>
                              </div>

                              {/* Contenido de respuesta */}
                              <p className="text-gray-300 text-xs leading-relaxed">
                                {reply.contenido}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
