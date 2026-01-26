import { ShoppingCart } from 'lucide-react';

interface EmptyCartProps {
    onClose: () => void;
}

export default function EmptyCart({ onClose }: EmptyCartProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>

            {/* Message */}
            <h3 className="text-xl font-bold text-white mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-400 mb-8 max-w-sm">
                Explora nuestro catálogo de equipos de climatización y agrega productos para solicitar cotización.
            </p>

            {/* CTA */}
            <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-sky-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-sky-500/30"
            >
                Ver Productos
            </button>
        </div>
    );
}
