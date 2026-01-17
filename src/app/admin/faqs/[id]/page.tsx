'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import API_CONFIG from '@/lib/config';

interface RelatedLink {
    text: string;
    url: string;
}

interface FAQFormData {
    title: string;
    description: string;
    isActive: boolean;
    order: number;
    icon: string;
    category: string;
    gradient: string;
    // Reverso de la card
    detailedAnswer: string;
    tips: string[];
    relatedLinks: RelatedLink[];
}

export default function FAQFormPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const isEdit = params?.id !== 'new';
    const faqId = isEdit ? params?.id as string : null;

    const [formData, setFormData] = useState<FAQFormData>({
        title: '',
        description: '',
        isActive: true,
        order: 1,
        icon: 'Phone',
        category: '',
        gradient: 'from-sky-400 to-blue-500',
        detailedAnswer: '',
        tips: [],
        relatedLinks: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
            return;
        }

        if (isEdit && faqId) {
            loadFAQ();
        }
    }, [isAuthenticated, isEdit, faqId]);

    const loadFAQ = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_CONFIG.url(`/api/content/item/${faqId}`), {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                const data = result.success ? result.data : result;
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    isActive: data.isActive ?? true,
                    order: data.order || 1,
                    icon: data.data?.icon || 'Phone',
                    category: data.data?.category || '',
                    gradient: data.data?.gradient || 'from-sky-400 to-blue-500',
                    detailedAnswer: data.data?.backContent?.detailedAnswer || '',
                    tips: data.data?.backContent?.tips || [],
                    relatedLinks: data.data?.backContent?.relatedLinks || [],
                });
            }
        } catch (error) {
            console.error('Error loading FAQ:', error);
            setError('Error al cargar la FAQ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError('La pregunta es requerida');
            return;
        }

        setIsSaving(true);

        try {
            const url = isEdit
                ? API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${faqId}`)
                : API_CONFIG.url(API_CONFIG.ENDPOINTS.CONTENT);

            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type: 'faq',
                    title: formData.title,
                    description: formData.description,
                    isActive: formData.isActive,
                    order: formData.order,
                    data: {
                        icon: formData.icon,
                        category: formData.category,
                        gradient: formData.gradient,
                        backContent: {
                            detailedAnswer: formData.detailedAnswer,
                            tips: formData.tips.filter(t => t.trim()),
                            relatedLinks: formData.relatedLinks.filter(l => l.text && l.url),
                        }
                    }
                }),
            });

            if (response.ok) {
                router.push('/admin/faqs');
            } else {
                const data = await response.json();
                setError(data.message || 'Error al guardar la FAQ');
            }
        } catch (error) {
            console.error('Error saving FAQ:', error);
            setError('Error al guardar la FAQ');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin/faqs')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a FAQs
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {isEdit ? 'Editar FAQ' : 'Nueva FAQ'}
                </h1>
                <p className="text-gray-400">
                    {isEdit ? 'Modifica los datos de la pregunta frecuente' : 'Crea una nueva pregunta frecuente'}
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* SECCIÓN: INFORMACIÓN BÁSICA */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">📋 Información Básica</h2>

                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Pregunta <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                    placeholder="Ej: ¿Cada cuánto debo hacer mantenimiento?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Orden
                                </label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                placeholder="Ej: Mantenimiento, Instalación, Garantía..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Respuesta Corta (Frente)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                placeholder="Respuesta corta que aparece en el frente de la card"
                            />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: DISEÑO VISUAL */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">🎨 Diseño Visual</h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Icono
                            </label>
                            <select
                                value={formData.icon}
                                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            >
                                <option value="Clock">🕐 Clock</option>
                                <option value="Wrench">🔧 Wrench</option>
                                <option value="Shield">🛡️ Shield</option>
                                <option value="Calendar">📅 Calendar</option>
                                <option value="DollarSign">💰 DollarSign</option>
                                <option value="Phone">📱 Phone</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Gradiente (Tailwind)
                            </label>
                            <input
                                type="text"
                                value={formData.gradient}
                                onChange={(e) => setFormData(prev => ({ ...prev, gradient: e.target.value }))}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                placeholder="from-sky-400 to-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: REVERSO DE LA CARD */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">🔄 Contenido del Reverso</h2>

                    {/* Respuesta Detallada */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Respuesta Detallada
                        </label>
                        <textarea
                            value={formData.detailedAnswer}
                            onChange={(e) => setFormData(prev => ({ ...prev, detailedAnswer: e.target.value }))}
                            rows={5}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            placeholder="Respuesta completa y detallada que aparece en el reverso de la card"
                        />
                    </div>

                    {/* Tips */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Tips / Consejos Útiles
                        </label>
                        <div className="space-y-2">
                            {formData.tips.map((tip, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tip}
                                        onChange={(e) => {
                                            const newTips = [...formData.tips];
                                            newTips[index] = e.target.value;
                                            setFormData(prev => ({ ...prev, tips: newTips }));
                                        }}
                                        className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
                                        placeholder="Ej: Cambia los filtros cada 1-3 meses"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newTips = formData.tips.filter((_, i) => i !== index);
                                            setFormData(prev => ({ ...prev, tips: newTips }));
                                        }}
                                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, tips: [...prev.tips, ''] }))}
                                className="w-full px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Agregar Tip
                            </button>
                        </div>
                    </div>

                    {/* Links Relacionados */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Enlaces Relacionados
                        </label>
                        <div className="space-y-2">
                            {formData.relatedLinks.map((link, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={link.text}
                                        onChange={(e) => {
                                            const newLinks = [...formData.relatedLinks];
                                            newLinks[index].text = e.target.value;
                                            setFormData(prev => ({ ...prev, relatedLinks: newLinks }));
                                        }}
                                        className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
                                        placeholder="Texto del enlace"
                                    />
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => {
                                            const newLinks = [...formData.relatedLinks];
                                            newLinks[index].url = e.target.value;
                                            setFormData(prev => ({ ...prev, relatedLinks: newLinks }));
                                        }}
                                        className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
                                        placeholder="/url"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newLinks = formData.relatedLinks.filter((_, i) => i !== index);
                                            setFormData(prev => ({ ...prev, relatedLinks: newLinks }));
                                        }}
                                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, relatedLinks: [...prev.relatedLinks, { text: '', url: '' }] }))}
                                className="w-full px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Agregar Enlace
                            </button>
                        </div>
                    </div>
                </div>

                {/* Estado */}
                <div>
                    <label className="flex items-center gap-3 p-3 bg-slate-800 border border-white/10 rounded-lg cursor-pointer hover:border-sky-500/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="w-5 h-5 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                        />
                        <span className="text-white">FAQ activa</span>
                    </label>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/faqs')}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <><Loader2 className="h-5 w-5 animate-spin" />Guardando...</>
                        ) : (
                            <><Save className="h-5 w-5" />{isEdit ? 'Actualizar FAQ' : 'Crear FAQ'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
