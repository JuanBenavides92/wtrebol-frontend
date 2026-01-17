import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Sobre Nosotros - WTREBOL Innovación',
    description: 'Conoce nuestra misión, visión y valores corporativos. WTREBOL es líder en soluciones de climatización y refrigeración en Colombia.',
    keywords: ['WTREBOL', 'climatización Colombia', 'refrigeración industrial', 'aire acondicionado', 'servicios técnicos', 'empresa colombiana'],
    authors: [{ name: 'WTREBOL S.A.S' }],
    creator: 'WTREBOL S.A.S',
    publisher: 'WTREBOL S.A.S',

    // Open Graph
    openGraph: {
        title: 'Sobre Nosotros - WTREBOL Innovación',
        description: 'Conoce nuestra misión, visión y valores corporativos. WTREBOL es líder en soluciones de climatización y refrigeración en Colombia.',
        url: 'https://wtrebol.com/nosotros',
        siteName: 'WTREBOL',
        locale: 'es_CO',
        type: 'website',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
                width: 1200,
                height: 630,
                alt: 'WTREBOL - Soluciones de Climatización',
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'Sobre Nosotros - WTREBOL Innovación',
        description: 'Conoce nuestra misión, visión y valores corporativos. WTREBOL es líder en soluciones de climatización y refrigeración en Colombia.',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop'],
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

export default function NosotrosPage() {
    return (
        <>
            <PageLayout>
                <h1 className="text-4xl font-bold text-sky-500 mb-8">Sobre Nosotros</h1>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-800/50 border border-white/10 p-8 rounded-2xl hover:border-sky-500/50 transition-colors">
                        <h3 className="text-2xl font-bold text-white mb-4">Misión</h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Brindar soluciones integrales a nuestros clientes fomentando la cultura de la sostenibilidad en el tiempo y siendo inclusivos en cada proceso realizado.
                        </p>
                    </div>
                    <div className="bg-slate-800/50 border border-white/10 p-8 rounded-2xl hover:border-sky-500/50 transition-colors">
                        <h3 className="text-2xl font-bold text-white mb-4">Visión 2026</h3>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Ser una empresa posicionada y competitiva destacada por nuestra innovación, atención personalizada y compromiso con el cambio social.
                        </p>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-xl font-bold text-white mb-6">Valores Corporativos</h3>
                    <div className="flex gap-3 flex-wrap">
                        {['Superación', 'Creatividad', 'Innovación', 'Lealtad'].map((value) => (
                            <span
                                key={value}
                                className="px-6 py-3 bg-sky-500/20 text-sky-300 rounded-full border border-sky-500/30 font-medium hover:bg-sky-500/30 transition-colors"
                            >
                                {value}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border border-sky-500/20 rounded-2xl p-8">
                    <p className="text-gray-200 text-lg leading-relaxed">
                        WTREBOL es una empresa colombiana especializada en soluciones integrales de climatización, refrigeración y servicios técnicos. Con años de experiencia en el mercado, nos hemos posicionado como líderes en innovación y atención personalizada para nuestros clientes residenciales, comerciales e industriales.
                    </p>
                </div>
            </PageLayout>
            <Footer showFooter={true} isStatic={true} />
        </>
    );
}

