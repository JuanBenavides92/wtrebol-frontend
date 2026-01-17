'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, FileText, StickyNote } from 'lucide-react';

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
    { value: 'corporate-contract', label: 'Contrato Corporativo', color: '#9333EA', icon: '🏢' },
    { value: 'personal-deal', label: 'Trato Personal', color: '#10B981', icon: '🤝' },
    { value: 'internal', label: 'Interno', color: '#6B7280', icon: '🔒' },
    { value: 'maintenance', label: 'Mantenimiento', color: '#F59E0B', icon: '🔧' },
    { value: 'other', label: 'Otro', color: '#0EA5E9', icon: '📌' }
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

    const selectedType = blockTypeOptions.find(opt => opt.value === formData.blockType);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                                    style={{
                                        backgroundColor: `${selectedType?.color}20`,
                                        border: `2px solid ${selectedType?.color}50`
                                    }}
                                >
                                    {selectedType?.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-white">Bloquear Horario</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group"
                            >
                                <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
                            {/* Título */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Título <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={100}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    placeholder="Ej: Servicio Empresa ABC"
                                />
                            </div>

                            {/* Tipo de Bloqueo */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Tipo de Bloqueo <span className="text-red-400">*</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {blockTypeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => handleBlockTypeChange(option.value)}
                                            className={`
                                                px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium
                                                ${formData.blockType === option.value
                                                    ? 'border-sky-500 bg-sky-500/20 text-white'
                                                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                                                }
                                            `}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-xl">{option.icon}</span>
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: option.color }}
                                                />
                                                <span className="text-xs">{option.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fecha y Horario */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-emerald-400" />
                                            Fecha <span className="text-red-400">*</span>
                                        </div>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.scheduledDate}
                                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-sky-400" />
                                            Hora Inicio <span className="text-red-400">*</span>
                                        </div>
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-orange-400" />
                                            Hora Fin <span className="text-red-400">*</span>
                                        </div>
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-purple-400" />
                                        Descripción
                                    </div>
                                </label>
                                <textarea
                                    maxLength={500}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                                    rows={3}
                                    placeholder="Detalles adicionales sobre el bloqueo..."
                                />
                            </div>

                            {/* Notas */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    <div className="flex items-center gap-2">
                                        <StickyNote className="w-4 h-4 text-amber-400" />
                                        Notas Internas
                                    </div>
                                </label>
                                <textarea
                                    maxLength={1000}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                                    rows={2}
                                    placeholder="Notas privadas (no visibles para clientes)..."
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 border border-white/10 bg-white/5 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-medium"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creando...' : 'Crear Bloqueo'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

