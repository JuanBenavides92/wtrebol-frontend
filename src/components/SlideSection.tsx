import { ReactNode } from 'react';

interface SlideSectionProps {
  backgroundImage: string;
  overlay?: 'to-right' | 'to-left' | 'darker' | 'full-background';
  isActive: boolean;
  children: ReactNode;
}

export default function SlideSection({
  backgroundImage,
  overlay = 'to-right',
  isActive,
  children,
}: SlideSectionProps) {
  // 🔍 LOG: Ver el estado de renderizado
  console.log('📦 [SlideSection] Renderizando:', {
    isActive,
    overlay,
    hasBackgroundImage: !!backgroundImage,
    backgroundImage: backgroundImage?.substring(0, 50) + '...'
  });

  // Determinar el estilo de fondo según el tipo de overlay
  const getBackgroundStyle = () => {
    if (!backgroundImage) {
      return '#ffffff';
    }

    // Si es 'full-background', mostrar la imagen completa con oscurecimiento sutil
    if (overlay === 'full-background') {
      return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${backgroundImage}') center/cover no-repeat`;
    }

    // Para otros overlays, usar el overlay blanco original
    return `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('${backgroundImage}') center/cover`;
  };

  return (
    <div
      data-slide
      className="flex-shrink-0 flex items-center justify-center relative overflow-hidden"
      style={{
        width: '100vw',
        height: 'calc(100vh - 80px)',
        flexBasis: '100vw',
        background: getBackgroundStyle(),
      }}
    >
      {/* Content */}
      <div
        className="relative z-10 px-6 w-full"
      >
        {children}
      </div>
    </div>
  );
}
