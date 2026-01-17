import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Nuestros Servicios - WTREBOL Innovación',
    description: 'Climatización integral, refrigeración industrial, mantenimiento experto, obra civil, instalación profesional y asesoría integral.',
    keywords: ['servicios climatización', 'refrigeración industrial Colombia', 'mantenimiento aire acondicionado', 'instalación HVAC', 'obra civil climatización', 'asesoría técnica'],
    authors: [{ name: 'WTREBOL S.A.S' }],
    creator: 'WTREBOL S.A.S',
    publisher: 'WTREBOL S.A.S',

    // Open Graph
    openGraph: {
        title: 'Nuestros Servicios - WTREBOL Innovación',
        description: 'Climatización integral, refrigeración industrial, mantenimiento experto, obra civil, instalación profesional y asesoría integral.',
        url: 'https://wtrebol.com/servicios',
        siteName: 'WTREBOL',
        locale: 'es_CO',
        type: 'website',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'WTREBOL - Servicios de Climatización y Refrigeración',
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'Nuestros Servicios - WTREBOL Innovación',
        description: 'Climatización integral, refrigeración industrial, mantenimiento experto, obra civil, instalación profesional y asesoría integral.',
        images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=630&fit=crop'],
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

interface ServiceData {
    features?: string[];
    benefits?: string[];
    icon?: string;
    color?: string;
    gradient?: string;
}

interface Service {
    _id: string;
    type: 'service';
    title: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    order?: number;
    data?: ServiceData;
    createdAt: string;
    updatedAt: string;
}

async function getServices(): Promise<Service[]> {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const response = await fetch(`${API_URL}/api/content/service?active=true`, {
            next: { revalidate: 60 }, // Revalidar cada 60 segundos
        });

        if (!response.ok) {
            console.error('Error fetching services:', response.statusText);
            return [];
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            // Ordenar por el campo order
            return result.data.sort((a: Service, b: Service) => (a.order || 0) - (b.order || 0));
        }

        return [];
    } catch (error) {
        console.error('Error loading services:', error);
        return [];
    }
}

export default async function ServiciosPage() {
    const services = await getServices();

    return (
        <>
            <PageLayout>
                <h1 className="text-4xl font-bold text-sky-500 mb-4">Nuestros Servicios</h1>
                <p className="text-gray-400 mb-12 text-lg">Soluciones integrales diseñadas para tus necesidades</p>

                {services.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/30 border border-white/10 rounded-xl">
                        <p className="text-gray-400 text-lg">No hay servicios disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => {
                            const features = service.data?.features || [];
                            const benefits = service.data?.benefits || [];
                            const icon = service.data?.icon || '🔧';
                            const gradient = service.data?.gradient || 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)';

                            return (
                                <div
                                    key={service._id}
                                    className="bg-slate-800/30 border border-white/10 rounded-xl p-6 hover:border-sky-500/50 transition-all hover:shadow-lg hover:shadow-sky-500/20"
                                    style={{
                                        borderImage: `${gradient} 1`,
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-4xl">{icon}</span>
                                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                    </div>

                                    {service.description && (
                                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">{service.description}</p>
                                    )}

                                    {features.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-sky-400 mb-3">Características:</h4>
                                            <div className="space-y-2">
                                                {features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-gray-300">
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                        <span className="text-xs">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {benefits.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-sky-400 mb-3">Beneficios:</h4>
                                            <div className="space-y-2">
                                                {benefits.map((benefit, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-gray-300">
                                                        <CheckCircle2 className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                                        <span className="text-xs">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </PageLayout>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}

