'use client';

import { useState, useEffect } from 'react';
import SlideByLayout from './SlideByLayout';
import NavigationDots from './NavigationDots';
import OrganicBlobs from './OrganicBlobs';
import { Content } from '@/hooks/useContent';

interface SliderAutoProps {
    slides: Content[];
    autoPlayInterval?: number;
    pauseOnHover?: boolean;
    showDots?: boolean;
    showArrows?: boolean;
}

export default function SliderAuto({
    slides,
    autoPlayInterval = 8000,
    pauseOnHover = true,
    showDots = true,
    showArrows = true,
}: SliderAutoProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-play logic
    useEffect(() => {
        if (isPaused || slides.length === 0) return;

        console.log('🎬 [SliderAuto] Auto-play iniciado, intervalo:', autoPlayInterval, 'ms');

        const interval = setInterval(() => {
            console.log('⏰ [SliderAuto] Cambiando slide automáticamente');
            setCurrentSlide((prev) => {
                const nextSlide = (prev + 1) % slides.length;
                console.log(`📍 [SliderAuto] Slide ${prev} → ${nextSlide}`);
                return nextSlide;
            });
        }, autoPlayInterval);

        return () => {
            console.log('🛑 [SliderAuto] Limpiando intervalo');
            clearInterval(interval);
        };
    }, [isPaused, slides.length, autoPlayInterval]);

    // Manual navigation
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (slides.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-slate-900 text-2xl">No hay slides disponibles</div>
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            {/* Organic Blobs Background */}
            <OrganicBlobs />

            {/* Slides Container */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide._id}
                        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                        style={{
                            opacity: currentSlide === index ? 1 : 0,
                            pointerEvents: currentSlide === index ? 'auto' : 'none',
                        }}
                    >
                        <SlideByLayout slide={slide} isActive={currentSlide === index} />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {showArrows && slides.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/40 transition-all duration-300 group"
                        aria-label="Previous slide"
                    >
                        <svg
                            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/40 transition-all duration-300 group"
                        aria-label="Next slide"
                    >
                        <svg
                            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Navigation Dots */}
            {showDots && slides.length > 1 && (
                <NavigationDots
                    totalSlides={slides.length}
                    currentSlide={currentSlide}
                    onDotClick={goToSlide}
                    showFooter={false}
                />
            )}
        </div>
    );
}

