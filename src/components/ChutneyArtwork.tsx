import React from 'react';
import { Product } from '../types';

interface ChutneyArtworkProps {
  product: Product;
  isMarathi?: boolean;
  className?: string;
  showDetails?: boolean;
}

export const ChutneyArtwork: React.FC<ChutneyArtworkProps> = ({
  product,
  isMarathi = false,
  className = '',
  showDetails = true
}) => {
  const id = product.id;

  // Custom visual configurations per original Maharashtrian chutney product
  const getProductConfig = () => {
    switch (id) {
      case 'prod-kanda-lasun':
        return {
          primaryColor: '#991b1b', // Deep fiery Kolhapuri red
          secondaryColor: '#dc2626',
          granuleColor1: '#7f1d1d',
          granuleColor2: '#b91c1c',
          granuleColor3: '#fca5a5',
          oilSheen: '#f87171',
          jarChutneyGrad: ['#450a0a', '#991b1b', '#b91c1c', '#7f1d1d'],
          bgGradient: ['#1c0707', '#2e0a0a', '#140505'],
          glowColor: '#ef4444',
          labelMarathi: 'अस्सल कोल्हापुरी कांदा-लसूण चटणी',
          labelEn: 'KOLHAPURI KANDA-LASUN CHUTNEY',
          subLabelMr: 'कोल्हापूरचे मुख्य वैशिष्ट्य • अस्सल पारंपरिक पद्धत',
          subLabelEn: 'FLAGSHIP KOLHAPURI RECIPE • PURE & AUTHENTIC',
          badgeText: 'KOLHAPUR #1',
          heatLevel: '🌶️🌶️🌶️🌶️ (Fiery 4/5)',
          textureType: 'Coarse Hand-Pounded Powder',
          textureTypeMr: 'जाडसर खलबत्त्यातील मसाला',
          accentItem: 'chilli-garlic',
          spicePoints: [
            { cx: 280, cy: 300, r: 2.5, fill: '#fca5a5' },
            { cx: 310, cy: 290, r: 3, fill: '#fef08a' }, // garlic fleck
            { cx: 330, cy: 320, r: 2, fill: '#450a0a' }, // roasted onion
            { cx: 260, cy: 325, r: 3.5, fill: '#b91c1c' },
            { cx: 295, cy: 340, r: 2.8, fill: '#fef08a' },
            { cx: 345, cy: 295, r: 2, fill: '#f87171' },
            { cx: 270, cy: 285, r: 1.8, fill: '#fee2e2' },
          ]
        };

      case 'prod-shengdana-chutney':
        return {
          primaryColor: '#b45309', // Roasted peanut golden amber
          secondaryColor: '#d97706',
          granuleColor1: '#92400e',
          granuleColor2: '#f59e0b',
          granuleColor3: '#ef4444',
          oilSheen: '#fbbf24',
          jarChutneyGrad: ['#78350f', '#b45309', '#d97706', '#92400e'],
          bgGradient: ['#1f1406', '#2b1b08', '#120c04'],
          glowColor: '#f59e0b',
          labelMarathi: 'सोलापुरी खमंग शेंगदाणा चटणी',
          labelEn: 'SOLAPURI SHENGDANA CHUTNEY',
          subLabelMr: 'टपोरे शेंगदाणे व गावरान लसूण • जाडसर कुटलेली',
          subLabelEn: 'SLOW ROASTED PEANUTS & GARLIC • COARSE DRY POWDER',
          badgeText: 'SOLAPURI ORIGINAL',
          heatLevel: '🌶️🌶️🌶️ (Medium 3/5)',
          textureType: 'Crunchy Roasted Peanut Chunks',
          textureTypeMr: 'खमंग दाणेदार शेंगदाणा कूट',
          accentItem: 'peanuts',
          spicePoints: [
            { cx: 280, cy: 300, r: 4, fill: '#fef08a' }, // peanut chunk
            { cx: 315, cy: 295, r: 3.5, fill: '#fde047' },
            { cx: 335, cy: 325, r: 2.2, fill: '#dc2626' }, // chili speck
            { cx: 265, cy: 320, r: 4.5, fill: '#fef08a' },
            { cx: 298, cy: 340, r: 3, fill: '#b45309' },
            { cx: 340, cy: 300, r: 2, fill: '#ef4444' },
            { cx: 275, cy: 280, r: 3.5, fill: '#fef08a' },
          ]
        };

      case 'prod-kolhapuri-thecha':
        return {
          primaryColor: '#15803d', // Rustic fresh spicy green
          secondaryColor: '#22c55e',
          granuleColor1: '#166534',
          granuleColor2: '#4ade80',
          granuleColor3: '#fef08a',
          oilSheen: '#86efac',
          jarChutneyGrad: ['#14532d', '#15803d', '#16a34a', '#166534'],
          bgGradient: ['#051c0d', '#0b2b16', '#031208'],
          glowColor: '#22c55e',
          labelMarathi: 'अस्सल कोल्हापुरी लवंगी मिरची ठेचा',
          labelEn: 'KOLHAPURI GREEN CHILLI THECHA',
          subLabelMr: 'गावरान लवंगी मिरची व लसूण ठेचा',
          subLabelEn: 'TRADITIONAL RECIPE • DESI GARLIC & PEANUTS',
          badgeText: 'RUSTIC THECHA',
          heatLevel: '🌶️🌶️🌶️🌶️🌶️ (Super Fiery 5/5)',
          textureType: 'Coarse Mortar Crushed Mash',
          textureTypeMr: 'खलबत्त्यातील जाडसर ठेचा',
          accentItem: 'thecha-mortar',
          spicePoints: [
            { cx: 280, cy: 300, r: 3.5, fill: '#fef08a' }, // garlic bit
            { cx: 310, cy: 290, r: 2.8, fill: '#86efac' }, // chili seed
            { cx: 330, cy: 320, r: 3, fill: '#14532d' },
            { cx: 260, cy: 325, r: 4, fill: '#fef08a' }, // peanut piece
            { cx: 295, cy: 340, r: 2.5, fill: '#4ade80' },
            { cx: 345, cy: 295, r: 3, fill: '#166534' },
            { cx: 270, cy: 285, r: 2, fill: '#bbf7d0' },
          ]
        };

      case 'prod-vada-pav-coconut':
        return {
          primaryColor: '#ea580c', // Bright orange-red
          secondaryColor: '#f97316',
          granuleColor1: '#c2410c',
          granuleColor2: '#fb923c',
          granuleColor3: '#fffbeb',
          oilSheen: '#fdba74',
          jarChutneyGrad: ['#7c2d12', '#ea580c', '#f97316', '#c2410c'],
          bgGradient: ['#1c0c05', '#2c1409', '#120703'],
          glowColor: '#f97316',
          labelMarathi: 'वडापाव स्पेशल सुके खोबरे लसूण चटणी',
          labelEn: 'VADA PAV DRY COCONUT GARLIC CHUTNEY',
          subLabelMr: 'तळलेला लसूण व कुरकुरीत कोकणी खोबरे',
          subLabelEn: 'CRISPY TOASTED COPRA & FRIED GARLIC CRUMBLE',
          badgeText: 'MUMBAI ICON',
          heatLevel: '🌶️🌶️🌶️ (Medium-High 3.5/5)',
          textureType: 'Fluffy Crispy Coconut Flakes',
          textureTypeMr: 'कुरकुरीत खोबरे व लसूण भुरभुर',
          accentItem: 'coconut-flakes',
          spicePoints: [
            { cx: 280, cy: 300, r: 3, fill: '#fffbeb' }, // coconut shred
            { cx: 315, cy: 290, r: 3.8, fill: '#fed7aa' }, // fried garlic
            { cx: 335, cy: 320, r: 2.5, fill: '#ea580c' },
            { cx: 265, cy: 325, r: 3, fill: '#fffbeb' },
            { cx: 295, cy: 340, r: 2.2, fill: '#c2410c' },
            { cx: 340, cy: 295, r: 3.5, fill: '#fed7aa' },
            { cx: 275, cy: 285, r: 2.8, fill: '#ffedd5' },
          ]
        };

      case 'prod-til-chutney':
        return {
          primaryColor: '#ca8a04', // Warm sesame tan
          secondaryColor: '#eab308',
          granuleColor1: '#a16207',
          granuleColor2: '#fef08a',
          granuleColor3: '#b45309',
          oilSheen: '#fde047',
          jarChutneyGrad: ['#713f12', '#ca8a04', '#eab308', '#a16207'],
          bgGradient: ['#1a1405', '#292008', '#100c03'],
          glowColor: '#eab308',
          labelMarathi: 'गावरान तीळ लसूण चटणी',
          labelEn: 'GAVRAN TIL (SESAME) CHUTNEY',
          subLabelMr: 'नैसर्गिक कॅल्शियम युक्त • भाजलेला गावरान तीळ',
          subLabelEn: 'HIGH CALCIUM TOASTED SESAME & GARLIC POWDER',
          badgeText: 'SUPERFOOD',
          heatLevel: '🌶️🌶️ (Mild Warmth 2.5/5)',
          textureType: 'Nutty Sesame Seed Crumble',
          textureTypeMr: 'तीळ व जिऱ्याचे खमंग कूट',
          accentItem: 'sesame-seeds',
          spicePoints: [
            { cx: 280, cy: 300, r: 2, fill: '#fef08a' },
            { cx: 310, cy: 290, r: 2.5, fill: '#fef9c3' },
            { cx: 330, cy: 320, r: 1.8, fill: '#713f12' },
            { cx: 260, cy: 325, r: 2.2, fill: '#fef08a' },
            { cx: 295, cy: 340, r: 2, fill: '#ca8a04' },
            { cx: 345, cy: 295, r: 2.5, fill: '#fef9c3' },
            { cx: 270, cy: 285, r: 1.9, fill: '#eab308' },
          ]
        };

      case 'prod-javas-chutney':
        return {
          primaryColor: '#854d0e', // Earthy flaxseed bronze
          secondaryColor: '#a16207',
          granuleColor1: '#713f12',
          granuleColor2: '#ca8a04',
          granuleColor3: '#fef08a',
          oilSheen: '#d97706',
          jarChutneyGrad: ['#451a03', '#854d0e', '#a16207', '#713f12'],
          bgGradient: ['#170c04', '#261407', '#0f0702'],
          glowColor: '#d97706',
          labelMarathi: 'गावरान जवस (अळशी) चटणी',
          labelEn: 'ROASTED JAVAS (FLAXSEED) CHUTNEY',
          subLabelMr: 'ओमेगा-३ व फायबर युक्त • आरोग्यदायी कोरडी चटणी',
          subLabelEn: 'OMEGA-3 ROASTED FLAXSEED & CURRY LEAVES',
          badgeText: 'OMEGA-3',
          heatLevel: '🌶️🌶️ (Nutty Mild 2/5)',
          textureType: 'Glistening Flaxseed Powder',
          textureTypeMr: 'पौष्टिक जवस व कढीपत्ता पूड',
          accentItem: 'flax-seeds',
          spicePoints: [
            { cx: 280, cy: 300, r: 2.5, fill: '#ca8a04' },
            { cx: 310, cy: 290, r: 3, fill: '#713f12' },
            { cx: 330, cy: 320, r: 2.2, fill: '#a16207' },
            { cx: 260, cy: 325, r: 2.8, fill: '#ca8a04' },
            { cx: 295, cy: 340, r: 2, fill: '#451a03' },
            { cx: 345, cy: 295, r: 2.4, fill: '#ca8a04' },
            { cx: 270, cy: 285, r: 2.8, fill: '#ca8a04' },
          ]
        };

      case 'prod-karale-khurasani':
        return {
          primaryColor: '#292524', // Charcoal-brown Niger seed
          secondaryColor: '#44403c',
          granuleColor1: '#1c1917',
          granuleColor2: '#57534e',
          granuleColor3: '#a8a29e',
          oilSheen: '#78716c',
          jarChutneyGrad: ['#0c0a09', '#1c1917', '#292524', '#1c1917'],
          bgGradient: ['#0c0a09', '#171514', '#080707'],
          glowColor: '#78716c',
          labelMarathi: 'अस्सल कारळे (खुरासणी) चटणी',
          labelEn: 'KARALE / KHURASANI CHUTNEY',
          subLabelMr: 'खान्देशी व नाशिकची खास चव • गावरान खुरासणी',
          subLabelEn: 'DESI NIGER SEED & CUMIN RUSTIC CHUTNEY',
          badgeText: 'NASHIK SPECIAL',
          heatLevel: '🌶️🌶️🌶️ (Spicy Earthy 3/5)',
          textureType: 'Dark Aromatic Seed Granules',
          textureTypeMr: 'खमंग काळी खुरासणी पूड',
          accentItem: 'niger-seeds',
          spicePoints: [
            { cx: 280, cy: 300, r: 2, fill: '#a8a29e' },
            { cx: 310, cy: 290, r: 2.5, fill: '#57534e' },
            { cx: 330, cy: 320, r: 1.8, fill: '#1c1917' },
            { cx: 260, cy: 325, r: 2.2, fill: '#d6d3d1' },
            { cx: 295, cy: 340, r: 2, fill: '#44403c' },
            { cx: 345, cy: 295, r: 2.5, fill: '#a8a29e' },
            { cx: 270, cy: 285, r: 1.8, fill: '#57534e' },
          ]
        };

      case 'prod-kala-masala':
      default:
        return {
          primaryColor: '#3b2518', // Dark roasted Khandeshi spice
          secondaryColor: '#5a3824',
          granuleColor1: '#26170e',
          granuleColor2: '#78442a',
          granuleColor3: '#b45309',
          oilSheen: '#8c5033',
          jarChutneyGrad: ['#170e09', '#2b1b11', '#3b2518', '#26170e'],
          bgGradient: ['#120b07', '#1f130c', '#0a0604'],
          glowColor: '#b45309',
          labelMarathi: 'अस्सल खान्देशी काळा मसाला',
          labelEn: 'KHANDESHI ROASTED KALA MASALA',
          subLabelMr: '२४ खडे मसाले मंद आचेवर भाजून तयार',
          subLabelEn: '24 AROMATIC SPICES WOOD-ROASTED BLEND',
          badgeText: '24-SPICE GODA',
          heatLevel: '🌶️🌶️🌶️🌶️ (Robust Aromatic 4/5)',
          textureType: 'Fine Roasted Spice Powder',
          textureTypeMr: 'सुगंधी भाजलेला काळा मसाला',
          accentItem: 'star-anise',
          spicePoints: [
            { cx: 280, cy: 300, r: 2.2, fill: '#b45309' },
            { cx: 310, cy: 290, r: 2.5, fill: '#78442a' },
            { cx: 330, cy: 320, r: 1.8, fill: '#26170e' },
            { cx: 260, cy: 325, r: 2, fill: '#f59e0b' },
            { cx: 295, cy: 340, r: 2.8, fill: '#3b2518' },
            { cx: 345, cy: 295, r: 2.1, fill: '#d97706' },
            { cx: 270, cy: 285, r: 1.9, fill: '#78442a' },
          ]
        };
    }
  };

  const cfg = getProductConfig();

  return (
    <div className={`relative w-full h-full overflow-hidden bg-stone-950 select-none flex items-center justify-center ${className}`}>
      {/* High-Fidelity Handcrafted SVG Product Visual */}
      <svg
        viewBox="0 0 500 420"
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial Studio Spotlight */}
          <radialGradient id={`studio-spot-${id}`} cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor={cfg.bgGradient[1]} stopOpacity="1" />
            <stop offset="70%" stopColor={cfg.bgGradient[0]} stopOpacity="1" />
            <stop offset="100%" stopColor={cfg.bgGradient[2]} stopOpacity="1" />
          </radialGradient>

          {/* Wooden Slate / Stone Platform Gradient */}
          <linearGradient id={`platform-grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c221a" />
            <stop offset="30%" stopColor="#1a1410" />
            <stop offset="100%" stopColor="#0c0a08" />
          </linearGradient>

          {/* Glass Jar Body Gradient (Showing rich textured chutney inside) */}
          <linearGradient id={`jar-chutney-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={cfg.jarChutneyGrad[0]} />
            <stop offset="25%" stopColor={cfg.jarChutneyGrad[1]} />
            <stop offset="60%" stopColor={cfg.jarChutneyGrad[2]} />
            <stop offset="85%" stopColor={cfg.jarChutneyGrad[1]} />
            <stop offset="100%" stopColor={cfg.jarChutneyGrad[3]} />
          </linearGradient>

          {/* Gold / Brass Airtight Jar Lid Gradient */}
          <linearGradient id={`brass-lid-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="20%" stopColor="#d97706" />
            <stop offset="45%" stopColor="#fef08a" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Glass Specular Reflection Highlight */}
          <linearGradient id={`glass-reflection-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>

          {/* Authentic Chutney Mound Shadow */}
          <radialGradient id={`chutney-heap-glow-${id}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={cfg.secondaryColor} stopOpacity="0.9" />
            <stop offset="60%" stopColor={cfg.primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={cfg.granuleColor1} stopOpacity="1" />
          </radialGradient>

          {/* Stone Mortar / Bowl Gradient */}
          <linearGradient id={`mortar-bowl-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3f3f46" />
            <stop offset="40%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#18181b" />
          </linearGradient>

          {/* Soft Shadow Under Jar */}
          <radialGradient id={`shadow-ellipse-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Backdrop Studio Lighting */}
        <rect width="500" height="420" fill={`url(#studio-spot-${id})`} />

        {/* Ambient Warm Back-Glow */}
        <circle cx="200" cy="180" r="160" fill={cfg.glowColor} opacity="0.12" filter="blur(35px)" />

        {/* 2. Heavy Rustic Kitchen Slate Table / Surface */}
        <path d="M 0 280 Q 250 270 500 280 L 500 420 L 0 420 Z" fill={`url(#platform-grad-${id})`} />
        {/* Subtle wooden edge highlight */}
        <path d="M 0 280 Q 250 270 500 280" stroke="#523b2d" strokeWidth="2" fill="none" opacity="0.6" />

        {/* Cast Shadows Under Containers */}
        <ellipse cx="180" cy="330" rx="95" ry="24" fill={`url(#shadow-ellipse-${id})`} />
        <ellipse cx="330" cy="355" rx="110" ry="26" fill={`url(#shadow-ellipse-${id})`} />

        {/* ==================================================================== */}
        {/* 3. ARTISANAL MS MASALE GLASS JAR (Background Left) */}
        {/* ==================================================================== */}
        <g id="ms-masale-jar" transform="translate(100, 75)">
          {/* Jar Base Shape & Chutney Contents */}
          <rect
            x="15"
            y="70"
            width="140"
            height="175"
            rx="18"
            fill={`url(#jar-chutney-${id})`}
            stroke="#1c1917"
            strokeWidth="2"
          />

          {/* Interior Chutney Granule Flecks inside glass */}
          <g opacity="0.65">
            <circle cx="35" cy="100" r="2.5" fill={cfg.granuleColor3} />
            <circle cx="55" cy="85" r="1.8" fill={cfg.granuleColor2} />
            <circle cx="120" cy="95" r="3" fill={cfg.granuleColor3} />
            <circle cx="45" cy="205" r="2.8" fill={cfg.granuleColor3} />
            <circle cx="130" cy="190" r="2" fill={cfg.granuleColor2} />
            <circle cx="110" cy="220" r="3" fill={cfg.granuleColor3} />
            <circle cx="65" cy="230" r="2.2" fill={cfg.granuleColor2} />
          </g>

          {/* Glass Wall Reflections (Left & Right Highlights) */}
          <rect
            x="15"
            y="70"
            width="140"
            height="175"
            rx="18"
            fill={`url(#glass-reflection-${id})`}
            pointerEvents="none"
          />

          {/* Jar Shoulder & Neck Curve */}
          <path
            d="M 28 70 Q 40 45 60 42 L 110 42 Q 130 45 142 70 Z"
            fill={`url(#jar-chutney-${id})`}
            stroke="#000000"
            strokeWidth="1.5"
          />

          {/* Airtight Golden/Brass Cap with Embossed Ribbing */}
          <g id="jar-lid">
            <rect x="48" y="22" width="74" height="22" rx="4" fill={`url(#brass-lid-${id})`} stroke="#78350f" strokeWidth="1.5" />
            {/* Thread ribs on cap */}
            <line x1="56" y1="23" x2="56" y2="43" stroke="#92400e" strokeWidth="1.5" opacity="0.8" />
            <line x1="68" y1="23" x2="68" y2="43" stroke="#92400e" strokeWidth="1.5" opacity="0.8" />
            <line x1="80" y1="23" x2="80" y2="43" stroke="#92400e" strokeWidth="1.5" opacity="0.8" />
            <line x1="92" y1="23" x2="92" y2="43" stroke="#92400e" strokeWidth="1.5" opacity="0.8" />
            <line x1="104" y1="23" x2="104" y2="43" stroke="#92400e" strokeWidth="1.5" opacity="0.8" />
            {/* Top crown rim */}
            <ellipse cx="85" cy="23" rx="36" ry="6" fill={`url(#brass-lid-${id})`} stroke="#fef08a" strokeWidth="1" />
            <text x="85" y="25" textAnchor="middle" fill="#451a03" fontSize="5" fontWeight="900" letterSpacing="0.5">
              M.S. MASALE
            </text>
          </g>

          {/* ========================================================== */}
          {/* AUTHENTIC VINTAGE BRAND LABEL ON THE GLASS JAR */}
          {/* ========================================================== */}
          <g id="jar-label" transform="translate(23, 88)">
            {/* Parchment Label Background */}
            <rect x="0" y="0" width="124" height="102" rx="6" fill="#fdfbf7" stroke="#b45309" strokeWidth="1.5" />
            {/* Golden Ornamental Inner Border */}
            <rect x="3" y="3" width="118" height="96" rx="4" fill="none" stroke="#d97706" strokeWidth="0.75" strokeDasharray="3,1" />

            {/* Brand Header */}
            <text x="62" y="15" textAnchor="middle" fill="#78350f" fontSize="7.5" fontWeight="900" letterSpacing="1">
              ★ M.S. MASALE ★
            </text>
            <text x="62" y="23" textAnchor="middle" fill="#92400e" fontSize="5" fontWeight="700" letterSpacing="0.5">
              KOLHAPUR • MAHARASHTRA
            </text>

            {/* Subtle Divider */}
            <line x1="15" y1="27" x2="109" y2="27" stroke="#b45309" strokeWidth="0.8" />

            {/* Chutney Name in Marathi Devanagari */}
            <text x="62" y="40" textAnchor="middle" fill="#991b1b" fontSize="8" fontWeight="900">
              {cfg.labelMarathi.length > 22 ? cfg.labelMarathi.substring(0, 22) + '...' : cfg.labelMarathi}
            </text>

            {/* English Sub-Brand */}
            <text x="62" y="50" textAnchor="middle" fill="#1c1917" fontSize="5" fontWeight="800" letterSpacing="0.3">
              {cfg.labelEn.length > 24 ? cfg.labelEn.substring(0, 24) : cfg.labelEn}
            </text>

            {/* Heritage Seal Box */}
            <rect x="12" y="56" width="100" height="18" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.5" />
            <text x="62" y="65" textAnchor="middle" fill="#92400e" fontSize="4.5" fontWeight="800">
              100% PURE INGREDIENTS • NO PRESERVATIVES
            </text>
            <text x="62" y="71" textAnchor="middle" fill="#78350f" fontSize="4" fontWeight="700">
              {isMarathi ? 'अस्सल पारंपरिक पद्धत' : 'Authentic Desi Taste & Aroma'}
            </text>

            {/* Net Weight & Origin Badge */}
            <g transform="translate(10, 82)">
              <rect x="0" y="0" width="46" height="12" rx="2" fill="#78350f" />
              <text x="23" y="8.5" textAnchor="middle" fill="#fef08a" fontSize="5" fontWeight="900">
                NET: 500g
              </text>
            </g>
            <g transform="translate(68, 82)">
              <rect x="0" y="0" width="46" height="12" rx="2" fill="#991b1b" />
              <text x="23" y="8.5" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="800">
                {cfg.badgeText}
              </text>
            </g>
          </g>

          {/* Glass Jar Rim & Bottom Refraction Highlight */}
          <rect x="18" y="240" width="134" height="4" rx="2" fill="#ffffff" opacity="0.35" />
          <line x1="22" y1="80" x2="22" y2="235" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </g>

        {/* ==================================================================== */}
        {/* 4. FOREGROUND AUTHENTIC CHUTNEY BOWL / MORTAR WITH HEAPING POWDER */}
        {/* ==================================================================== */}
        <g id="chutney-bowl-and-powder" transform="translate(200, 180)">
          {/* Heavy Stone / Brass Mortar Katori Bowl */}
          <ellipse cx="120" cy="155" rx="105" ry="32" fill={`url(#mortar-bowl-${id})`} stroke="#52525b" strokeWidth="2.5" />
          {/* Bowl Rim */}
          <ellipse cx="120" cy="148" rx="98" ry="26" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />

          {/* Overflowing Heap of Fresh Coarse Chutney Powder */}
          <path
            d="M 30 148 Q 70 85 120 75 Q 170 85 210 148 Q 170 170 120 172 Q 65 170 30 148 Z"
            fill={`url(#chutney-heap-glow-${id})`}
          />

          {/* Coarse Texture / Granular Powder Surface Layer */}
          <g opacity="0.85">
            {/* Irregular granular clusters across the mound */}
            <circle cx="85" cy="130" r="4.5" fill={cfg.granuleColor1} />
            <circle cx="105" cy="115" r="5" fill={cfg.secondaryColor} />
            <circle cx="135" cy="110" r="6" fill={cfg.primaryColor} />
            <circle cx="160" cy="125" r="4" fill={cfg.granuleColor2} />
            <circle cx="120" cy="95" r="5" fill={cfg.oilSheen} />
            <circle cx="95" cy="145" r="4" fill={cfg.secondaryColor} />
            <circle cx="145" cy="142" r="5.5" fill={cfg.granuleColor1} />

            {/* Product-Specific Ingredients (Chilli bits, garlic cloves, peanuts, seeds) */}
            {cfg.spicePoints.map((pt, i) => (
              <circle key={i} cx={pt.cx - 200} cy={pt.cy - 180} r={pt.r} fill={pt.fill} />
            ))}

            {/* Extra rustic powder specks */}
            <circle cx="75" cy="120" r="2" fill="#ffffff" opacity="0.4" />
            <circle cx="125" cy="85" r="2.5" fill="#fef08a" opacity="0.6" />
            <circle cx="150" cy="100" r="2" fill="#ffffff" opacity="0.3" />
            <circle cx="170" cy="135" r="3" fill={cfg.granuleColor3} />
          </g>

          {/* Spilled Coarse Chutney on Wooden / Stone Slate Foreground */}
          <g opacity="0.75">
            <ellipse cx="50" cy="165" rx="20" ry="8" fill={cfg.primaryColor} />
            <ellipse cx="185" cy="170" rx="24" ry="9" fill={cfg.secondaryColor} />
            <circle cx="35" cy="168" r="3" fill={cfg.granuleColor3} />
            <circle cx="58" cy="163" r="2.5" fill={cfg.oilSheen} />
            <circle cx="195" cy="168" r="3" fill={cfg.granuleColor2} />
            <circle cx="175" cy="174" r="2.2" fill={cfg.granuleColor1} />
          </g>

          {/* Handcrafted Carved Wooden / Brass Tasting Spoon */}
          <g id="tasting-spoon" transform="translate(150, 60) rotate(28)">
            <ellipse cx="18" cy="12" rx="14" ry="20" fill="url(#brass-lid-default)" stroke="#78350f" strokeWidth="1.5" />
            <path d="M 16 32 L 20 110 L 16 110 L 12 32 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
            {/* Powder heaped in spoon */}
            <ellipse cx="18" cy="12" rx="10" ry="14" fill={cfg.primaryColor} />
            <circle cx="16" cy="10" r="2.5" fill={cfg.granuleColor3} />
            <circle cx="20" cy="14" r="2" fill={cfg.oilSheen} />
          </g>
        </g>

        {/* ==================================================================== */}
        {/* 5. AUTHENTIC RAW INGREDIENTS AROUND THE BASE */}
        {/* ==================================================================== */}
        <g id="raw-ingredients" transform="translate(0, 0)">
          {/* Whole Dried Kolhapuri Red Chilli (Curved Lavangi Chilli with green stem) */}
          <g id="red-chilli" transform="translate(60, 315) rotate(-15)">
            {/* Chilli Body */}
            <path
              d="M 20 15 Q 45 10 75 22 Q 85 28 95 42 Q 78 35 55 28 Q 30 24 20 15 Z"
              fill="#991b1b"
              stroke="#450a0a"
              strokeWidth="1.5"
            />
            {/* Chilli Highlights & Wrinkles */}
            <path d="M 30 18 Q 50 16 70 25" stroke="#f87171" strokeWidth="1.5" fill="none" opacity="0.7" />
            {/* Green Stem & Calyx */}
            <path d="M 12 12 Q 18 14 20 15 Q 16 19 12 16 Z" fill="#15803d" stroke="#14532d" strokeWidth="1" />
            <path d="M 12 12 Q 2 5 0 0" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>

          {/* Fresh Peeled Desi Garlic Cloves */}
          <g id="garlic-cloves" transform="translate(150, 345)">
            {/* Garlic 1 */}
            <path
              d="M 10 20 Q 5 10 15 5 Q 25 2 28 10 Q 30 22 20 24 Q 12 24 10 20 Z"
              fill="#fef9c3"
              stroke="#ca8a04"
              strokeWidth="1.2"
            />
            <path d="M 15 6 Q 18 14 18 22" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.8" />

            {/* Garlic 2 (Smaller, tilted) */}
            <path
              d="M 32 22 Q 28 14 36 8 Q 44 6 46 14 Q 48 24 38 25 Z"
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="1.2"
            />
          </g>

          {/* Special Accents per Product */}
          {cfg.accentItem === 'peanuts' && (
            <g id="roasted-peanuts" transform="translate(370, 340)">
              {/* Roasted Peanut Half 1 */}
              <ellipse cx="15" cy="12" rx="10" ry="6" fill="#fef08a" stroke="#b45309" strokeWidth="1.2" transform="rotate(-20 15 12)" />
              <ellipse cx="15" cy="12" rx="7" ry="3" fill="#fde047" opacity="0.6" transform="rotate(-20 15 12)" />
              {/* Roasted Peanut Half 2 */}
              <ellipse cx="32" cy="18" rx="9" ry="5" fill="#fef08a" stroke="#b45309" strokeWidth="1.2" transform="rotate(25 32 18)" />
            </g>
          )}

          {cfg.accentItem === 'thecha-mortar' && (
            <g id="green-chillies" transform="translate(360, 325)">
              <path
                d="M 10 25 Q 30 18 55 24 Q 65 30 75 42 Q 60 32 40 26 Z"
                fill="#15803d"
                stroke="#14532d"
                strokeWidth="1.5"
              />
              <path d="M 8 25 Q 0 20 2 12" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          )}

          {cfg.accentItem === 'coconut-flakes' && (
            <g id="coconut-flake" transform="translate(370, 340)">
              <path d="M 5 15 Q 15 5 30 10 Q 25 22 10 20 Z" fill="#fffbeb" stroke="#d97706" strokeWidth="1.2" />
              <path d="M 28 8 Q 38 12 36 24" stroke="#78350f" strokeWidth="2" fill="none" />
            </g>
          )}
        </g>

        {/* 6. Subtle Atmospheric Vignette */}
        <rect width="500" height="420" fill="none" stroke="#000000" strokeWidth="8" opacity="0.3" pointerEvents="none" />
      </svg>

      {/* Floating Informational Glass Overlays */}
      {showDetails && (
        <>
          {/* Top-Left Authentic Product Origin Stamp */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1">
            <span className="px-2.5 py-1 rounded-full bg-stone-900/90 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-black tracking-wider uppercase shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>{id === 'prod-kanda-lasun' ? '★ KOLHAPUR FLAGSHIP' : cfg.badgeText}</span>
            </span>
          </div>

          {/* Top-Right Authentic Texture & Heat Indicator */}
          <div className="absolute top-3 right-3 z-10 pointer-events-none flex flex-col items-end gap-1">
            <span className="px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold shadow-md">
              {cfg.heatLevel}
            </span>
          </div>

          {/* Bottom Bar: Texture Description */}
          <div className="absolute bottom-2.5 inset-x-3 z-10 pointer-events-none flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-stone-800/80 text-[11px] shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.primaryColor }} />
              <span className="font-semibold text-stone-200">
                {isMarathi ? cfg.textureTypeMr : cfg.textureType}
              </span>
            </div>
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
              {isMarathi ? '१००% अस्सल बरणी' : 'Artisanal Jar'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
