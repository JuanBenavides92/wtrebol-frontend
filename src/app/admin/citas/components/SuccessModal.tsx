'use client';

import { useEffect } from 'react';

interface SuccessToastProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

export default function SuccessToast({
    isOpen,
    message,
    onClose,
    autoClose = true,
    autoCloseDelay = 3000
}: SuccessToastProps) {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, autoCloseDelay, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-white rounded-lg shadow-2xl border-l-4 border-green-500 p-4 min-w-[320px] max-w-md">
                <div className="flex items-start gap-3">
                    {/* Success Icon */}
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">{message}</p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                {autoClose && (
                    <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 animate-progress"
                            style={{ animationDuration: `${autoCloseDelay}ms` }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
}
