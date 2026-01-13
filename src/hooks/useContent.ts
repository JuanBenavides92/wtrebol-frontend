import { useState, useEffect } from 'react';
import api from '@/lib/api';

/**
 * Interfaz para el contenido
 */
export interface Content {
    _id: string;
    type: 'slide' | 'product' | 'service' | 'setting';
    title: string;
    description?: string;
    imageUrl?: string;
    price?: string;
    order?: number;
    isActive: boolean;
    layout?: 'image-right' | 'image-left' | 'image-background';
    buttonText?: string;
    buttonLink?: string;
    overlayOpacity?: number;
    // Text styling
    titleSize?: number;
    titleColor?: string;
    titleGradient?: boolean;
    titleBold?: boolean;
    titleItalic?: boolean;
    descriptionSize?: number;
    descriptionColor?: string;
    descriptionGradient?: boolean;
    descriptionBold?: boolean;
    descriptionItalic?: boolean;
    data?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

/**
 * Hook para obtener contenido por tipo
 */
export function useContent(type: 'slide' | 'product' | 'service' | 'setting', activeOnly = true) {
    const [content, setContent] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.getContentByType<Content>(type, activeOnly);

                console.log(`[useContent] ${type} response:`, response);

                if (response.success && response.data) {
                    setContent(response.data);
                } else {
                    setError('No se pudo cargar el contenido');
                }
            } catch (err) {
                console.error('Error fetching content:', err);
                setError('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [type, activeOnly]);

    return { content, loading, error, refetch: () => setLoading(true) };
}

/**
 * Hook para obtener slides
 */
export function useSlides() {
    return useContent('slide', true);
}

/**
 * Hook para obtener productos
 */
export function useProducts() {
    return useContent('product', true);
}

/**
 * Hook para obtener servicios
 */
export function useServices() {
    return useContent('service', true);
}
