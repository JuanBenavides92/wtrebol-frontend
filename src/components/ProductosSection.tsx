'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API_CONFIG from '@/lib/config';
import { formatPrice } from '@/lib/formatters';

interface FeaturedProduct {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
    price?: string;
    slug?: string;
}

export default function ProductosSection() {
    const [products, setProducts] = useState<FeaturedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    console.log('🎨 [ProductosSection] Componente renderizado');

    useEffect(() => {
        console.log('🔄 [ProductosSection] useEffect ejecutado');
        loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
        console.log('🔍 [ProductosSection] Cargando productos destacados...');
        try {
            const url = API_CONFIG.url('/api/content/featured');
            console.log('🌐 [ProductosSection] URL:', url);

            const response = await fetch(url);
            console.log('📡 [ProductosSection] Response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ [ProductosSection] Resultado:', result);

                if (result.success && Array.isArray(result.data)) {
                    console.log(`⭐ [ProductosSection] ${result.data.length} productos destacados encontrados`);
                    setProducts(result.data);
                } else {
                    console.warn('⚠️ [ProductosSection] Formato de respuesta inesperado:', result);
                }
            } else {
                console.error('❌ [ProductosSection] Error en respuesta:', response.status);
            }
        } catch (error) {
            console.error('💥 [ProductosSection] Error loading featured products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Si no hay productos destacados, no mostrar la sección
    if (!isLoading && products.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">
                    Productos Destacados
                </h2>
                <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
                    Equipos de aire acondicionado de las mejores marcas
                </p>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-white rounded-2xl overflow-hidden animate-pulse"
                            >
                                <div className="h-48 bg-gradient-to-br from-blue-100 to-sky-100" />
                                <div className="p-6 space-y-3">
                                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                                    <div className="h-4 bg-slate-200 rounded w-full" />
                                    <div className="h-4 bg-slate-200 rounded w-5/6" />
                                    <div className="h-10 bg-slate-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="h-48 bg-gradient-to-br from-blue-100 to-sky-100 overflow-hidden relative">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-6xl">❄️</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 line-clamp-1">
                                        {product.title}
                                    </h3>
                                    <p className="text-slate-600 mb-3 line-clamp-2 min-h-[3rem]">
                                        {product.description || 'Producto de alta calidad'}
                                    </p>
                                    {product.price && (
                                        <p className="text-2xl font-bold text-emerald-600 mb-4">
                                            {formatPrice(product.price)}
                                        </p>
                                    )}
                                    <Link
                                        href={product.slug ? `/tienda/${product.slug}` : '/tienda'}
                                        className="block w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-xl font-bold hover:scale-105 transition-all duration-300 text-center"
                                    >
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}


