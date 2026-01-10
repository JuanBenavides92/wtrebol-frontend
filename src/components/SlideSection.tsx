import { ReactNode } from 'react';

interface SlideSectionProps {
  backgroundImage: string;
  overlay?: 'to-right' | 'to-left' | 'darker';
  isActive: boolean;
  children: ReactNode;
}

export default function SlideSection({
  backgroundImage,
  overlay = 'to-right',
  isActive,
  children,
}: SlideSectionProps) {
  const overlayStyles = {
    'to-right': 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4))',
    'to-left': 'linear-gradient(to left, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.6))',
    'darker': 'rgba(15, 23, 42, 0.95)',
  };

  // 🔍 LOG: Ver el estado de renderizado
  console.log('📦 [SlideSection] Renderizando:', {
    isActive,
    hasBackgroundImage: !!backgroundImage,
    backgroundImage: backgroundImage?.substring(0, 50) + '...'
  });

  return (
    <div
      data-slide
      className="flex-shrink-0 flex items-center justify-center relative overflow-hidden"
      style={{
        width: '100vw',
        height: 'calc(100vh - 80px)',
        flexBasis: '100vw',
        background: backgroundImage
          ? `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('${backgroundImage}') center/cover`
          : '#ffffff',
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
