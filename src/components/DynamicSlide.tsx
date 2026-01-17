import Link from 'next/link';
import SlideSection from './SlideSection';
import ProductCard from './ProductCard';
import { Content } from '@/hooks/useContent';

interface DynamicSlideProps {
    slide: Content;
    isActive: boolean;
    currentSlideIndex: number;
    onAddToCart?: () => void;
    products?: Content[];
}

/**
 * Componente que renderiza un slide dinámicamente según su contenido
 */
export default function DynamicSlide({
    slide,
    isActive,
    currentSlideIndex,
    onAddToCart,
    products = []
}: DynamicSlideProps) {
    const { title, description, imageUrl, data } = slide;

    // 🔍 LOG: Ver qué slide se está renderizando
    console.log(`🎯 [DynamicSlide] Renderizando:`, {
        title,
        order: slide.order,
        isActive,
        currentSlideIndex,
        hasImage: !!imageUrl,
        hasData: !!data
    });

    // Slide 1: Hero (order 1)
    if (slide.order === 1) {
        return (
            <SlideSection
                backgroundImage={imageUrl || ''}
                overlay="to-right"
                isActive={isActive}
            >
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left max-w-4xl">
                    {data?.subtitle && (
                        <span className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                            {data.subtitle}
                        </span>
                    )}
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-gray-900">
                        {title.split(' ').slice(0, 2).join(' ')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">
                            {title.split(' ').slice(2).join(' ')}
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                        {description}
                    </p>
                    {data?.buttonText && data?.buttonAction && (
                        <Link
                            href={`/${data.buttonAction}`}
                            className="group relative inline-block px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/50 overflow-hidden"
                        >
                            <span className="relative z-10">{data.buttonText}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    )}
                </div>
            </SlideSection>
        );
    }

    // Slide 2: Mantenimiento (order 2)
    if (slide.order === 2) {
        return (
            <SlideSection
                backgroundImage={imageUrl || ''}
                overlay="to-left"
                isActive={isActive}
            >
                <div className="container mx-auto px-6 relative z-10 max-w-5xl grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                            {title.split(' ')[0]} <br />
                            <span className="text-emerald-600">{title.split(' ').slice(1).join(' ')}</span>
                        </h2>
                        <p className="text-gray-700 text-lg mb-6">{description}</p>
                        {data?.benefits && (
                            <ul className="space-y-3 mb-8">
                                {data.benefits.map((benefit: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-800">
                                        <span className="text-emerald-600 font-bold">✓</span> {benefit}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {data?.buttonText && data?.buttonAction && (
                            <Link
                                href={`/${data.buttonAction}`}
                                className="text-gray-900 border-b-2 border-emerald-600 pb-1 hover:text-emerald-600 transition-colors font-medium"
                            >
                                {data.buttonText}
                            </Link>
                        )}
                    </div>
                </div>
            </SlideSection>
        );
    }

    // Slide 3: Instalación (order 3)
    if (slide.order === 3) {
        return (
            <SlideSection
                backgroundImage={imageUrl || ''}
                overlay="to-right"
                isActive={isActive}
            >
                <div className="container mx-auto px-6 relative z-10 text-right max-w-4xl ml-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {title.split(' ')[0]} <br />
                        <span className="text-sky-600">{title.split(' ').slice(1).join(' ')}</span>
                    </h2>
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed">{description}</p>
                    {data?.categories && (
                        <div className="flex flex-wrap gap-4 justify-end">
                            {data.categories.map((cat: any, i: number) => (
                                <div key={i} className="bg-gray-100 p-4 rounded-xl border border-gray-300 hover:border-sky-500 transition-colors">
                                    <h3 className="font-bold text-sky-600">{cat.name}</h3>
                                    <p className="text-xs text-gray-600">{cat.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SlideSection>
        );
    }

    // Slide 4: Soluciones Integrales (order 4)
    if (slide.order === 4) {
        return (
            <SlideSection
                backgroundImage={imageUrl || ''}
                overlay="to-right"
                isActive={isActive}
            >
                <div className="container mx-auto px-6 relative z-10 text-center w-full">
                    <h2 className="text-4xl md:text-5xl font-bold mb-12 text-gray-900">{title}</h2>
                    {data?.services && (
                        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {data.services.map((service: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:border-sky-500 transition-colors">
                                    <div className="text-4xl mb-4">{service.icon}</div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{service.name}</h3>
                                    <p className="text-sm text-gray-600">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SlideSection>
        );
    }

    // Slide 5: Tienda/Productos (order 5)
    if (slide.order === 5) {
        return (
            <SlideSection
                backgroundImage={imageUrl || ''}
                overlay="darker"
                isActive={isActive}
            >
                <div className="container mx-auto px-6 relative z-10 w-full">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            {data?.subtitle && (
                                <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">{data.subtitle}</span>
                            )}
                            <h2 className="text-4xl font-bold text-gray-900 mt-2">{title}</h2>
                        </div>
                        {data?.buttonText && data?.buttonAction && (
                            <Link
                                href={`/${data.buttonAction}`}
                                className="hidden md:block text-sky-600 hover:text-sky-700 transition-colors font-medium"
                            >
                                {data.buttonText} →
                            </Link>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {products.slice(0, 3).map((product) => (
                            <ProductCard
                                key={product._id}
                                image={product.imageUrl || ''}
                                title={product.title}
                                description={product.description || ''}
                                price={product.price || ''}
                                onAddToCart={onAddToCart || (() => { })}
                            />
                        ))}
                    </div>
                </div>
            </SlideSection>
        );
    }

    // Slide 6: Contacto (order 6)
    if (slide.order === 6) {
        return (
            <SlideSection
                backgroundImage={imageUrl || ''}
                overlay="darker"
                isActive={isActive}
            >
                <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
                    <h2 className="text-5xl font-bold mb-6 text-gray-900">{title}</h2>
                    <p className="text-xl text-gray-700 mb-12">{description}</p>

                    <div className="space-y-6 mb-12">
                        {data?.phone && (
                            <div className="text-2xl text-gray-900">
                                📞 <a href={`tel:${data.phone}`} className="hover:text-sky-600 transition-colors">{data.phone}</a>
                            </div>
                        )}
                        {data?.email && (
                            <div className="text-xl text-gray-700">
                                ✉️ <a href={`mailto:${data.email}`} className="hover:text-sky-600 transition-colors">{data.email}</a>
                            </div>
                        )}
                        {data?.instagram && (
                            <div className="text-xl text-gray-700">
                                📷 <a href={`https://instagram.com/${data.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 transition-colors">{data.instagram}</a>
                            </div>
                        )}
                    </div>

                    {data?.cta && (
                        <Link
                            href="/contacto"
                            className="inline-block px-10 py-5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-2xl font-bold text-xl hover:scale-105 transition-transform"
                        >
                            {data.cta}
                        </Link>
                    )}
                </div>
            </SlideSection>
        );
    }

    // Fallback: Slide genérico
    return (
        <SlideSection
            backgroundImage={imageUrl || ''}
            overlay="to-right"
            isActive={isActive}
        >
            <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                <h2 className="text-5xl font-bold mb-6 text-gray-900">{title}</h2>
                <p className="text-xl text-gray-700">{description}</p>
            </div>
        </SlideSection>
    );
}

