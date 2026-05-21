"use client";

import { useState, useEffect } from "react";
import { Wallet, DollarSign, History, ArrowUpRight, ArrowDownLeft, X, AlertCircle, Sparkles } from "lucide-react";
import { getUserProfile } from "@/app/actions/profile";
import { getWalletTransactionsAction, requestWithdrawAction } from "@/app/actions/wallet";

interface Transaction {
  id: string;
  usuarioId: string;
  monto: number;
  descripcion: string;
  fecha: string;
}

export default function IngresosPage() {
  const [saldo, setSaldo] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const RETIRO_MINIMO = 500.00;

  // Cargar datos
  const loadWalletData = async () => {
    try {
      const profile = await getUserProfile();
      if (profile) {
        setSaldo(profile.saldoBilletera || 0);
      }
      const trxs = await getWalletTransactionsAction();
      setTransactions(trxs);
    } catch (error) {
      console.error("Error al cargar datos de billetera:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  // Calcular ingresos totales históricos sumando solo transacciones de ingreso (monto > 0)
  const ingresosTotales = transactions
    .filter(t => t.monto > 0)
    .reduce((acc, t) => acc + t.monto, 0);

  const puedeRetirar = saldo >= RETIRO_MINIMO;
  const porcentajeRetiro = Math.min((saldo / RETIRO_MINIMO) * 100, 100);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError("");
    setWithdrawSuccess(false);

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError("Por favor ingresa un monto válido.");
      return;
    }

    if (amountNum > saldo) {
      setWithdrawError("El monto a retirar no puede superar tu saldo disponible.");
      return;
    }

    if (amountNum < RETIRO_MINIMO && saldo >= RETIRO_MINIMO) {
      setWithdrawError(`El monto solicitado debe ser mayor o igual al mínimo de $${RETIRO_MINIMO.toFixed(2)}.`);
      return;
    }

    setSubmittingWithdraw(true);
    try {
      const res = await requestWithdrawAction(amountNum);
      if (res.success) {
        setWithdrawSuccess(true);
        setWithdrawAmount("");
        // Recargar saldo y transacciones inmediatamente
        await loadWalletData();
        // Cerrar modal después de un breve delay para que vean el mensaje de éxito
        setTimeout(() => {
          setIsWithdrawModalOpen(false);
          setWithdrawSuccess(false);
        }, 2000);
      } else {
        setWithdrawError(res.error || "No se pudo procesar el retiro.");
      }
    } catch (err) {
      setWithdrawError("Error de conexión al procesar el retiro.");
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  // Helper para formatear fechas
  const formatTxDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ingresos y Billetera
        </h1>
        <p className="mt-1 text-[#aeb4c0]">
          Gestiona tus ganancias, revisa tu saldo y solicita retiros a tu cuenta.
        </p>
      </div>

      {loading ? (
        /* SKELETON LOADING */
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-28 bg-white/5 rounded-3xl animate-pulse" />
              <div className="h-28 bg-white/5 rounded-3xl animate-pulse" />
            </div>
          </div>
          <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* TARJETAS DE SALDO */}
          <div className="mb-10 grid gap-6 md:grid-cols-2">
            
            {/* Tarjeta Principal: Saldo Disponible */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0c15] to-[#121826] p-8 shadow-2xl">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-600/20 blur-[50px]" />
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-[#aeb4c0]">Saldo Disponible</p>
                  <h2 className="mt-2 text-5xl font-extrabold text-white">
                    ${saldo.toFixed(2)} <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">MXN</span>
                  </h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <Wallet size={32} />
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[#aeb4c0]">Progreso para retiro mínimo ($500)</span>
                  <span className="font-bold text-white">{porcentajeRetiro.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      puedeRetirar 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                    }`}
                    style={{ width: `${porcentajeRetiro}%` }}
                  />
                </div>
              </div>

              <button 
                disabled={!puedeRetirar}
                onClick={() => {
                  setWithdrawAmount(saldo.toFixed(2));
                  setIsWithdrawModalOpen(true);
                }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <ArrowUpRight size={20} /> 
                {puedeRetirar ? "Solicitar Retiro" : "Saldo Insuficiente para Retirar"}
              </button>
            </div>

            {/* Tarjeta Secundaria: Ingresos Históricos */}
            <div className="flex flex-col gap-6">
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
                <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-600/10 blur-[40px]" />
                <p className="text-sm font-medium uppercase tracking-wider text-[#aeb4c0]">Ingresos Totales (Histórico)</p>
                <h3 className="mt-2 text-4xl font-bold text-white">
                  ${ingresosTotales.toFixed(2)} <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">MXN</span>
                </h3>
                <p className="mt-4 text-xs text-[#aeb4c0] leading-relaxed">
                  Este es el monto total acumulado de por vida que tus películas han generado desde que te uniste a StreamHub Studio. No se reduce al realizar retiros.
                </p>
              </div>
              
              <div className="flex flex-1 items-center gap-4 rounded-3xl border border-white/10 bg-[#0b0c15] p-6 shadow-lg">
                <AlertCircle className="shrink-0 text-blue-500" size={24} />
                <p className="text-xs text-[#aeb4c0] leading-relaxed">
                  Las comisiones de **$10.00 MXN** se acreditan automáticamente en el mismo instante en que un espectador califica viendo 1 minuto o más de tus contenidos de terceros.
                </p>
              </div>
            </div>

          </div>

          {/* HISTORIAL DE TRANSACCIONES */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <History className="text-[#aeb4c0]" size={20} />
              <h2 className="text-xl font-bold text-white">Historial de Transacciones</h2>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c15] shadow-xl">
              <div className="overflow-x-auto custom-scrollbar">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <History size={40} className="text-gray-600 mb-2 animate-pulse" />
                    <p className="font-bold text-sm text-gray-400">Sin transacciones registradas</p>
                    <p className="text-xs text-gray-500 mt-1">Comparte tus películas para empezar a recibir visualizaciones y generar comisiones.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm text-[#aeb4c0]">
                    <thead className="border-b border-white/5 bg-white/5 text-xs uppercase text-[#aeb4c0]">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-semibold">Fecha / Referencia</th>
                        <th scope="col" className="px-6 py-4 font-semibold">Descripción</th>
                        <th scope="col" className="px-6 py-4 font-semibold text-right">Monto</th>
                        <th scope="col" className="px-6 py-4 font-semibold text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.map((trx) => (
                        <tr key={trx.id} className="transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-white text-xs truncate max-w-[120px]">{trx.id}</div>
                            <div className="text-[10px] text-gray-500">{formatTxDate(trx.fecha)}</div>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-white">
                            {trx.descripcion}
                          </td>
                          <td className="px-6 py-4 text-right font-bold whitespace-nowrap">
                            {trx.monto > 0 ? (
                              <span className="flex items-center justify-end gap-0.5 text-emerald-400">
                                <ArrowDownLeft size={16} />
                                +${trx.monto.toFixed(2)}
                              </span>
                            ) : (
                              <span className="flex items-center justify-end gap-0.5 text-white">
                                <ArrowUpRight size={16} />
                                -${Math.abs(trx.monto).toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                              Completado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* MODAL DE RETIRO */}
          {isWithdrawModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
              <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#121826] shadow-2xl animate-in zoom-in duration-200">
                
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-500 animate-pulse" />
                    Solicitar Retiro
                  </h2>
                  <button 
                    onClick={() => {
                      if (!submittingWithdraw) {
                        setIsWithdrawModalOpen(false);
                        setWithdrawError("");
                      }
                    }}
                    className="rounded-lg p-2 text-[#aeb4c0] transition hover:bg-white/5 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleWithdraw} className="p-6">
                  
                  {withdrawSuccess ? (
                    <div className="py-6 text-center space-y-3">
                      <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 animate-bounce">
                        <ArrowUpRight size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-white">¡Retiro Exitoso!</h3>
                      <p className="text-xs text-[#aeb4c0]">
                        Se ha enviado la transferencia simulada a tu tarjeta bancaria term. **4021**
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 rounded-2xl bg-[#0b0c15] p-4 text-center border border-white/5">
                        <p className="text-xs text-[#aeb4c0]">Saldo Disponible</p>
                        <p className="text-3xl font-extrabold text-white">${saldo.toFixed(2)}</p>
                      </div>

                      <div className="mb-6">
                        <label className="mb-2 block text-xs font-semibold text-[#aeb4c0] uppercase tracking-wider">
                          Monto a retirar (MXN)
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <DollarSign className="text-white/40" size={18} />
                          </div>
                          <input 
                            type="number" 
                            required
                            step="0.01"
                            min={RETIRO_MINIMO}
                            max={saldo}
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-xl border border-white/10 bg-[#0b0c15] py-3.5 pl-10 pr-4 text-xl font-bold text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            disabled={submittingWithdraw}
                          />
                        </div>
                        {withdrawError && (
                          <p className="mt-2 text-xs text-red-400 font-bold flex items-center gap-1">
                            <AlertCircle size={12} /> {withdrawError}
                          </p>
                        )}
                        <button 
                          type="button"
                          onClick={() => setWithdrawAmount(saldo.toString())}
                          className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition hover:underline"
                        >
                          Retirar todo el saldo
                        </button>
                      </div>

                      <div className="mb-8 rounded-xl bg-white/5 p-4 border border-white/5">
                        <p className="text-xs text-white font-bold">Destino de la transferencia (Simulado):</p>
                        <p className="mt-1.5 flex items-center gap-2 text-xs font-medium text-[#aeb4c0]">
                          <Wallet size={14} className="text-blue-400" /> Cuenta de débito terminada en **4021**
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          disabled={submittingWithdraw}
                          onClick={() => {
                            setIsWithdrawModalOpen(false);
                            setWithdrawError("");
                          }}
                          className="flex-1 rounded-xl border border-white/10 bg-transparent py-3 font-bold text-white transition hover:bg-white/5 disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit"
                          disabled={submittingWithdraw}
                          className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          {submittingWithdraw ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              Confirmar Retiro
                              <ArrowUpRight size={16} />
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}

                </form>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
