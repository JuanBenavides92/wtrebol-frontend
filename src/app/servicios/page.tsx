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

export default function ServiciosPage() {
    const services = [
        {
            title: 'Climatización Integral',
            description: 'Control de temperatura ambiental con sistemas eficientes y sostenibles',
            features: ['Splits inverter', 'Cassettes 4 vías', 'Piso cielo', 'Sistemas centralizados'],
        },
        {
            title: 'Refrigeración Industrial',
            description: 'Soluciones de refrigeración para procesos productivos y conservación',
            features: ['Enfriadores de proceso', 'Cuartos fríos', 'Sistemas de conservación', 'Mantenimiento preventivo'],
        },
        {
            title: 'Mantenimiento Experto',
            description: 'Servicio técnico preventivo, correctivo y reconstructivo',
            features: ['Diagnóstico preciso', 'Limpieza de componentes', 'Optimización de consumo', 'Garantía en reparaciones'],
        },
        {
            title: 'Obra Civil',
            description: 'Adecuaciones locativas y preparación de espacios',
            features: ['Diseño de ductos', 'Instalación de tuberías', 'Acondicionamiento de espacios', 'Asesoría técnica'],
        },
        {
            title: 'Instalación Profesional',
            description: 'Montaje de sistemas completos con técnicos certificados',
            features: ['Instalación residencial', 'Instalación comercial', 'Sistemas industriales', 'Puesta en marcha'],
        },
        {
            title: 'Asesoría Integral',
            description: 'Proyectos personalizados según tus necesidades',
            features: ['Evaluación de espacios', 'Recomendaciones técnicas', 'Presupuestos detallados', 'Seguimiento post-venta'],
        },
    ];

    return (
        <>
            <PageLayout>
                <h1 className="text-4xl font-bold text-sky-500 mb-4">Nuestros Servicios</h1>
                <p className="text-gray-400 mb-12 text-lg">Soluciones integrales diseñadas para tus necesidades</p>

                <div className="grid md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/30 border border-white/10 rounded-xl p-6 hover:border-sky-500/50 transition-colors"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                            <p className="text-gray-400 mb-4">{service.description}</p>
                            <div className="space-y-2">
                                {service.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </PageLayout>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}
