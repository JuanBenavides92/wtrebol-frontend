'use client';

import { useState, useEffect } from 'react';
import Slider from '@/components/Slider';
import NavigationDots from '@/components/NavigationDots';
import DynamicSlide from '@/components/DynamicSlide';
import Footer from '@/components/Footer';
import { useSlides, useProducts } from '@/hooks/useContent';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  // Consumir datos del backend
  const { content: slides, loading: slidesLoading } = useSlides();
  const { content: products } = useProducts();

  // Montar solo en el cliente para evitar errores de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🔍 LOG: Verificar slides recibidos
  console.log('📊 [page.tsx] Estado de slides:', {
    loading: slidesLoading,
    cantidad: slides.length,
    isMounted,
    currentSlide,
    slides: slides.map(s => ({ id: s._id, title: s.title, order: s.order }))
  });

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      {/* Animated gradient orbs for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Mostrar loading hasta que esté montado en el cliente */}
      {!isMounted || slidesLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-2xl">Cargando slides...</div>
        </div>
      ) : (
        <>
          <Slider
            currentSlide={currentSlide}
            onSlideChange={handleSlideChange}
            isModalOpen={false}
            showFooter={showFooter}
            onShowFooter={setShowFooter}
          >
            {/* Renderizar slides dinámicamente desde el backend */}
            {slides.length > 0 ? (
              slides
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((slide, index) => {
                  // 🔍 LOG: Verificar cada slide antes de renderizar
                  console.log(`🎨 [page.tsx] Renderizando slide ${index}:`, {
                    id: slide._id,
                    title: slide.title,
                    order: slide.order,
                    isActive: currentSlide === index,
                    currentSlideIndex: index
                  });
                  return (
                    <DynamicSlide
                      key={slide._id}
                      slide={slide}
                      isActive={currentSlide === index}
                      currentSlideIndex={index}
                      products={products}
                    />
                  );
                })
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-2xl">No hay slides disponibles</div>
              </div>
            )}
          </Slider>

          {/* Navigation Dots */}
          <NavigationDots
            totalSlides={slides.length}
            currentSlide={currentSlide}
            onDotClick={handleSlideChange}
            showFooter={showFooter}
          />

          {/* Footer - Shows when scrolling down from last slide */}
          <Footer showFooter={showFooter} />
        </>
      )}
    </div>
  );
}
