'use client';

import { useState } from 'react';
import { Plus, Loader2, Settings } from 'lucide-react';
import CreateOptionModal from './CreateOptionModal';
import DeleteOptionModal from './DeleteOptionModal';
import DuplicateOptionAlert from './DuplicateOptionAlert';

interface Option {
    _id?: string; // MongoDB ID for delete functionality
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
    error?: string | null;
    optionType?: string; // For delete modal (category, btu, condition)
    onRefresh?: () => void; // Callback to refresh options after delete
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
    error = null,
    optionType = '',
    onRefresh,
}: CreatableSelectProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [duplicateAlert, setDuplicateAlert] = useState<{
        isOpen: boolean;
        existing: any;
    }>({ isOpen: false, existing: null });

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔄 [CreatableSelect] handleSelectChange LLAMADO');
        console.log('📥 [CreatableSelect] Valor seleccionado del DOM:', selectedValue);
        console.log('📋 [CreatableSelect] Valor anterior del componente:', value);

        if (selectedValue === '__create_new__') {
            console.log('➕ [CreatableSelect] Opción "Crear nueva" seleccionada. Abriendo modal.');
            setIsModalOpen(true);
        } else {
            console.log('✅ [CreatableSelect] Llamando onChange con:', selectedValue);
            onChange(selectedValue);
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    };

    const handleCreateOption = async (label: string) => {
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║  [CreatableSelect] handleCreateOption INICIADO         ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log('📝 [CreatableSelect] Label recibido:', label);
        console.log('📋 [CreatableSelect] Opciones antes de crear:', options.length);
        console.log('📋 [CreatableSelect] Value actual del componente:', value);

        try {
            // onCreateOption returns the created option from backend
            const createdOption = await onCreateOption(label);

            console.log('📦 [CreatableSelect] Opción retornada del hook:', createdOption);

            // If option was created successfully, select it using the backend value
            if (createdOption) {
                console.log('✅ [CreatableSelect] Opción creada exitosamente');
                console.log('📤 [CreatableSelect] Llamando onChange con:', createdOption.value);
                onChange(createdOption.value);
                console.log('✅ [CreatableSelect] onChange ejecutado');
            } else {
                console.error('❌ [CreatableSelect] No se pudo crear la opción');
            }
        } catch (err: any) {
            // Handle duplicate error
            if (err.isDuplicate && err.existing) {
                console.log('⚠️ [CreatableSelect] Opción duplicada detectada:', err.existing);
                setDuplicateAlert({
                    isOpen: true,
                    existing: err.existing
                });
            } else {
                console.error('❌ [CreatableSelect] Error al crear opción:', err);
            }
        }
        console.log('╚════════════════════════════════════════════════════════╝');
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
                externalError={error}
            />

            {/* Delete Option Modal */}
            {optionType && (
                <DeleteOptionModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    options={options.map(opt => ({
                        _id: opt._id || opt.value, // Use real MongoDB ID if available, fallback to value
                        type: optionType,
                        value: opt.value,
                        label: opt.label,
                        isActive: true
                    }))}
                    optionType={optionType}
                    onDeleteSuccess={() => {
                        setIsDeleteModalOpen(false);
                        if (onRefresh) onRefresh();
                    }}
                />
            )}

            {/* Manage Options Button */}
            {optionType && options.length > 0 && (
                <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="mt-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                    <Settings size={14} />
                    Gestionar opciones
                </button>
            )}

            {/* Duplicate Option Alert */}
            <DuplicateOptionAlert
                isOpen={duplicateAlert.isOpen}
                onClose={() => setDuplicateAlert({ isOpen: false, existing: null })}
                existingOption={duplicateAlert.existing}
                optionType={optionType}
            />
        </div>
    );
}
