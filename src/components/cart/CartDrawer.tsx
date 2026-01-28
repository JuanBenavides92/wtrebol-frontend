'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import { generateWhatsAppLink, formatPrice } from '@/lib/whatsapp';

export default function CartDrawer() {
    const { items, cartCount, totalAmount, isOpen, closeCart, updateQuantity, removeFromCart, clearCart } =
        useCart();

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle WhatsApp quotation
    const handleWhatsAppQuote = () => {
        const link = generateWhatsAppLink(items, totalAmount);
        window.open(link, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-6 w-6 text-sky-500" />
                                <div>
                                    <h2 className="text-xl font-bold text-white">Carrito</h2>
                                    <p className="text-sm text-gray-400">
                                        {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <EmptyCart onClose={closeCart} />
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <CartItem
                                            key={item.productId}
                                            item={item}
                                            onUpdateQuantity={updateQuantity}
                                            onRemove={removeFromCart}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - Only show when items exist */}
                        {items.length > 0 && (
                            <div className="border-t border-white/10 bg-slate-900/80 backdrop-blur-md px-6 py-5 space-y-4">
                                {/* Clear Cart Button */}
                                <button
                                    onClick={clearCart}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Vaciar carrito
                                </button>

                                {/* Total */}
                                <div className="flex justify-between items-center py-3 border-t border-white/10">
                                    <span className="text-gray-400 font-semibold">Total estimado</span>
                                    <span className="text-2xl font-bold text-emerald-500">
                                        {formatPrice(totalAmount)}
                                    </span>
                                </div>

                                {/* Checkout Button - Primary */}
                                <a
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    Proceder al Checkout
                                </a>

                                <p className="text-xs text-center text-gray-400">
                                    💳 Pago seguro con tarjeta, PSE, Nequi y más
                                </p>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-slate-900 text-gray-400">o</span>
                                    </div>
                                </div>

                                {/* WhatsApp Quote Button - Secondary */}
                                <button
                                    onClick={handleWhatsAppQuote}
                                    className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Solicitar Cotización
                                </button>

                                <p className="text-xs text-center text-gray-400">
                                    📱 O cotiza por WhatsApp
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
