"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, X, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { updateStudioMovieAction, deleteStudioMovieAction } from "@/app/actions/studio";
import { useRouter } from "next/navigation";

type Movie = {
  id: string;
  title: string;
  image: string;
  releaseDate: string;
  genres: string[];
  // raw fields for editing
  descripcion?: string;
  duracion?: string;
  rutaCaratula?: string;
  rutaImagenFondo?: string;
  rutaVideo?: string;
  rutaTrailer?: string;
};

const GENEROS = [
  "Acción", "Animación", "Aventura", "Ciencia Ficción",
  "Comedia", "Drama", "Terror",
];

const formatDateUTC = (dateStr: string) => {
  if (!dateStr) return "No especificado";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.slice(0, 10))) {
    const parts = dateStr.slice(0, 10).split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "No especificado";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
};


export default function MisPeliculasClient({ movies: initialMovies }: { movies: Movie[] }) {
  const router = useRouter();
  const [movies, setMovies] = useState(initialMovies);
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setMovies(initialMovies);
  }, [initialMovies]);

  // ── Edit modal state ──────────────────────────────────────────
  const [editMovie, setEditMovie] = useState<Movie | null>(null);
  const [editForm, setEditForm] = useState({
    titulo: "",
    descripcion: "",
    fechaLanzamiento: "",
    duracion: "",
    generos: [] as string[],
    rutaCaratula: "",
    rutaImagenFondo: "",
    rutaVideo: "",
    rutaTrailer: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // ── Delete modal state ────────────────────────────────────────
  const [deleteMovie, setDeleteMovie] = useState<Movie | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─────────────────────────────────────────────────────────────
  const openEdit = (movie: Movie) => {
    setEditMovie(movie);
    setEditForm({
      titulo: movie.title,
      descripcion: movie.descripcion || "",
      fechaLanzamiento: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
      duracion: movie.duracion || "",
      generos: movie.genres,
      rutaCaratula: movie.rutaCaratula || movie.image || "",
      rutaImagenFondo: movie.rutaImagenFondo || "",
      rutaVideo: movie.rutaVideo || "",
      rutaTrailer: movie.rutaTrailer || "",
    });
  };

  const handleEditInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGenresChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions).map(o => o.value);
    setEditForm(prev => ({ ...prev, generos: values }));
  };

  const handleEditSubmit = async () => {
    if (!editMovie) return;
    if (!editForm.titulo) { showToast("El título es requerido", "error"); return; }
    setIsEditing(true);
    const res = await updateStudioMovieAction(editMovie.id, editForm);
    setIsEditing(false);
    if (res.success) {
      setMovies(prev => prev.map(m => m.id === editMovie.id ? {
        ...m,
        title: editForm.titulo,
        image: editForm.rutaCaratula || m.image,
        releaseDate: editForm.fechaLanzamiento,
        genres: editForm.generos,
        descripcion: editForm.descripcion,
        duracion: editForm.duracion,
        rutaCaratula: editForm.rutaCaratula,
        rutaImagenFondo: editForm.rutaImagenFondo,
        rutaVideo: editForm.rutaVideo,
        rutaTrailer: editForm.rutaTrailer,
      } : m));
      setEditMovie(null);
      showToast("Película actualizada exitosamente", "success");
      router.refresh();
    } else {
      showToast(res.error || "Error al actualizar la película", "error");
    }
  };

  // ─────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteMovie) return;
    setIsDeleting(true);
    const res = await deleteStudioMovieAction(deleteMovie.id);
    setIsDeleting(false);
    if (res.success) {
      setMovies(prev => prev.filter(m => m.id !== deleteMovie.id));
      setDeleteMovie(null);
      showToast("Película eliminada exitosamente", "success");
      router.refresh();
    } else {
      showToast(res.error || "Error al eliminar la película", "error");
    }
  };

  return (
    <>
      {/* ── TABLE ─────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c15] shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-[#aeb4c0]">
            <thead className="border-b border-white/5 bg-white/5 text-xs uppercase text-[#aeb4c0]">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Carátula</th>
                <th scope="col" className="px-6 py-4 font-semibold">Película</th>
                <th scope="col" className="px-6 py-4 font-semibold">Lanzamiento</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {movies.length > 0 ? movies.map((movie) => (
                <tr key={movie.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="h-20 w-14 rounded object-cover shadow-md"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-base font-bold text-white">{movie.title}</span>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres?.map((genre) => (
                          <span
                            key={genre}
                            className="rounded-full border border-white/10 bg-[#3a86ff]/10 px-2.5 py-0.5 text-xs font-medium text-[#3a86ff]"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDateUTC(movie.releaseDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEdit(movie)}
                        className="rounded-lg p-2 text-[#aeb4c0] transition hover:bg-white/5 hover:text-[#3a86ff]"
                        title="Editar película"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteMovie(movie)}
                        className="rounded-lg p-2 text-[#aeb4c0] transition hover:bg-red-500/10 hover:text-red-500"
                        title="Eliminar película"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No has subido ninguna película todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EDIT MODAL ────────────────────────────────────────── */}
      {editMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121826] shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white">Editar Película</h2>
              <button
                onClick={() => setEditMovie(null)}
                className="rounded-lg p-2 text-[#aeb4c0] transition hover:bg-white/5 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-6">

                {/* Título */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Nombre de la película
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={editForm.titulo}
                    onChange={handleEditInput}
                    placeholder="Ej: Matrix"
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Descripción
                  </label>
                  <textarea
                    rows={4}
                    name="descripcion"
                    value={editForm.descripcion}
                    onChange={handleEditInput}
                    placeholder="Sinopsis de la película..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                  />
                </div>

                {/* Fecha y Duración */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                      Fecha de lanzamiento
                    </label>
                    <input
                      type="date"
                      name="fechaLanzamiento"
                      value={editForm.fechaLanzamiento}
                      onChange={handleEditInput}
                      className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      name="duracion"
                      value={editForm.duracion}
                      onChange={handleEditInput}
                      placeholder="Ej: 120"
                      className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                    />
                  </div>
                </div>

                {/* Géneros */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                    Géneros
                  </label>
                  <select
                    multiple
                    value={editForm.generos}
                    onChange={handleGenresChange}
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] p-2 text-white outline-none transition focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                    size={4}
                  >
                    {GENEROS.map(g => (
                      <option key={g} value={g} className="rounded p-2 hover:bg-[#00f2fe]/20">{g}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-[#aeb4c0]">
                    Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar varios
                  </p>
                </div>

                {/* URLs */}
                {[
                  { name: "rutaCaratula", label: "Link de imagen de carátula" },
                  { name: "rutaImagenFondo", label: "Link de imagen de fondo" },
                  { name: "rutaVideo", label: "Link de la película (Video)" },
                  { name: "rutaTrailer", label: "Link del tráiler" },
                ].map(field => (
                  <div key={field.name}>
                    <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                      {field.label}
                    </label>
                    <input
                      type="url"
                      name={field.name}
                      value={(editForm as any)[field.name]}
                      onChange={handleEditInput}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/10 bg-[#0b0c15] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                    />
                  </div>
                ))}

              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 border-t border-white/10 bg-[#0b0c15] p-6">
              <button
                onClick={() => setEditMovie(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-bold text-white transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isEditing}
                className="rounded-xl bg-[#3a86ff] px-6 py-2.5 font-bold text-white shadow-[0_0_15px_rgba(58,134,255,0.4)] transition hover:bg-[#2563eb] disabled:opacity-50"
              >
                {isEditing ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ──────────────────────────────── */}
      {deleteMovie && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121826] p-8 shadow-2xl">

            <div className="mb-6 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">¿Eliminar película?</h2>
                <p className="mt-2 text-[#aeb4c0]">
                  Estás a punto de eliminar{" "}
                  <span className="font-semibold text-white">"{deleteMovie.title}"</span>.
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteMovie(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 font-bold text-white transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-red-600 py-2.5 font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>

          </div>
        </div>
      )}
      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full shadow-2xl animate-bounce backdrop-blur-md border font-semibold flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-[#00f2fe]/20 border-[#00f2fe]/50 text-[#00f2fe]' : 'bg-red-500/20 border-red-500/50 text-red-500'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}
    </>
  );
}
