'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface ProductFormData {
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    category: string;
    isActive: boolean;
}

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated } = useAuth();
    const isEdit = params?.id !== 'new';
    const productId = isEdit ? params?.id as string : null;

    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        description: '',
        imageUrl: '',
        price: '',
        category: '',
        isActive: true,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/admin/login');
            return;
        }

        if (isEdit && productId) {
            loadProduct();
        }
    }, [isAuthenticated, isEdit, productId]);

    const loadProduct = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/content/item/${productId}`, {
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
                    price: data.price || '',
                    category: data.category || '',
                    isActive: data.isActive ?? true,
                });
            }
        } catch (error) {
            console.error('Error loading product:', error);
            setError('Error al cargar el producto');
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
                ? `http://localhost:5000/api/content/${productId}`
                : 'http://localhost:5000/api/content';

            const response = await fetch(url, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type: 'product', ...formData }),
            });

            if (response.ok) {
                router.push('/admin/productos');
            } else {
                const data = await response.json();
                setError(data.message || 'Error al guardar el producto');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setError('Error al guardar el producto');
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
                    onClick={() => router.push('/admin/productos')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Productos
                </button>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                </h1>
                <p className="text-gray-400">
                    {isEdit ? 'Modifica los datos del producto' : 'Crea un nuevo producto para la tienda'}
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
                        Nombre del Producto <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Ej: Aire Acondicionado Split 12000 BTU"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Descripción detallada del producto"
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

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Precio</label>
                        <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            placeholder="Ej: $1.200.000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                            placeholder="Ej: Aires Acondicionados"
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
                        <span className="text-white">Producto activo</span>
                    </label>
                </div>

                <div className="flex gap-4 pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/productos')}
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
                            <><Save className="h-5 w-5" />{isEdit ? 'Actualizar Producto' : 'Crear Producto'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
