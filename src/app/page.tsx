'use client';

import { useState, useEffect } from 'react';
import Slider from '@/components/Slider';
import NavigationDots from '@/components/NavigationDots';
import SlideByLayout from '@/components/SlideByLayout';
import OrganicBlobs from '@/components/OrganicBlobs';
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
    <div className="relative w-screen h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 overflow-hidden">
      {/* Organic Blobs - Dynamic Flow Design */}
      <OrganicBlobs />

      {/* Mostrar loading hasta que esté montado en el cliente */}
      {!isMounted || slidesLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-900 text-2xl font-semibold">Cargando...</div>
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
                    layout: slide.layout,
                    order: slide.order,
                    isActive: currentSlide === index,
                    currentSlideIndex: index
                  });
                  return (
                    <SlideByLayout
                      key={slide._id}
                      slide={slide}
                      isActive={currentSlide === index}
                    />
                  );
                })
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-900 text-2xl">No hay slides disponibles</div>
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
