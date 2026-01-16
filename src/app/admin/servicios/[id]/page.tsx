'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface ServiceFormData {
    title: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    features: string[];
    benefits: string[];
    icon: string;
    color: string;
    gradient: string;
    buttonText: string;
    buttonLink: string;
}

export default function ServiceFormPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const isEdit = params?.id !== 'new';
    const serviceId = isEdit ? params?.id as string : null;

    const [formData, setFormData] = useState<ServiceFormData>({
        title: '',
        description: '',
        imageUrl: '',
        isActive: true,
        features: [],
        benefits: [],
        icon: '🔧',
        color: '#0EA5E9',
        gradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
        buttonText: 'Solicitar Servicio',
        buttonLink: '/contacto',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
            return;
        }

        if (isEdit && serviceId) {
            loadService();
        }
    }, [isAuthenticated, isEdit, serviceId]);

    const loadService = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/content/item/${serviceId}`, {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                // Backend devuelve { success: true, data: {...} }
                const data = result.success ? result.data : result;
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    imageUrl: data.imageUrl || '',
                    isActive: data.isActive ?? true,
                    features: data.data?.features || [],
                    benefits: data.data?.benefits || [],
                    icon: data.data?.icon || '🔧',
                    color: data.data?.color || '#0EA5E9',
                    gradient: data.data?.gradient || 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                    buttonText: data.data?.buttonText || 'Solicitar Servicio',
                    buttonLink: data.data?.buttonLink || '/contacto',
                });
            }
        } catch (error) {
            console.error('Error loading service:', error);
            setError('Error al cargar el servicio');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (!formData.imageUrl.trim()) {
            setError('La imagen es requerida');
            return;
        }

        setIsSaving(true);

        try {
            const url = isEdit
                ? `http://localhost:5000/api/content/${serviceId}`
                : 'http://localhost:5000/api/content';

            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type: 'service',
                    title: formData.title,
                    description: formData.description,
                    imageUrl: formData.imageUrl,
                    isActive: formData.isActive,
                    data: {
                        features: formData.features,
                        benefits: formData.benefits,
                        icon: formData.icon,
                        color: formData.color,
                        gradient: formData.gradient,
                        buttonText: formData.buttonText,
                        buttonLink: formData.buttonLink,
                    }
                }),
            });

            if (response.ok) {
                router.push('/admin/servicios');
            } else {
                const data = await response.json();
                setError(data.message || 'Error al guardar el servicio');
            }
        } catch (error) {
            console.error('Error saving service:', error);
            setError('Error al guardar el servicio');
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
        <div className="p-8 max-w-4xl">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/admin/servicios')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Servicios
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {isEdit ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h1>
                <p className="text-gray-400">
                    {isEdit ? 'Modifica los datos del servicio' : 'Crea un nuevo servicio'}
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-sm text-red-200">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre del Servicio <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Ej: Instalación de Aires Acondicionados"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={5}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Descripción detallada del servicio"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Imagen <span className="text-red-400">*</span>
                    </label>
                    {formData.imageUrl ? (
                        <div className="space-y-4">
                            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-slate-700">
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                className="text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                Cambiar imagen
                            </button>
                        </div>
                    ) : (
                        <ImageUpload
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            onUploadError={(error) => setError(error)}
                        />
                    )}
                </div>

                {/* Features - Dynamic List */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        ¿Qué incluye? (Features)
                    </label>
                    <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => {
                                        const newFeatures = [...formData.features];
                                        newFeatures[index] = e.target.value;
                                        setFormData(prev => ({ ...prev, features: newFeatures }));
                                    }}
                                    className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                    placeholder="Ej: Limpieza profunda de filtros"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newFeatures = formData.features.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, features: newFeatures }));
                                    }}
                                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))}
                            className="w-full px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors text-sm font-medium"
                        >
                            + Agregar Feature
                        </button>
                    </div>
                </div>

                {/* Benefits - Dynamic List */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Beneficios
                    </label>
                    <div className="space-y-2">
                        {formData.benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={benefit}
                                    onChange={(e) => {
                                        const newBenefits = [...formData.benefits];
                                        newBenefits[index] = e.target.value;
                                        setFormData(prev => ({ ...prev, benefits: newBenefits }));
                                    }}
                                    className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                    placeholder="Ej: Reduce facturas de electricidad"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newBenefits = formData.benefits.filter((_, i) => i !== index);
                                        setFormData(prev => ({ ...prev, benefits: newBenefits }));
                                    }}
                                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }))}
                            className="w-full px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors text-sm font-medium"
                        >
                            + Agregar Beneficio
                        </button>
                    </div>
                </div>

                {/* Icon */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ícono (Emoji)
                    </label>
                    <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Ej: 🔧, ⚙️, 🛠️"
                        maxLength={2}
                    />
                    <p className="text-xs text-gray-400 mt-1">Usa un emoji para representar el servicio</p>
                </div>

                {/* Color and Gradient */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Color Principal
                        </label>
                        <div className="space-y-2">
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                className="w-full h-12 bg-slate-800 border border-white/10 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                placeholder="#0EA5E9"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Gradiente CSS
                        </label>
                        <div className="space-y-2">
                            <div
                                className="h-12 rounded-lg border border-white/10"
                                style={{ background: formData.gradient }}
                            />
                            <input
                                type="text"
                                value={formData.gradient}
                                onChange={(e) => setFormData(prev => ({ ...prev, gradient: e.target.value }))}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm"
                                placeholder="linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)"
                            />
                        </div>
                    </div>
                </div>

                {/* Button Text and Link */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Texto del Botón
                        </label>
                        <input
                            type="text"
                            value={formData.buttonText}
                            onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            placeholder="Solicitar Servicio"
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
                        />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-3 p-3 bg-slate-800 border border-white/10 rounded-lg cursor-pointer hover:border-sky-500/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="w-5 h-5 rounded border-gray-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-800"
                        />
                        <span className="text-white">Servicio activo</span>
                    </label>
                </div>

                <div className="flex gap-4 pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/servicios')}
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
                            <><Save className="h-5 w-5" />{isEdit ? 'Actualizar Servicio' : 'Crear Servicio'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
