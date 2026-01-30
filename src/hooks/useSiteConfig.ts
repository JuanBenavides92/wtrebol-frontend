'use client';

import { useState, useEffect } from 'react';
import API_CONFIG from '@/lib/config';

export interface SiteConfig {
    _id: string;
    logoUrl?: string;
    logoText: string;
    logoSubtext?: string;
    logoHeight?: number;
    faviconUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    contactPhone?: string;
    contactEmail?: string;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        whatsapp?: string;
    };
    updatedAt?: string;
}

export function useSiteConfig() {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(API_CONFIG.url('/api/config/site'), {
                cache: 'no-store', // Prevent caching for immediate updates
            });

            if (!response.ok) {
                throw new Error('Error al cargar configuración del sitio');
            }

            const result = await response.json();

            if (result.success && result.data) {
                setConfig(result.data);
            } else {
                throw new Error('Formato de respuesta inválido');
            }
        } catch (err: any) {
            console.error('[useSiteConfig] Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return { config, loading, error, refetch: fetchConfig };
}
