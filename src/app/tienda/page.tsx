import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';
import ProductListClient from './ProductListClient';
import { fetchProducts } from '@/lib/server-fetch';

export const metadata: Metadata = {
    title: 'Tienda - WTREBOL Innovación',
    description: 'Equipos y accesorios de aire acondicionado de primera calidad. High Wall, Cassettes, Piso Cielo y más.',
    keywords: ['tienda aire acondicionado', 'comprar HVAC Colombia', 'equipos climatización', 'splits inverter', 'cassettes 4 vías', 'precios aire acondicionado'],
    authors: [{ name: 'WTREBOL S.A.S' }],
    creator: 'WTREBOL S.A.S',
    publisher: 'WTREBOL S.A.S',

    // Open Graph
    openGraph: {
        title: 'Tienda - WTREBOL Innovación',
        description: 'Equipos y accesorios de aire acondicionado de primera calidad. High Wall, Cassettes, Piso Cielo y más.',
        url: 'https://wtrebol.com/tienda',
        siteName: 'WTREBOL',
        locale: 'es_CO',
        type: 'website',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da46?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'WTREBOL - Tienda de Equipos de Climatización',
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'Tienda - WTREBOL Innovación',
        description: 'Equipos y accesorios de aire acondicionado de primera calidad. High Wall, Cassettes, Piso Cielo y más.',
        images: ['https://images.unsplash.com/photo-1632823471565-1ecdf5c6da46?w=1200&h=630&fit=crop'],
    },

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

// Server Component - Fetch data on server
export default async function TiendaPage() {
    // Fetch products from backend on server
    const products = await fetchProducts();

    // Fallback products if backend is down
    const fallbackProducts = [
        {
            _id: '1',
            type: 'product' as const,
            title: 'High Wall Inverter',
            description: '12000 BTU - Ahorro Energético',
            imageUrl: 'https://images.unsplash.com/photo-1632823471565-1ecdf5c6da46?q=80&w=2070&auto=format&fit=crop',
            price: '$1.200.000',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '2',
            type: 'product' as const,
            title: 'Cassette 4 Vías',
            description: '36000 BTU - Comercial',
            imageUrl: 'https://images.unsplash.com/photo-1574955075265-849c2bd8df14?q=80&w=2070&auto=format&fit=crop',
            price: '$4.500.000',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '3',
            type: 'product' as const,
            title: 'Piso Cielo',
            description: '24000 BTU - Silencioso',
            imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=2070&auto=format&fit=crop',
            price: '$2.900.000',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '4',
            type: 'product' as const,
            title: 'Condensadora de Proceso',
            description: '48000 BTU - Industrial',
            imageUrl: 'https://images.unsplash.com/photo-1532634726645-c7ee0dbb11dd?q=80&w=2070&auto=format&fit=crop',
            price: '$6.800.000',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '5',
            type: 'product' as const,
            title: 'Minisplit Dual',
            description: '18000+18000 BTU - Residencial',
            imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2070&auto=format&fit=crop',
            price: '$2.200.000',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '6',
            type: 'product' as const,
            title: 'Kit Instalación Completa',
            description: 'Tuberías, cableado, accesorios',
            imageUrl: 'https://images.unsplash.com/photo-1542919528-d4631286684d?q=80&w=2070&auto=format&fit=crop',
            price: '$850.000',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    // Use backend products if available, otherwise use fallback
    const displayProducts = products.length > 0 ? products : fallbackProducts;

    return (
        <>
            <PageLayout>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-sky-500 mb-2">Tienda WTREBOL</h1>
                        <p className="text-gray-400 text-lg">Equipos y accesorios de aire acondicionado de primera calidad</p>
                    </div>
                </div>

                {/* Client Component for cart functionality */}
                <ProductListClient products={displayProducts} />

                <div className="mt-16 p-8 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border border-sky-500/20 rounded-2xl text-center">
                    <p className="text-gray-200 text-lg mb-4">
                        ¿No encuentras lo que buscas? Contáctanos para consultar sobre equipos personalizados.
                    </p>
                    <p className="text-gray-400">Realizamos entregas a toda Colombia | Garantía en todos nuestros productos</p>
                </div>
            </PageLayout>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}
