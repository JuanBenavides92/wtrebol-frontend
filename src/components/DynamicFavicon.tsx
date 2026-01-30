'use client';

import { useEffect, useState } from 'react';
import API_CONFIG from '@/lib/config';
import Head from 'next/head';

export default function DynamicFavicon() {
    const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavicon = async () => {
            try {
                const response = await fetch(API_CONFIG.url('/api/config/site'), {
                    cache: 'no-store'
                });
                const result = await response.json();

                if (result.success && result.data?.faviconUrl) {
                    setFaviconUrl(result.data.faviconUrl);
                }
            } catch (error) {
                console.error('Error loading favicon:', error);
            }
        };

        fetchFavicon();
    }, []);

    useEffect(() => {
        if (faviconUrl) {
            // Actualizar favicon dinámicamente
            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = faviconUrl;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
    }, [faviconUrl]);

    return null;
}
