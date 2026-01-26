'use client';

import { Plus, X, GripVertical } from 'lucide-react';

interface FeaturesListProps {
    features: string[];
    onChange: (features: string[]) => void;
    maxLength?: number;
}

export default function FeaturesList({ features, onChange, maxLength = 100 }: FeaturesListProps) {
    const addFeature = () => {
        onChange([...features, '']);
    };

    const updateFeature = (index: number, value: string) => {
        const updated = [...features];
        updated[index] = value;
        onChange(updated);
    };

    const removeFeature = (index: number) => {
        onChange(features.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white">
                    Características Destacadas ({features.length})
                </label>
                <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Agregar
                </button>
            </div>

            {features.length === 0 ? (
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                    <p className="text-gray-400 mb-1">No hay características</p>
                    <p className="text-sm text-gray-500">Agrega puntos destacados del producto</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 bg-slate-800 border border-white/10 rounded-lg p-3">
                            <GripVertical className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => updateFeature(index, e.target.value)}
                                maxLength={maxLength}
                                className="flex-1 bg-slate-700 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 text-sm"
                                placeholder="Ej: Tecnología Inverter de bajo consumo"
                            />
                            <span className="text-xs text-gray-500 flex-shrink-0 w-12 text-right">
                                {feature.length}/{maxLength}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors flex-shrink-0"
                                title="Eliminar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500">
                Máximo {maxLength} caracteres por característica. Se mostrarán con ✓ en la página de detalle.
            </p>
        </div>
    );
}
