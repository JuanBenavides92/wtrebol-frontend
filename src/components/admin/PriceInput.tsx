'use client';

import { useState, useEffect } from 'react';

interface PriceInputProps {
    value: string; // Valor numérico sin formato (ej: "2500000")
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export default function PriceInput({
    value,
    onChange,
    label = 'Precio',
    placeholder = 'Ej: $2.500.000',
    required = false,
    className = '',
}: PriceInputProps) {
    const [displayValue, setDisplayValue] = useState('');

    // Formatear valor para mostrar
    useEffect(() => {
        if (!value) {
            setDisplayValue('');
            return;
        }

        // Remover cualquier caracter no numérico
        const numericValue = value.replace(/[^\d]/g, '');

        if (!numericValue) {
            setDisplayValue('');
            return;
        }

        // Formatear con separador de miles colombiano
        const formatted = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(numericValue));

        setDisplayValue(formatted);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Remover todo excepto dígitos
        const numericOnly = inputValue.replace(/[^\d]/g, '');

        // Actualizar el valor limpio (sin formato)
        onChange(numericOnly);
    };

    const handleBlur = () => {
        // Asegurar que el valor esté formateado al perder el foco
        if (value) {
            const numericValue = value.replace(/[^\d]/g, '');
            onChange(numericValue);
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-white mb-2">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    placeholder={placeholder}
                    required={required}
                    inputMode="numeric"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    💰
                </div>
            </div>
            {displayValue && (
                <p className="text-xs text-gray-400 mt-1">
                    Valor numérico: {value || '0'}
                </p>
            )}
        </div>
    );
}
