"use client";

import { useState } from "react";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { Input } from "./ui/Input";

interface PaymentFormProps {
  planName: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

function CardIcon({ type }: { type: string | null }) {
  if (type === "visa") {
    return (
      <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="20" rx="2" fill="#1434CB" />
        <path d="M12.4492 14H9.86017L11.4801 4H14.0691L12.4492 14ZM22.4533 4.29C21.8413 4.07 20.9703 3.86 19.8673 3.86C17.2182 3.86 15.3952 5.25 15.3782 7.29C15.3582 8.79 16.7322 9.63 17.7552 10.12C18.8072 10.63 19.1622 10.95 19.1622 11.44C19.1622 12.19 18.2572 12.51 17.2152 12.51C15.8232 12.51 15.0292 12.14 14.3902 11.83L13.9872 11.64L13.6062 14.01C14.2882 14.32 15.5292 14.59 16.8282 14.61C19.6542 14.61 21.4393 13.23 21.4643 11.11C21.4883 9.07 18.6652 8.96 18.6652 7.64C18.6652 7.02 19.2273 6.37 20.4703 6.19C21.0773 6.11 21.9023 6.13 22.5853 6.44L22.4533 4.29ZM28.6184 14H30.8264L28.7934 4H26.7113C26.1553 4 25.7533 4.29 25.5393 4.8L21.8153 14H24.5123L25.0503 12.48H27.8174L28.6184 14ZM25.7874 10.51L26.6804 8.01C26.8364 7.6 27.0624 6.89 27.1854 6.44H27.2404C27.3294 6.88 27.5024 7.55 27.6364 8.02L28.1404 10.51H25.7874ZM9.49317 14L6.96315 4H4.55113L3.89613 7.37C3.76612 8.01 3.51312 8.35 2.94611 8.65C2.1551 9.06 1.05409 9.38 0 9.53L0.0600004 9.82C0.603006 9.94 1.83902 10.29 2.65103 10.87C3.30804 11.35 3.58504 12.1 3.75804 13.19L3.89404 14H6.60214H9.49317Z" fill="white" />
      </svg>
    );
  }
  if (type === "mastercard") {
    return (
      <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="20" rx="2" fill="#1C2126" />
        <circle cx="11.5" cy="10" r="6.5" fill="#EA001B" />
        <circle cx="20.5" cy="10" r="6.5" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    );
  }
  if (type === "amex") {
    return (
      <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="20" rx="2" fill="#2671B9" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">AMEX</text>
      </svg>
    );
  }
  if (type === "discover") {
    return (
      <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="20" rx="2" fill="#FF6000" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DISC</text>
      </svg>
    );
  }
  return (
    <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="20" rx="2" fill="#374151" />
      <path d="M4 8H28" stroke="#1F2937" strokeWidth="2" />
    </svg>
  );
}

export default function PaymentForm({ planName, onPaymentSuccess, onCancel }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<string | null>(null);
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
  }>({});

  const getCardType = (number: string) => {
    const digits = number.replace(/\D/g, "");
    if (digits.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(digits)) return "mastercard";
    if (/^3[47]/.test(digits)) return "amex";
    if (/^6(?:011|5)/.test(digits)) return "discover";
    return null;
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    // 1. Validar Nombre
    if (!name.trim()) {
      newErrors.name = "El nombre en la tarjeta es obligatorio";
    }

    // 2. Validar Número de Tarjeta
    const cardDigits = cardNumber.replace(/\D/g, "");
    if (!cardDigits) {
      newErrors.cardNumber = "El número de tarjeta es obligatorio";
    } else {
      const expectedLength = cardType === "amex" ? 15 : 16;
      if (cardDigits.length < expectedLength) {
        newErrors.cardNumber = `El número de tarjeta debe tener ${expectedLength} dígitos`;
      }
    }

    // 3. Validar Expiración
    if (!expiry) {
      newErrors.expiry = "La fecha de expiración es obligatoria";
    } else {
      const expiryParts = expiry.split("/");
      if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
        newErrors.expiry = "La fecha está incompleta (debe ser MM/YY)";
      } else {
        const month = parseInt(expiryParts[0], 10);
        const year = parseInt(expiryParts[1], 10);

        if (month < 1 || month > 12) {
          newErrors.expiry = "El mes debe estar entre 01 y 12";
        } else {
          // Obtener fecha actual
          const now = new Date();
          const currentYear = now.getFullYear() % 100; // e.g. 26 para 2026
          const currentMonth = now.getMonth() + 1; // 1-12

          if (year < currentYear || (year === currentYear && month < currentMonth)) {
            newErrors.expiry = "La tarjeta ha expirado";
          }
        }
      }
    }

    // 4. Validar CVV
    if (!cvv) {
      newErrors.cvv = "El CVV es obligatorio";
    } else {
      const expectedCvvLength = cardType === "amex" ? 4 : 3;
      if (cvv.length < expectedCvvLength) {
        newErrors.cvv = `El CVV debe tener ${expectedCvvLength} dígitos`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    const currentCardType = getCardType(value);
    const maxLen = currentCardType === "amex" ? 15 : 16;
    if (value.length > maxLen) {
      value = value.slice(0, maxLen);
    }
    setCardType(currentCardType);
    const formatted = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Allow deleting slash
    if (value.length < expiry.length && expiry.endsWith("/")) {
      value = value.replace(/\//g, "");
      setExpiry(value);
      if (errors.expiry) {
        setErrors((prev) => ({ ...prev, expiry: undefined }));
      }
      return;
    }

    value = value.replace(/[^\d/]/g, "");

    const parts = value.split("/");
    let month = parts[0] || "";
    let year = parts[1] || "";

    if (month.length === 1) {
      if (value.endsWith("/") && month !== "0") {
        month = `0${month}`;
        setExpiry(`${month}/`);
        if (errors.expiry) {
          setErrors((prev) => ({ ...prev, expiry: undefined }));
        }
        return;
      }
    }

    if (month.length >= 2) {
      month = month.slice(0, 2);
      const mInt = parseInt(month, 10);
      if (mInt === 0) month = "01";
      else if (mInt > 12) month = "12";

      if (!value.includes("/") && value.length === 2 && !expiry.endsWith("/")) {
        setExpiry(`${month}/`);
        if (errors.expiry) {
          setErrors((prev) => ({ ...prev, expiry: undefined }));
        }
        return;
      }
    }

    if (year.length > 2) {
      year = year.slice(0, 2);
    }

    if (value.includes("/") || month.length === 2) {
      setExpiry(`${month}/${year}`);
    } else {
      setExpiry(month);
    }

    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: undefined }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    const maxLen = cardType === "amex" ? 4 : 3;
    if (value.length > maxLen) {
      value = value.slice(0, maxLen);
    }
    setCvv(value);
    if (errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsProcessing(true);

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

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Input
            label="Nombre en la Tarjeta"
            type="text"
            placeholder="Ej. Juan Pérez"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
            error={errors.name}
          />
        </div>

        <div>
          <Input
            label="Número de Tarjeta"
            type="text"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            value={cardNumber}
            onChange={handleCardNumberChange}
            rightElement={<CardIcon type={cardType} />}
            error={errors.cardNumber}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiración"
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            value={expiry}
            onChange={handleExpiryChange}
            error={errors.expiry}
          />
          <Input
            label="CVV"
            type="text"
            placeholder="123"
            maxLength={cardType === "amex" ? 4 : 3}
            value={cvv}
            onChange={handleCvvChange}
            error={errors.cvv}
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
