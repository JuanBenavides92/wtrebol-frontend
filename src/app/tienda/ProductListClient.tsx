'use client';

import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { Content } from '@/hooks/useContent';

interface ProductListClientProps {
    products: Content[];
}

export default function ProductListClient({ products }: ProductListClientProps) {
    const { addToCart } = useCart();

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    image={product.imageUrl || 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da46?q=80&w=2070&auto=format&fit=crop'}
                    title={product.title}
                    description={product.description || ''}
                    price={product.price || '$0'}
                    onAddToCart={addToCart}
                />
            ))}
        </div>
    );
}

