import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Fetch product data
async function getProduct(slug: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/content/product/slug/${slug}`, {
            next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Producto no encontrado',
        };
    }

    return {
        title: product.metaTitle || `${product.title} | WTREBOL Innovación`,
        description: product.metaDescription || product.description || `Compra ${product.title} en WTREBOL`,
        keywords: product.metaKeywords?.join(', '),
        openGraph: {
            title: product.title,
            description: product.description,
            images: [product.images?.[product.mainImageIndex || 0] || product.imageUrl || ''],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <PageLayout>
            <ProductDetailClient product={product} />
        </PageLayout>
    );
}
