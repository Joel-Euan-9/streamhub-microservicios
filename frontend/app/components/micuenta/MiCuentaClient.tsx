"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, Edit2, X } from "lucide-react";
import { changePasswordAction, changePlanAction, changeNameAction, verifyPasswordAction } from "@/app/actions/perfil";
import { logout } from "@/app/actions/auth";
import PaymentForm from "@/app/components/PaymentForm";

// Define los planes y beneficios
const PLAN_BENEFITS = {
  BASIC: {
    name: "BÁSICO",
    price: "Gratis",
    features: [
      { text: "Acceso al 40% del catálogo", included: true },
      { text: "Con interrupciones publicitarias", included: true },
      { text: "Límite de 5 películas por día", included: true },
      { text: "Calidad de video HD", included: true },
      { text: "Sin conexión (Descargas)", included: false },
      { text: "Subir contenido propio", included: false }
    ]
  },
  PREMIUM: {
    name: "PREMIUM",
    price: "$149 MXN/mes",
    features: [
      { text: "Catálogo completo ilimitado", included: true },
      { text: "Sin publicidad", included: true },
      { text: "Películas ilimitadas por día", included: true },
      { text: "Calidad 4K UHD + HDR", included: true },
      { text: "Descargas disponibles", included: true },
      { text: "Subir contenido propio", included: false }
    ]
  },
  STUDIO: {
    name: "STUDIO PASS",
    price: "$299 MXN/mes",
    features: [
      { text: "Todo lo incluido en Premium", included: true },
      { text: "Sin publicidad", included: true },
      { text: "Panel de Creador Independiente", included: true },
      { text: "Sube y gestiona tus propias películas", included: true },
      { text: "Estadísticas de visualización", included: true },
      { text: "Soporte técnico prioritario", included: true }
    ]
  }
};

interface UserProps {
  id: string;
  email: string;
  name: string;
  plan: string;
  createdAt: string;
}

export default function MiCuentaClient({ user }: { user: UserProps }) {
  const [currentPlan, setCurrentPlan] = useState<string>(user.plan || "BASIC");
  
  // Name edit state
  const [userName, setUserName] = useState(user.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(user.name);
  const [nameError, setNameError] = useState("");

  // Modals state
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlanToPay, setSelectedPlanToPay] = useState<string | null>(null);
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  
  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Avatar initial
  const initial = userName ? userName.charAt(0).toUpperCase() : "U";
  
  // Formatear fecha
  const dateObj = new Date(user.createdAt);
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  const currentPlanDetails = PLAN_BENEFITS[currentPlan as keyof typeof PLAN_BENEFITS] || PLAN_BENEFITS.BASIC;

  const handleNameSubmit = async () => {
    setNameError("");
    if (!editNameValue.trim()) {
      setNameError("El nombre no puede estar vacío");
      return;
    }
    const res = await changeNameAction(editNameValue);
    if (res.success) {
      setUserName(editNameValue);
      setIsEditingName(false);
    } else {
      setNameError(res.error || "Error al cambiar el nombre");
    }
  };

  const handleVerifyClick = async () => {
    setVerifyError("");
    if (!currentPassword) {
      setVerifyError("Ingresa tu contraseña actual primero.");
      return;
    }
    const res = await verifyPasswordAction(currentPassword);
    if (res.success) {
      setPasswordModalOpen(true);
    } else {
      setVerifyError(res.error || "Contraseña incorrecta");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("La nueva contraseña no puede ser igual a la actual.");
      return;
    }

    const res = await changePasswordAction(currentPassword, newPassword);
    if (res.success) {
      setPasswordSuccess(res.message);
      setTimeout(() => {
        setPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess("");
      }, 2000);
    } else {
      setPasswordError(res.error || "Hubo un error al cambiar la contraseña.");
    }
  };

  const handleChangePlan = async (newPlan: string) => {
    if (newPlan === currentPlan) return;
    
    if (newPlan === "BASIC") {
      const res = await changePlanAction(newPlan);
      if (res.success) {
        setCurrentPlan(res.plan);
        setPlanModalOpen(false);
      } else {
        alert(res.error || "Error al cambiar el plan");
      }
    } else {
      setSelectedPlanToPay(newPlan);
      setPlanModalOpen(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!selectedPlanToPay) return;
    const res = await changePlanAction(selectedPlanToPay);
    if (res.success) {
      setCurrentPlan(res.plan);
      setSelectedPlanToPay(null);
    } else {
      alert(res.error || "Error al cambiar el plan");
      setSelectedPlanToPay(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Columna Izquierda: Perfil del Usuario */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-white/5 bg-[#161824] p-8 shadow-xl">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] shadow-[0_0_20px_rgba(79,172,254,0.3)]">
              <span className="text-6xl font-bold text-[#0b0c15]">{initial}</span>
            </div>
            
            <h2 className="mt-6 text-2xl font-bold">{userName}</h2>
            <span className="mt-2 rounded-full bg-[#ffb703] px-3 py-1 text-xs font-bold tracking-wider text-[#0b0c15]">
              {currentPlan}
            </span>
          </div>

          <div className="my-8 h-[1px] w-full bg-white/10"></div>

          {/* Información Personal */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#aeb4c0]">Nombre de Usuario</p>
              {!isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-medium text-white">{userName}</p>
                  <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-white transition">
                    <Edit2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={editNameValue} 
                      onChange={(e) => setEditNameValue(e.target.value)}
                      className="rounded bg-white/10 px-3 py-1 text-white focus:outline-none focus:border-[#3a86ff] border border-transparent w-full"
                    />
                    <button onClick={handleNameSubmit} className="text-green-400 hover:text-green-300">
                      <Check size={20} />
                    </button>
                    <button onClick={() => {setIsEditingName(false); setNameError(""); setEditNameValue(userName);}} className="text-red-400 hover:text-red-300">
                      <X size={20} />
                    </button>
                  </div>
                  {nameError && <p className="text-red-400 text-xs mt-1">{nameError}</p>}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-[#aeb4c0]">Correo Electrónico</p>
              <p className="mt-1 font-medium text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-[#aeb4c0]">Miembro desde</p>
              <p className="mt-1 font-medium text-white">{formattedDate}</p>
            </div>
          </div>

          {/* Botón de Cerrar Sesión */}
          <div className="mt-10">
            <form action={logout}>
              <button 
                type="submit" 
                className="flex w-full items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Ajustes */}
      <div className="flex flex-col gap-8 lg:col-span-8">
        
        {/* Tarjeta de Seguridad */}
        <div className="rounded-2xl border border-white/5 bg-[#161824] p-8 shadow-xl">
          <h3 className="text-xl font-bold text-[#3a86ff]">Seguridad</h3>
          <div className="my-5 h-[1px] w-full bg-white/10"></div>
          
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-[#aeb4c0]">Contraseña Actual</label>
              <div className="relative max-w-md">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  className={`w-full rounded-lg border ${verifyError ? 'border-red-500' : 'border-white/10'} bg-[rgba(11,12,21,0.5)] px-4 py-3 text-white focus:border-[#3a86ff] focus:outline-none pr-12`}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {verifyError && <p className="text-red-400 text-sm mt-2">{verifyError}</p>}
            </div>
            
            <div>
              <button 
                onClick={handleVerifyClick}
                className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]"
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Suscripción / Plan */}
        <div className="rounded-2xl border border-white/5 bg-[#161824] p-8 shadow-xl">
          <h3 className="text-xl font-bold text-[#3a86ff]">Suscripción y Planes</h3>
          <div className="my-5 h-[1px] w-full bg-white/10"></div>
          
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-[#aeb4c0]">Plan Actual</p>
              <p className="text-lg font-bold text-white uppercase">{currentPlan}</p>
              <p className="text-sm text-green-400">Activo</p>
            </div>
            
            <div>
              <button 
                onClick={() => setPlanModalOpen(true)}
                className="rounded-full bg-[#3a86ff] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(58,134,255,0.35)] transition hover:-translate-y-0.5 hover:bg-white hover:text-[#3a86ff]"
              >
                Cambiar Plan
              </button>
            </div>
          </div>
          
          <div className="mt-8 rounded-xl border border-white/5 bg-[rgba(11,12,21,0.5)] p-5">
            <h4 className="mb-3 font-semibold text-white">Beneficios de tu plan:</h4>
            <ul className="space-y-2 text-sm text-[#aeb4c0]">
              {currentPlanDetails.features.map((feature, idx) => feature.included && (
                <li key={idx} className="flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* --- MODAL DE CONTRASEÑA --- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161824] p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Cambiar Contraseña</h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* La contraseña actual ya fue verificada, solo pedimos la nueva */}
              {/* Nueva */}
              <div>
                <label className="block text-sm text-[#aeb4c0] mb-2">Nueva Contraseña</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"} 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[rgba(11,12,21,0.5)] px-4 py-3 text-white focus:border-[#3a86ff] focus:outline-none pr-12"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva */}
              <div>
                <label className="block text-sm text-[#aeb4c0] mb-2">Confirmar Nueva Contraseña</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[rgba(11,12,21,0.5)] px-4 py-3 text-white focus:border-[#3a86ff] focus:outline-none pr-12"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-400 text-sm mt-2">{passwordSuccess}</p>}

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setPasswordModalOpen(false)}
                  className="w-1/2 rounded-full border border-white/20 px-4 py-3 font-semibold hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 rounded-full bg-[#3a86ff] px-4 py-3 font-semibold text-white hover:bg-[#3a86ff]/80 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE ELEGIR PLAN --- */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-5xl rounded-2xl bg-[#0b0c15] p-6 shadow-2xl relative my-auto border border-white/10">
            <button 
              onClick={() => setPlanModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="text-center mb-10 mt-4">
              <h2 className="text-3xl font-bold text-white mb-2">¿Qué plan vas a elegir?</h2>
              <p className="text-[#aeb4c0]">Cambia de plan en cualquier momento.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(PLAN_BENEFITS).map(([planKey, plan]) => {
                const isActive = planKey === currentPlan;
                return (
                  <div key={planKey} className={`rounded-xl border ${isActive ? 'border-[#3a86ff]' : 'border-white/10'} bg-[#161824] p-6 flex flex-col`}>
                    <div className="text-center mb-6 pb-6 border-b border-white/10">
                      <h3 className={`text-lg font-bold tracking-widest ${isActive ? 'text-[#3a86ff]' : 'text-gray-400'}`}>
                        {plan.name}
                      </h3>
                      <p className="text-2xl font-bold text-white mt-2">{plan.price}</p>
                    </div>
                    
                    <ul className="flex-1 space-y-4 text-sm mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className={`flex items-start gap-3 ${f.included ? 'text-gray-200' : 'text-gray-600'}`}>
                          {f.included ? (
                            <Check size={18} className="text-[#3a86ff] shrink-0 mt-0.5" />
                          ) : (
                            <span className="shrink-0 mt-0.5 inline-block w-[18px] text-center">-</span>
                          )}
                          {f.text}
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => handleChangePlan(planKey)}
                      disabled={isActive}
                      className={`w-full rounded-full py-3 font-bold transition-all ${
                        isActive 
                          ? 'bg-white/10 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#3a86ff] text-white hover:bg-[#3a86ff]/80 hover:shadow-[0_0_15px_rgba(58,134,255,0.4)]'
                      }`}
                    >
                      {isActive ? 'PLAN ACTUAL' : `Elegir ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE PAGO --- */}
      {selectedPlanToPay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <PaymentForm 
            planName={PLAN_BENEFITS[selectedPlanToPay as keyof typeof PLAN_BENEFITS]?.name || selectedPlanToPay}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => setSelectedPlanToPay(null)}
          />
        </div>
      )}
    </div>
  );
}
