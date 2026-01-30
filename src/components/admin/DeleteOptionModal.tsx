'use client';

import { useState } from 'react';
import { X, Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface ProductOption {
    _id: string;
    type: string;
    value: string;
    label: string;
    isActive: boolean;
}

interface DeleteOptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    options: ProductOption[];
    optionType: string;
    onDeleteSuccess: () => void;
}

export default function DeleteOptionModal({
    isOpen,
    onClose,
    options,
    optionType,
    onDeleteSuccess
}: DeleteOptionModalProps) {
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usageInfo, setUsageInfo] = useState<{ count: number; sampleProducts: string } | null>(null);

    if (!isOpen) return null;

    const handleDeleteClick = async (e: React.MouseEvent, option: ProductOption) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedOption(option);
        setError(null);
        setUsageInfo(null);

        // Check usage first
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-options/${option._id}/usage`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.count > 0) {
                    setUsageInfo({
                        count: data.count,
                        sampleProducts: data.products.map((p: any) => p.title).slice(0, 3).join(', ')
                    });
                }
            } else {
                console.warn('⚠️ [DeleteOptionModal] Usage check failed:', response.status);
            }
        } catch (err) {
            console.error('❌ [DeleteOptionModal] Error checking usage:', err);
            // Continue anyway - user can still delete
        }
    };

    const confirmDelete = async () => {
        if (!selectedOption) return;

        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-options/${selectedOption._id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                onDeleteSuccess();
                setSelectedOption(null);
            } else {
                setError(data.message || 'Error al eliminar opción');
                setUsageInfo(data.usageCount > 0 ? {
                    count: data.usageCount,
                    sampleProducts: data.sampleProducts || ''
                } : null);
            }
        } catch (err) {
            setError('Error de conexión al eliminar opción');
        } finally {
            setIsDeleting(false);
        }
    };

    const getTypeLabel = () => {
        const labels: Record<string, string> = {
            'category': 'Categoría',
            'btu': 'Capacidad BTU',
            'condition': 'Condición'
        };
        return labels[optionType] || optionType;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        Gestionar {getTypeLabel()}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Options List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {options.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            No hay opciones disponibles
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {options.map((option) => (
                                <div
                                    key={option._id}
                                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                                >
                                    <div>
                                        <p className="text-white font-medium">{option.label}</p>
                                        <p className="text-sm text-gray-400">{option.value}</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, option)}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Eliminar opción"
                                        type="button"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Delete Confirmation */}
                {selectedOption && (
                    <div className="p-6 border-t border-white/10 bg-slate-800/30">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                                <div className="flex-1">
                                    <p className="text-white font-medium">
                                        ¿Eliminar "{selectedOption.label}"?
                                    </p>

                                    {usageInfo && usageInfo.count > 0 ? (
                                        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <p className="text-red-400 text-sm font-medium">
                                                ⚠️ No se puede eliminar
                                            </p>
                                            <p className="text-red-300 text-sm mt-1">
                                                {usageInfo.count} producto(s) usan esta opción
                                            </p>
                                            {usageInfo.sampleProducts && (
                                                <p className="text-red-300/70 text-xs mt-1">
                                                    Ejemplos: {usageInfo.sampleProducts}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm mt-1">
                                            Esta acción no se puede deshacer.
                                        </p>
                                    )}

                                    {error && (
                                        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <p className="text-red-400 text-sm">{error}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setSelectedOption(null);
                                        setError(null);
                                        setUsageInfo(null);
                                    }}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting || (usageInfo && usageInfo.count > 0)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    type="button"
                                >
                                    {isDeleting && <Loader2 size={16} className="animate-spin" />}
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
