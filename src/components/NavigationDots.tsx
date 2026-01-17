interface NavigationDotsProps {
  currentSlide: number;
  totalSlides: number;
  onDotClick: (index: number) => void;
  showFooter: boolean;
}

export default function NavigationDots({ currentSlide, totalSlides, onDotClick, showFooter }: NavigationDotsProps) {
  return (
    <div className={`absolute right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 transition-opacity duration-500 ${showFooter ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
            ? 'bg-sky-500 scale-150'
            : 'bg-white/30 hover:bg-white/50'
            }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

