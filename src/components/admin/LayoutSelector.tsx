'use client';

import { LayoutGrid, ImageIcon, Maximize2 } from 'lucide-react';

export type LayoutType = 'image-right' | 'image-left' | 'image-background';

interface LayoutOption {
    value: LayoutType;
    label: string;
    icon: React.ReactNode;
    description: string;
    preview: React.ReactNode;
}

interface LayoutSelectorProps {
    selected: LayoutType;
    onChange: (layout: LayoutType) => void;
}

export default function LayoutSelector({ selected, onChange }: LayoutSelectorProps) {
    const layouts: LayoutOption[] = [
        {
            value: 'image-right',
            label: 'Imagen Derecha',
            icon: <LayoutGrid className="h-5 w-5" />,
            description: 'Texto a la izquierda, imagen a la derecha',
            preview: (
                <div className="flex gap-2 h-16">
                    <div className="flex-1 bg-sky-500/20 rounded flex items-center justify-center">
                        <span className="text-xs text-sky-300">Texto</span>
                    </div>
                    <div className="flex-1 bg-purple-500/20 rounded flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-purple-300" />
                    </div>
                </div>
            )
        },
        {
            value: 'image-left',
            label: 'Imagen Izquierda',
            icon: <LayoutGrid className="h-5 w-5 scale-x-[-1]" />,
            description: 'Imagen a la izquierda, texto a la derecha',
            preview: (
                <div className="flex gap-2 h-16">
                    <div className="flex-1 bg-purple-500/20 rounded flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-purple-300" />
                    </div>
                    <div className="flex-1 bg-sky-500/20 rounded flex items-center justify-center">
                        <span className="text-xs text-sky-300">Texto</span>
                    </div>
                </div>
            )
        },
        {
            value: 'image-background',
            label: 'Fondo Completo',
            icon: <Maximize2 className="h-5 w-5" />,
            description: 'Imagen de fondo con texto centrado',
            preview: (
                <div className="relative h-16 bg-purple-500/20 rounded flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-purple-300/30 absolute" />
                    <span className="text-xs text-sky-300 relative z-10">Texto</span>
                </div>
            )
        }
    ];

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
                Tipo de Layout <span className="text-red-400">*</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {layouts.map((layout) => (
                    <button
                        key={layout.value}
                        type="button"
                        onClick={() => onChange(layout.value)}
                        className={`
                            relative p-4 rounded-lg border-2 transition-all text-left
                            ${selected === layout.value
                                ? 'border-sky-500 bg-sky-500/10'
                                : 'border-white/10 bg-slate-800 hover:border-sky-500/50'
                            }
                        `}
                    >
                        {/* Selected Indicator */}
                        {selected === layout.value && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}

                        {/* Icon and Label */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`${selected === layout.value ? 'text-sky-400' : 'text-gray-400'}`}>
                                {layout.icon}
                            </div>
                            <h3 className={`font-semibold ${selected === layout.value ? 'text-white' : 'text-gray-300'}`}>
                                {layout.label}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-400 mb-3">
                            {layout.description}
                        </p>

                        {/* Visual Preview */}
                        <div className="mt-2">
                            {layout.preview}
                        </div>
                    </button>
                ))}
            </div>

            {/* Help Text */}
            <p className="mt-3 text-xs text-gray-500">
                Selecciona cómo se mostrará el slide en la página principal
            </p>
        </div>
    );
}

