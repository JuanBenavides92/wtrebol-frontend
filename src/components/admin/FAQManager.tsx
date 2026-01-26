'use client';

import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQManagerProps {
    faqs: FAQ[];
    onChange: (faqs: FAQ[]) => void;
}

export default function FAQManager({ faqs, onChange }: FAQManagerProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const addFAQ = () => {
        onChange([...faqs, { question: '', answer: '' }]);
        setExpandedIndex(faqs.length);
    };

    const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
        const updated = [...faqs];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const removeFAQ = (index: number) => {
        onChange(faqs.filter((_, i) => i !== index));
        setExpandedIndex(null);
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-white">
                    Preguntas Frecuentes ({faqs.length})
                </label>
                <button
                    type="button"
                    onClick={addFAQ}
                    className="flex items-center gap-2 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Agregar FAQ
                </button>
            </div>

            {faqs.length === 0 ? (
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                    <p className="text-gray-400 mb-1">No hay preguntas frecuentes</p>
                    <p className="text-sm text-gray-500">Agrega Q&A específicas de este producto</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-slate-800 border border-white/10 rounded-lg overflow-hidden">
                            {/* Header */}
                            <div
                                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-800/50"
                                onClick={() => toggleExpand(index)}
                            >
                                <span className="flex-shrink-0 w-8 h-8 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    {faq.question ? (
                                        <p className="text-white font-medium truncate">{faq.question}</p>
                                    ) : (
                                        <p className="text-gray-500 italic">Nueva pregunta...</p>
                                    )}
                                </div>
                                {expandedIndex === index ? (
                                    <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                            </div>

                            {/* Content */}
                            {expandedIndex === index && (
                                <div className="border-t border-white/10 p-4 space-y-4 bg-slate-800/30">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">
                                            Pregunta (10-150 caracteres)
                                        </label>
                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                            maxLength={150}
                                            className="w-full bg-slate-700 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 text-sm"
                                            placeholder="Ej: ¿Incluye instalación?"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{faq.question.length}/150</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-2">
                                            Respuesta (20-500 caracteres)
                                        </label>
                                        <textarea
                                            value={faq.answer}
                                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                            maxLength={500}
                                            rows={4}
                                            className="w-full bg-slate-700 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 text-sm"
                                            placeholder="Escribe la respuesta completa..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{faq.answer.length}/500</p>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeFAQ(index)}
                                            className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <X className="h-4 w-4" />
                                            Eliminar FAQ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-500">
                Las FAQs aparecerán en formato acordeón en la página de detalle del producto.
            </p>
        </div>
    );
}
