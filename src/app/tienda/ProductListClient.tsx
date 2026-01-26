'use client';

import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/tienda/FilterBar';
import { useCart, CartProduct } from '@/context/CartContext';
import { Content } from '@/hooks/useContent';
import { useProductFilters } from '@/hooks/useProductFilters';

interface ProductListClientProps {
    products: Content[];
}

export default function ProductListClient({ products }: ProductListClientProps) {
    const { addToCart } = useCart();

    const {
        filters,
        filteredProducts,
        availableFilters,
        updateFilter,
        toggleCategory,
        toggleBTU,
        clearFilters,
        hasActiveFilters,
    } = useProductFilters(products);

    const handleAddToCart = (product: Content) => {
        const cartProduct: CartProduct = {
            _id: product._id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            btuCapacity: product.btuCapacity,
        };
        addToCart(cartProduct);
    };

    return (
        <>
            {/* Filter Bar */}
            <FilterBar
                filters={filters}
                availableCategories={availableFilters.categories}
                availableBTUs={availableFilters.btuCapacities}
                onSearchChange={(search) => updateFilter('search', search)}
                onToggleCategory={toggleCategory}
                onToggleBTU={toggleBTU}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                resultCount={filteredProducts.length}
            />

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            image={
                                product.imageUrl ||
                                'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da46?q=80&w=2070&auto=format&fit=crop'
                            }
                            title={product.title}
                            description={product.description || ''}
                            price={product.price || '$0'}
                            category={product.category}
                            btuCapacity={product.btuCapacity}
                            inStock={product.inStock}
                            slug={product.slug}
                            onAddToCart={() => handleAddToCart(product)}
                        />
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="col-span-full text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No encontramos productos</h3>
                    <p className="text-gray-400 mb-6">
                        Intenta ajustar los filtros o usar otros términos de búsqueda
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-sky-400 hover:to-emerald-400 transition-all duration-300"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
