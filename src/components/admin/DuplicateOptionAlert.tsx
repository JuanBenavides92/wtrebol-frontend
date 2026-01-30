'use client';

import { AlertCircle, X } from 'lucide-react';

interface DuplicateOptionAlertProps {
    isOpen: boolean;
    onClose: () => void;
    existingOption: {
        label: string;
        value: string;
        isActive: boolean;
    } | null;
    optionType: string;
}

export default function DuplicateOptionAlert({
    isOpen,
    onClose,
    existingOption,
    optionType
}: DuplicateOptionAlertProps) {
    if (!isOpen || !existingOption) return null;

    const typeLabels: Record<string, string> = {
        category: 'Categoría',
        btu: 'BTU',
        condition: 'Condición'
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-yellow-500/30 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <AlertCircle className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                Opción Duplicada
                            </h3>
                            <p className="text-sm text-gray-400">
                                Esta opción ya existe
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 mb-3">
                        Ya existe una opción de <strong className="text-white">{typeLabels[optionType] || optionType}</strong> con este valor:
                    </p>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <div>
                            <p className="text-white font-semibold">{existingOption.label}</p>
                            <p className="text-sm text-gray-400">{existingOption.value}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${existingOption.isActive
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                            {existingOption.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-300">
                        💡 <strong>Sugerencia:</strong> Puedes usar la opción existente o crear una con un nombre diferente.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}
