import Link from 'next/link';
import { Content } from '@/hooks/useContent';

interface SlideByLayoutProps {
    slide: Content;
    isActive: boolean;
}

/**
 * Componente que renderiza un slide según su layout configurado
 */
export default function SlideByLayout({ slide, isActive }: SlideByLayoutProps) {
    const {
        title, description, imageUrl, buttonText, buttonLink,
        layout = 'image-right', overlayOpacity,
        titleSize = 48, titleColor = 'auto', titleGradient = false, titleBold = true, titleItalic = false,
        descriptionSize = 18, descriptionColor = 'auto', descriptionGradient = false, descriptionBold = false, descriptionItalic = false
    } = slide;

    // Helper para obtener estilos de título
    const getTitleStyle = () => {
        const baseStyle: React.CSSProperties = {
            fontSize: `${titleSize}px`,
            fontWeight: titleBold ? 'bold' : 'normal',
            fontStyle: titleItalic ? 'italic' : 'normal'
        };

        // Color automático según layout
        let finalColor = titleColor;
        if (titleColor === 'auto') {
            finalColor = layout === 'image-background' ? '#FFFFFF' : '#1F2937';
        }

        if (titleGradient && titleColor !== 'auto') {
            return {
                ...baseStyle,
                background: titleColor,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            };
        }
        return { ...baseStyle, color: finalColor };
    };

    // Helper para obtener estilos de descripción
    const getDescriptionStyle = () => {
        const baseStyle: React.CSSProperties = {
            fontSize: `${descriptionSize}px`,
            fontWeight: descriptionBold ? 'bold' : 'normal',
            fontStyle: descriptionItalic ? 'italic' : 'normal'
        };

        // Color automático según layout
        let finalColor = descriptionColor;
        if (descriptionColor === 'auto') {
            finalColor = layout === 'image-background' ? '#FFFFFF' : '#374151';
        }

        if (descriptionGradient && descriptionColor !== 'auto') {
            return {
                ...baseStyle,
                background: descriptionColor,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            };
        }
        return { ...baseStyle, color: finalColor };
    };

    // Layout: Image Right (Texto izquierda, imagen derecha)
    if (layout === 'image-right') {
        return (
            <div
                className="w-screen flex items-center justify-center relative"
                style={{ height: '100vh', paddingTop: '80px' }}
                data-slide
            >
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Texto - Izquierda */}
                        <div className={`space-y-6 text-center lg:text-left ${isActive ? 'animate-fade-in-left' : 'opacity-0'}`}>
                            <h2
                                className="leading-tight"
                                style={getTitleStyle()}
                            >
                                {title}
                            </h2>
                            {description && (
                                <p
                                    className="leading-relaxed"
                                    style={getDescriptionStyle()}
                                >
                                    {description}
                                </p>
                            )}
                            {buttonText && buttonLink && (
                                <Link
                                    href={buttonLink}
                                    className="inline-block px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
                                >
                                    {buttonText}
                                </Link>
                            )}
                        </div>

                        {/* Imagen - Derecha */}
                        <div className={`relative ${isActive ? 'animate-fade-in-right' : 'opacity-0'}`}>
                            {imageUrl && (
                                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Layout: Image Left (Imagen izquierda, texto derecha)
    if (layout === 'image-left') {
        return (
            <div
                className="w-screen flex items-center justify-center relative"
                style={{ height: '100vh', paddingTop: '80px' }}
                data-slide
            >
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Imagen - Izquierda */}
                        <div className={`relative order-2 lg:order-1 ${isActive ? 'animate-fade-in-left' : 'opacity-0'}`}>
                            {imageUrl && (
                                <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Texto - Derecha */}
                        <div className={`space-y-6 text-center lg:text-left order-1 lg:order-2 ${isActive ? 'animate-fade-in-right' : 'opacity-0'}`}>
                            <h2
                                className="leading-tight"
                                style={getTitleStyle()}
                            >
                                {title}
                            </h2>
                            {description && (
                                <p
                                    className="leading-relaxed"
                                    style={getDescriptionStyle()}
                                >
                                    {description}
                                </p>
                            )}
                            {buttonText && buttonLink && (
                                <Link
                                    href={buttonLink}
                                    className="inline-block px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
                                >
                                    {buttonText}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Layout: Image Background (Imagen de fondo, texto centrado)
    if (layout === 'image-background') {
        const opacity = (overlayOpacity ?? 50) / 100; // Convertir de 0-100 a 0-1

        return (
            <div
                className="w-screen flex items-center justify-center relative"
                style={{ height: '100vh', paddingTop: '80px' }}
                data-slide
            >
                {/* Imagen de Fondo */}
                {imageUrl && (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                        {/* Overlay oscuro con opacidad dinámica */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(to bottom, rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity * 0.9}), rgba(0,0,0,${opacity}))`
                            }}
                        />
                    </>
                )}

                {/* Texto Centrado */}
                <div className={`container mx-auto px-6 lg:px-12 relative z-10 text-center ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h2
                            className="leading-tight drop-shadow-2xl"
                            style={getTitleStyle()}
                        >
                            {title}
                        </h2>
                        {description && (
                            <p
                                className="leading-relaxed drop-shadow-lg"
                                style={getDescriptionStyle()}
                            >
                                {description}
                            </p>
                        )}
                        {buttonText && buttonLink && (
                            <Link
                                href={buttonLink}
                                className="inline-block px-10 py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
                            >
                                {buttonText}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Fallback (por si acaso)
    return null;
}
