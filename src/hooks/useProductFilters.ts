import { useState, useMemo } from 'react';
import { Content } from './useContent';
import { parsePriceToNumber } from '@/lib/whatsapp';

export interface FilterState {
    search: string;
    categories: string[];
    btuRanges: number[];
    priceMin: number;
    priceMax: number;
}

const initialFilterState: FilterState = {
    search: '',
    categories: [],
    btuRanges: [],
    priceMin: 0,
    priceMax: 20000000, // 20M COP max
};

export function useProductFilters(products: Content[]) {
    const [filters, setFilters] = useState<FilterState>(initialFilterState);

    // Filter products based on current criteria
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchTitle = product.title.toLowerCase().includes(searchLower);
                const matchDesc = product.description?.toLowerCase().includes(searchLower);
                const matchCategory = product.category?.toLowerCase().includes(searchLower);
                if (!matchTitle && !matchDesc && !matchCategory) {
                    return false;
                }
            }

            // Category filter
            if (filters.categories.length > 0) {
                if (!product.category || !filters.categories.includes(product.category)) {
                    return false;
                }
            }

            // BTU filter
            if (filters.btuRanges.length > 0) {
                if (!product.btuCapacity || !filters.btuRanges.includes(product.btuCapacity)) {
                    return false;
                }
            }

            // Price filter
            const productPrice = parsePriceToNumber(product.price || '$0');
            if (productPrice < filters.priceMin || productPrice > filters.priceMax) {
                return false;
            }

            return true;
        });
    }, [products, filters]);

    // Get unique values for filter options
    const availableFilters = useMemo(() => {
        const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[];
        const btuCapacities = Array.from(new Set(products.map((p) => p.btuCapacity).filter(Boolean))).sort(
            (a, b) => (a || 0) - (b || 0)
        ) as number[];

        return {
            categories,
            btuCapacities,
        };
    }, [products]);

    // Update specific filter
    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Toggle category
    const toggleCategory = (category: string) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };

    // Toggle BTU
    const toggleBTU = (btu: number) => {
        setFilters((prev) => ({
            ...prev,
            btuRanges: prev.btuRanges.includes(btu)
                ? prev.btuRanges.filter((b) => b !== btu)
                : [...prev.btuRanges, btu],
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters(initialFilterState);
    };

    // Check if any filter is active
    const hasActiveFilters =
        filters.search !== '' ||
        filters.categories.length > 0 ||
        filters.btuRanges.length > 0 ||
        filters.priceMin !== initialFilterState.priceMin ||
        filters.priceMax !== initialFilterState.priceMax;

    return {
        filters,
        filteredProducts,
        availableFilters,
        updateFilter,
        toggleCategory,
        toggleBTU,
        clearFilters,
        hasActiveFilters,
    };
}
