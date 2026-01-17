'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import API_CONFIG from '@/lib/config';

interface Statistic {
    label: string;
    value: string;
}

interface AdvantageFormData {
    title: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    order: number;
    icon: string;
    color: string;
    gradient: string;
    showButton: boolean;
    buttonText: string;
    buttonLink: string;
    // Reverso de la card
    statistics: Statistic[];
    details: string[];
    cta: string;
}

export default function AdvantageFormPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const isEdit = params?.id !== 'new';
    const advantageId = isEdit ? params?.id as string : null;

    const [formData, setFormData] = useState<AdvantageFormData>({
        title: '',
        description: '',
        imageUrl: '',
        isActive: true,
        order: 1,
        icon: 'Award',
        color: '#0EA5E9',
        gradient: 'from-sky-400 to-blue-500',
        showButton: true,
        buttonText: 'Más Información',
        buttonLink: '/contacto',
        statistics: [],
        details: [],
        cta: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
            return;
        }

        if (isEdit && advantageId) {
            loadAdvantage();
        }
    }, [isAuthenticated, isEdit, advantageId]);

    const loadAdvantage = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_CONFIG.url(`/api/content/item/${advantageId}`), {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                const data = result.success ? result.data : result;
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    imageUrl: data.imageUrl || '',
                    isActive: data.isActive ?? true,
                    order: data.order || 1,
                    icon: data.data?.icon || 'Award',
                    color: data.data?.color || '#0EA5E9',
                    gradient: data.data?.gradient || 'from-sky-400 to-blue-500',
                    showButton: data.data?.showButton ?? true,
                    buttonText: data.buttonText || 'Más Información',
                    buttonLink: data.buttonLink || '/contacto',
                    statistics: data.data?.backContent?.statistics || [],
                    details: data.data?.backContent?.details || [],
                    cta: data.data?.backContent?.cta || '',
                });
            }
        } catch (error) {
            console.error('Error loading advantage:', error);
            setError('Error al cargar la ventaja');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError('El título es requerido');
            return;
        }

        setIsSaving(true);

        try {
            const url = isEdit
                ? API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${advantageId}`)
                : API_CONFIG.url(API_CONFIG.ENDPOINTS.CONTENT);

            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type: 'advantage',
                    title: formData.title,
                    description: formData.description,
                    imageUrl: formData.imageUrl,
                    isActive: formData.isActive,
                    order: formData.order,
                    buttonText: formData.buttonText,
                    buttonLink: formData.buttonLink,
                    data: {
                        icon: formData.icon,
                        color: formData.color,
                        gradient: formData.gradient,
                        showButton: formData.showButton,
                        backContent: {
                            statistics: formData.statistics.filter(s => s.label && s.value),
                            details: formData.details.filter(d => d.trim()),
                            cta: formData.cta,
                        }
                    }
                }),
            });

            if (response.ok) {
                router.push('/admin/ventajas');
            } else {
                const data = await response.json();
                setError(data.message || 'Error al guardar la ventaja');
            }
        } catch (error) {
            console.error('Error saving advantage:', error);
            setError('Error al guardar la ventaja');
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
                    onClick={() => router.push('/admin/ventajas')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Ventajas
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {isEdit ? 'Editar Ventaja' : 'Nueva Ventaja'}
                </h1>
                <p className="text-gray-400">
                    {isEdit ? 'Modifica los datos de la ventaja competitiva' : 'Crea una nueva ventaja competitiva'}
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
                                    Título <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                    placeholder="Ej: Certificaciones Profesionales"
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
                            <label className="block text-sm font-medium text-gray-300 mb-2">Descripción (Frente)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                placeholder="Descripción corta que aparece en el frente de la card"
                            />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: DISEÑO VISUAL */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">🎨 Diseño Visual</h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Icono
                            </label>
                            <select
                                value={formData.icon}
                                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            >
                                <option value="Award">🏆 Award</option>
                                <option value="Zap">⚡ Zap</option>
                                <option value="Shield">🛡️ Shield</option>
                                <option value="Wrench">🔧 Wrench</option>
                                <option value="DollarSign">💰 DollarSign</option>
                                <option value="Smartphone">📱 Smartphone</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Color Principal
                            </label>
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                className="w-full h-12 bg-slate-800 border border-white/10 rounded-lg cursor-pointer"
                            />
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

                    {/* Estadísticas */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Estadísticas (máx. 3)
                        </label>
                        <div className="space-y-2">
                            {formData.statistics.map((stat, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={stat.label}
                                        onChange={(e) => {
                                            const newStats = [...formData.statistics];
                                            newStats[index].label = e.target.value;
                                            setFormData(prev => ({ ...prev, statistics: newStats }));
                                        }}
                                        className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
                                        placeholder="Etiqueta (ej: Técnicos Certificados)"
                                    />
                                    <input
                                        type="text"
                                        value={stat.value}
                                        onChange={(e) => {
                                            const newStats = [...formData.statistics];
                                            newStats[index].value = e.target.value;
                                            setFormData(prev => ({ ...prev, statistics: newStats }));
                                        }}
                                        className="w-32 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
                                        placeholder="15+"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newStats = formData.statistics.filter((_, i) => i !== index);
                                            setFormData(prev => ({ ...prev, statistics: newStats }));
                                        }}
                                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {formData.statistics.length < 3 && (
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, statistics: [...prev.statistics, { label: '', value: '' }] }))}
                                    className="w-full px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-4 w-4" /> Agregar Estadística
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Detalles */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Detalles / Puntos Clave
                        </label>
                        <div className="space-y-2">
                            {formData.details.map((detail, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => {
                                            const newDetails = [...formData.details];
                                            newDetails[index] = e.target.value;
                                            setFormData(prev => ({ ...prev, details: newDetails }));
                                        }}
                                        className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
                                        placeholder="Ej: Certificación EPA Universal para manejo de refrigerantes"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newDetails = formData.details.filter((_, i) => i !== index);
                                            setFormData(prev => ({ ...prev, details: newDetails }));
                                        }}
                                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, details: [...prev.details, ''] }))}
                                className="w-full px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Agregar Detalle
                            </button>
                        </div>
                    </div>

                    {/* CTA */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mensaje CTA (Llamado a la Acción)
                        </label>
                        <textarea
                            value={formData.cta}
                            onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.value }))}
                            rows={2}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            placeholder="Mensaje motivacional que aparece al final del reverso"
                        />
                    </div>
                </div>

                {/* SECCIÓN: BOTÓN DE ACCIÓN */}
                <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">🔗 Botón de Acción</h2>

                        {/* Toggle para habilitar/deshabilitar botón */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <span className="text-sm font-medium text-gray-300">Mostrar botón</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={formData.showButton}
                                    onChange={(e) => setFormData(prev => ({ ...prev, showButton: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                            </div>
                        </label>
                    </div>

                    <div className={`grid md:grid-cols-2 gap-4 transition-opacity duration-200 ${!formData.showButton ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Texto del Botón
                            </label>
                            <input
                                type="text"
                                value={formData.buttonText}
                                onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                placeholder="Más Información"
                                disabled={!formData.showButton}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Enlace del Botón
                            </label>
                            <input
                                type="text"
                                value={formData.buttonLink}
                                onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                placeholder="/contacto"
                                disabled={!formData.showButton}
                            />
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
                        <span className="text-white">Ventaja activa</span>
                    </label>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-4 pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/ventajas')}
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
                            <><Save className="h-5 w-5" />{isEdit ? 'Actualizar Ventaja' : 'Crear Ventaja'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
