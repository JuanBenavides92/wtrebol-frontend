'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, ShoppingBag } from 'lucide-react';

interface Product {
    _id: string;
    type: 'product';
    title: string;
    description?: string;
    imageUrl: string;
    price?: string;
    category?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function ProductsPage() {
    const router = useRouter();
    const { isLoading, isAuthenticated } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

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
            const response = await fetch('http://localhost:5000/api/content/product', {
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
            const response = await fetch(`http://localhost:5000/api/content/${id}`, {
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

    const deleteProduct = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/content/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
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
                <button
                    onClick={() => router.push('/admin/productos/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Nuevo Producto
                </button>
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
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
                                            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
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
                                        <p className="text-emerald-400 font-semibold">{product.price || '-'}</p>
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
                                                onClick={() => deleteProduct(product._id)}
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
        </div>
    );
}
