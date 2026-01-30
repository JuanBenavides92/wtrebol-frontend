'use client';

import { useState } from 'react';
import { Content } from '@/hooks/useContent';
import { useCart, CartProduct } from '@/context/CartContext';
import { ShoppingCart, Share2, Home, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryLabel, generateWhatsAppLink, parsePriceToNumber } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/formatters';

interface ProductDetailClientProps {
    product: Content;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { addToCart } = useCart();
    const [selectedImageIndex, setSelectedImageIndex] = useState(product.mainImageIndex || 0);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'faqs'>('description');

    // Determinar las imágenes disponibles
    const productImages = product.images && product.images.length > 0
        ? product.images
        : product.imageUrl
            ? [product.imageUrl]
            : ['https://images.unsplash.com/photo-1632823471565-1ecdf5c6da46?q=80&w=2070'];

    const handleAddToCart = () => {
        const cartProduct: CartProduct = {
            _id: product._id,
            title: product.title,
            price: product.price,
            imageUrl: productImages[selectedImageIndex],
            category: product.category,
            btuCapacity: product.btuCapacity,
        };
        addToCart(cartProduct);
    };

    const handleWhatsAppQuote = () => {
        const items = [{
            productId: product._id,
            title: product.title,
            price: product.price || '$0',
            imageUrl: productImages[selectedImageIndex],
            quantity: 1,
            priceNumeric: parsePriceToNumber(product.price || '$0'),
            category: product.category,
            btuCapacity: product.btuCapacity,
        }];
        const total = parsePriceToNumber(product.price || '$0');
        const url = generateWhatsAppLink(items, total);
        window.open(url, '_blank');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: product.description || '',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado al portapapeles');
        }
    };

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <div>
                <Link
                    href="/tienda"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all duration-300 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Volver a la Tienda
                </Link>
            </div>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/" className="hover:text-sky-500 transition-colors">
                    <Home className="h-4 w-4" />
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/tienda" className="hover:text-sky-500 transition-colors">
                    Tienda
                </Link>
                {product.category && (
                    <>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-gray-300">{getCategoryLabel(product.category)}</span>
                    </>
                )}
                <ChevronRight className="h-4 w-4" />
                <span className="text-white truncate">{product.title}</span>
            </nav>

            {/* Main Product Section */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Gallery */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-white/10">
                        <Image
                            src={productImages[selectedImageIndex]}
                            alt={product.title}
                            fill
                            className="object-contain p-8"
                            priority
                        />
                        {/* Badges */}
                        {product.badges && product.badges.length > 0 && (
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {product.badges.map((badge, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${badge === 'nuevo'
                                            ? 'bg-blue-500 text-white'
                                            : badge === 'oferta'
                                                ? 'bg-red-500 text-white'
                                                : badge === 'mas-vendido'
                                                    ? 'bg-amber-500 text-white'
                                                    : badge === 'envio-gratis'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-purple-500 text-white'
                                            }`}
                                    >
                                        {badge.toUpperCase().replace('-', ' ')}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {productImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {productImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={`relative aspect-square bg-slate-800 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                                        ? 'border-sky-500 ring-2 ring-sky-500/50'
                                        : 'border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.title} - Image ${idx + 1}`}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Category Badge */}
                    {product.category && (
                        <div>
                            <span className="bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-sm font-semibold border border-sky-500/30">
                                {getCategoryLabel(product.category)}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-white">{product.title}</h1>

                    {/* SKU & Brand */}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        {product.sku && <span>SKU: {product.sku}</span>}
                        {product.brand && <span>| Marca: {product.brand}</span>}
                    </div>

                    {/* Price */}
                    <div className="py-4 border-y border-white/10">
                        <div className="text-4xl font-bold text-emerald-500">{formatPrice(product.price) || 'Consultar'}</div>
                        {product.condition && (
                            <div className="text-sm text-gray-400 mt-1">
                                Estado: <span className="text-white">{product.condition === 'nuevo' ? 'Nuevo' : 'Usado'}</span>
                            </div>
                        )}
                    </div>

                    {/* Quick Specs */}
                    {(product.btuCapacity || product.warranty) && (
                        <div className="grid grid-cols-2 gap-4">
                            {product.btuCapacity && (
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <div className="text-sm text-gray-400">Capacidad</div>
                                    <div className="text-lg font-semibold text-white">❄️ {product.btuCapacity.toLocaleString()} BTU</div>
                                </div>
                            )}
                            {product.warranty && (
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <div className="text-sm text-gray-400">Garantía</div>
                                    <div className="text-lg font-semibold text-white">{product.warranty.duration}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                        {product.stockStatus === 'in-stock' && (
                            <span className="text-green-500 font-semibold">✓ En Stock</span>
                        )}
                        {product.stockStatus === 'low-stock' && (
                            <span className="text-amber-500 font-semibold">⚠️ Últimas unidades</span>
                        )}
                        {product.stockStatus === 'out-of-stock' && (
                            <span className="text-red-500 font-semibold">✗ Agotado</span>
                        )}
                        {product.stockStatus === 'pre-order' && (
                            <span className="text-blue-500 font-semibold">📅 Pre-orden</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-4 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Agregar al Carrito
                        </button>
                        <button
                            onClick={handleWhatsAppQuote}
                            className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all duration-300"
                        >
                            💬 Solicitar Cotización por WhatsApp
                        </button>
                        <button
                            onClick={handleShare}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Share2 className="h-4 w-4" />
                            Compartir Producto
                        </button>
                    </div>

                    {/* Shipping & Installation Info */}
                    {(product.shipping?.freeShipping || product.installation?.required) && (
                        <div className="border-t border-white/10 pt-4 space-y-2">
                            {product.shipping?.freeShipping && (
                                <div className="flex items-center gap-2 text-green-500">
                                    <span>📦</span>
                                    <span className="font-semibold">Envío GRATIS</span>
                                </div>
                            )}
                            {product.installation?.required && (
                                <div className="flex items-center gap-2 text-sky-400">
                                    <span>🔧</span>
                                    <span>Instalación disponible{product.installation.cost && `: ${product.installation.cost}`}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {/* Tab Headers */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'description'
                            ? 'bg-sky-500 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Descripción
                    </button>
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'specs'
                                ? 'bg-sky-500 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Especificaciones
                        </button>
                    )}
                    {product.faqs && product.faqs.length > 0 && (
                        <button
                            onClick={() => setActiveTab('faqs')}
                            className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'faqs'
                                ? 'bg-sky-500 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Preguntas Frecuentes
                        </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'description' && (
                        <div className="space-y-4">
                            {product.longDescription ? (
                                <div
                                    className="prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.longDescription }}
                                />
                            ) : (
                                <p className="text-gray-300">{product.description || 'Sin descripción disponible.'}</p>
                            )}

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Características Destacadas</h3>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-gray-300">
                                                <span className="text-emerald-500 mt-1">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Video */}
                            {product.videoUrl && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Video del Producto</h3>
                                    <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
                                        <iframe
                                            src={product.videoUrl}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'specs' && product.specifications && (
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Especificaciones Técnicas</h3>
                            <table className="w-full">
                                <tbody>
                                    {Object.entries(product.specifications).map(([key, value], idx) => (
                                        <tr
                                            key={idx}
                                            className={`border-b border-white/10 ${idx % 2 === 0 ? 'bg-white/5' : ''
                                                }`}
                                        >
                                            <td className="py-3 px-4 font-semibold text-gray-300">{key}</td>
                                            <td className="py-3 px-4 text-white">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'faqs' && product.faqs && (
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Preguntas Frecuentes</h3>
                            <div className="space-y-4">
                                {product.faqs.map((faq, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <h4 className="font-bold text-white mb-2">{faq.question}</h4>
                                        <p className="text-gray-300">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Documents */}
            {
                product.documents && product.documents.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Documentos Descargables</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {product.documents.map((doc, idx) => (
                                <a
                                    key={idx}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-colors"
                                >
                                    <span className="text-2xl">📄</span>
                                    <div>
                                        <div className="font-semibold text-white">{doc.name}</div>
                                        <div className="text-xs text-gray-400">{doc.type.toUpperCase()}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
