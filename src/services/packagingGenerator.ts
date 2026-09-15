export interface PackagingRequestParams {
  productName: string;
  productNameEn?: string;
  packagingType?: 'glass_jar' | 'standup_pouch' | 'earthen_pot' | 'flat_label';
  styleVariant?: 'traditional_heritage' | 'royal_maratha_gold' | 'rustic_artisan_kraft' | 'modern_minimalist_spices';
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9';
  brandName?: string;
  netWeight?: string;
  spiceLevel?: number;
  tagline?: string;
  ingredientsHighlight?: string;
}

export function buildImagenPackagingPrompt(params: PackagingRequestParams): string {
  const brand = params.brandName || 'MS Masale';
  const name = params.productName || 'गावरान चटणी';
  const nameEn = params.productNameEn || '';
  const netWt = params.netWeight || '250g';
  const spiceRating = params.spiceLevel ? `Spice Intensity: Level ${params.spiceLevel}/5` : 'Medium Spicy';

  let containerDesc = 'a premium hexagonal glass jar with a polished brushed-copper metal screw lid and tamper-evident gold seal';
  if (params.packagingType === 'standup_pouch') {
    containerDesc = 'a matte artisan kraft paper standup food pouch with a resealable zip lock and a subtle clear product window';
  } else if (params.packagingType === 'earthen_pot') {
    containerDesc = 'a traditional terracotta glazed earthen pot (handi) tied with rustic jute twine around the neck';
  } else if (params.packagingType === 'flat_label') {
    containerDesc = 'a flat, high-definition commercial product label wrap laid out for print packaging design';
  }

  let styleDesc = 'traditional royal heritage styling with deep maroon, saffron orange, and intricate metallic gold filigree borders';
  if (params.styleVariant === 'rustic_artisan_kraft') {
    styleDesc = 'rustic handmade artisan aesthetic with natural kraft tones, vintage stamp typography, and woodcut spice illustrations';
  } else if (params.styleVariant === 'modern_minimalist_spices') {
    styleDesc = 'clean contemporary gourmet export packaging, sleek modern sans-serif and Devanagari typography, clean whitespace';
  } else if (params.styleVariant === 'royal_maratha_gold') {
    styleDesc = 'regal aesthetics with gilded royal crests, traditional motifs, and rich embossed gold foil lettering';
  }

  return [
    `Commercial high-end product photograph of ${containerDesc}.`,
    `The package features an ultra-sharp, professionally printed front label.`,
    `On the front label, the exact product title "${name}" ${nameEn ? `("${nameEn}")` : ''} is rendered boldly in elegant, perfectly legible typography centered with crisp drop shadow.`,
    `At the top of the label is the prominent brand header: "${brand}".`,
    `Label details include: "${netWt}", "${spiceRating}", a "100% Stone-Ground In Khalbatta" circular badge, and a standard green vegetarian dot in a square mark.`,
    `Design aesthetic: ${styleDesc}.`,
    `Surroundings: set on a dark rustic teak-wood culinary tabletop, artfully surrounded by scattered whole raw spices: fiery red Byadagi dried chillies, toasted golden sesame seeds, garlic cloves, and a vintage black granite stone mortar and pestle in soft blurred background.`,
    `Lighting and finish: 8K resolution food photography, warm rim lighting, crisp studio reflections, photorealistic textures, zero artifacting, label-ready graphic mockup.`
  ].join(' ');
}

export function generateFallbackBrandedSvg(params: PackagingRequestParams): string {
  const brand = params.brandName || 'MS MASALE';
  const name = params.productName || 'शेंगदाणा चटणी';
  const nameEn = params.productNameEn || 'Gavran Stone-Ground Chutney';
  const netWt = params.netWeight || '250g Glass Jar';
  const tagline = params.tagline || 'पारंपरिक खलबत्त्यात कुटलेली चव';
  const spiceLevel = params.spiceLevel || 4;
  const pkgType = params.packagingType || 'glass_jar';

  const chillies = '🌶️'.repeat(Math.min(spiceLevel, 5));

  // Determine width/height based on aspect ratio
  let w = 800;
  let h = 800;
  if (params.aspectRatio === '3:4') { w = 600; h = 800; }
  else if (params.aspectRatio === '4:3') { w = 800; h = 600; }
  else if (params.aspectRatio === '16:9') { w = 960; h = 540; }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <!-- Background table gradient -->
    <radialGradient id="tableGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#3D2314"/>
      <stop offset="60%" stop-color="#1E1008"/>
      <stop offset="100%" stop-color="#0D0603"/>
    </radialGradient>

    <!-- Metallic Gold Foil Gradient -->
    <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFDF73"/>
      <stop offset="25%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#FFF3A8"/>
      <stop offset="75%" stop-color="#AA7C11"/>
      <stop offset="100%" stop-color="#FFDF73"/>
    </linearGradient>

    <!-- Copper Lid Gradient -->
    <linearGradient id="copperLid" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#73321A"/>
      <stop offset="20%" stop-color="#C86D48"/>
      <stop offset="45%" stop-color="#F29F79"/>
      <stop offset="60%" stop-color="#9C4423"/>
      <stop offset="85%" stop-color="#54210E"/>
      <stop offset="100%" stop-color="#2D1107"/>
    </linearGradient>

    <!-- Glass Jar Shading -->
    <linearGradient id="glassShade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="12%" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="88%" stop-color="rgba(0,0,0,0.2)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.2)"/>
    </linearGradient>

    <!-- Deep Royal Crimson Label Background -->
    <radialGradient id="labelBg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#801818"/>
      <stop offset="75%" stop-color="#4A0D0D"/>
      <stop offset="100%" stop-color="#2A0505"/>
    </radialGradient>

    <!-- Kraft Paper Gradient -->
    <linearGradient id="kraftBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D9A874"/>
      <stop offset="50%" stop-color="#C48E59"/>
      <stop offset="100%" stop-color="#A87341"/>
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.85"/>
    </filter>
    
    <filter id="labelShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Canvas Background: Rustic Kitchen Atmosphere -->
  <rect width="${w}" height="${h}" fill="url(#tableGlow)" />

  <!-- Atmospheric Light Beams & Wood Planks texture -->
  <path d="M 0 0 L ${w} 0 L ${w} 120 L 0 60 Z" fill="rgba(255,220,150,0.03)" />
  <ellipse cx="${w * 0.5}" cy="${h * 0.88}" rx="${w * 0.42}" ry="${h * 0.08}" fill="rgba(0,0,0,0.6)" filter="url(#dropShadow)" />

  <!-- Scattered rustic spice elements in soft focus -->
  <g opacity="0.35">
    <!-- Chillies -->
    <path d="M ${w * 0.15} ${h * 0.78} Q ${w * 0.22} ${h * 0.75} ${w * 0.26} ${h * 0.82} Q ${w * 0.20} ${h * 0.85} ${w * 0.15} ${h * 0.78}" fill="#C82819" />
    <path d="M ${w * 0.78} ${h * 0.75} Q ${w * 0.86} ${h * 0.73} ${w * 0.90} ${h * 0.81} Q ${w * 0.84} ${h * 0.83} ${w * 0.78} ${h * 0.75}" fill="#B51E10" />
    <!-- Garlic cloves -->
    <ellipse cx="${w * 0.22}" cy="${h * 0.84}" rx="14" ry="9" fill="#FFF2DF" transform="rotate(-15 ${w * 0.22} ${h * 0.84})" />
    <ellipse cx="${w * 0.76}" cy="${h * 0.82}" rx="16" ry="10" fill="#FCEBD2" transform="rotate(20 ${w * 0.76} ${h * 0.82})" />
    <!-- Peanuts / seeds -->
    <circle cx="${w * 0.18}" cy="${h * 0.86}" r="5" fill="#D99B66" />
    <circle cx="${w * 0.25}" cy="${h * 0.88}" r="4" fill="#C4824F" />
    <circle cx="${w * 0.81}" cy="${h * 0.86}" r="5.5" fill="#D99B66" />
    <circle cx="${w * 0.85}" cy="${h * 0.88}" r="4" fill="#C4824F" />
  </g>

  <!-- ================= CONTAINER RENDERING ================= -->
  ${pkgType === 'standup_pouch' ? `
    <!-- STANDUP POUCH -->
    <g filter="url(#dropShadow)">
      <!-- Pouch Body -->
      <path d="M ${w * 0.26} ${h * 0.18} 
               L ${w * 0.74} ${h * 0.18} 
               Q ${w * 0.73} ${h * 0.22} ${w * 0.76} ${h * 0.82} 
               Q ${w * 0.5} ${h * 0.87} ${w * 0.24} ${h * 0.82} 
               Q ${w * 0.27} ${h * 0.22} ${w * 0.26} ${h * 0.18} Z" 
            fill="url(#kraftBg)" stroke="#8C582B" stroke-width="3" />
      
      <!-- Sealed Top Strip with Hanging Hole -->
      <rect x="${w * 0.26}" y="${h * 0.18}" width="${w * 0.48}" height="${h * 0.05}" rx="3" fill="#8C582B" opacity="0.9" />
      <rect x="${w * 0.46}" y="${h * 0.195}" width="${w * 0.08}" height="8" rx="4" fill="#3D2314" />
      <line x1="${w * 0.26}" y1="${h * 0.23}" x2="${w * 0.74}" y2="${h * 0.23}" stroke="#5C3615" stroke-dasharray="3,3" stroke-width="2" />
    </g>
  ` : `
    <!-- PREMIUM GLASS JAR -->
    <g filter="url(#dropShadow)">
      <!-- Glass Jar Base Body with Spices Visible Inside -->
      <rect x="${w * 0.25}" y="${h * 0.24}" width="${w * 0.50}" height="${h * 0.58}" rx="24" fill="#6E1E14" />
      
      <!-- Spice Granules Texture Inside Jar -->
      <rect x="${w * 0.25}" y="${h * 0.24}" width="${w * 0.50}" height="${h * 0.58}" rx="24" fill="rgba(196, 60, 30, 0.4)" />
      
      <!-- Glass reflections & Specular highlights -->
      <rect x="${w * 0.25}" y="${h * 0.24}" width="${w * 0.50}" height="${h * 0.58}" rx="24" fill="url(#glassShade)" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
      <path d="M ${w * 0.28} ${h * 0.28} Q ${w * 0.29} ${h * 0.52} ${w * 0.28} ${h * 0.78}" stroke="rgba(255,255,255,0.4)" stroke-width="5" fill="none" stroke-linecap="round" />
      
      <!-- Metallic Copper Lid -->
      <g filter="url(#labelShadow)">
        <ellipse cx="${w * 0.5}" cy="${h * 0.22}" rx="${w * 0.23}" ry="${h * 0.038}" fill="url(#copperLid)" />
        <rect x="${w * 0.27}" y="${h * 0.17}" width="${w * 0.46}" height="${h * 0.06}" rx="10" fill="url(#copperLid)" stroke="#52200D" stroke-width="2" />
        <!-- Lid ridges -->
        <line x1="${w * 0.32}" y1="${h * 0.18}" x2="${w * 0.32}" y2="${h * 0.22}" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
        <line x1="${w * 0.38}" y1="${h * 0.18}" x2="${w * 0.38}" y2="${h * 0.22}" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
        <line x1="${w * 0.50}" y1="${h * 0.18}" x2="${w * 0.50}" y2="${h * 0.22}" stroke="rgba(255,255,255,0.6)" stroke-width="3"/>
        <line x1="${w * 0.62}" y1="${h * 0.18}" x2="${w * 0.62}" y2="${h * 0.22}" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
        <line x1="${w * 0.68}" y1="${h * 0.18}" x2="${w * 0.68}" y2="${h * 0.22}" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
        <!-- Golden Tamper Seal -->
        <rect x="${w * 0.46}" y="${h * 0.21}" width="${w * 0.08}" height="${h * 0.07}" rx="4" fill="url(#goldFoil)" />
        <text x="${w * 0.5}" y="${h * 0.25}" fill="#3D2314" font-size="9" font-weight="900" text-anchor="middle" font-family="sans-serif">SEALED</text>
      </g>
    </g>
  `}

  <!-- ================= FRONT BRANDED PACKAGING LABEL ================= -->
  <g filter="url(#labelShadow)">
    <!-- Label Main Outer Card -->
    <rect x="${w * 0.28}" y="${h * 0.32}" width="${w * 0.44}" height="${h * 0.45}" rx="14" fill="url(#labelBg)" stroke="url(#goldFoil)" stroke-width="3.5" />

    <!-- Inner Golden Filigree Border -->
    <rect x="${w * 0.295}" y="${h * 0.335}" width="${w * 0.41}" height="${h * 0.42}" rx="10" fill="none" stroke="url(#goldFoil)" stroke-width="1.2" stroke-dasharray="8,4" />

    <!-- Top Arch Banner: Brand Name -->
    <path d="M ${w * 0.32} ${h * 0.39} Q ${w * 0.5} ${h * 0.365} ${w * 0.68} ${h * 0.39}" fill="none" id="brandArc" />
    
    <text x="${w * 0.5}" y="${h * 0.372}" text-anchor="middle" fill="url(#goldFoil)" font-size="${Math.max(13, w * 0.02)}" font-weight="900" font-family="'Cinzel', 'Noto Serif Devanagari', serif" letter-spacing="3">
      ★ ${brand} ★
    </text>

    <text x="${w * 0.5}" y="${h * 0.398}" text-anchor="middle" fill="#FFD8A8" font-size="${Math.max(10, w * 0.013)}" font-weight="600" font-family="'Noto Sans Devanagari', sans-serif">
      ${tagline}
    </text>

    <!-- Golden Divider with Sunburst Motif -->
    <line x1="${w * 0.34}" y1="${h * 0.415}" x2="${w * 0.45}" y2="${h * 0.415}" stroke="url(#goldFoil)" stroke-width="1.5" />
    <circle cx="${w * 0.5}" cy="${h * 0.415}" r="5" fill="url(#goldFoil)" />
    <line x1="${w * 0.55}" y1="${h * 0.415}" x2="${w * 0.66}" y2="${h * 0.415}" stroke="url(#goldFoil)" stroke-width="1.5" />

    <!-- ================= SPECIFIC PRODUCT TITLE (CENTRAL FOCUS) ================= -->
    <rect x="${w * 0.305}" y="${h * 0.435}" width="${w * 0.39}" height="${h * 0.13}" rx="8" fill="#1C0505" stroke="url(#goldFoil)" stroke-width="1.5" />
    
    <!-- Marathi Main Title -->
    <text x="${w * 0.5}" y="${h * 0.495}" text-anchor="middle" fill="#FFFFFF" font-size="${name.length > 20 ? Math.max(16, w * 0.024) : Math.max(20, w * 0.032)}" font-weight="900" font-family="'Noto Serif Devanagari', serif">
      ${name}
    </text>

    <!-- English / Secondary Sub-Title -->
    <text x="${w * 0.5}" y="${h * 0.535}" text-anchor="middle" fill="url(#goldFoil)" font-size="${Math.max(10, w * 0.014)}" font-weight="800" font-family="'Cinzel', sans-serif" letter-spacing="1">
      ${nameEn.slice(0, 36)}
    </text>

    <!-- ================= PURITY STAMPS & BADGES ================= -->
    <!-- Left Seal: 100% Gavran -->
    <g transform="translate(${w * 0.315}, ${h * 0.59})">
      <circle cx="20" cy="20" r="19" fill="#2E0A0A" stroke="url(#goldFoil)" stroke-width="1.5" />
      <text x="20" y="15" text-anchor="middle" fill="url(#goldFoil)" font-size="7" font-weight="900">100%</text>
      <text x="20" y="24" text-anchor="middle" fill="#FFF" font-size="6.5" font-weight="bold">खलबत्ता</text>
      <text x="20" y="31" text-anchor="middle" fill="#FFC98A" font-size="5.5">कुटलेली</text>
    </g>

    <!-- Center Badge: Spice meter -->
    <g transform="translate(${w * 0.43}, ${h * 0.59})">
      <rect x="0" y="5" width="${w * 0.14}" height="28" rx="6" fill="#3D0B0B" stroke="#A82819" stroke-width="1.5" />
      <text x="${w * 0.07}" y="17" text-anchor="middle" fill="#FFA38A" font-size="8" font-weight="bold">SPICE METER</text>
      <text x="${w * 0.07}" y="28" text-anchor="middle" font-size="10">${chillies}</text>
    </g>

    <!-- Right Seal: Pure Vegetarian Mark -->
    <g transform="translate(${w * 0.615}, ${h * 0.59})">
      <rect x="4" y="4" width="30" height="30" rx="3" fill="#FFFFFF" stroke="#0D7324" stroke-width="2" />
      <circle cx="19" cy="19" r="8" fill="#0D7324" />
    </g>

    <!-- ================= BOTTOM STRIP: NET WEIGHT & STATUTORY ================= -->
    <rect x="${w * 0.295}" y="${h * 0.69}" width="${w * 0.41}" height="${h * 0.055}" rx="5" fill="#140303" />
    
    <text x="${w * 0.32}" y="${h * 0.725}" fill="#FFDF73" font-size="${Math.max(9, w * 0.013)}" font-weight="800" font-family="sans-serif">
      NET WT: ${netWt}
    </text>

    <text x="${w * 0.68}" y="${h * 0.725}" text-anchor="end" fill="#E8D5C4" font-size="${Math.max(8.5, w * 0.011)}" font-family="monospace">
      PURE &amp; NATURAL • FSSAI CERTIFIED
    </text>
  </g>

  <!-- High-Tech Imagen Label Generation Indicator -->
  <g transform="translate(${w * 0.04}, ${h * 0.04})">
    <rect x="0" y="0" width="220" height="42" rx="10" fill="rgba(0,0,0,0.75)" stroke="url(#goldFoil)" stroke-width="1.5" />
    <circle cx="20" cy="21" r="7" fill="#10B981" />
    <circle cx="20" cy="21" r="11" fill="none" stroke="#10B981" stroke-width="1.5" opacity="0.6"/>
    <text x="36" y="18" fill="#FFFFFF" font-size="11" font-weight="800" font-family="sans-serif">AI IMAGEN WORKFLOW</text>
    <text x="36" y="32" fill="#FFDF73" font-size="9.5" font-family="sans-serif">Label-Ready Packaging Design</text>
  </g>
</svg>
`;

  return `data:image/svg+xml;charset=utf-8;base64,${Buffer.from(svg).toString('base64')}`;
}
