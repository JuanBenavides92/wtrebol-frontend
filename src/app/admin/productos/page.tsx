'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, ShoppingBag, Star } from 'lucide-react';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/formatters';
import DeleteProductModal from '@/components/admin/DeleteProductModal';

interface Product {
    _id: string;
    type: 'product';
    title: string;
    description?: string;
    imageUrl: string;
    price?: string;
    category?: string;
    isActive: boolean;
    isFeatured?: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function ProductsPage() {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isGeneratingSlugs, setIsGeneratingSlugs] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: Product | null }>({
        isOpen: false,
        product: null
    });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadProducts();
        }
    }, [isAuthenticated]);

    const loadProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await fetch(API_CONFIG.url(API_CONFIG.ENDPOINTS.PRODUCTS), {
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                // Backend devuelve { success: true, count: N, data: [...] }
                if (result.success && Array.isArray(result.data)) {
                    setProducts(result.data);
                } else {
                    console.warn('Backend response format unexpected:', result);
                    setProducts([]);
                }
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${id}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (response.ok) loadProducts();
        } catch (error) {
            console.error('Error toggling product:', error);
        }
    };

    const toggleFeatured = async (id: string, currentFeatured: boolean) => {
        console.log('⭐ [FRONTEND] toggleFeatured llamado:', { id, currentFeatured });
        try {
            const url = API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${id}/toggle-featured`);
            console.log('🌐 [FRONTEND] URL completa:', url);
            console.log('📡 [FRONTEND] Enviando PATCH request...');

            const response = await fetch(url, {
                method: 'PATCH',
                credentials: 'include',
            });

            console.log('📡 [FRONTEND] Response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ [FRONTEND] Resultado:', result);
                if (result.success) {
                    loadProducts();
                } else {
                    alert(result.message || 'Error al cambiar estado destacado');
                }
            } else {
                const result = await response.json();
                console.error('❌ [FRONTEND] Error response:', result);
                alert(result.message || 'Error al cambiar estado destacado');
            }
        } catch (error) {
            console.error('💥 [FRONTEND] Error toggling featured:', error);
            alert('Error al cambiar estado destacado');
        }
    };

    const handleDeleteClick = (product: Product) => {
        setDeleteModal({ isOpen: true, product });
    };

    const deleteProduct = async () => {
        if (!deleteModal.product) return;

        try {
            const response = await fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.CONTENT}/${deleteModal.product._id}`), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                loadProducts();
                setDeleteModal({ isOpen: false, product: null });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const generateSlugs = async () => {
        if (!confirm('¿Generar slugs para todos los productos que no los tienen?\\n\\nEsto creará URLs amigables automáticamente.')) {
            return;
        }

        setIsGeneratingSlugs(true);
        try {
            const response = await fetch(API_CONFIG.url('/api/content/generate-slugs'), {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    alert(`✅ Slugs generados exitosamente!\\n\\n` +
                        `• Actualizados: ${result.data.updated}\\n` +
                        `• Saltados: ${result.data.skipped}\\n` +
                        `• Total procesados: ${result.data.total}\\n\\n` +
                        `Ahora los productos tendrán URLs como:\\n/tienda/nombre-del-producto`);
                    loadProducts();
                }
            }
        } catch (error) {
            console.error('Error generating slugs:', error);
            alert('❌ Error al generar slugs');
        } finally {
            setIsGeneratingSlugs(false);
        }
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Productos</h1>
                    <p className="text-gray-400">Gestiona el catálogo de productos</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={generateSlugs}
                        disabled={isGeneratingSlugs}
                        className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
                        title="Generar URLs amigables para productos sin slug"
                    >
                        {isGeneratingSlugs ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Generando...
                            </>
                        ) : (
                            <>
                                🔗 Generar Slugs
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => router.push('/admin/productos/new')}
                        className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            {isLoadingProducts ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 border border-white/10 rounded-xl">
                    <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No hay productos</h3>
                    <p className="text-gray-400 mb-6">Crea tu primer producto para la tienda</p>
                    <button
                        onClick={() => router.push('/admin/productos/new')}
                        className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Crear Producto
                    </button>
                </div>
            ) : (
                <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Imagen</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nombre</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Descripción</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Precio</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Destacado</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex items-center justify-center">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da46?q=80&w=200';
                                                    target.onerror = null; // Prevent infinite loop
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{product.title}</p>
                                        {product.category && (
                                            <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-400 text-sm line-clamp-2 max-w-md">
                                            {product.description || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-emerald-400 font-semibold">{formatPrice(product.price)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => toggleFeatured(product._id, product.isFeatured || false)}
                                                className={`p-2 rounded-lg transition-all ${product.isFeatured
                                                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                                    : 'bg-slate-700/50 text-gray-500 hover:bg-slate-700 hover:text-amber-400'
                                                    }`}
                                                title={product.isFeatured ? 'Quitar de destacados' : 'Marcar como destacado'}
                                            >
                                                <Star className={`h-5 w-5 ${product.isFeatured ? 'fill-amber-400' : ''}`} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleActive(product._id, product.isActive)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${product.isActive
                                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                                }`}
                                        >
                                            {product.isActive ? <><Eye className="h-4 w-4" />Activo</> : <><EyeOff className="h-4 w-4" />Inactivo</>}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/admin/productos/${product._id}`)}
                                                className="p-2 hover:bg-sky-500/20 text-sky-400 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(product)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {products.length > 0 && (
                <div className="mt-6 p-4 bg-slate-800/30 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Total: {products.length} {products.length === 1 ? 'producto' : 'productos'}</span>
                        <span className="text-gray-400">Activos: {products.filter(p => p.isActive).length}</span>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteProductModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, product: null })}
                onConfirm={deleteProduct}
                productName={deleteModal.product?.title || ''}
            />
        </div>
    );
}

