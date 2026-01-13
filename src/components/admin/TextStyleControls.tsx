'use client';

import { Type, Palette, Bold, Italic } from 'lucide-react';

interface TextStyleControlsProps {
    label: string;
    size: number;
    color: string;
    gradient: boolean;
    bold: boolean;
    italic: boolean;
    onSizeChange: (size: number) => void;
    onColorChange: (color: string) => void;
    onGradientChange: (gradient: boolean) => void;
    onBoldChange: (bold: boolean) => void;
    onItalicChange: (italic: boolean) => void;
    minSize?: number;
    maxSize?: number;
}

const gradientPresets = [
    { name: 'Azul a Cyan', value: 'linear-gradient(to right, #0EA5E9, #06B6D4)' },
    { name: 'Púrpura a Rosa', value: 'linear-gradient(to right, #A855F7, #EC4899)' },
    { name: 'Verde a Esmeralda', value: 'linear-gradient(to right, #10B981, #059669)' },
    { name: 'Naranja a Rojo', value: 'linear-gradient(to right, #F97316, #EF4444)' },
    { name: 'Índigo a Púrpura', value: 'linear-gradient(to right, #6366F1, #8B5CF6)' },
];

const colorPresets = [
    { name: 'Gris Oscuro', value: '#1F2937' },
    { name: 'Negro', value: '#000000' },
    { name: 'Blanco', value: '#FFFFFF' },
    { name: 'Azul', value: '#0EA5E9' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Púrpura', value: '#A855F7' },
    { name: 'Rojo', value: '#EF4444' },
];

export default function TextStyleControls({
    label,
    size,
    color,
    gradient,
    bold,
    italic,
    onSizeChange,
    onColorChange,
    onGradientChange,
    onBoldChange,
    onItalicChange,
    minSize = 12,
    maxSize = 200
}: TextStyleControlsProps) {
    return (
        <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-white/10">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Type className="h-4 w-4" />
                {label}
            </h3>

            {/* Size Input */}
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                    Tamaño (px)
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min={minSize}
                        max={maxSize}
                        value={size}
                        onChange={(e) => onSizeChange(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <input
                        type="number"
                        min={minSize}
                        max={maxSize}
                        value={size}
                        onChange={(e) => onSizeChange(parseInt(e.target.value) || minSize)}
                        className="w-20 px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white text-center focus:outline-none focus:border-sky-500"
                    />
                </div>
            </div>

            {/* Bold and Italic */}
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={bold}
                        onChange={(e) => onBoldChange(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                    />
                    <span className="text-sm text-gray-300 flex items-center gap-1">
                        <Bold className="h-4 w-4" />
                        Negrilla
                    </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={italic}
                        onChange={(e) => onItalicChange(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                    />
                    <span className="text-sm text-gray-300 flex items-center gap-1">
                        <Italic className="h-4 w-4" />
                        Cursiva
                    </span>
                </label>
            </div>

            {/* Color Selection */}
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Color</label>

                {/* Automatic or Custom */}
                <div className="flex gap-3 mb-3">
                    <button
                        type="button"
                        onClick={() => onColorChange('auto')}
                        className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${color === 'auto'
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }
                        `}
                    >
                        Automático
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (color === 'auto') {
                                onColorChange('#1F2937');
                            }
                        }}
                        className={`
                            flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${color !== 'auto'
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }
                        `}
                    >
                        Personalizado
                    </button>
                </div>

                {/* Custom Color Controls */}
                {color !== 'auto' && (
                    <div className="space-y-3">
                        {/* Color Picker */}
                        <div className="flex items-center gap-3">
                            <label className="text-xs text-gray-400 w-20">Selector:</label>
                            <input
                                type="color"
                                value={gradient ? '#1F2937' : color}
                                onChange={(e) => onColorChange(e.target.value)}
                                className="w-16 h-10 rounded-lg cursor-pointer border-2 border-white/20"
                            />
                        </div>

                        {/* RGB/Hex Input */}
                        <div className="flex items-center gap-3">
                            <label className="text-xs text-gray-400 w-20">Código:</label>
                            <input
                                type="text"
                                value={gradient ? color : color}
                                onChange={(e) => onColorChange(e.target.value)}
                                placeholder="#000000 o rgb(0,0,0)"
                                className="flex-1 px-3 py-2 bg-slate-700 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500"
                            />
                        </div>

                        {/* Gradient Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-white/10">
                            <input
                                type="checkbox"
                                checked={gradient}
                                onChange={(e) => onGradientChange(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                            />
                            <span className="text-sm text-gray-300 flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Usar difuminado (gradiente)
                            </span>
                        </label>

                        {/* Gradient Presets */}
                        {gradient && (
                            <div className="pt-2">
                                <label className="block text-xs text-gray-400 mb-2">Gradientes predefinidos:</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {gradientPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() => onColorChange(preset.value)}
                                            className={`
                                                relative px-3 py-2 rounded-lg text-xs font-medium transition-all overflow-hidden
                                                ${color === preset.value
                                                    ? 'ring-2 ring-sky-500'
                                                    : 'hover:ring-2 hover:ring-white/30'
                                                }
                                            `}
                                        >
                                            <div
                                                className="absolute inset-0"
                                                style={{ background: preset.value }}
                                            />
                                            <span className="relative z-10 text-white drop-shadow-lg">
                                                {preset.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
