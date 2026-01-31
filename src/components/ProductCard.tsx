import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { getCategoryLabel } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/formatters';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  category?: string;
  btuCapacity?: number;
  inStock?: boolean;
  slug?: string;
  onAddToCart: () => void;
}

export default function ProductCard({
  image,
  title,
  description,
  price,
  category,
  btuCapacity,
  inStock = true,
  slug,
  onAddToCart,
}: ProductCardProps) {
  const productLink = slug ? `/tienda/${slug}` : '#';

  return (
    <div className="group relative bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-200/40 transition-all duration-300">
      {/* Badges Top-Left */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        {!inStock && (
          <span className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
            Bajo Pedido
          </span>
        )}
        {category && (
          <span className="bg-sky-500/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
            {getCategoryLabel(category)}
          </span>
        )}
      </div>

      {/* Product Image - Clickable */}
      <Link href={productLink} className="block">
        <div className="relative h-48 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-slate-50 cursor-pointer">
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
      </Link>

      {/* Product Info - Clickable */}
      <Link href={productLink} className="block">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 hover:text-sky-600 transition-colors cursor-pointer">
          {title}
        </h3>
      </Link>
      <p className="text-slate-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">{description}</p>

      {/* BTU Badge (if applicable) */}
      {btuCapacity && (
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border border-sky-500/30 text-sky-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            ❄️ {btuCapacity.toLocaleString()} BTU
          </span>
        </div>
      )}

      {/* Price and Button */}
      <div className="flex justify-between items-center mt-auto">
        <span className="text-emerald-500 font-bold text-lg">{formatPrice(price)}</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart();
          }}
          className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
