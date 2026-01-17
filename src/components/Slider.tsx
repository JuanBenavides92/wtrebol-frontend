import { useEffect, useState } from 'react';

interface SliderProps {
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isModalOpen: boolean;
  showFooter: boolean;
  onShowFooter: (show: boolean) => void;
  children: React.ReactNode;
}

export default function Slider({
  currentSlide,
  onSlideChange,
  isModalOpen,
  showFooter,
  onShowFooter,
  children,
}: SliderProps) {
  const [isScrolling, setIsScrolling] = useState(false);

  // Handle wheel scroll to navigate slides
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't scroll if modal is open
      if (isModalOpen) return;

      if (isScrolling) return;

      const slides = document.querySelectorAll('[data-slide]').length;

      if (e.deltaY > 0) {
        // Scroll down
        if (currentSlide < slides - 1) {
          // Navigate to next slide
          setIsScrolling(true);
          onSlideChange(currentSlide + 1);
          setTimeout(() => setIsScrolling(false), 1200);
        } else if (currentSlide === slides - 1 && !showFooter) {
          // We're on the last slide, show footer
          setIsScrolling(true);
          onShowFooter(true);
          setTimeout(() => setIsScrolling(false), 1200);
        }
      } else {
        // Scroll up
        if (showFooter) {
          // We're viewing the footer, go back to last slide
          setIsScrolling(true);
          onShowFooter(false);
          setTimeout(() => setIsScrolling(false), 1200);
        } else if (currentSlide > 0) {
          // Navigate to previous slide
          setIsScrolling(true);
          onSlideChange(currentSlide - 1);
          setTimeout(() => setIsScrolling(false), 1200);
        }
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSlide, isScrolling, isModalOpen, showFooter, onSlideChange, onShowFooter]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;

      const slides = document.querySelectorAll('[data-slide]').length;

      if (e.key === 'ArrowRight' && currentSlide < slides - 1) {
        onSlideChange(currentSlide + 1);
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        onSlideChange(currentSlide - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isModalOpen, onSlideChange]);

  const slides = (typeof children === 'object' && children && 'length' in children ? children.length : 0) as number;

  return (
    <div className="relative">
      <div
        className="flex bg-white"
        style={{
          width: `${slides * 100}vw`,
          height: 'calc(100vh - 80px)',
          overflow: 'hidden',
          transform: `translateX(-${currentSlide * 100}vw)`,
          transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {children}
      </div>

      {/* Navigation Arrows */}
      {!isModalOpen && (
        <>
          {/* Left Arrow */}
          {currentSlide > 0 && (
            <button
              onClick={() => onSlideChange(currentSlide - 1)}
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
          )}

          {/* Right Arrow */}
          {currentSlide < slides - 1 && (
            <button
              onClick={() => onSlideChange(currentSlide + 1)}
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
          )}
        </>
      )}
    </div>
  );
}

