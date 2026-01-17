'use client';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger';
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'info'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const typeColors = {
        info: 'bg-sky-500 hover:bg-sky-600',
        warning: 'bg-amber-500 hover:bg-amber-600',
        danger: 'bg-red-500 hover:bg-red-600'
    };

    const typeIcons = {
        info: '❓',
        warning: '⚠️',
        danger: '🗑️'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{typeIcons[type]}</span>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-700 whitespace-pre-line">{message}</p>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${typeColors[type]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

