import React, { useState } from 'react';
import { Sparkles, MapPin, Eye, Camera } from 'lucide-react';
import { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  isMarathi?: boolean;
  className?: string;
  allowToggle?: boolean;
  aspectRatio?: 'card' | 'modal' | 'thumb';
}

// Strictly NON-TEXT authentic Maharashtrian culinary food photography
// Inspired by traditional Maharashtrian dry chutneys & metkuts (ceramic/clay/stone/brass bowls)
const REAL_FOOD_FALLBACKS: Record<string, string> = {
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

// Coarse stone-ground macro spice textures & authentic stone grinding
const TEXTURE_FALLBACKS: Record<string, string> = {
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

const DEFAULT_REAL_FOOD = '/products/kanda-lasun.jpg';

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  isMarathi = false,
  className = '',
  allowToggle = true,
  aspectRatio = 'card'
}) => {
  // Toggle between 'culinary' bowl presentation and 'texture' macro shot (both 100% non-text)
  const [viewMode, setViewMode] = useState<'culinary' | 'texture'>('culinary');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const activeSrc = viewMode === 'culinary' 
    ? (product.imageUrl || REAL_FOOD_FALLBACKS[product.id] || DEFAULT_REAL_FOOD)
    : (TEXTURE_FALLBACKS[product.id] || REAL_FOOD_FALLBACKS[product.id] || DEFAULT_REAL_FOOD);

  const getBadgeInfo = () => {
    switch (product.id) {
      case 'prod-kanda-lasun':
        return { emoji: '🧅', tag: isMarathi ? 'कोल्हापूरचे मुख्य वैशिष्ट्य' : 'Kolhapur Flagship Special', region: isMarathi ? 'कोल्हापूर' : 'Kolhapur' };
      case 'prod-shengdana-chutney':
        return { emoji: '🥜', tag: isMarathi ? 'सोलापुरी शेंगदाणा' : 'Solapuri Shenga', region: isMarathi ? 'सोलापूर' : 'Solapur' };
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
      case 'prod-metkut':
        return { emoji: '🥣', tag: isMarathi ? 'साजूक मेतकूट' : 'Heritage Metkut', region: isMarathi ? 'पुणे' : 'Pune' };
      case 'prod-ambyache-lonche':
        return { emoji: '🥭', tag: isMarathi ? 'आंब्याचे लोणचे' : 'Raw Mango Pickle', region: isMarathi ? 'कोकण' : 'Konkan' };
      case 'prod-limbache-lonche':
        return { emoji: '🍋', tag: isMarathi ? 'पाचक लिंबू लोणचे' : 'Digestive Lemon Pickle', region: isMarathi ? 'सातारा' : 'Satara' };
      case 'prod-panchamrut':
        return { emoji: '🪔', tag: isMarathi ? 'सणाचे पंचामृत' : 'Festive Panchamrut', region: isMarathi ? 'पश्चिम महाराष्ट्र' : 'W. Maharashtra' };
      case 'prod-hirvi-mirchi-lonche':
        return { emoji: '🌶️', tag: isMarathi ? 'मिरचीचे लोणचे' : 'Chilli Pickle', region: isMarathi ? 'खानदेश' : 'Khandesh' };
      default:
        return { emoji: '🏺', tag: isMarathi ? 'अस्सल गावरान' : 'Authentic Desi', region: product.regionOriginMr || 'महाराष्ट्र' };
    }
  };

  const badge = getBadgeInfo();

  return (
    <div className={`relative w-full h-full overflow-hidden bg-stone-900 select-none group ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/40 border-t-amber-500 animate-spin" />
        </div>
      )}

      {/* 100% Non-text Authentic Food Photograph */}
      <img
        key={activeSrc}
        src={activeSrc}
        alt={isMarathi ? product.nameMr : product.nameEn}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== DEFAULT_REAL_FOOD && !target.src.endsWith(DEFAULT_REAL_FOOD)) {
            target.src = DEFAULT_REAL_FOOD;
          }
        }}
        className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-106 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Subtle Gradient Shadow for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Top Left: Authentic Category label */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/95 backdrop-blur-md text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          <span>
            {product.id === 'prod-kanda-lasun'
              ? (isMarathi ? '★ कोल्हापूर फ्लॅगशिप' : '★ Kolhapur Flagship')
              : product.id === 'prod-kolhapuri-thecha'
              ? (isMarathi ? 'अस्सल ठेचा' : 'Fresh Thecha')
              : product.id === 'prod-metkut'
              ? (isMarathi ? 'अस्सल मेतकूट' : 'Heirloom Metkut')
              : product.category === 'pickle'
              ? (isMarathi ? 'पारंपरिक लोणचे' : 'Heritage Pickle')
              : product.category === 'masala'
              ? (isMarathi ? 'भाजलेला मसाला' : 'Roasted Masala')
              : (isMarathi ? 'कोरडी चटणी' : 'Chutney Powder')}
          </span>
        </span>
      </div>

      {/* Top Heritage Region Pill */}
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
          <MapPin className="w-2.5 h-2.5 text-amber-400" />
          <span>{badge.region}</span>
        </span>
      </div>

      {/* Toggle between Bowl Setting and Grain Texture (both non-text food photos) */}
      {allowToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLoaded(false);
            setViewMode(prev => prev === 'culinary' ? 'texture' : 'culinary');
          }}
          className="absolute bottom-2.5 right-3 z-20 px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-700/80 text-[10px] font-medium backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          {viewMode === 'culinary' ? (
            <>
              <Eye className="w-3 h-3 text-amber-400" />
              <span>{isMarathi ? 'मसाला पोत' : 'Spice Grain'}</span>
            </>
          ) : (
            <>
              <Camera className="w-3 h-3 text-amber-400" />
              <span>{isMarathi ? 'पारंपरिक वाटी' : 'Bowl Setting'}</span>
            </>
          )}
        </button>
      )}

      {/* Bottom Cultural Notes */}
      <div className="absolute bottom-2.5 left-3 z-10 flex items-center pointer-events-none text-white">
        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-extrabold flex items-center gap-1 border border-amber-400/30">
          <span>{badge.emoji}</span>
          <span className="truncate max-w-[130px] sm:max-w-[160px]">{badge.tag}</span>
        </span>
      </div>
    </div>
  );
};

