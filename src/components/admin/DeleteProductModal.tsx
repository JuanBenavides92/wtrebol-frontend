'use client';

import { X, AlertTriangle } from 'lucide-react';

interface DeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
}

export default function DeleteProductModal({
    isOpen,
    onClose,
    onConfirm,
    productName
}: DeleteProductModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-red-500/30 shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                Eliminar Producto
                            </h3>
                            <p className="text-sm text-gray-400">
                                Esta acción no se puede deshacer
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
                    <p className="text-gray-300">
                        ¿Estás seguro de que deseas eliminar el producto{' '}
                        <strong className="text-white">"{productName}"</strong>?
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Se eliminará permanentemente de la base de datos.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
