import React, { useState } from 'react';
import { Sparkles, Flame, ShieldCheck, Heart, Award, MapPin } from 'lucide-react';
import { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  isMarathi?: boolean;
  className?: string;
  allowToggle?: boolean;
  aspectRatio?: 'card' | 'modal' | 'thumb';
}

// Fallback high-resolution culinary photos for Maharashtrian chutneys & spices
const REAL_FOOD_FALLBACKS: Record<string, string> = {
  'prod-shengdana-chutney': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1000&q=85',
  'prod-kanda-lasun': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=85',
  'prod-vada-pav-coconut': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=85',
  'prod-til-chutney': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=85',
  'prod-javas-chutney': 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=1000&q=85',
  'prod-kolhapuri-thecha': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=85',
  'prod-karale-khurasani': 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=1000&q=85',
  'prod-kala-masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=85'
};

const DEFAULT_REAL_FOOD = 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85';

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  isMarathi = false,
  className = '',
  aspectRatio = 'card'
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(product.imageUrl);
  const [fallbackAttempt, setFallbackAttempt] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleImageError = () => {
    if (fallbackAttempt === 0) {
      const fallback = REAL_FOOD_FALLBACKS[product.id] || DEFAULT_REAL_FOOD;
      setCurrentSrc(fallback);
      setFallbackAttempt(1);
    } else if (fallbackAttempt === 1) {
      setCurrentSrc(DEFAULT_REAL_FOOD);
      setFallbackAttempt(2);
    }
  };

  const getBadgeInfo = () => {
    switch (product.id) {
      case 'prod-shengdana-chutney':
        return { emoji: '🥜', tag: isMarathi ? 'सोलापुरी शेंगदाणा' : 'Solapuri Shenga', region: isMarathi ? 'सोलापूर' : 'Solapur' };
      case 'prod-kanda-lasun':
        return { emoji: '🧅', tag: isMarathi ? 'कोल्हापुरी कांदा-लसूण' : 'Kolhapuri Kanda-Lasun', region: isMarathi ? 'कोल्हापूर' : 'Kolhapur' };
      case 'prod-vada-pav-coconut':
        return { emoji: '🥥', tag: isMarathi ? 'वडापाव लाल चटणी' : 'Vada Pav Red Chutney', region: isMarathi ? 'मुंबई/कोकण' : 'Konkan' };
      case 'prod-til-chutney':
        return { emoji: '✨', tag: isMarathi ? 'गावरान तीळ' : 'High-Calcium Til', region: isMarathi ? 'मराठवाडा' : 'Marathwada' };
      case 'prod-javas-chutney':
        return { emoji: '🌾', tag: isMarathi ? 'ओमेगा-३ जवस' : 'Omega-3 Flaxseed', region: isMarathi ? 'पश्चिम महाराष्ट्र' : 'W. Maharashtra' };
      case 'prod-kolhapuri-thecha':
        return { emoji: '🌶️', tag: isMarathi ? 'कोल्हापुरी ठेचा' : 'Kolhapuri Thecha', region: isMarathi ? 'कोल्हापूर' : 'Kolhapur' };
      case 'prod-karale-khurasani':
        return { emoji: '🖤', tag: isMarathi ? 'खुरासणी / कारळे' : 'Karale Niger Seed', region: isMarathi ? 'नाशिक' : 'Nashik' };
      case 'prod-kala-masala':
        return { emoji: '🍲', tag: isMarathi ? '२४ खडे मसाले' : '24-Spice Kala Masala', region: isMarathi ? 'खान्देश' : 'Khandesh' };
      default:
        return { emoji: '🏺', tag: isMarathi ? 'अस्सल गावरान' : 'Authentic Desi', region: product.regionOriginMr || 'महाराष्ट्र' };
    }
  };

  const badge = getBadgeInfo();

  return (
    <div className={`relative w-full h-full overflow-hidden bg-stone-900 select-none group ${className}`}>
      {/* Background warm shimmer placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/40 border-t-amber-500 animate-spin" />
        </div>
      )}

      {/* Real High-Definition Food Photograph */}
      <img
        src={currentSrc}
        alt={isMarathi ? product.nameMr : product.nameEn}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-108 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Subtle Gradient Shadow for Readability and Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

      {/* Top Heritage Region Pill (Top-Right) */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
          <MapPin className="w-2.5 h-2.5 text-amber-400" />
          <span>{badge.region}</span>
        </span>
      </div>

      {/* Bottom Cultural Notes & Key Ingredients */}
      <div className="absolute bottom-2.5 inset-x-3 z-10 flex items-center justify-between pointer-events-none text-white">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-extrabold flex items-center gap-1 border border-amber-400/30">
            <span>{badge.emoji}</span>
            <span className="truncate max-w-[130px] sm:max-w-[160px]">{badge.tag}</span>
          </span>
        </div>

        {/* 100% Authentic Seal */}
        <span className="px-1.5 py-0.5 rounded-md bg-amber-600/90 text-white text-[9px] font-extrabold shadow-xs tracking-wider uppercase">
          {isMarathi ? 'दगडी कुटाई' : 'Stone-Ground'}
        </span>
      </div>
    </div>
  );
};
