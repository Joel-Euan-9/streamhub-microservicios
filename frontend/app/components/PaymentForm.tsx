"use client";

import { useState } from "react";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { Input } from "./ui/Input";

interface PaymentFormProps {
  planName: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentForm({ planName, onPaymentSuccess, onCancel }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulamos un retraso de procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Llamamos al callback de éxito después de una breve pausa para ver la animación
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-xl max-w-md w-full mx-auto animate-in zoom-in duration-300">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">¡Pago Completado!</h3>
        <p className="text-gray-400 text-center text-sm">Tu suscripción al plan {planName} está activa.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 max-w-md w-full mx-auto shadow-2xl">
      <div className="mb-6 flex flex-col items-center border-b border-white/10 pb-6">
        <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-3">
          <CreditCard className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Detalles de Pago</h3>
        <p className="text-sm text-gray-400 mt-1">Estás a punto de adquirir el plan <strong className="text-white">{planName}</strong></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input 
            label="Nombre en la Tarjeta"
            type="text"
            required
            placeholder="Ej. Juan Pérez"
          />
        </div>
        
        <div>
          <Input 
            label="Número de Tarjeta"
            type="text"
            required
            placeholder="0000 0000 0000 0000"
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Expiración"
            type="text"
            required
            placeholder="MM/YY"
            maxLength={5}
          />
          <Input 
            label="CVV"
            type="text"
            required
            placeholder="123"
            maxLength={4}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-4 bg-white/5 p-3 rounded-lg">
          <Lock className="w-4 h-4" />
          <p>Tus pagos están encriptados de forma segura (Simulación).</p>
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-1/3 py-2.5 rounded-md font-bold text-sm bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button 
            type="submit"
            disabled={isProcessing}
            className="w-2/3 py-2.5 rounded-md font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : "Pagar Ahora"}
          </button>
        </div>
      </form>
    </div>
  );
}
