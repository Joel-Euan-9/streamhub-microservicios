
import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {

    label: string;

}

export const Input = ({
    label,
    className = "",
    placeholder = " ",
    id,
    ...props
}: InputProps) => {
    const inputId = id || label.replace(/\s+/g, '-').toLowerCase();

    return (
        <div className="w-full">
            <div className="relative flex items-center">
                <input
                    {...props}
                    id={inputId}
                    placeholder={placeholder}
                    className={`
                        peer block w-full px-4 h-12 rounded-md
                        text-white border border-gray-500 font-medium 
                        appearance-none focus:outline-none focus:ring-1 focus:border-white
                        transition-all duration-200
                        text-sm bg-transparent
                        pt-4 /* Un poco de padding arriba para bajar el texto sutilmente */
                        ${className}
                    `}
                />

                <label
                    htmlFor={inputId}
                    className={`
                        absolute text-gray-500 duration-200 transform font-semibold text-sm
                        left-4 pointer-events-none
                        /* Centrado vertical inicial */
                        top-1/2 -translate-y-1/2 scale-100 (scale-80) */
                        peer-focus:top-2 peer-focus:translate-y-0 peer-focus:scale-75
                        peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-75
                        origin-[0]
                    `}
                >
                    {label}
                </label>
            </div>
        </div>
    );
};