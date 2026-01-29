'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import CreateOptionModal from './CreateOptionModal';

interface Option {
    value: string;
    label: string;
}

interface CreatableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    onCreateOption: (label: string) => Promise<{ value: string; label: string } | null>;
    label: string;
    placeholder?: string;
    isLoading?: boolean;
    className?: string;
}

export default function CreatableSelect({
    value,
    onChange,
    options,
    onCreateOption,
    label,
    placeholder = 'Seleccionar...',
    isLoading = false,
    className = '',
}: CreatableSelectProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        if (selectedValue === '__create_new__') {
            setIsModalOpen(true);
        } else {
            onChange(selectedValue);
        }
    };

    const handleCreateOption = async (label: string) => {
        // onCreateOption returns the created option from backend
        const createdOption = await onCreateOption(label);

        // If option was created successfully, select it using the backend value
        if (createdOption) {
            onChange(createdOption.value);
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-white mb-2">
                {label}
            </label>

            <div className="relative">
                <select
                    value={value}
                    onChange={handleSelectChange}
                    disabled={isLoading}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 appearance-none pr-10"
                >
                    <option value="">{placeholder}</option>

                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}

                    {/* Separator */}
                    <option disabled>──────────────</option>

                    {/* Create new option */}
                    <option value="__create_new__">
                        ➕ Crear nueva opción...
                    </option>
                </select>

                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    </div>
                )}

                {/* Dropdown arrow */}
                {!isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Create Option Modal */}
            <CreateOptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCreateOption}
                title={`Nueva ${label}`}
                placeholder={`Nombre de la nueva ${label.toLowerCase()}`}
            />
        </div>
    );
}
