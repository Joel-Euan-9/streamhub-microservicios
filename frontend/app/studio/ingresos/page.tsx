"use client";

import { useState } from "react";
import { Wallet, DollarSign, History, ArrowUpRight, ArrowDownLeft, X, AlertCircle } from "lucide-react";

// Datos simulados del usuario
const SALDO_DISPONIBLE = 450.00;
const INGRESOS_TOTALES = 1250.00;
const RETIRO_MINIMO = 500.00; // Por ejemplo, el mínimo para retirar
const PORCENTAJE_RETIRO = Math.min((SALDO_DISPONIBLE / RETIRO_MINIMO) * 100, 100);

const mockTransactions = [
  {
    id: "TRX-9021",
    date: "18 Mayo, 2026",
    description: "Comisiones por visualizaciones (Coco)",
    type: "ingreso",
    amount: 120.00,
    status: "Completado"
  },
  {
    id: "TRX-8930",
    date: "10 Mayo, 2026",
    description: "Comisiones por visualizaciones (Thor: Ragnarok)",
    type: "ingreso",
    amount: 330.00,
    status: "Completado"
  },
  {
    id: "TRX-8500",
    date: "01 Mayo, 2026",
    description: "Retiro a cuenta bancaria (Termina en 4021)",
    type: "retiro",
    amount: -800.00,
    status: "Completado"
  },
  {
    id: "TRX-7802",
    date: "15 Abril, 2026",
    description: "Comisiones por visualizaciones (Varias películas)",
    type: "ingreso",
    amount: 800.00,
    status: "Completado"
  }
];

export default function IngresosPage() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const puedeRetirar = SALDO_DISPONIBLE >= RETIRO_MINIMO;

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

      {/* TARJETAS DE SALDO */}
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        
        {/* Tarjeta Principal: Saldo Disponible */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0c15] to-[#121826] p-8 shadow-2xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00f2fe]/20 blur-[50px]" />
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-[#aeb4c0]">Saldo Disponible</p>
              <h2 className="mt-2 text-5xl font-extrabold text-white">
                ${SALDO_DISPONIBLE.toFixed(2)}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00f2fe]/20 text-[#00f2fe]">
              <Wallet size={32} />
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[#aeb4c0]">Progreso para retiro mínimo ($500)</span>
              <span className="font-bold text-white">{PORCENTAJE_RETIRO.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${puedeRetirar ? 'bg-green-400' : 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe]'}`}
                style={{ width: `${PORCENTAJE_RETIRO}%` }}
              />
            </div>
          </div>

          <button 
            disabled={!puedeRetirar}
            onClick={() => setIsWithdrawModalOpen(true)}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3a86ff] px-6 py-3.5 font-bold text-white shadow-[0_0_15px_rgba(58,134,255,0.4)] transition hover:bg-[#2563eb] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <ArrowUpRight size={20} /> 
            {puedeRetirar ? "Solicitar Retiro" : "Saldo Insuficiente para Retirar"}
          </button>
        </div>

        {/* Tarjeta Secundaria: Ingresos Históricos */}
        <div className="flex flex-col gap-6">
          <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#f97316]/20 blur-[40px]" />
            <p className="text-sm font-medium uppercase tracking-wider text-[#aeb4c0]">Ingresos Totales (Histórico)</p>
            <h3 className="mt-2 text-4xl font-bold text-white">${INGRESOS_TOTALES.toFixed(2)}</h3>
            <p className="mt-4 text-sm text-[#aeb4c0]">
              Este es el monto total que tus películas han generado desde que te uniste a StreamHub.
            </p>
          </div>
          
          <div className="flex flex-1 items-center gap-4 rounded-3xl border border-white/10 bg-[#0b0c15] p-6 shadow-lg">
            <AlertCircle className="shrink-0 text-[#3a86ff]" size={24} />
            <p className="text-sm text-[#aeb4c0]">
              Las comisiones por visualizaciones se calculan automáticamente y se abonan a tu saldo cada fin de semana.
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
            <table className="w-full text-left text-sm text-[#aeb4c0]">
              <thead className="border-b border-white/5 bg-white/5 text-xs uppercase text-[#aeb4c0]">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">ID / Fecha</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Descripción</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-right">Monto</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockTransactions.map((trx) => (
                  <tr key={trx.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white">{trx.id}</div>
                      <div className="text-xs">{trx.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      {trx.description}
                    </td>
                    <td className="px-6 py-4 text-right font-bold whitespace-nowrap">
                      {trx.type === "ingreso" ? (
                        <span className="flex items-center justify-end gap-1 text-green-400">
                          <ArrowDownLeft size={16} />
                          +${trx.amount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-1 text-white">
                          <ArrowUpRight size={16} />
                          -${Math.abs(trx.amount).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex rounded-full bg-green-400/10 px-2.5 py-0.5 text-xs font-medium text-green-400 border border-green-400/20">
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DE RETIRO */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#121826] shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 className="text-xl font-bold text-white">Solicitar Retiro</h2>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded-lg p-2 text-[#aeb4c0] transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 rounded-2xl bg-[#0b0c15] p-4 text-center border border-white/5">
                <p className="text-sm text-[#aeb4c0]">Saldo Disponible</p>
                <p className="text-3xl font-extrabold text-white">${SALDO_DISPONIBLE.toFixed(2)}</p>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#aeb4c0]">
                  Monto a retirar ($)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <DollarSign className="text-white/50" size={20} />
                  </div>
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    max={SALDO_DISPONIBLE}
                    className="w-full rounded-xl border border-white/10 bg-[#0b0c15] py-3 pl-10 pr-4 text-xl font-bold text-white outline-none transition focus:border-[#3a86ff] focus:ring-1 focus:ring-[#3a86ff]"
                  />
                </div>
                <button 
                  onClick={() => setWithdrawAmount(SALDO_DISPONIBLE.toString())}
                  className="mt-2 text-xs font-medium text-[#3a86ff] hover:underline"
                >
                  Retirar todo el saldo máximo
                </button>
              </div>

              <div className="mb-8 rounded-xl bg-white/5 p-4">
                <p className="text-sm text-white">Destino del fondo:</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#aeb4c0]">
                  <Wallet size={16} /> Cuenta Bancaria terminada en 4021
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-transparent py-3 font-bold text-white transition hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    alert("Solicitud de retiro enviada al backend exitosamente.");
                    setIsWithdrawModalOpen(false);
                  }}
                  className="flex-1 rounded-xl bg-[#3a86ff] py-3 font-bold text-white shadow-[0_0_15px_rgba(58,134,255,0.4)] transition hover:bg-[#2563eb]"
                >
                  Confirmar Retiro
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
