'use client';

import { useState, useEffect } from 'react';
import { ProductOption } from './useProductOptions';
import API_CONFIG from '@/lib/config';
import { Content } from './useContent';

interface FilterOption {
    value: string | number;
    label: string;
    count: number;
    _id: string; // MongoDB ID for unique React keys
}

interface StoreFilterOptions {
    categories: FilterOption[];
    btuCapacities: FilterOption[];
    conditions: FilterOption[];
    isLoading: boolean;
}

/**
 * Hook to fetch and manage store filter options from ProductOptions API
 * Shows ALL available options from database, not just ones used in products
 */
export function useStoreFilters(products: Content[]): StoreFilterOptions {
    const [categoryOptions, setCategoryOptions] = useState<ProductOption[]>([]);
    const [btuOptions, setBtuOptions] = useState<ProductOption[]>([]);
    const [conditionOptions, setConditionOptions] = useState<ProductOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                // Fetch all ProductOptions in parallel
                const [catRes, btuRes, condRes] = await Promise.all([
                    fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.PRODUCT_OPTIONS}/category?active=true`), {
                        credentials: 'include'
                    }),
                    fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.PRODUCT_OPTIONS}/btu?active=true`), {
                        credentials: 'include'
                    }),
                    fetch(API_CONFIG.url(`${API_CONFIG.ENDPOINTS.PRODUCT_OPTIONS}/condition?active=true`), {
                        credentials: 'include'
                    })
                ]);

                const [catData, btuData, condData] = await Promise.all([
                    catRes.json(),
                    btuRes.json(),
                    condRes.json()
                ]);

                console.log('🎯 [useStoreFilters] Opciones cargadas:', {
                    categories: catData.data?.length || 0,
                    btus: btuData.data?.length || 0,
                    conditions: condData.data?.length || 0
                });

                setCategoryOptions(catData.data || []);
                setBtuOptions(btuData.data || []);
                setConditionOptions(condData.data || []);
            } catch (err) {
                console.error('❌ [useStoreFilters] Error loading filter options:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilterOptions();
    }, []);

    // Count products for each category option
    const categories: FilterOption[] = categoryOptions.map(opt => ({
        value: opt.value,
        label: opt.label,
        count: products.filter(p => p.category === opt.value).length,
        _id: opt._id // Keep _id for unique keys
    }));

    // Count products for each BTU option
    const btuCapacities: FilterOption[] = btuOptions
        .filter(opt => {
            const cleanValue = opt.value.replace(/\D/g, '');
            const numericValue = cleanValue ? parseInt(cleanValue, 10) : 0;
            return numericValue && !isNaN(numericValue);
        })
        .map(opt => {
            const cleanValue = opt.value.replace(/\D/g, '');
            const numericValue = parseInt(cleanValue, 10);

            return {
                value: numericValue,
                label: opt.label,
                count: products.filter(p => p.btuCapacity === numericValue).length,
                _id: opt._id
            };
        })
        .sort((a, b) => (a.value as number) - (b.value as number));

    // Count products for each condition option
    const conditions: FilterOption[] = conditionOptions.map(opt => ({
        value: opt.value,
        label: opt.label,
        count: products.filter(p => p.condition === opt.value).length,
        _id: opt._id // Keep _id for unique keys
    }));

    return {
        categories,
        btuCapacities,
        conditions,
        isLoading
    };
}
