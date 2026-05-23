"use client";

import { useState, useEffect } from "react";
import { User, CreditCard, Image as ImageIcon, Camera, CheckCircle2, Save, Loader2 } from "lucide-react";
import { getStudioProfileAction, updateStudioProfileAction } from "@/app/actions/studio";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<"perfil" | "cobros">("perfil");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [perfil, setPerfil] = useState({
    nombreCanal: "",
    biografia: "",
    avatar: "",
    banner: ""
  });
  const [originalPerfil, setOriginalPerfil] = useState({
    nombreCanal: "",
    biografia: "",
    avatar: "",
    banner: ""
  });

  const [cobros, setCobros] = useState({
    metodoPreferido: "paypal",
    paypalEmail: "",
    cuentaBancaria: ""
  });
  const [originalCobros, setOriginalCobros] = useState({
    metodoPreferido: "paypal",
    paypalEmail: "",
    cuentaBancaria: ""
  });

  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await getStudioProfileAction();
      if (res.success && res.profile) {
        const p = {
          nombreCanal: res.profile.nombreCanal || "",
          biografia: res.profile.descripcion || "",
          avatar: res.profile.fotoPerfilUrl || "",
          banner: res.profile.fotoPortadaUrl || ""
        };
        setPerfil(p);
        setOriginalPerfil(p);

        const isBanco = res.profile.metodoPago === "TRANSFERENCIA";
        const c = {
          metodoPreferido: isBanco ? "banco" : "paypal",
          paypalEmail: !isBanco ? (res.profile.datosPago || "") : "",
          cuentaBancaria: isBanco ? (res.profile.datosPago || "") : ""
        };
        setCobros(c);
        setOriginalCobros(c);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const datosGuardar = {
      nombreCanal: perfil.nombreCanal,
      descripcion: perfil.biografia,
      fotoPerfilUrl: perfil.avatar,
      fotoPortadaUrl: perfil.banner,
      metodoPago: cobros.metodoPreferido === "paypal" ? "PAYPAL" : "TRANSFERENCIA",
      datosPago: cobros.metodoPreferido === "paypal" ? cobros.paypalEmail : cobros.cuentaBancaria
    };

    const res = await updateStudioProfileAction(datosGuardar);
    setSaving(false);

    if (res.success) {
      setToast({ message: "¡Cambios guardados con éxito!", type: "success" });
      setOriginalPerfil(perfil);
      setOriginalCobros(cobros);
    } else {
      setToast({ message: "Hubo un error al guardar los cambios.", type: "error" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleDiscard = () => {
    setPerfil(originalPerfil);
    setCobros(originalCobros);
  };

  const handleCuentaBancariaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Eliminar todo lo que no sea dígito y limitar a 16
    const rawValue = e.target.value.replace(/\D/g, '').substring(0, 16);
    // Agrupar en bloques de 4
    const formatted = rawValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCobros({ ...cobros, cuentaBancaria: formatted });
  };

  const handleChangeBanner = () => {
    const url = window.prompt("Ingresa la URL de tu nueva foto de portada:", perfil.banner);
    if (url !== null) {
      setPerfil(prev => ({ ...prev, banner: url }));
    }
  };

  const handleChangeAvatar = () => {
    const url = window.prompt("Ingresa la URL de tu nueva foto de perfil:", perfil.avatar);
    if (url !== null) {
      setPerfil(prev => ({ ...prev, avatar: url }));
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-[#aeb4c0]"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Configuración
        </h1>
        <p className="mt-1 text-[#aeb4c0]">
          Personaliza cómo te ven tus espectadores y gestiona dónde recibes tus ganancias.
        </p>
      </div>

      {/* TABS NAVEGACIÓN */}
      <div className="mb-6 flex space-x-1 rounded-xl bg-[#0b0c15] p-1 border border-white/10">
        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${activeTab === "perfil"
              ? "bg-[#3a86ff] text-white shadow-md"
              : "text-[#aeb4c0] hover:bg-white/5 hover:text-white"
            }`}
        >
          <User size={18} /> Perfil del Canal
        </button>
        <button
          onClick={() => setActiveTab("cobros")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${activeTab === "cobros"
              ? "bg-[#3a86ff] text-white shadow-md"
              : "text-[#aeb4c0] hover:bg-white/5 hover:text-white"
            }`}
        >
          <CreditCard size={18} /> Métodos de Cobro
        </button>
      </div>

      {/* CONTENIDO DE LAS TABS */}
      <form onSubmit={handleSave} className="rounded-3xl border border-white/10 bg-[#0b0c15] shadow-xl overflow-hidden">

        {activeTab === "perfil" && (
          <div className="animate-in fade-in">
            {/* Sección visual: Banner y Avatar */}
            <div className="relative h-48 w-full bg-gradient-to-r from-[#121826] to-[#0b0c15] border-b border-white/10">
              {perfil.banner ? (
                <img src={perfil.banner} alt="Banner" className="h-full w-full object-cover opacity-60" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#aeb4c0]">
                  <ImageIcon size={48} className="opacity-20" />
                </div>
              )}
              {/* Botón flotante para cambiar banner */}
              <button onClick={handleChangeBanner} type="button" className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-black/50 backdrop-blur px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black/70 border border-white/10">
                <Camera size={14} /> Cambiar Portada
              </button>

              {/* Avatar Flotante */}
              <div className="absolute -bottom-10 left-8">
                <div className="group relative h-24 w-24 rounded-full border-4 border-[#0b0c15] bg-[#121826] overflow-hidden">
                  {perfil.avatar ? (
                    <img src={perfil.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#aeb4c0]">
                      <User size={40} />
                    </div>
                  )}
                  {/* Overlay para subir foto */}
                  <div onClick={handleChangeAvatar} className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario Perfil */}
            <div className="p-8 pt-16 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                  Nombre del Canal
                </label>
                <input
                  type="text"
                  value={perfil.nombreCanal}
                  onChange={(e) => setPerfil({ ...perfil, nombreCanal: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none transition focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                  Biografía / Descripción
                </label>
                <textarea
                  rows={4}
                  value={perfil.biografia}
                  onChange={(e) => setPerfil({ ...perfil, biografia: e.target.value })}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none transition focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                />
                <p className="mt-2 text-xs text-[#aeb4c0]">Esta información será visible para tus suscriptores en la página principal de tu canal.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cobros" && (
          <div className="p-8 animate-in fade-in space-y-8">
            <div className="rounded-2xl border border-[#00f2fe]/20 bg-[#00f2fe]/5 p-6 flex gap-4">
              <CheckCircle2 className="text-[#00f2fe] shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-[#00f2fe]">Tus pagos están seguros</h3>
                <p className="text-sm text-white/80 mt-1">
                  Solo puedes tener un método de retiro activo a la vez. Cuando solicites un retiro desde la pestaña de "Ingresos", el dinero se enviará automáticamente al método que configures aquí.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-4 block text-sm font-medium text-[#aeb4c0]">
                Selecciona tu método principal
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer rounded-xl border p-4 transition-all ${cobros.metodoPreferido === 'paypal' ? 'border-[#3a86ff] bg-[#3a86ff]/10' : 'border-white/10 bg-[#121826] hover:bg-white/5'}`}>
                  <input type="radio" name="metodo" className="hidden" checked={cobros.metodoPreferido === 'paypal'} onChange={() => setCobros({ ...cobros, metodoPreferido: 'paypal' })} />
                  <div className="font-bold text-white">Cuenta PayPal</div>
                  <div className="text-xs text-[#aeb4c0] mt-1">Retiros rápidos en USD</div>
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 transition-all ${cobros.metodoPreferido === 'banco' ? 'border-[#3a86ff] bg-[#3a86ff]/10' : 'border-white/10 bg-[#121826] hover:bg-white/5'}`}>
                  <input type="radio" name="metodo" className="hidden" checked={cobros.metodoPreferido === 'banco'} onChange={() => setCobros({ ...cobros, metodoPreferido: 'banco' })} />
                  <div className="font-bold text-white">Transferencia Bancaria</div>
                  <div className="text-xs text-[#aeb4c0] mt-1">Directo a tu CLABE/IBAN</div>
                </label>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/10">
              {cobros.metodoPreferido === 'paypal' ? (
                <div className="animate-in fade-in">
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">Correo electrónico de PayPal</label>
                  <input
                    type="email"
                    value={cobros.paypalEmail}
                    onChange={(e) => setCobros({ ...cobros, paypalEmail: e.target.value })}
                    placeholder="ejemplo@paypal.com"
                    className="w-full rounded-xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none transition focus:border-[#3a86ff] focus:ring-1 focus:ring-[#3a86ff]"
                  />
                </div>
              ) : (
                <div className="animate-in fade-in">
                  <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">Número de cuenta (CLABE / IBAN)</label>
                  <input
                    type="text"
                    value={cobros.cuentaBancaria}
                    onChange={handleCuentaBancariaChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full rounded-xl border border-white/10 bg-[#121826] px-4 py-3 text-white outline-none transition focus:border-[#3a86ff] focus:ring-1 focus:ring-[#3a86ff] font-mono tracking-widest"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* FOOTER FORMULARIO */}
        <div className="flex items-center justify-end gap-4 border-t border-white/10 bg-[#121826]/50 p-6">
          <button type="button" onClick={handleDiscard} className="rounded-xl px-6 py-2.5 font-bold text-[#aeb4c0] transition hover:bg-white/5 hover:text-white">
            Descartar Cambios
          </button>
          <button disabled={saving} type="submit" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] px-8 py-2.5 font-bold text-[#0b0c15] shadow-[0_0_15px_rgba(79,172,254,0.4)] transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Guardar
          </button>
        </div>

      </form>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full shadow-2xl animate-bounce backdrop-blur-md border font-semibold flex items-center gap-2 ${toast.type === 'success' ? 'bg-[#00f2fe]/20 border-[#00f2fe]/50 text-[#00f2fe]' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : null}
          {toast.message}
        </div>
      )}

    </div>
  );
}
