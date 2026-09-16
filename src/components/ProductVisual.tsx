import React, { useState } from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import { Product } from '../types';

export interface ProductVisualProps {
  product?: Product | null;
  imageUrl?: string;
  name?: string;
  isMarathi?: boolean;
  className?: string;
  allowToggle?: boolean;
  aspectRatio?: 'square' | 'card' | 'wide' | 'modal' | 'thumb';
  defaultMode?: string;
}

// Packaging Images (JPG & SVG) for MS Masale
const PACKAGING_IMAGES: Record<string, string> = {
  'prod-kanda-lasun': '/products/kanda-lasun.jpg',
  'prod-shengdana-chutney': '/products/shengdana-peanuts.jpg',
  'prod-vada-pav-coconut': '/products/vada-pav-lasun.jpg',
  'prod-til-chutney': '/products/til-sesame.jpg',
  'prod-javas-chutney': '/products/javas-flaxseed.jpg',
  'prod-kolhapuri-thecha': '/products/thecha-green.jpg',
  'prod-karale-khurasani': '/products/karale-niger.jpg',
  'prod-kala-masala': '/products/kala-masala.jpg',
  'prod-metkut': '/products/metkut-rice.jpg',
  'prod-ambyache-lonche': '/products/mango-pickle.jpg',
  'prod-limbache-lonche': '/products/lemon-pickle.jpg',
  'prod-panchamrut': '/products/panchamrut.jpg',
  'prod-hirvi-mirchi-lonche': '/products/chilli-pickle.jpg',
  'prod-lasun-lonche': '/products/garlic-pickle.jpg',
  'prod-malvani-masala': '/products/kala-masala.jpg',
  'prod-khandeshi-kala-masala': '/products/kala-masala.jpg',
  'prod-goda-masala': '/products/til-sesame.jpg',
  'prod-agri-koli-masala': '/products/kanda-lasun.jpg',
  'prod-puneri-garam-masala': '/products/kala-masala.jpg',
  'prod-kolhapuri-misal-kat-masala': '/products/kanda-lasun.jpg',
  'prod-saoji-masala': '/products/kala-masala.jpg',
  'prod-pav-bhaji-masala': '/products/vada-pav-lasun.jpg',
  'prod-chai-masala': '/products/metkut-rice.jpg',
  'prod-biryani-masala': '/products/kala-masala.jpg'
};

// Vector SVG packaging fallbacks
const PACKAGING_SVG_FALLBACKS: Record<string, string> = {
  'prod-kanda-lasun': '/products/kanda-lasun.svg',
  'prod-shengdana-chutney': '/products/shengdana-peanuts.svg',
  'prod-vada-pav-coconut': '/products/vada-pav-lasun.svg',
  'prod-til-chutney': '/products/til-sesame.svg',
  'prod-javas-chutney': '/products/javas-flaxseed.svg',
  'prod-kolhapuri-thecha': '/products/thecha-green.svg',
  'prod-karale-khurasani': '/products/karale-niger.svg',
  'prod-kala-masala': '/products/kala-masala.svg',
  'prod-metkut': '/products/metkut-rice.svg',
  'prod-ambyache-lonche': '/products/mango-pickle.svg',
  'prod-limbache-lonche': '/products/lemon-pickle.svg',
  'prod-panchamrut': '/products/panchamrut.svg',
  'prod-hirvi-mirchi-lonche': '/products/chilli-pickle.svg',
  'prod-lasun-lonche': '/products/garlic-pickle.svg'
};

const DEFAULT_IMAGE = '/products/kanda-lasun.jpg';

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  imageUrl,
  name,
  isMarathi = false,
  className = '',
  aspectRatio = 'square'
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [fallbackAttempted, setFallbackAttempted] = useState<boolean>(false);

  const productId = product?.id || '';

  // Determine initial image source: exact imageUrl first, then product.imageUrl, then mapped pack image, then default
  const resolvedSrc = 
    imageUrl || 
    product?.imageUrl || 
    (productId && PACKAGING_IMAGES[productId]) || 
    DEFAULT_IMAGE;

  const [currentSrc, setCurrentSrc] = useState<string>(resolvedSrc);

  // Update src when props change
  React.useEffect(() => {
    const nextSrc = 
      imageUrl || 
      product?.imageUrl || 
      (productId && PACKAGING_IMAGES[productId]) || 
      DEFAULT_IMAGE;
    setCurrentSrc(nextSrc);
    setIsLoaded(false);
    setFallbackAttempted(false);
  }, [imageUrl, product?.imageUrl, productId]);

  const getOriginInfo = () => {
    if (!product) {
      return { region: 'Traditional', isFlagship: false };
    }
    if (product.id === 'prod-kanda-lasun') {
      return { region: 'Signature Blend', isFlagship: true };
    }
    return {
      region: product.regionOriginEn || 'Traditional',
      isFlagship: Boolean(product.isBestSeller)
    };
  };

  const origin = getOriginInfo();
  const displayName = product?.nameEn || name || 'MS Masale';

  // Aspect ratio classes for responsive standard sizing
  const aspectClass = 
    aspectRatio === 'square' ? 'aspect-square w-full' :
    aspectRatio === 'card' ? 'aspect-square w-full' :
    aspectRatio === 'wide' ? 'aspect-[4/3] w-full' :
    aspectRatio === 'modal' ? 'w-full h-full min-h-[280px] sm:min-h-[360px]' :
    aspectRatio === 'thumb' ? 'w-16 h-16 aspect-square' :
    'aspect-square w-full';

  return (
    <div
      className={`relative overflow-hidden select-none group/visual bg-gradient-to-b from-[#FAF7F2] via-[#F4EDE2] to-[#E9DDCB] flex items-center justify-center p-3 sm:p-4 transition-colors ${aspectClass} ${className}`}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-200/50 animate-pulse flex items-center justify-center z-10">
          <div className="w-6 h-6 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
        </div>
      )}

      {/* Actual Product Packaging Image ("As It Is") */}
      <img
        src={currentSrc}
        alt={displayName}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!fallbackAttempted) {
            setFallbackAttempted(true);
            // Try SVG fallback for vector mockup or default image
            if (productId && PACKAGING_SVG_FALLBACKS[productId]) {
              setCurrentSrc(PACKAGING_SVG_FALLBACKS[productId]);
            } else if (currentSrc !== DEFAULT_IMAGE) {
              setCurrentSrc(DEFAULT_IMAGE);
            }
          }
          setIsLoaded(true);
        }}
        className={`w-full h-full object-contain object-center transform transition-transform duration-500 ease-out will-change-transform drop-shadow-[0_8px_18px_rgba(45,28,15,0.18)] group-hover/visual:scale-105 group-hover/card:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Origin Badge (Top Right) */}
      <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-tight shadow-xs backdrop-blur-md flex items-center gap-1 ${
            origin.isFlagship
              ? 'bg-amber-500 text-stone-950 border border-amber-400 font-extrabold'
              : 'bg-white/90 text-stone-800 border border-stone-200/80'
          }`}
        >
          {origin.isFlagship ? (
            <Sparkles className="w-2.5 h-2.5 text-amber-950 fill-amber-950" />
          ) : (
            <MapPin className="w-2.5 h-2.5 text-amber-600" />
          )}
          <span className="truncate max-w-[110px] sm:max-w-[130px]">{origin.region}</span>
        </span>
      </div>
    </div>
  );
};
