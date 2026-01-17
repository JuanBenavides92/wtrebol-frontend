import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  onAddToCart: () => void;
}

export default function ProductCard({
  image,
  title,
  description,
  price,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      {/* Product Image */}
      <div className="relative h-48 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-slate-800">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHBYYFRQYHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/2wBDAR"
        />
      </div>

      {/* Product Info */}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>

      {/* Price and Button */}
      <div className="flex justify-between items-center">
        <span className="text-emerald-500 font-bold text-lg">{price}</span>
        <button
          onClick={onAddToCart}
          className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-400 transition-colors flex items-center justify-center"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

