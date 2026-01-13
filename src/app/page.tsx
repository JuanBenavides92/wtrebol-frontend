'use client';

import { useState, useEffect } from 'react';
import SliderAuto from '@/components/SliderAuto';
import ServiciosSection3D from '@/components/ServiciosSection3D';
import PorQueElegirnosSection from '@/components/PorQueElegirnosSection';
import ProcesoTrabajoSection from '@/components/ProcesoTrabajoSection';
import ProductosSection from '@/components/ProductosSection';
import MarcasPartnersSection from '@/components/MarcasPartnersSection';
import FAQSection from '@/components/FAQSection';
import EmergenciasSection from '@/components/EmergenciasSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import { useSlides } from '@/hooks/useContent';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  // Consumir datos del backend
  const { content: slides, loading: slidesLoading } = useSlides();

  // Montar solo en el cliente para evitar errores de hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 🔍 LOG: Verificar slides recibidos
  console.log('📊 [page.tsx] Estado de slides:', {
    loading: slidesLoading,
    cantidad: slides.length,
    isMounted,
    slides: slides.map(s => ({ id: s._id, title: s.title, order: s.order }))
  });

  return (
    <div className="w-full bg-gradient-to-br from-white via-sky-50 to-blue-50">
      {/* Hero Section - Auto-Play Slider */}
      <section className="h-screen relative">
        {!isMounted || slidesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-900 text-2xl font-semibold">Cargando...</div>
          </div>
        ) : (
          <SliderAuto
            slides={slides.sort((a, b) => (a.order || 0) - (b.order || 0))}
            autoPlayInterval={8000}
            pauseOnHover={true}
            showDots={true}
            showArrows={true}
          />
        )}
      </section>

      {/* Servicios Section - 3D Scroll Effect */}
      <ServiciosSection3D />

      {/* Por Qué Elegirnos Section */}
      <PorQueElegirnosSection />

      {/* Proceso de Trabajo Section */}
      <ProcesoTrabajoSection />

      {/* Productos Section */}
      <ProductosSection />

      {/* Marcas Partners Section */}
      <MarcasPartnersSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Emergencias 24/7 Section */}
      <EmergenciasSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer showFooter={true} isStatic={true} />
    </div>
  );
}
