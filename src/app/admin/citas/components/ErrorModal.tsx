'use client';

import { useEffect } from 'react';

interface ErrorModalProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
}

export default function ErrorModal({
    isOpen,
    message,
    onClose
}: ErrorModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-8 text-center">
                    {/* Error Icon */}
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    {/* Message */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
                    <p className="text-gray-700 whitespace-pre-line">{message}</p>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
