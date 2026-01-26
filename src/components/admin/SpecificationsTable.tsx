'use client';

import { Plus, X } from 'lucide-react';

interface SpecificationsTableProps {
    specifications: Record<string, string | number>;
    onChange: (specs: Record<string, string | number>) => void;
}

export default function SpecificationsTable({ specifications, onChange }: SpecificationsTableProps) {
    const specs = Object.entries(specifications);

    const addRow = () => {
        onChange({ ...specifications, '': '' });
    };

    const updateKey = (oldKey: string, newKey: string) => {
        const newSpecs = { ...specifications };
        const value = newSpecs[oldKey];
        delete newSpecs[oldKey];
        newSpecs[newKey] = value;
        onChange(newSpecs);
    };

    const updateValue = (key: string, value: string) => {
        onChange({ ...specifications, [key]: value });
    };

    const removeRow = (key: string) => {
        const newSpecs = { ...specifications };
        delete newSpecs[key];
        onChange(newSpecs);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white">
                    Especificaciones Técnicas ({specs.length})
                </label>
                <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Agregar
                </button>
            </div>

            <div className="space-y-2">
                {specs.length === 0 ? (
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                        <p className="text-gray-400 mb-1">No hay especificaciones</p>
                        <p className="text-sm text-gray-500">Agrega detalles técnicos del producto</p>
                    </div>
                ) : (
                    <div className="bg-slate-800/30 border border-white/10 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Característica</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Valor</th>
                                    <th className="px-4 py-3 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {specs.map(([key, value], index) => (
                                    <tr key={index} className="hover:bg-slate-800/30">
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={key}
                                                onChange={(e) => updateKey(key, e.target.value)}
                                                className="w-full bg-slate-700 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 text-sm"
                                                placeholder="Ej: Voltaje"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => updateValue(key, e.target.value)}
                                                className="w-full bg-slate-700 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 text-sm"
                                                placeholder="Ej: 220V"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(key)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                                                title="Eliminar"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500">
                Ejemplos: "Voltaje: 220V", "Peso: 45kg", "Dimensiones: 80x60x20cm"
            </p>
        </div>
    );
}
