import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/context/CartContext';
import { formatPrice, getCategoryLabel } from '@/lib/whatsapp';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const subtotal = item.priceNumeric * item.quantity;

    return (
        <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            {/* Product Image */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
                <Image
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da46?q=80&w=200'}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-white font-semibold text-sm truncate">{item.title}</h4>
                    <button
                        onClick={() => onRemove(item.productId)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove from cart"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Product Details */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-3">
                    {item.category && (
                        <span className="bg-white/5 px-2 py-0.5 rounded">
                            {getCategoryLabel(item.category)}
                        </span>
                    )}
                    {item.btuCapacity && (
                        <span className="bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded">
                            ❄️ {item.btuCapacity.toLocaleString()} BTU
                        </span>
                    )}
                </div>

                {/* Quantity Controls and Price */}
                <div className="flex justify-between items-center">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-white transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <div className="text-xs text-gray-400">{item.price} c/u</div>
                        <div className="text-emerald-500 font-bold text-sm">
                            {formatPrice(subtotal)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
