'use client';

import { useState } from 'react';
import { useSlides } from '@/hooks/useContent';

export default function TestSliderPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { content: slides, loading } = useSlides();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    const sortedSlides = slides.sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div className="relative w-screen h-screen bg-gray-900 overflow-hidden">
            {/* Indicador de slide actual */}
            <div className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-bold">
                    Slide {currentSlide + 1} de {sortedSlides.length}
                </p>
                <p className="text-xs text-gray-600">
                    Order: {sortedSlides[currentSlide]?.order}
                </p>
            </div>

            {/* Botones de navegación */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                    className="bg-white px-4 py-2 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    ← Anterior
                </button>
                <button
                    onClick={() => setCurrentSlide(Math.min(sortedSlides.length - 1, currentSlide + 1))}
                    disabled={currentSlide === sortedSlides.length - 1}
                    className="bg-white px-4 py-2 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                    Siguiente →
                </button>
            </div>

            {/* Dots de navegación */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                {sortedSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${currentSlide === index
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                    />
                ))}
            </div>

            {/* Contenedor de slides */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${currentSlide * 100}vw)`,
                }}
            >
                {sortedSlides.map((slide, index) => (
                    <div
                        key={slide._id}
                        className="flex-shrink-0 w-screen h-screen flex items-center justify-center relative"
                        style={{
                            background: slide.imageUrl
                                ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${slide.imageUrl}') center/cover`
                                : `hsl(${index * 60}, 70%, 50%)`,
                        }}
                    >
                        <div className="text-center text-white z-10 max-w-4xl px-8">
                            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <h1 className="text-6xl font-bold mb-4">
                                    Slide #{index + 1}
                                </h1>
                                <h2 className="text-4xl font-bold mb-4">
                                    {slide.title}
                                </h2>
                                <p className="text-xl mb-4">
                                    {slide.description}
                                </p>
                                <div className="text-sm text-white/70 space-y-1">
                                    <p>Order: {slide.order}</p>
                                    <p>ID: {slide._id}</p>
                                    <p>Tiene imagen: {slide.imageUrl ? '✅' : '❌'}</p>
                                    <p>Tiene data: {slide.data ? '✅' : '❌'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lista de todos los slides (debug) */}
            <div className="absolute bottom-20 left-4 z-50 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
                <p className="font-bold text-sm mb-2">Slides cargados:</p>
                <ul className="text-xs space-y-1">
                    {sortedSlides.map((slide, index) => (
                        <li
                            key={slide._id}
                            className={`${currentSlide === index ? 'font-bold text-blue-600' : 'text-gray-600'}`}
                        >
                            {index + 1}. {slide.title} (order: {slide.order})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
