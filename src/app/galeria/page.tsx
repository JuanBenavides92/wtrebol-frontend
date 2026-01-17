import type { Metadata } from 'next';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Galería de Proyectos - WTREBOL Innovación',
    description: 'Conoce nuestros proyectos exitosos en climatización, refrigeración y servicios técnicos.',
    keywords: ['proyectos climatización', 'instalaciones HVAC Colombia', 'galería trabajos', 'portfolio refrigeración', 'casos de éxito', 'proyectos realizados'],
    authors: [{ name: 'WTREBOL S.A.S' }],
    creator: 'WTREBOL S.A.S',
    publisher: 'WTREBOL S.A.S',

    // Open Graph
    openGraph: {
        title: 'Galería de Proyectos - WTREBOL Innovación',
        description: 'Conoce nuestros proyectos exitosos en climatización, refrigeración y servicios técnicos.',
        url: 'https://wtrebol.com/galeria',
        siteName: 'WTREBOL',
        locale: 'es_CO',
        type: 'website',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'WTREBOL - Galería de Proyectos de Climatización',
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'Galería de Proyectos - WTREBOL Innovación',
        description: 'Conoce nuestros proyectos exitosos en climatización, refrigeración y servicios técnicos.',
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=630&fit=crop'],
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

export default function GaleriaPage() {
    const projects = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop',
            title: 'Instalación Residencial',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop',
            title: 'Mantenimiento Industrial',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1000&auto=format&fit=crop',
            title: 'Servicio Técnico',
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
            title: 'Climatización Comercial',
        },
        {
            id: 5,
            image: 'https://images.unsplash.com/photo-1595807680548-74d944b90a4d?q=80&w=1000&auto=format&fit=crop',
            title: 'Equipos Disponibles',
        },
        {
            id: 6,
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop',
            title: 'Consultoría Profesional',
        },
    ];

    return (
        <>
            <PageLayout>
                <h1 className="text-4xl font-bold text-sky-500 mb-4">Galería de Proyectos</h1>
                <p className="text-gray-400 mb-12 text-lg">Conoce algunos de nuestros proyectos exitosos</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group relative rounded-xl overflow-hidden h-64 cursor-pointer"
                        >
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHBYYFRQYHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/2wBDAR"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <h3 className="text-white font-bold text-lg">{project.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </PageLayout>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}

