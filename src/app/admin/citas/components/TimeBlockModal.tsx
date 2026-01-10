'use client';

import { useState } from 'react';

interface TimeBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (blockData: TimeBlockData) => void;
    initialDate?: string;
    initialStartTime?: string;
    initialEndTime?: string;
}

export interface TimeBlockData {
    title: string;
    description?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    blockType: 'corporate-contract' | 'personal-deal' | 'internal' | 'maintenance' | 'other';
    notes?: string;
    color?: string;
}

const blockTypeOptions = [
    { value: 'corporate-contract', label: 'Contrato Corporativo', color: '#9333EA' },
    { value: 'personal-deal', label: 'Trato Personal', color: '#10B981' },
    { value: 'internal', label: 'Interno', color: '#6B7280' },
    { value: 'maintenance', label: 'Mantenimiento', color: '#F59E0B' },
    { value: 'other', label: 'Otro', color: '#0EA5E9' }
];

export default function TimeBlockModal({
    isOpen,
    onClose,
    onSubmit,
    initialDate,
    initialStartTime,
    initialEndTime
}: TimeBlockModalProps) {
    const [formData, setFormData] = useState<TimeBlockData>({
        title: '',
        description: '',
        scheduledDate: initialDate || '',
        startTime: initialStartTime || '',
        endTime: initialEndTime || '',
        blockType: 'internal',
        notes: '',
        color: '#6B7280'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            // Reset form
            setFormData({
                title: '',
                description: '',
                scheduledDate: initialDate || '',
                startTime: initialStartTime || '',
                endTime: initialEndTime || '',
                blockType: 'internal',
                notes: '',
                color: '#6B7280'
            });
        } catch (error) {
            console.error('Error submitting block:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBlockTypeChange = (type: string) => {
        const option = blockTypeOptions.find(opt => opt.value === type);
        setFormData({
            ...formData,
            blockType: type as any,
            color: option?.color || '#6B7280'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Bloquear Horario</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={100}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            placeholder="Ej: Servicio Empresa ABC"
                        />
                    </div>

                    {/* Tipo de Bloqueo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Bloqueo <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {blockTypeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleBlockTypeChange(option.value)}
                                    className={`
                                        px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium
                                        ${formData.blockType === option.value
                                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: option.color }}
                                        ></div>
                                        {option.label}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fecha y Horario */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.scheduledDate}
                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hora Inicio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hora Fin <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            maxLength={500}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            rows={3}
                            placeholder="Detalles adicionales sobre el bloqueo..."
                        />
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notas Internas
                        </label>
                        <textarea
                            maxLength={1000}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            rows={2}
                            placeholder="Notas privadas (no visibles para clientes)..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Bloqueo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
