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
  aspectRatio?: 'square' | 'card' | 'wide' | 'modal' | 'thumb' | 'natural';
  defaultMode?: string;
  showOriginBadge?: boolean;
}

// Authentic Packaging Images Provided Directly by User for MS Masale
const PACKAGING_IMAGES: Record<string, string> = {
  'prod-kanda-lasun': '/products/1000170201.jpg',
  'prod-shengdana-chutney': '/products/1000170225.jpg',
  'prod-vada-pav-coconut': '/products/1000170174.jpg',
  'prod-til-chutney': '/products/1000170198.jpg',
  'prod-kolhapuri-thecha': '/products/1000170204.jpeg',
  'prod-kala-masala': '/products/1000170207.jpeg',
  'prod-metkut': '/products/1000170234.jpeg',
  'prod-ambyache-lonche': '/products/1000170213.jpg',
  'prod-limbache-lonche': '/products/1000170210.jpg',
  'prod-lasun-lonche': '/products/1000170216.jpg',
  'prod-hirvi-mirchi-lonche': '/products/1000170219.jpg'
};

const DEFAULT_IMAGE = '/products/1000170201.jpg';

// Module-level cache so images that have already loaded once render instantly without skeleton flash
const loadedImagesCache = new Set<string>();

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  imageUrl,
  name,
  isMarathi = false,
  className = '',
  aspectRatio = 'card',
  showOriginBadge = false
}) => {
  const productId = product?.id || '';

  // Determine preferred image source: explicit prop first, then product.imageUrl, then mapped image, then default
  const getPreferredImage = (): string => {
    if (imageUrl) return imageUrl;
    if (product?.imageUrl) {
      return product.imageUrl;
    }
    if (productId === 'prod-metkut') {
      return (aspectRatio === 'wide' || aspectRatio === 'modal') 
        ? '/products/metkut-rice-wide.jpg' 
        : '/products/1000170234.jpeg';
    }
    return (productId && PACKAGING_IMAGES[productId]) || DEFAULT_IMAGE;
  };

  const [currentSrc, setCurrentSrc] = useState<string>(getPreferredImage);
  const [isLoaded, setIsLoaded] = useState<boolean>(() => {
    const initial = getPreferredImage();
    return loadedImagesCache.has(initial);
  });
  const [fallbackAttempted, setFallbackAttempted] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  // Update src when props change
  React.useEffect(() => {
    const nextSrc = getPreferredImage();
    setCurrentSrc(nextSrc);
    setIsLoaded(loadedImagesCache.has(nextSrc));
    setFallbackAttempted(false);
  }, [imageUrl, product?.imageUrl, productId, aspectRatio]);

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

  // Smooth, proportional aspect ratios matching actual product packaging
  const aspectClass = 
    aspectRatio === 'card' ? 'aspect-[4/3] w-full' :
    aspectRatio === 'square' ? 'aspect-square w-full' :
    aspectRatio === 'wide' ? 'aspect-[16/10] w-full' :
    aspectRatio === 'modal' ? 'w-full h-full min-h-[220px] sm:min-h-[280px]' :
    aspectRatio === 'thumb' ? 'w-14 h-14 aspect-square' :
    aspectRatio === 'natural' ? 'w-full' :
    'aspect-[4/3] w-full';

  return (
    <div
      className={`relative overflow-hidden select-none group/visual bg-white flex items-center justify-center ${
        isLandscape ? 'p-2 sm:p-3' : 'p-3 sm:p-4'
      } transition-colors ${aspectClass} ${className}`}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-50 flex items-center justify-center z-10">
          <div className="w-5 h-5 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
        </div>
      )}

      {/* Actual Product Packaging Image ("As It Is") - seamless on pure white background */}
      <img
        src={currentSrc}
        alt={displayName}
        referrerPolicy="no-referrer"
        loading={aspectRatio === 'card' || aspectRatio === 'square' ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={(e) => {
          loadedImagesCache.add(currentSrc);
          setIsLoaded(true);
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setIsLandscape(img.naturalWidth / img.naturalHeight > 1.25);
          }
        }}
        onError={() => {
          if (!fallbackAttempted) {
            setFallbackAttempted(true);
            const fb = (productId && PACKAGING_IMAGES[productId]) || DEFAULT_IMAGE;
            if (currentSrc !== fb) {
              setCurrentSrc(fb);
            }
          }
          setIsLoaded(true);
        }}
        className={`w-full h-full object-contain object-center transform transition-transform duration-300 ease-out will-change-transform group-hover/visual:scale-105 group-hover/card:scale-105 transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Optional Origin Badge - Only shown when explicitly requested */}
      {showOriginBadge && (
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight shadow-xs flex items-center gap-1 ${
              origin.isFlagship
                ? 'bg-amber-500 text-stone-950 border border-amber-400 font-extrabold'
                : 'bg-white/95 text-stone-800 border border-stone-200/80 shadow-xs'
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
      )}
    </div>
  );
};

