/**
 * Server-side fetch utility for WTREBOL
 * Used for server components that need to fetch data
 */

import { cookies } from 'next/headers';
import { Content } from '@/hooks/useContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Fetch content by type from the backend (Server-side)
 * @param type - Type of content to fetch
 * @param activeOnly - Only fetch active content
 * @returns Array of content items
 */
export async function fetchContentByType(
    type: 'slide' | 'product' | 'service' | 'setting',
    activeOnly = true
): Promise<Content[]> {
    try {
        // Ruta correcta: /api/content/:type (no /type/)
        const url = `${API_URL}/api/content/${type}${activeOnly ? '?active=true' : ''}`;

        console.log(`[Server Fetch] Fetching ${type} from:`, url);

        const response = await fetch(url, {
            // Revalidate every 60 seconds
            next: { revalidate: 60 },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`[Server Fetch] Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        if (data.success && data.data) {
            console.log(`[Server Fetch] Successfully fetched ${data.data.length} ${type}(s)`);
            return data.data;
        }

        return [];
    } catch (error) {
        console.error(`[Server Fetch] Error fetching ${type}:`, error);
        return [];
    }
}

/**
 * Fetch slides (Server-side)
 */
export async function fetchSlides(): Promise<Content[]> {
    return fetchContentByType('slide', true);
}

/**
 * Fetch products (Server-side)
 */
export async function fetchProducts(): Promise<Content[]> {
    return fetchContentByType('product', true);
}

/**
 * Fetch services (Server-side)
 */
export async function fetchServices(): Promise<Content[]> {
    return fetchContentByType('service', true);
}
