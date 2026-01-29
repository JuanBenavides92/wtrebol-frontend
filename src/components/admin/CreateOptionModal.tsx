'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface CreateOptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (label: string) => Promise<void>;
    title: string;
    placeholder?: string;
}

export default function CreateOptionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    placeholder = 'Nombre de la nueva opción',
}: CreateOptionModalProps) {
    const [label, setLabel] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted (for SSR compatibility)
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!label.trim()) {
            setError('El nombre es requerido');
            return;
        }

        setIsCreating(true);
        setError(null);

        try {
            await onConfirm(label.trim());
            setLabel('');
            onClose();
        } catch (err) {
            setError('Error al crear la opción');
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        if (!isCreating) {
            setLabel('');
            setError(null);
            onClose();
        }
    };

    // Render modal using Portal to avoid nested form issue
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-800 border border-white/10 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <button
                        onClick={handleClose}
                        disabled={isCreating}
                        className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-white mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            placeholder={placeholder}
                            autoFocus
                            disabled={isCreating}
                        />
                        {error && (
                            <p className="text-sm text-red-400 mt-2">{error}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isCreating}
                            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || !label.trim()}
                            className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
