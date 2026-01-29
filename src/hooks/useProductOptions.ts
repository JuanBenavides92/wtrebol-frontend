'use client';

import { useState, useEffect, useCallback } from 'react';
import API_CONFIG from '@/lib/config';

export interface ProductOption {
    _id: string;
    type: 'category' | 'btu' | 'condition';
    value: string;
    label: string;
    isActive: boolean;
    usageCount: number;
}

interface UseProductOptionsReturn {
    options: ProductOption[];
    isLoading: boolean;
    error: string | null;
    createOption: (label: string) => Promise<ProductOption | null>;
    refresh: () => Promise<void>;
}

export const useProductOptions = (
    type: 'category' | 'btu' | 'condition'
): UseProductOptionsReturn => {
    const [options, setOptions] = useState<ProductOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOptions = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const url = API_CONFIG.url(`${API_CONFIG.ENDPOINTS.PRODUCT_OPTIONS}/${type}?active=true`);
        console.log(`🔍 [useProductOptions] ═══════════════════════════════════════`);
        console.log(`🔍 [useProductOptions] Iniciando carga de opciones para tipo: "${type}"`);
        console.log(`📡 [useProductOptions] URL completa: ${url}`);
        console.log(`🔍 [useProductOptions] ═══════════════════════════════════════`);

        try {
            console.log(`⏳ [useProductOptions] Haciendo fetch...`);
            const response = await fetch(url, {
                credentials: 'include',
            });

            console.log(`📥 [useProductOptions] Respuesta recibida:`, {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                url: response.url
            });

            if (response.ok) {
                const result = await response.json();
                console.log(`✅ [useProductOptions] Datos recibidos:`, result);

                if (result.success && Array.isArray(result.data)) {
                    console.log(`✅ [useProductOptions] ${result.data.length} opciones cargadas para "${type}"`);
                    setOptions(result.data);
                } else {
                    console.error(`❌ [useProductOptions] Formato de respuesta inválido:`, result);
                    setError('Formato de respuesta inválido');
                }
            } else {
                console.error(`❌ [useProductOptions] Error HTTP ${response.status}: ${response.statusText}`);
                try {
                    const errorText = await response.text();
                    console.error(`❌ [useProductOptions] Cuerpo de error:`, errorText);
                } catch (e) {
                    console.error(`❌ [useProductOptions] No se pudo leer el cuerpo del error`);
                }
                setError(`Error ${response.status} al cargar opciones`);
            }
        } catch (err) {
            console.error(`❌ [useProductOptions] Error de red o excepción:`, err);
            setError('Error al cargar opciones');
        } finally {
            setIsLoading(false);
            console.log(`🏁 [useProductOptions] Carga finalizada para "${type}"`);
        }
    }, [type]);

    useEffect(() => {
        loadOptions();
    }, [loadOptions]);

    const createOption = async (label: string): Promise<ProductOption | null> => {
        try {
            // Generate value from label (lowercase, replace spaces with hyphens)
            const value = label
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Remove duplicate hyphens
                .trim();

            const response = await fetch(
                API_CONFIG.url(API_CONFIG.ENDPOINTS.PRODUCT_OPTIONS),
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ type, value, label }),
                }
            );

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    // Refresh options list
                    await loadOptions();
                    return result.data;
                }
            } else {
                const result = await response.json();
                setError(result.message || 'Error al crear opción');
            }
        } catch (err) {
            console.error('Error creating option:', err);
            setError('Error al crear opción');
        }
        return null;
    };

    return {
        options,
        isLoading,
        error,
        createOption,
        refresh: loadOptions,
    };
};
