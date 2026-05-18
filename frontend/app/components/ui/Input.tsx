import * as React from "react";
// Importamos una utilidad para clases condicionales. Si no la tienes, ver abajo.
import { cn } from "@/lib/utils";

// Icono de advertencia de error (SVG)
const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="w-4 h-4 mr-1 text-red-500 flex-shrink-0"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
    />
  </svg>
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; // Propiedad para pasar el mensaje de error
  rightElement?: React.ReactNode; // Elemento opcional a la derecha (como un icono)
}

// Usamos forwardRef para integrarlo con React Hook Form
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, rightElement, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full">

        {/* 1. Estilo del Label: Se vuelve rojo si hay error */}
        <label
          className={cn(
            "text-sm font-medium transition-colors duration-200",
            error ? "text-red-500" : "text-white/70"
          )}
        >
          {label}
        </label>

        {/* 2. Estilo del Input: Borde rojo si hay error */}
        <div className="relative">
          <input
            type={type}
            className={cn(
              // Clases base
              "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50",
              // Padding derecho si hay rightElement
              rightElement && "pr-12",
              // Clases de error
              error && "border-red-500 focus:ring-red-500 placeholder:text-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {/* 3. Estilo del Mensaje de Error: Incluye el icono */}
        {error && (
          <div className="flex items-start text-xs text-red-500 mt-1 transition-all duration-200">
            <ErrorIcon />
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };