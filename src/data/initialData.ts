import { Product, ProductCategory, BaseIngredientOption, SpiceLevelOption, GarlicOption, SaltOption, OilOption, RawIngredientStock, Order } from '../types';

export const BASE_INGREDIENTS: BaseIngredientOption[] = [
  {
    id: 'peanuts',
    nameMr: 'भाजलेले शेंगदाणे',
    nameEn: 'Roasted Peanuts',
    marathiScript: 'शेंगदाणे',
    descriptionMr: 'सोलापूरची गावरान चव, खरपूस भाजलेले आणि खमंग खुसखुशीत',
    descriptionEn: 'Crispy slow-roasted Solapuri peanuts rich in protein and crunchy bite',
    color: '#D97706',
    patternColor: '#B45309',
    pricePer100g: 35,
    iconName: 'Nut',
    aromaNotes: 'खमंग, खरपूस व पौष्टिक'
  },
  {
    id: 'dryCoconut',
    nameMr: 'सुके खोबरे',
    nameEn: 'Dry Copra / Coconut',
    marathiScript: 'खोबरे',
    descriptionMr: 'कोकणातील दर्जेदार सुके खोबरे, मंद आचेवर भाजलेले',
    descriptionEn: 'Konkan-origin sun-dried roasted coconut flakes for authentic texture',
    color: '#D4A373',
    patternColor: '#A98467',
    pricePer100g: 45,
    iconName: 'CircleDot',
    aromaNotes: 'गोडसर सुगंध व क्रिस्पी पोत'
  },
  {
    id: 'sesameSeeds',
    nameMr: 'गावरान तीळ',
    nameEn: 'Roasted Sesame Seeds',
    marathiScript: 'तीळ',
    descriptionMr: 'कॅल्शियमयुक्त गावठी तीळ, मंद आचेवर फुटूस्तवर भाजलेले',
    descriptionEn: 'High-calcium organic sesame seeds roasted until nutty pop',
    color: '#E9D8A6',
    patternColor: '#D3B87D',
    pricePer100g: 40,
    iconName: 'Sparkles',
    aromaNotes: 'पारंपरिक चव आणि हाडांच्या आरोग्यासाठी उत्तम'
  },
  {
    id: 'flaxseed',
    nameMr: 'भाजलेले जवस',
    nameEn: 'Roasted Flaxseed',
    marathiScript: 'जवस',
    descriptionMr: 'ओमेगा-३ युक्त निरोगी जवस, हृदयासाठी अमृततुल्य',
    descriptionEn: 'Omega-3 power-packed roasted flaxseeds for digestion and cardiac health',
    color: '#8C5242',
    patternColor: '#5C3826',
    pricePer100g: 38,
    iconName: 'HeartPulse',
    aromaNotes: 'सुदृढ आरोग्यासाठी खास अस्सल गावठी जवस'
  },
  {
    id: 'redChilliBase',
    nameMr: 'खास लवंगी / बेडगी तिखट बेस',
    nameEn: 'Pure Bedgi & Lavangi Chilli Base',
    marathiScript: 'लाल तिखट बेस',
    descriptionMr: 'गावरान लाल मिरचीची खरी धगधगती चव व नैसर्गिक गडद लाल रंग',
    descriptionEn: 'Authentic stone-crushed Maharashtrian whole chillies with natural color',
    color: '#DC2626',
    patternColor: '#991B1B',
    pricePer100g: 50,
    iconName: 'Flame',
    aromaNotes: 'गावरान तिखटपणा आणि सुरेख लाल रंग'
  }
];

export const SPICE_LEVELS: SpiceLevelOption[] = [
  {
    level: 1,
    labelMr: 'कमी तिखट (साजूक व गोडसर)',
    labelEn: 'Mild (Gentle & Aromatic)',
    scovilleDescMr: 'लहान मुलांसाठी व सौम्य चव आवडणाऱ्यांसाठी',
    scovilleDescEn: 'Delicate spice with focus on roasted aroma and natural sweetness',
    color: '#10B981',
    flameCount: 1
  },
  {
    level: 2,
    labelMr: 'गावरान मध्यम (रोजच्या जेवणासाठी)',
    labelEn: 'Medium (Balanced Classic)',
    scovilleDescMr: 'भाकरी व पोळीसोबत उत्तम समतोल',
    scovilleDescEn: 'Perfect daily balance for Bhakri, Chapati, and Rice',
    color: '#F59E0B',
    flameCount: 2
  },
  {
    level: 3,
    labelMr: 'मसालेदार झणझणीत',
    labelEn: 'Spicy (Punchy & Bold)',
    scovilleDescMr: 'खऱ्या चोखंदळ खवय्यांची पहिली पसंती',
    scovilleDescEn: 'Zesty kick with stone-crushed chilli heat',
    color: '#F97316',
    flameCount: 3
  },
  {
    level: 4,
    labelMr: 'कोल्हापुरी लवंगी ठसका',
    labelEn: 'Kolhapuri Fiery (Extra Hot)',
    scovilleDescMr: 'जिभेवर ठसका देणारी कोल्हापुरी गावरान मिरची',
    scovilleDescEn: 'Real Kolhapuri spicy kick that opens up all senses',
    color: '#EF4444',
    flameCount: 4
  },
  {
    level: 5,
    labelMr: 'अस्सल गावरान अंगार (Extreme Hot)',
    labelEn: 'Gavran Angar (Extreme)',
    scovilleDescMr: 'तांबडा-पांढरा रस्सा प्रेमींसाठी खास जळजळीत चव',
    scovilleDescEn: 'Pure fire made with raw sun-dried Lavangi and Sankeshwari',
    color: '#991B1B',
    flameCount: 5
  }
];

export const GARLIC_OPTIONS: GarlicOption[] = [
  {
    id: 'none',
    labelMr: 'लसूण विरहित (जैन / उपवास स्पेशल)',
    labelEn: 'No Garlic (Jain/Satvik Style)',
    extraPrice: 0,
    descMr: 'शुद्ध सात्विक चव',
    descEn: 'Garlic-free formulation'
  },
  {
    id: 'low',
    labelMr: 'हलका लसूण (Light Garlic)',
    labelEn: 'Mild Garlic',
    extraPrice: 10,
    descMr: 'मंद सुवास देणारा लसूण',
    descEn: 'Subtle hint of roasted garlic'
  },
  {
    id: 'medium',
    labelMr: 'गावरान भाजलेला लसूण (Classic Gavran)',
    labelEn: 'Classic Roasted Garlic',
    extraPrice: 20,
    descMr: 'अस्सल गावरान खमंग लसणाचा स्वाद',
    descEn: 'Traditional ratio of golden roasted cloves'
  },
  {
    id: 'extra',
    labelMr: 'एक्स्ट्रा गावरान लसूण प्रेमी',
    labelEn: 'Extra Desi Garlic Heavy',
    extraPrice: 35,
    descMr: 'दुप्पट खमंग लसूण, वडापाव चटणी स्टाईल',
    descEn: 'Double portion of hand-peeled roasted desi garlic'
  }
];

export const SALT_OPTIONS: SaltOption[] = [
  {
    id: 'regular',
    labelMr: 'अस्सल शुद्ध मीठ',
    labelEn: 'Pure Sea Salt',
    extraPrice: 0,
    descMr: 'नेहमीचे संतुलित मीठ',
    descEn: 'Balanced natural mineral salt'
  },
  {
    id: 'sendhav',
    labelMr: 'गुलाबी सेंधव मीठ (Rock Salt)',
    labelEn: 'Himalayan Pink Rock Salt (Sendhav)',
    extraPrice: 15,
    descMr: 'पचनासाठी हलके व आरोग्यदायी',
    descEn: 'Rich in 84+ trace minerals, gut-friendly'
  },
  {
    id: 'low_salt',
    labelMr: 'कमी मीठ (Low Sodium Special)',
    labelEn: 'Low Sodium Special',
    extraPrice: 10,
    descMr: 'बीपी व आरोग्य जपणाऱ्यांसाठी',
    descEn: 'Designed for blood-pressure conscious diets'
  }
];

export const OIL_OPTIONS: OilOption[] = [
  {
    id: 'none',
    labelMr: 'ड्राय पावडर (Dry Coarse Powder)',
    labelEn: 'Dry Powder (Long Shelf Life)',
    extraPrice: 0,
    descMr: 'अधिक दिवस टिकणारी कोरडी चटणी',
    descEn: 'Zero added oil, longest pantry stability'
  },
  {
    id: 'groundnut_cold_pressed',
    labelMr: 'लाकडी घाण्याचे अस्सल शेंगदाणा तेल',
    labelEn: 'Wood-Pressed Groundnut Oil Drizzle',
    extraPrice: 25,
    descMr: 'पारंपरिक पद्धतीने मुरवलेली ओली चटणी',
    descEn: 'Infused with authentic wooden ghani kacchi ghani oil'
  },
  {
    id: 'extra_drizzle',
    labelMr: 'खमंग फोडणी व एक्स्ट्रा तेल ड्रिझल',
    labelEn: 'Tadka Infused Extra Oil',
    extraPrice: 40,
    descMr: 'भाकरीवर चोळून खाण्यासाठी उत्तम',
    descEn: 'Tempered with mustard and curry leaf aroma'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-kanda-lasun',
    nameMr: 'अस्सल कोल्हापुरी कांदा-लसूण चटणी व मसाला (मुख्य वैशिष्ट्य #1)',
    nameEn: 'Authentic Kolhapuri Kanda-Lasun Chutney & Masala (Flagship #1)',
    taglineMr: 'कोल्हापूरची जगप्रसिद्ध अस्सल कांदा-लसूण चटणी • लवंगी मिरची व भाजलेला कांदा',
    taglineEn: "Kolhapur's legendary flagship roasted onion, garlic & fiery chilli chutney",
    descriptionMr: 'कोल्हापूरची अस्सल शान! मंद आचेवर भाजलेला कांदा, गावरान लसूण आणि कोल्हापूरची लवंगी मिरची एकत्र खलबत्त्यात कुटून तयार केलेली ही जगप्रसिद्ध कांदा-लसूण चटणी. रस्सा, सुक्का, मिसळ किंवा गरम भाकरीसोबत खाण्यासाठी कोल्हापूरचे मुख्य वैशिष्ट्य.',
    descriptionEn: "The undisputed crown jewel of Kolhapur. Slow-caramelized onions, hand-peeled desi garlic, and sun-cured fiery Kolhapuri Lavangi chillies stone-pounded into a fragrant, rich crimson dry chutney. An absolute must-have for authentic Kolhapuri Misal, curries, or straight on hot Bhakri.",
    category: 'chutney',
    spiceLevel: 4,
    badgeMr: 'कोल्हापूरची मुख्य शान (Flagship #1)',
    badgeEn: "Kolhapur's #1 Flagship Chutney",
    rating: 4.98,
    reviewCount: 780,
    imageUrl: '/products/kanda-lasun.jpg',
    ingredientsMr: ['गावरान भाजलेला कांदा', 'रानटी लसूण', 'कोल्हापुरी लवंगी व बेडगी मिरची', 'लाकडी घाण्याचे तेल', 'खडे मीठ', 'धने-जिरे'],
    ingredientsEn: ['Roasted Gavran Onion', 'Desi Garlic Cloves', 'Kolhapuri Lavangi & Bedgi Chillies', 'Wood-Pressed Oil', 'Sea Salt', 'Coriander & Cumin'],
    pairingRecommendationsMr: ['ज्वारीची किंवा बाजरीची गरम भाकरी', 'झणझणीत मिसळ', 'पिठलं-भात', 'सुक्के मटण / चिकन'],
    pairingRecommendationsEn: ['Hot Jowar/Bajra Bhakri', 'Kolhapuri Misal', 'Pithla Bhaat', 'Sukka Gravy Accompaniment'],
    whereToUseMr: [
      'मटण रस्सा, चिकन सुक्का किंवा अंडा करी बनवताना फोडणीत १-२ चमचे घालून अस्सल कोल्हापुरी तर्री आणा.',
      'झणझणीत पिठलं (झुणका) आणि शेव भाजीसाठी मुख्य मसाला म्हणून वापरा.',
      'कडक भाकरी आणि गोड दह्यासोबत थेट तोंडी लावण्यासाठी वापरा.',
      'मिसळचा कट (तर्री) बनवताना उत्कृष्ट लाल रंग आणि झणझणीतपणासाठी.'
    ],
    whereToUseEn: [
      'Add 1-2 tablespoons while tempering curry gravies (Mutton Rassa, Chicken Sukka, or Egg Curry) for authentic Kolhapuri aroma.',
      'Essential base seasoning for rustic Maharashtrian Pithla (Zunka) and Shev Bhaji.',
      'Serve raw alongside hot Bhakri and fresh curd as a spicy palate enhancer.',
      'Incorporate into Kolhapuri Misal Kat (spicy gravy) for unmatched depth and color.'
    ],
    hygienePrecautionsMr: [
      'नैसर्गिकरीत्या सुकवलेल्या अस्सल मिरच्या: कोणत्याही रासायनिक प्रक्रियेविना सूर्यप्रकाशात वाळवलेल्या बेडगी व लवंगी मिरच्या.',
      'लाकडी घाण्याचे अस्सल तेल: फोडणी व भाजणीसाठी केवळ शुद्ध लाकडी घाण्याचे तेल वापरले जाते.',
      'स्वच्छतेची कठोर त्रिसूत्री: लसूण व कांदा हाताने निवडून, स्वच्छ धुवून व वाळवूनच खलबत्त्यात कुटला जातो.',
      'प्रयोगशाळेत प्रमाणित (Lab Tested): ओलावा व सूक्ष्मजीव तपासणी करूनच ग्राहकांपर्यंत पोहोचवले जाते.'
    ],
    hygienePrecautionsEn: [
      'Naturally Sun-Dried Chillies: Raw Bedgi & Lavangi peppers naturally cured under direct sunlight without sulfur treatment.',
      'Pure Cold-Pressed Oil: Roasted solely using unadulterated cold-pressed groundnut oil.',
      'Hand-Inspected & Sorted: Each clove of garlic and bulb of onion is cleaned and sorted manually before processing.',
      'Lab Certified Quality: Thorough microbial and moisture testing conducted for every fresh batch.'
    ],
    storageTipsMr: 'कोरड्या जागी हवाबंद बरणीत ठेवा. पाण्याचा थेंबही लागू देऊ नका. ९ महिने उत्तम टिकते.',
    storageTipsEn: 'Store in an airtight jar in a cool place. Avoid moisture contact. Best before 9 months.',
    hsnCode: '21039090',
    nutritionFacts: {
      calories: '185 kcal / 100g',
      protein: '6.4g',
      healthyFats: '8.2g',
      fiber: '7.1g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 165, originalPrice: 195, inStock: true },
      { size: '500g', grams: 500, price: 310, originalPrice: 380, inStock: true },
      { size: '1kg', grams: 1000, price: 590, originalPrice: 740, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'कोल्हापूर',
    regionOriginEn: 'Kolhapur'
  },
  {
    id: 'prod-shengdana-chutney',
    nameMr: 'सोलापुरी शेंगदाणा आणि लसणाची सुकी चटणी (Shenga Chutney)',
    nameEn: 'Solapuri Shengdana ani Lasanachi Sukki Chutney (Peanut Garlic Dry Chutney)',
    taglineMr: 'सोलापूरची जगप्रसिद्ध खमंग शेंगदाणा कोरडी चटणी, जाडसर कुटलेली',
    taglineEn: 'Classic stone-pounded coarse roasted peanut dry chutney with garlic',
    descriptionMr: 'सोलापूरचे नाव निघाले की डोळ्यासमोर येते ती म्हणजे खमंग शेंगदाणा चटणी. स्थानिक शेतकऱ्यांकडून घेतलेले टपोरे शेंगदाणे लाकडी चुलीवर मंद आचेवर भाजून खलबत्त्यात कुटून तयार केली जाते. लाल मिरची, खडे मीठ आणि गावरान लसूण यांचा अचूक समतोल.',
    descriptionEn: 'The undisputed pride of Solapur condiments. Jumbo peanuts slow-roasted over wood embers and coarsely pounded in stone mortars with raw garlic, sea salt, and fiery Bedgi red chilli flakes. Zero added water or cooked food filler—pure dry chutney.',
    category: 'chutney',
    spiceLevel: 3,
    badgeMr: 'सोलापूरची अस्सल ओळख',
    badgeEn: 'Original Solapuri Taste',
    rating: 4.95,
    reviewCount: 512,
    imageUrl: '/products/shengdana-peanuts.jpg',
    ingredientsMr: ['सोलापुरी टपोरे शेंगदाणे', 'गावरान लसूण', 'बेडगी व संकेश्वरी मिरची', 'कच्चे शेंगदाणा तेल', 'मीठ'],
    ingredientsEn: ['Solapuri Jumbo Peanuts', 'Desi Garlic', 'Bedgi & Sankeshwari Chilli', 'Cold-Pressed Groundnut Oil', 'Salt'],
    pairingRecommendationsMr: ['सोलापुरी कडक भाकरी', 'दही-पोहे', 'उपमा', 'तूप-वरण-भात', 'थालीपीठ लोणी'],
    pairingRecommendationsEn: ['Solapuri Crisp Kadak Bhakri', 'Dahi Poha', 'Upma', 'Varan Bhaat with Pure Ghee', 'Thalipeeth with Makkhan'],
    whereToUseMr: [
      'गरमागरम ज्वारीच्या किंवा बाजरीच्या भाकरीवर १ चमचा चटणी व त्यावर लाकडी घाण्याचे कच्चे शेंगदाणा तेल ओतून खा.',
      'सकाळच्या कांदे पोहे, उपमा किंवा शिऱ्यावर भुरभुरवून खमंग चव वाढवा.',
      'वरण-भातावर साजूक तूप आणि १ चमचा शेंगदाणा चटणी घालून आस्वाद घ्या.',
      'गरम थालीपीठासोबत घरचे लोणी आणि ही चटणी अप्रतिम लागते.',
      'सँडविच किंवा टोस्टवर बटरसोबत स्प्रिंकल करून युनिक देसी फ्लेवर मिळवा.'
    ],
    whereToUseEn: [
      'Sprinkle generously on hot Jowar or Bajra Bhakri with a drizzle of cold-pressed groundnut oil.',
      'Dust over morning Poha, Upma, or Khichdi for an instant crunch and garlic warmth.',
      'Spoon over steaming Varan Bhaat (Dal Rice) along with melted Desi Cow Ghee.',
      'Serve as an indispensable side with Maharashtrian Thalipeeth and white butter.',
      'Use as a zesty dry seasoning for butter toasts, wraps, and rolls.'
    ],
    hygienePrecautionsMr: [
      '१००% शून्य प्रिझर्व्हेटिव्ह: आम्ही कोणत्याही प्रकारचे कृत्रिम प्रिझर्व्हेटिव्ह (उदा. Sodium Benzoate) किंवा कृत्रिम रंग वापरत नाही.',
      'दगडी खलबत्ता कुटाई: मंद वेगाने कुटल्यामुळे घर्षण उष्णता निर्माण होत नाही, ज्यामुळे शेंगदाण्यातील नैसर्गिक तेल व जीवनसत्त्वे सुरक्षित राहतात.',
      'अन्न-दर्जा निर्जंतुक काचेची बरणी: काचेच्या एअरटाइट जारमध्ये पॅक केल्याने प्लास्टिक रसायनांचा कोणताही धोका नसतो व कुरकुरीतपणा टिकून राहतो.',
      'हात न लावता स्वयंचलित पॅकिंग: सर्व बॅचेस उच्च स्वच्छता मानके पाळून आणि एफएसएसएआय (FSSAI) नियमावलीनुसार तयार केल्या जातात.'
    ],
    hygienePrecautionsEn: [
      'Zero Chemical Preservatives: 100% free from sodium benzoate, artificial food colorings, or synthetic flavor enhancers.',
      'Low-RPM Cold Stone Pounding: Milled slowly in stone mortars to eliminate heat buildup and retain wholesome natural plant oils.',
      'Sanitized Glass Heritage Jars: Packaged in food-grade airtight glass containers preventing any plastic chemical leaching.',
      'FSSAI Certified & Touchless Packing: Strict batch-tested hygiene protocols followed from farm harvest to hermetic seal.'
    ],
    storageTipsMr: 'नेहमी कोरड्या चमच्याने वापरा. थेट सूर्यप्रकाशापासून दूर थंड व कोरड्या जागी ठेवा. ६ महिने ताजी राहते.',
    storageTipsEn: 'Always use a dry spoon. Store in a cool, dry place away from direct sunlight. Shelf life: 6 months.',
    hsnCode: '21039090',
    nutritionFacts: {
      calories: '280 kcal / 100g',
      protein: '11.5g',
      healthyFats: '21.0g',
      fiber: '5.8g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 150, originalPrice: 180, inStock: true },
      { size: '500g', grams: 500, price: 280, originalPrice: 340, inStock: true },
      { size: '1kg', grams: 1000, price: 540, originalPrice: 660, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'सोलापूर',
    regionOriginEn: 'Solapur'
  },
  {
    id: 'prod-vada-pav-coconut',
    nameMr: 'सुके खोबरे आणि लसूण चटणी (वडापाव स्पेशल कोरडी लाल चटणी)',
    nameEn: 'Sukhe Khobare ani Lasun Chutney (Vada Pav Red Coconut Garlic Chutney)',
    taglineMr: 'मुंबई-पुण्याच्या वडापावची तीच खमंग आणि कुरकुरीत लाल कोरडी चटणी',
    taglineEn: 'Crispy roasted coconut & golden garlic red dry chutney powder',
    descriptionMr: 'प्रत्येक वडापाव प्रेमीचे स्वप्न! दर्जेदार कोकणी सुके खोबरे आणि भाजलेला लसूण मंद आचेवर तळून, त्यात अस्सल काश्मिरी-बेडगी मिरचीचा रंग व तिखटपणा मिळवून बनवलेली ही कुरकुरीत चटणी.',
    descriptionEn: 'The legendary secret behind Maharashtra’s world-famous dry condiment. Golden-toasted Konkani copra shreds, roasted garlic flakes, and vibrant Bedgi chilli blended into a crispy, aromatic powder.',
    category: 'chutney',
    spiceLevel: 3,
    badgeMr: '१००% अस्सल वडापाव लाल चटणी',
    badgeEn: 'Iconic Red Chutney',
    rating: 4.8,
    reviewCount: 289,
    imageUrl: '/products/vada-pav-lasun.jpg',
    ingredientsMr: ['कोकणी सुके खोबरे', 'भाजलेला लसूण', 'बेडगी लाल मिरची', 'सेंधव मीठ', 'हिंग'],
    ingredientsEn: ['Dried Coconut Copra', 'Crisp Fried Garlic', 'Bedgi Red Chilli Powder', 'Rock Salt', 'Asafoetida'],
    pairingRecommendationsMr: ['गरमागरम वडा पाव', 'समोसा', 'कांदा भजी', 'तूप-भात', 'थालीपीठ'],
    pairingRecommendationsEn: ['Steaming Hot Vada Pav', 'Samosa & Kanda Bhaji', 'Ghee Rice', 'Crispy Thalipeeth'],
    whereToUseMr: [
      'घरी बनवलेल्या वडापावच्या पावामध्ये भरपूर भरून अस्सल मुंबई स्ट्रीट स्टाईल चव मिळवा.',
      'गरमागरम बटाटा भजी, कांदा भजी व समोसा सोबत क्रिस्पी डीप म्हणून सर्व्ह करा.',
      'ब्रेड रोल्स, कटलेट व फ्रँकी रोलमध्ये स्प्रिंकल करा.',
      'गरम साध्या भातावर थोडे तूप आणि ही खोबरे-लसूण चटणी खाऊन बघा.'
    ],
    whereToUseEn: [
      'Stuff generously inside hot Pav alongside Vada for that unmistakable Mumbai street-corner magic.',
      'Serve as a crispy crunchy dry dip with piping hot onion pakoras (Bhajiya) and samosas.',
      'Dust over frankies, wraps, toasties, and cutlets.',
      'Mix with plain hot steamed rice and melted butter for a quick gourmet treat.'
    ],
    hygienePrecautionsMr: [
      'कोकणी वाळवलेले खोबरे: जुने किंवा रासायनिक गंध असलेले खोबरे कधीही न वापरता फक्त ताजे कोकणी खोबरे वापरले जाते.',
      'कमी तापमानावर भाजणी: खोबरे करपू न देता मंद आचेवर सोनेरी भाजल्याने नैसर्गिक चव टिकते.',
      'हवाबंद पॅकिंग: ओलावा व हवा आत जाऊ नये यासाठी व्हॅक्यूम सीलबंद बरणी वापरली जाते.'
    ],
    hygienePrecautionsEn: [
      'Premium Konkan Copra: Only select, sweet-smelling dry coconut kernels used without sulfur treatment.',
      'Slow Low-Heat Toasting: Toasted gently to golden perfection without burning delicate coconut fats.',
      'Moisture-Lock Seal: Vacuum hermetic jars prevent rancidity and ensure months of crisp aroma.'
    ],
    storageTipsMr: 'बरणीचे झाकण घट्ट बंद ठेवा. सूर्यप्रकाशापासून दूर कोरड्या जागी ठेवा. ६ महिने कुरकुरीत राहते.',
    storageTipsEn: 'Keep lid tightly closed. Store away from heat and direct sunlight. 6 months shelf life.',
    hsnCode: '21039090',
    nutritionFacts: {
      calories: '240 kcal / 100g',
      protein: '5.2g',
      healthyFats: '16.8g',
      fiber: '8.4g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 175, originalPrice: 210, inStock: true },
      { size: '500g', grams: 500, price: 330, originalPrice: 400, inStock: true },
      { size: '1kg', grams: 1000, price: 620, originalPrice: 780, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'कोकण व मुंबई',
    regionOriginEn: 'Konkan & Mumbai'
  },
  {
    id: 'prod-til-chutney',
    nameMr: 'महाराष्ट्रीयन खमंग तीळ-कूट चटणी (कॅल्शियमयुक्त गावरान तीळ)',
    nameEn: 'Maharashtrian Tilachi Chutney / Til-Koot (Roasted Sesame Seed Chutney)',
    taglineMr: 'गावठी तीळ आणि लसणाची मंद सुवासिक व पौष्टिक कोरडी चटणी',
    taglineEn: 'Naturally calcium-rich unpolished sesame seeds with mild garlic spice',
    descriptionMr: 'गावठी गावरान पांढरे व तपकिरी तीळ मंद विस्तवावर भाजून, त्यात जिरे आणि लसूण घालून पाट्यावर वाटल्यासारखी तयार केलेली तिळाची चटणी. हिवाळ्यात व वर्षभर शरीराला उष्णता व ताकद देणारी पारंपरिक रेसिपी.',
    descriptionEn: 'Slow-roasted unpolished desi sesame seeds pounded with cumin and mild garlic into a nutty dry chutney powder. Rich in natural calcium, magnesium, and dietary fiber.',
    category: 'chutney',
    spiceLevel: 2,
    badgeMr: 'हाडांसाठी कॅल्शियमचा खजिना',
    badgeEn: 'High Calcium Superfood',
    rating: 4.9,
    reviewCount: 198,
    imageUrl: '/products/til-sesame.jpg',
    ingredientsMr: ['गावरान तीळ', 'लसूण पाकळ्या', 'भाजलेले जिरे', 'लाल तिखट', 'सेंधव मीठ'],
    ingredientsEn: ['Desi Roasted Sesame Seeds', 'Garlic Cloves', 'Roasted Cumin', 'Mild Red Chilli', 'Sendhav Salt'],
    pairingRecommendationsMr: ['बाजरीची भाकरी व लोणी', 'पोहे', 'उकडपेंडी', 'दडपे पोहे', 'वरण-भात'],
    pairingRecommendationsEn: ['Bajra Bhakri with Homemade Butter', 'Kanda Poha', 'Ukadpendi', 'Dadpe Pohe', 'Varan Bhaat'],
    whereToUseMr: [
      'बाजरीच्या कडक किंवा मऊ भाकरीवर साजूक तूप किंवा लोण्यासोबत १ चमचा तिळाची चटणी खा.',
      'दडपे पोहे, कांदे पोहे किंवा उपम्यावर वरून भुरभुरवून पोषकता व खमंगपणा वाढवा.',
      'मुलांच्या डब्यामध्ये चपातीवर थोडे तूप आणि तिळाची चटणी रोल करून द्या.'
    ],
    whereToUseEn: [
      'Enjoy with hot Bajra Bhakri and fresh homemade white butter for a classic Maharashtrian breakfast.',
      'Sprinkle over Dadpe Poha, Kanda Poha, or Upma for natural crunch and bone-strengthening calcium.',
      'Spread on Ghee Chapati and roll up for a wholesome school tiffin snack.'
    ],
    hygienePrecautionsMr: [
      'गावरान न पॉलिश केलेले तीळ: केमिकलने धुतलेले चकचकीत तीळ न वापरता थेट शेतकऱ्यांचे गावरान तीळ वापरले जातात.',
      'दगडी खलबत्त्यात कुटाई: तिळाचे तेल वेगळे न होता कोरडा व खमंग पोत टिकतो.',
      'शून्य प्रिझर्व्हेटिव्ह व खडे मीठ: आरोग्यदायी सेंधव मिठाचा समतोल वापर.'
    ],
    hygienePrecautionsEn: [
      'Unpolished Desi Sesame: Sourced directly from local farmers without chemical bleaching or polish.',
      'Stone Pounded: Maintains intact cellular nutrients without turning excessively oily.',
      'Pure Himalayan Rock Salt: Prepared with natural mineral-rich rock salt.'
    ],
    storageTipsMr: 'थंड व कोरड्या जागी ठेवा. ६ महिने टिकते.',
    storageTipsEn: 'Store in a cool and dry pantry. Best for 6 months.',
    hsnCode: '21039090',
    nutritionFacts: {
      calories: '265 kcal / 100g',
      protein: '8.8g',
      healthyFats: '19.2g',
      fiber: '6.5g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 155, originalPrice: 185, inStock: true },
      { size: '500g', grams: 500, price: 290, originalPrice: 350, inStock: true },
      { size: '1kg', grams: 1000, price: 550, originalPrice: 680, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: true,
    regionOriginMr: 'मराठवाडा व विदर्भ',
    regionOriginEn: 'Marathwada & Vidarbha'
  },
  {
    id: 'prod-javas-chutney',
    nameMr: 'अस्सल गावरान जवस चटणी (ओमेगा-३ युक्त पारंपरिक चव)',
    nameEn: 'Maharashtrian Jawas Chutney (Roasted Flaxseed Superfood Chutney)',
    taglineMr: 'हृदयाच्या व केसांच्या आरोग्यासाठी अत्यंत गुणकारी गावरान कोरडी चटणी',
    taglineEn: 'Cardio-protective Omega-3 rich flaxseed dry chutney roasted to perfection',
    descriptionMr: 'जवस शरीरासाठी किती फायदेशीर आहे हे आपल्या आजी-आजोबांना चांगलेच ठाऊक होते. आम्ही गावरान जवस तडतडेपर्यंत भाजून त्यात लसूण व तिखट घालून ही चविष्ट व आरोग्यदायी कोरडी चटणी तयार केली आहे.',
    descriptionEn: 'Harnessing the age-old Maharashtrian wisdom of flaxseed nutrition. Rich in Alpha-Linolenic Acid (Omega-3), lignans, and soluble fiber. Pounded with garlic and mild red spice.',
    category: 'chutney',
    spiceLevel: 2,
    badgeMr: 'ओमेगा-३ & हृदय स्वास्थ्य',
    badgeEn: 'Heart-Healthy Omega-3',
    rating: 4.85,
    reviewCount: 215,
    imageUrl: '/products/javas-flaxseed.jpg',
    ingredientsMr: ['गावरान जवस', 'भाजलेला लसूण', 'कढीपत्ता', 'लाल मिरची पूड', 'सेंधव मीठ'],
    ingredientsEn: ['Roasted Flaxseed', 'Garlic Cloves', 'Curry Leaves', 'Red Chilli Powder', 'Rock Salt'],
    pairingRecommendationsMr: ['गरम भाकरी व कच्चे शेंगदाणा तेल', 'गव्हाची पोळी', 'मुगाची खिचडी', 'दही-भात'],
    pairingRecommendationsEn: ['Hot Bhakri with Raw Groundnut Oil', 'Wholewheat Roti', 'Moong Dal Khichdi', 'Curd Rice'],
    whereToUseMr: [
      'दररोज जेवणात १ चमचा जवस चटणी भाकरी किंवा चपातीसोबत खाऊन कोलेस्ट्रॉल व हृदयाचे आरोग्य सुधारा.',
      'सकाळच्या दलिया, ओट्स किंवा खिचडीमध्ये मिसळून न्यूट्रिशन वाढवा.',
      'दही-भातामध्ये वरून टाकून खमंग चवीचा आनंद घ्या.'
    ],
    whereToUseEn: [
      'Take 1 tablespoon daily with Bhakri or Roti to support healthy lipid profiles and heart wellness.',
      'Mix into morning porridge, oats, or khichdi for an omega-3 powerhouse boost.',
      'Stir into curd rice or salads for rustic nutty seasoning.'
    ],
    hygienePrecautionsMr: [
      '१००% गावरान देशी जवस: काळजीपूर्वक निवडून खडे व धूळ विरहित केलेले बियाणे.',
      'कमी उष्णतेवर भाजणी: ओमेगा-३ फॅटी ऍसिड नष्ट न होता पूर्ण पोषकता टिकून राहते.'
    ],
    hygienePrecautionsEn: [
      'Triple Cleaned Flaxseeds: Manually sorted to remove any dust or impurities.',
      'Low Temperature Roasting: Preserves vulnerable ALA Omega-3 fatty chains.'
    ],
    storageTipsMr: 'कोरड्या बरणीत ठेवा. ६ महिने उत्तम टिकते.',
    storageTipsEn: 'Store airtight in cool place. Best for 6 months.',
    hsnCode: '21039090',
    nutritionFacts: {
      calories: '235 kcal / 100g',
      protein: '9.2g',
      healthyFats: '17.5g (Rich in Omega-3)',
      fiber: '11.2g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 160, originalPrice: 190, inStock: true },
      { size: '500g', grams: 500, price: 300, originalPrice: 360, inStock: true },
      { size: '1kg', grams: 1000, price: 570, originalPrice: 700, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: true,
    regionOriginMr: 'पश्चिम महाराष्ट्र',
    regionOriginEn: 'Western Maharashtra'
  },
  {
    id: 'prod-kolhapuri-thecha',
    nameMr: 'अस्सल कोल्हापुरी हिरवी मिरची-लसूण ठेचा / खर्डा (Mirchi Thecha)',
    nameEn: 'Authentic Kolhapuri Hirvi Mirchi Thecha (Green Chilli & Garlic Kharda)',
    taglineMr: 'खलबत्त्यात कुटलेली गावरान हिरवी लवंगी मिरची आणि कच्चा लसूण',
    taglineEn: 'Traditional stone-pounded fiery green chilli & garlic rustic thecha',
    descriptionMr: 'कोल्हापूर आणि खान्देशची जान असलेला हा अस्सल गावरान ठेचा. तव्यावर हलक्या तेलात भाजलेली लवंगी हिरवी मिरची, शेंगदाणे, लसूण आणि खडे मीठ खलबत्त्यात जाडसर कुटून तयार केला जातो.',
    descriptionEn: 'The fiery soul of rustic Maharashtra. Fresh spicy green chillies, unpeeled pungent garlic, roasted peanuts, and crystal sea salt stone-pounded in traditional iron or stone mortars.',
    category: 'chutney',
    spiceLevel: 5,
    badgeMr: 'अस्सल कोल्हापुरी ठसका',
    badgeEn: 'Fiery Rustic Thecha',
    rating: 4.96,
    reviewCount: 420,
    imageUrl: '/products/thecha-green.jpg',
    ingredientsMr: ['गावठी हिरवी लवंगी मिरची', 'रानटी लसूण', 'भाजलेले शेंगदाणे', 'खडे मीठ', 'लाकडी घाण्याचे तेल'],
    ingredientsEn: ['Gavran Green Lavangi Chillies', 'Pungent Garlic', 'Roasted Peanuts', 'Sea Salt', 'Wood-Pressed Groundnut Oil'],
    pairingRecommendationsMr: ['बाजरीची कडक भाकरी', 'पिठलं', 'दही-भात', 'वरण-भात'],
    pairingRecommendationsEn: ['Bajra Bhakri', 'Pithla', 'Curd Rice', 'Varan Bhaat'],
    whereToUseMr: [
      'गरमागरम बाजरीची किंवा ज्वारीची भाकरी आणि पिठल्यासोबत हा ठेचा तोंडी लावा.',
      'दही-भातासोबत खाल्ल्यास ठेच्याचा ठसका आणि दह्याचा गारवा मनाला तृप्त करतो.',
      'सुख्या भाज्यांमध्ये किंवा उसळीमध्ये १ चमचा ठेचा टाकून झणझणीत चव आणा.'
    ],
    whereToUseEn: [
      'The quintessential companion to hot Bajra Bhakri and rustic Pithla.',
      'Pair with curd rice to create an exhilarating contrast between fiery spice and cool yoghurt.',
      'Stir into stir-fried veggies or sprout curries for a jolt of green chilli zest.'
    ],
    hygienePrecautionsMr: [
      'ताजी शेतातील हिरवी लवंगी मिरची: थेट शेतातून तोडलेली ताजी मिरची वापरली जाते.',
      'लाकडी घाण्याचे शुद्ध तेल: हलक्या भाजणीसाठी कोणतेही पामतेल किंवा रिफाइन्ड तेल वापरले जात नाही.'
    ],
    hygienePrecautionsEn: [
      'Farm-Fresh Lavangi Peppers: Harvested directly from partner growers in Kolhapur.',
      'Cold-Pressed Oil Only: Prepared without any refined oils or artificial vinegar.'
    ],
    storageTipsMr: 'उघडल्यानंतर फ्रीजमध्ये ठेवल्यास १ महिना ताजेपणा टिकून राहतो. कोरडा चमचा वापरा.',
    storageTipsEn: 'Refrigerate after opening to preserve green vibrancy. Use a dry spoon. 1-2 months.',
    hsnCode: '21039090',
    nutritionFacts: {
      calories: '160 kcal / 100g',
      protein: '4.8g',
      healthyFats: '9.2g',
      fiber: '6.0g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 170, originalPrice: 200, inStock: true },
      { size: '500g', grams: 500, price: 320, originalPrice: 390, inStock: true },
      { size: '1kg', grams: 1000, price: 600, originalPrice: 750, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'कोल्हापूर & खान्देश',
    regionOriginEn: 'Kolhapur & Khandesh'
  },
  {
    id: 'prod-karale-khurasani',
    nameMr: 'खानदेशी गावरान कारळे / खुरासणी चटणी (Khurasani Chutney)',
    nameEn: 'Khandeshi Karale / Khurasani Chutney (Roasted Niger Seed Chutney)',
    taglineMr: 'मराठवाडा व नाशिकची प्रसिद्ध पौष्टिक व खमंग काळी चटणी',
    taglineEn: 'Traditional Marathwada roasted niger seed dry chutney powder',
    descriptionMr: 'खुरासणी (कारळे) ही मराठवाडा व नाशिक भागातील अत्यंत लोकप्रिय व पारंपरिक बियाणे आहे. मंद आचेवर खरपूस भाजून लसूण, जिरे व लाल तिखटासोबत कुटलेली ही चटणी भाकरीसोबत खाताना अप्रतिम लागते.',
    descriptionEn: 'A cherished regional specialty from Marathwada and Nashik. High in iron and healthy plant fats, unpolished niger seeds are roasted until fragrant and pounded with roasted garlic and Bedgi chilli.',
    category: 'chutney',
    spiceLevel: 3,
    badgeMr: 'पारंपरिक खान्देशी चव',
    badgeEn: 'Regional Specialty',
    rating: 4.88,
    reviewCount: 176,
    imageUrl: '/products/karale-niger.jpg',
    ingredientsMr: ['गावरान खुरासणी (कारळे)', 'भाजलेला लसूण', 'लाल तिखट', 'जिरे', 'सेंधव मीठ'],
    ingredientsEn: ['Desi Niger Seeds (Khurasani)', 'Roasted Garlic', 'Red Chilli Powder', 'Cumin', 'Rock Salt'],
    pairingRecommendationsMr: ['ज्वारीची भाकरी व कच्चे तेल', 'दही-पोहे', 'थालीपीठ', 'भातावर तूप व चटणी'],
    pairingRecommendationsEn: ['Jowar Bhakri with Raw Oil', 'Dahi Poha', 'Thalipeeth', 'Steamed Rice with Ghee'],
    whereToUseMr: [
      'ज्वारीच्या भाकरीवर १ चमचा कारळे चटणी व कच्चे गोडेतेल घालून अस्सल खान्देशी जेवणाचा आनंद घ्या.',
      'दही-पोहे आणि थालीपीठासोबत तोंडी लावण्यासाठी.',
      'लोह (Iron) वाढवण्यासाठी रोजच्या जेवणात १ चमचा समाविष्ट करा.'
    ],
    whereToUseEn: [
      'Sprinkle on hot Jowar Bhakri with unheated sweet groundnut oil.',
      'Ideal dry chutney accompaniment for Dahi Poha and Thalipeeth.',
      'Naturally high in dietary iron and minerals for daily wellness.'
    ],
    hygienePrecautionsMr: [
      'गावरान अस्सल कारळे बिया: माती व खडे विरहित स्वच्छ केलेली अस्सल बियाणे.',
      'शून्य प्रिझर्व्हेटिव्ह: कोणतीही रसायने न वापरता नैसर्गिक पद्धतीने तयार.'
    ],
    hygienePrecautionsEn: [
      'Triple-Filtered Niger Seeds: Completely free from foreign grit or stones.',
      'Zero Additives: Pure roasted seeds, garlic, and natural spices.'
    ],
    storageTipsMr: 'थंड व कोरड्या जागी ठेवा. ६ महिने टिकते.',
    storageTipsEn: 'Store in dry airtight glass jar. 6 months shelf life.',
    hsnCode: '21039090',
    nutritionFacts: {
      calories: '250 kcal / 100g',
      protein: '8.1g',
      healthyFats: '18.4g',
      fiber: '9.0g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 165, originalPrice: 195, inStock: true },
      { size: '500g', grams: 500, price: 310, originalPrice: 380, inStock: true },
      { size: '1kg', grams: 1000, price: 580, originalPrice: 720, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: true,
    regionOriginMr: 'नाशिक व मराठवाडा',
    regionOriginEn: 'Nashik & Marathwada'
  },
  {
    id: 'prod-kala-masala',
    nameMr: 'पारंपरिक महाराष्ट्रीयन काळा / गोडा मसाला (२४ अस्सल खडे मसाले)',
    nameEn: 'Traditional Maharashtrian Goda / Kala Masala (24 Artisan Spices)',
    taglineMr: 'दगडफूल, दालचिनी व भाजलेल्या खोबऱ्याचा सुगंधित पारंपरिक मसाला',
    taglineEn: 'Heritage wood-roasted black spice blend for authentic Maharashtrian curries',
    descriptionMr: '२४ अस्सल सुगंधी खडे मसाले, दगडफूल, नागकेशर, आणि खोबरे लोखंडी कढईत मंद आचेवर भाजून तयार केलेला हा काळा मसाला. शेव भाजी, उसळ, मटण रस्सा आणि वांग्याच्या भरताला अस्सल गावरान चव देतो.',
    descriptionEn: 'The crown jewel of traditional Maharashtrian cooking. 24 whole spices including Stone Flower (Dagad Phool), Cobra Saffron (Nagkeshar), and dry copra slow-roasted in iron woks into a dark aromatic spice blend.',
    category: 'masala',
    spiceLevel: 3,
    badgeMr: '२४ औषधी खडे मसाले',
    badgeEn: '24 Artisan Spices',
    rating: 4.9,
    reviewCount: 164,
    imageUrl: '/products/kala-masala.jpg',
    ingredientsMr: ['धने', 'दगडफूल', 'दालचिनी', 'लवंग', 'वेलदोडे', 'तीळ', 'खोबरे', 'नागकेशर', 'तमालपत्र', 'जिरे', 'हळकुंड'],
    ingredientsEn: ['Coriander', 'Stone Flower', 'Cassia Bark', 'Cloves', 'Cardamom', 'Sesame', 'Copra', 'Nagkeshar', 'Bay Leaves', 'Cumin'],
    pairingRecommendationsMr: ['भरली वांगी (Khandeshi Baingan)', 'तर्री उसळ', 'काळा मटण / चिकन रस्सा', 'कट वडा'],
    pairingRecommendationsEn: ['Stuffed Brinjal (Bharli Vangi)', 'Kolhapuri Usal', 'Kala Rassa', 'Kat Vada'],
    whereToUseMr: [
      'भरली वांगी, शेव भाजी, मटकी उसळ व चणा उसळ बनवताना १-२ चमचे काळा मसाला घाला.',
      'अस्सल गावरान काळा मटण किंवा चिकन रस्सा तयार करण्यासाठी मुख्य घटक.',
      'वांग्याचे भरीत, बटाट्याची सुकी भाजी व आमटीला सुवासिक चव देण्यासाठी.'
    ],
    whereToUseEn: [
      'Use 1-2 teaspoons for Bharli Vangi (Stuffed Eggplant), Khandeshi Shev Bhaji, and sprout curries.',
      'The authentic heart of Maharashtrian Black Curry (Kala Mutton / Kala Chicken Rassa).',
      'Adds rich dark aroma to Aamti, Dal, and vegetable stir fries.'
    ],
    hygienePrecautionsMr: [
      '२४ अस्सल औषधी मसाले: कोणतेही भेसळयुक्त घटक न वापरता शुद्ध खडे मसाले वापरले जातात.',
      'लोखंडी कढईत मंद भाजणी: खडे मसाल्यांचा सुगंध व तेल जळून न जाता परिपूर्ण काळा रंग येतो.'
    ],
    hygienePrecautionsEn: [
      '24 Whole Aromatic Spices: Stone Flower, Nagkeshar, and organic condiments without synthetic fillers.',
      'Traditional Iron Wok Roasting: Roasted in heavy iron woks to yield signature deep umami complexity.'
    ],
    storageTipsMr: 'हवाबंद काचेच्या बरणीत ठेवा. १२ महिने सुवास टिकून राहतो.',
    storageTipsEn: 'Store in airtight glass container. Maintains freshness for 12 months.',
    hsnCode: '09109929',
    nutritionFacts: {
      calories: '190 kcal / 100g',
      protein: '7.1g',
      healthyFats: '9.4g',
      fiber: '14.2g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 195, originalPrice: 240, inStock: true },
      { size: '500g', grams: 500, price: 370, originalPrice: 450, inStock: true },
      { size: '1kg', grams: 1000, price: 710, originalPrice: 880, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: true,
    regionOriginMr: 'नाशिक व खान्देश',
    regionOriginEn: 'Nashik & Khandesh'
  },
  {
    id: 'prod-metkut',
    nameMr: 'पारंपरिक महाराष्ट्रीयन साजूक मेतकूट (पौष्टिक पाचक कूट)',
    nameEn: 'Traditional Maharashtrian Metkut (Heritage Roasted Dal & Spiced Digestive Powder)',
    taglineMr: 'गरम भात, साजूक तूप आणि मेतकूट • आजोळची अस्सल चव आणि पचनास उत्तम',
    taglineEn: 'Heirloom roasted multi-dal, whole grain & warm spice comfort powder for hot steamed rice and ghee',
    descriptionMr: 'महाराष्ट्राच्या प्रत्येक सुगरण आजीची समृद्ध परंपरा! भाजलेली हरभरा डाळ, उडीद डाळ, मूग डाळ, गहू, तांदूळ, धने, जिरे, सुंठ आणि हळद मंद आचेवर खरपूस भाजून पाट्यावर वाटल्यासारखे बारीक केलेले हे पौष्टिक मेतकूट. लहान मुलांपासून ज्येष्ठांपर्यंत सर्वांच्या पचनास अत्यंत हितकारक.',
    descriptionEn: 'The quintessential Maharashtrian heirloom comfort food. Slow-roasted multi-lentils (chana, urad, and moong dal) and golden grains stone-ground with sunth (dry ginger), turmeric, coriander, and cumin. Non-spicy, aromatic, and best enjoyed mixed into steaming white rice with pure desi ghee or creamy curd.',
    category: 'chutney',
    spiceLevel: 1,
    badgeMr: 'पारंपरिक मेतकूट • पचनास सर्वोत्तम',
    badgeEn: 'Heirloom Metkut • Easy Digestion',
    rating: 4.97,
    reviewCount: 342,
    imageUrl: '/products/metkut-rice.jpg',
    ingredientsMr: ['भाजलेली हरभरा डाळ', 'उडीद डाळ', 'मूग डाळ', 'गहू', 'तांदूळ', 'धने', 'जिरे', 'सुंठ', 'राजापुरी हळद', 'हिंग', 'सेंधव मीठ'],
    ingredientsEn: ['Roasted Bengal Gram (Chana Dal)', 'Black Gram (Urad Dal)', 'Moong Dal', 'Whole Wheat', 'Rice', 'Coriander Seeds', 'Cumin', 'Dry Ginger (Sunth)', 'Turmeric', 'Asafoetida (Hing)', 'Rock Salt'],
    pairingRecommendationsMr: ['गरम वाफाळलेला भात आणि साजूक तूप', 'दही-भात', 'पोळी किंवा दशमीवर तूप लावून', 'उपमा / दलिया'],
    pairingRecommendationsEn: ['Steaming Hot Rice with Pure Desi Ghee', 'Curd Rice (Dahi Bhaat)', 'Warm Roti with Ghee', 'Savory Porridge / Upma'],
    whereToUseMr: [
      'गरम पांढऱ्या भातावर १-२ चमचे मेतकूट आणि भरपूर साजूक तूप घालून कालवून खा.',
      'दही-भातात मिसळून खाल्ल्याने पचनक्रिया सुधारते आणि शरीराला थंडावा मिळतो.',
      'आजारी व्यक्तीला किंवा तोंडाला चव नसताना पातळ तांदळाच्या कांजीसोबत उत्तम पथ्यकर आहार.'
    ],
    whereToUseEn: [
      'Sprinkle 1-2 spoons over steaming hot white rice, crown with melted golden desi ghee, and mix gently.',
      'Mix into fresh curd rice for a comforting, gut-friendly light meal.',
      'Ideal mild, nourishing diet with rice porridge during recuperation or for toddlers.'
    ],
    hygienePrecautionsMr: [
      'मंद विस्तवावर खरपूस भाजणी: कडधान्ये व डाळी न जळता आतपर्यंत भाजल्या जातात.',
      'सुंठ आणि हिंगाची शुद्धता: नैसर्गिक पाचक गुणधर्म टिकवून ठेवले जातात.'
    ],
    hygienePrecautionsEn: [
      'Even Wood-Fire Dry Roasting: Roasted slowly to eliminate moisture and preserve aroma.',
      'Natural Healing Spices: Prepared with authentic ginger and unadulterated asafoetida.'
    ],
    storageTipsMr: 'कोरड्या जागी हवाबंद बरणीत ठेवा. ६ महिने ताजे राहते.',
    storageTipsEn: 'Store in an airtight container away from moisture. Fresh for 6 months.',
    hsnCode: '09109990',
    nutritionFacts: {
      calories: '345 kcal / 100g',
      protein: '16.8g',
      healthyFats: '4.2g',
      fiber: '11.5g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 140, originalPrice: 175, inStock: true },
      { size: '500g', grams: 500, price: 260, originalPrice: 320, inStock: true },
      { size: '1kg', grams: 1000, price: 490, originalPrice: 620, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'पुणे व पश्चिम महाराष्ट्र',
    regionOriginEn: 'Pune & Western Maharashtra'
  },
  {
    id: 'prod-ambyache-lonche',
    nameMr: 'पारंपरिक महाराष्ट्रीयन आंब्याचे लोणचे (Ambyache Lonche / Heirloom Raw Mango Pickle)',
    nameEn: 'Traditional Maharashtrian Raw Mango Pickle (Ambyache Lonche - Heirloom Recipe)',
    taglineMr: 'मेथी-मोहरीच्या दाणेदार मसाल्यात आणि मोहरीच्या तेलात पारंपरिक पद्धतीने मुरवलेले कैरीचे लोणचे',
    taglineEn: "Authentic Maharashtrian heirloom raw mango pickle cured with split mustard & fenugreek in mustard oil",
    descriptionMr: 'तरला दलाल यांच्या खास रेसिपीवर आधारित अस्सल महाराष्ट्रीयन आंब्याचे लोणचे! गावरान राजापुरी कैरीचे सुबक तुकडे, मेथीची डाळ (मेथी कुरिया), मोहरीची डाळ (राई कुरिया), हळद, हिंग आणि अस्सल लाल तिखट एकत्र करून कडकडीत तापवून थंड केलेल्या मोहरीच्या तेलात मुरवले जाते. भाकरी, वरण-भात किंवा चपातीसोबत जिभेवर रेंगाळणारी आंबट-तिखट चव.',
    descriptionEn: "Inspired by Tarla Dalal's celebrated Maharashtrian pickle recipe. Heirloom raw green mangoes diced and marinated in stone-crushed fenugreek seeds (methi na kuria), split yellow mustard seeds (rai na kuria), unadulterated asafoetida, and fiery red chillies bathed in cold-pressed mustard oil. Sun-cured to perfection.",
    category: 'pickle',
    spiceLevel: 4,
    badgeMr: 'पारंपरिक कैरीचे लोणचे • Heirloom Lonche',
    badgeEn: 'Heirloom Recipe • Authentic Raw Mango',
    rating: 4.96,
    reviewCount: 420,
    imageUrl: '/products/mango-pickle.jpg',
    ingredientsMr: ['गावठी राजापुरी कच्ची कैरी', 'मोहरीची डाळ (राई कुरिया)', 'मेथीची डाळ', 'कच्च्या घाण्याचे मोहरीचे तेल', 'बेडगी मिरची पूड', 'राजापुरी हळद', 'खडे मीठ', 'हिंग'],
    ingredientsEn: ['Raw Green Mangoes (Rajapuri)', 'Split Mustard Seeds (Rai Kuria)', 'Fenugreek Seeds (Methi Kuria)', 'Cold-Pressed Mustard Oil', 'Bedgi Chilli Powder', 'Turmeric', 'Sea Salt', 'Asafoetida (Hing)'],
    pairingRecommendationsMr: ['गरम वाफाळलेला वरण-भात व साजूक तूप', 'ज्वारीची कडक भाकरी', 'दही-भात', 'गरम चपाती व पोळी', 'मठ्ठा'],
    pairingRecommendationsEn: ['Steaming Varan Bhaat with Desi Ghee', 'Crisp Jowar Bhakri', 'Curd Rice (Dahi Bhaat)', 'Fresh Wheat Phulka / Roti', 'Spiced Buttermilk'],
    whereToUseMr: [
      'दुपारच्या जेवणात पानात डाव्या बाजूला वाढून पारंपरिक जेवणाची रंगत वाढवा.',
      'मठ्ठा आणि वाफाळलेल्या मऊ भातावर साजूक तूप व १ फोड लोणचे कालवून खा.',
      'प्रवासात चपाती-रोल किंवा दशमीसोबत उत्तम टिकणारा सोबती.'
    ],
    whereToUseEn: [
      'Serve as an indispensable condiment on the traditional Maharashtrian thali.',
      'Pairs matchlessly with soft curd rice or steaming hot dal-chawal crowned with ghee.',
      'Classic travel companion rolled inside warm rotis, parathas, or dashmi.'
    ],
    hygienePrecautionsMr: [
      'काचेच्या किंवा मातीच्या बरणीत नैसर्गिक ऊन देऊन मुरवले जाते.',
      'कोणताही कृत्रिम रंग किंवा रसायन वापरलेले नाही, शुद्ध मोहरीचे तेल नैसर्गिक संरक्षक म्हणून कार्य करते.'
    ],
    hygienePrecautionsEn: [
      'Cured naturally in sterilized ceramic and glass martabans under filtered sun.',
      '100% free from artificial food colorings; preserved solely by rock salt and cold-pressed mustard oil.'
    ],
    storageTipsMr: 'नेहमी कोरड्या चमच्याने काढावे. तेलाचा थर फोडींवर राहील याची काळजी घ्या. १२ महिने उत्तम टिकते.',
    storageTipsEn: 'Always handle with a dry spoon. Keep mango pieces immersed beneath the spice oil layer. Fresh for 12 months.',
    hsnCode: '20019000',
    nutritionFacts: {
      calories: '165 kcal / 100g',
      protein: '2.1g',
      healthyFats: '12.4g',
      fiber: '4.8g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 160, originalPrice: 195, inStock: true },
      { size: '500g', grams: 500, price: 295, originalPrice: 360, inStock: true },
      { size: '1kg', grams: 1000, price: 560, originalPrice: 700, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'कोकण व पश्चिम महाराष्ट्र',
    regionOriginEn: 'Konkan & Western Maharashtra'
  },
  {
    id: 'prod-limbache-lonche',
    nameMr: 'साजूक लिंबाचे आंबट-गोड पाचक लोणचे (Sweet & Sour Lemon Pickle)',
    nameEn: 'Maharashtrian Sweet & Sour Lemon Pickle (Limbache Lonche - Oil-Free)',
    taglineMr: 'अजवायन, सेंधव मीठ व गूळ-मसाल्यात मुरवलेले तेलविरहित पाचक लिंबू लोणचे',
    taglineEn: 'Traditional oil-free sun-ripened juicy lemon pickle with carom seeds and digestive spices',
    descriptionMr: 'तरला दलाल यांच्या खास शैलीतील तेलविरहित साजूक लिंबाचे लोणचे! रसदार पातळ सालीचे कागदी लिंबू, ओवा (अजवायन), सेंधव मीठ, काळे मीठ, भाजलेले जिरे आणि सेंद्रिय गुळाच्या पाकात मंद उन्हात मुरवून तयार केलेले. पचनासाठी अत्यंत गुणकारी आणि चवीला गोड-आंबट-तिखट असे अप्रतिम!',
    descriptionEn: 'The beloved Maharashtrian digestive classic featured in Tarla Dalal’s repertoire. Paper-thin juicy yellow lemons cubed and naturally matured in the sun with digestive carom seeds (ajwain), Himalayan black salt, roasted cumin, and pure unrefined jaggery syrup. 100% oil-free and naturally soothing for the gut.',
    category: 'pickle',
    spiceLevel: 2,
    badgeMr: '१००% तेलविरहित • पाचक लोणचे',
    badgeEn: 'Oil-Free • Ayurvedic Digestion',
    rating: 4.98,
    reviewCount: 388,
    imageUrl: '/products/lemon-pickle.jpg',
    ingredientsMr: ['रसदार कागदी लिंबू', 'सेंद्रिय गूळ', 'ओवा (अजवायन)', 'सेंधव व काळे मीठ', 'भाजलेली जिरे पूड', 'काश्मिरी लाल तिखट'],
    ingredientsEn: ['Juicy Thin-Skinned Lemons', 'Organic Jaggery', 'Carom Seeds (Ajwain)', 'Rock Salt & Black Salt', 'Roasted Cumin Powder', 'Kashmiri Mild Chilli'],
    pairingRecommendationsMr: ['मुगाची मऊ खिचडी', 'थालीपीठ', 'दही-भात', 'उपवास / आजारपणानंतर तोंडाला चव आणण्यासाठी'],
    pairingRecommendationsEn: ['Comforting Moong Dal Khichdi', 'Crispy Thalipeeth', 'Curd Rice', 'Appetite restoring side with light meals'],
    whereToUseMr: [
      'मऊ गरमागरम खिचडीवर साजूक तूप आणि १ चमचा लिंबू लोणचे घालून खा.',
      'अपचन, मळमळ किंवा तोंडाची चव गेली असल्यास १ छोटा तुकडा खाल्ल्याने पचन सुधारते.',
      'लहान मुलांना पोळीसोबत रोल करून देण्यासाठी आरोग्यदायी पर्याय.'
    ],
    whereToUseEn: [
      'Crown hot moong dal khichdi with desi cow ghee and a spoonful of this sweet-tangy lemon pickle.',
      'Natural Ayurvedic remedy to settle digestion and stimulate taste buds.',
      'Delicious spread for toddler rotis or soft parathas without greasy oils.'
    ],
    hygienePrecautionsMr: [
      'उन्हाच्या नैसर्गिक उष्णतेने काचेच्या बरणीत मुरवले जाते.',
      'कोणतेही व्हिनेगर किंवा रासायनिक ऍसिड न वापरता लिंबाच्या नैसर्गिक रसातच तयार होते.'
    ],
    hygienePrecautionsEn: [
      'Slow sun-ripened in sterilized glass vessels without artificial fermentation.',
      'Completely vinegar-free and oil-free; preserved purely by natural lemon citric juices and jaggery.'
    ],
    storageTipsMr: 'कोरड्या जागी हवाबंद काचेच्या बरणीत ठेवा. जसजसे जुने होते तसतसा याचा स्वाद अधिक समृद्ध होतो. १८ महिने टिकते.',
    storageTipsEn: 'Store in an airtight glass jar. Grows richer and darker with age. Shelf life: 18 months.',
    hsnCode: '20019000',
    nutritionFacts: {
      calories: '142 kcal / 100g',
      protein: '1.4g',
      healthyFats: '0.4g',
      fiber: '3.6g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 150, originalPrice: 185, inStock: true },
      { size: '500g', grams: 500, price: 280, originalPrice: 340, inStock: true },
      { size: '1kg', grams: 1000, price: 530, originalPrice: 650, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'पुणे व सातारा',
    regionOriginEn: 'Pune & Satara'
  },
  {
    id: 'prod-panchamrut',
    nameMr: 'पारंपरिक महाराष्ट्रीयन सणासुदीचे पंचामृत (Maharashtrian Panchamrut Chutney Relish)',
    nameEn: 'Traditional Maharashtrian Panchamrut (Festive Sweet & Tangy Chutney Relish)',
    taglineMr: 'शेंगदाणे, तीळ, सुके खोबरे, चिंच-गूळ आणि गोडा मसाल्याची चटकदार सणाची चटणी',
    taglineEn: 'Celebratory sweet, tangy & spicy relish made with roasted peanuts, sesame, coconut, tamarind & goda masala',
    descriptionMr: 'महाराष्ट्रातील सत्यनारायण पूजा, लग्नकार्य आणि सणावाराच्या पानावर डाव्या बाजूला अग्रस्थान असणारे पारंपरिक पंचामृत! भाजलेले शेंगदाणे, पांढरे तीळ, सुक्या खोबऱ्याचे तुकडे, हिरवी मिरची, चिंचेचा कोळ, गूळ आणि अस्सल गोडा मसाला यांची खमंग फोडणी देऊन मंद आचेवर घट्ट शिजवलेली ही शाही चटणी. तरला दलाल यांच्या खास रेसिपीनुसार तयार.',
    descriptionEn: "The signature celebratory relish of Maharashtra featured in Tarla Dalal’s traditional collection. Roasted peanuts, nutty sesame seeds, tender dried coconut strips, and slit green chillies simmered in a dense, glistening tamarind-jaggery syrup scented with authentic Maharashtrian Goda Masala. Sweet, sour, spicy, and profoundly aromatic.",
    category: 'chutney',
    spiceLevel: 2,
    badgeMr: 'सणासुदीचे खास पंचामृत • Festive Relish',
    badgeEn: 'Festive Maharashtrian Relish',
    rating: 4.95,
    reviewCount: 310,
    imageUrl: '/products/panchamrut.jpg',
    ingredientsMr: ['भाजलेले सोलापुरी शेंगदाणे', 'गावरान पांढरे तीळ', 'सुक्या खोबऱ्याच्या कातऱ्या', 'गावरान चिंचेचा कोळ', 'सेंद्रिय गूळ', 'गोडा मसाला', 'हिरवी मिरची', 'मोहरी व कढीपत्ता फोडणी'],
    ingredientsEn: ['Roasted Solapuri Peanuts', 'White Sesame Seeds', 'Dry Coconut Slivers', 'Tamarind Pulp', 'Organic Jaggery', 'Authentic Goda Masala', 'Green Chillies', 'Mustard & Curry Leaf Tadka'],
    pairingRecommendationsMr: ['सणाचे ताट (पुरणपोळी)', 'मसाले भात', 'कढी-भात', 'थालीपीठ', 'गरम पुरी-भाजी'],
    pairingRecommendationsEn: ['Festive Thali with Puran Poli', 'Maharashtrian Masale Bhaat', 'Kadhi Bhaat', 'Crisp Hot Puris', 'Thalipeeth'],
    whereToUseMr: [
      'सणासुदीच्या नैवेद्याच्या ताटात डाव्या बाजूला तोंडी लावण्यासाठी वाढा.',
      'मसाले भातासोबत १ चमचा पंचामृत खाल्ल्याने भाताची चव द्विगुणीत होते.',
      'गरम पुरी किंवा चपातीसोबत चविष्ट साइड डिश म्हणून अप्रतिम.'
    ],
    whereToUseEn: [
      'The quintessential companion on the traditional festive banana leaf feast.',
      'Spoon generously beside Maharashtrian Masale Bhaat for an unforgettable flavor balance.',
      'Delicious dip with piping hot puris, bhajis, or evening snacks.'
    ],
    hygienePrecautionsMr: [
      'मंद आचेवर शिजवून चिंच व गुळाचा परिपूर्ण पाक तयार केला जातो.',
      'कोणतेही कृत्रिम रंग किंवा प्रिझर्व्हेटिव्ह नसलेली १००% शुद्ध घरगुती पद्धत.'
    ],
    hygienePrecautionsEn: [
      'Simmered slowly in heavy copper-bottom pots to create an authentic glossy consistency.',
      'Zero synthetic additives; purely concentrated with natural jaggery and tamarind.'
    ],
    storageTipsMr: 'रेफ्रिजरेटरमध्ये हवाबंद बरणीत ठेवा. ३ महिने उत्तम ताजे राहते.',
    storageTipsEn: 'Refrigerate after opening in an airtight container. Fresh for 3 months.',
    hsnCode: '21039090',
    nutritionFacts: {
      calories: '260 kcal / 100g',
      protein: '7.8g',
      healthyFats: '14.2g',
      fiber: '6.5g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 170, originalPrice: 210, inStock: true },
      { size: '500g', grams: 500, price: 320, originalPrice: 390, inStock: true },
      { size: '1kg', grams: 1000, price: 610, originalPrice: 760, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'मराठवाडा व पश्चिम महाराष्ट्र',
    regionOriginEn: 'Marathwada & Western Maharashtra'
  },
  {
    id: 'prod-hirvi-mirchi-lonche',
    nameMr: 'झटपट हिरव्या मिरचीचे लोणचे (Instant Maharashtrian Green Chilli Pickle)',
    nameEn: 'Instant Maharashtrian Green Chilli Pickle (Hirvya Mirchyanche Lonche)',
    taglineMr: 'मोहरीची डाळ, लिंबाचा रस व हिंगाच्या खमंग फोडणीत ताजी हिरवी मिरची',
    taglineEn: 'Crunchy green chillies infused with crushed yellow mustard seeds, lemon juice & aromatic hing',
    descriptionMr: 'तरला दलाल यांच्या इन्स्टंट लोणचे रेसिपीवर आधारित कुरकुरीत हिरव्या मिरचीचे लोणचे! कमी तिखट गावठी ताज्या हिरव्या मिरच्या उभ्या चिरून त्यात मोहरीची डाळ (राई कुरिया), हळद, हिंग, खडे मीठ आणि ताज्या लिंबाचा रस घालून गरम तेलाची खमंग फोडणी दिली जाते. कोणत्याही जेवणाला त्वरित तिखट-आंबट किक देणारे लोणचे.',
    descriptionEn: "Inspired by Tarla Dalal's quick Maharashtrian pickle recipe. Slit tender fresh green chillies tossed with cracked yellow mustard seeds, turmeric, sea salt, fragrant hing, and bathed in fresh lemon juice and warm peanut oil. Crunchy, zesty, and instantly awakens the appetite.",
    category: 'pickle',
    spiceLevel: 3,
    badgeMr: 'झटपट लोणचे • Crunchy & Tangy',
    badgeEn: 'Instant Green Chilli Pickle',
    rating: 4.91,
    reviewCount: 260,
    imageUrl: '/products/chilli-pickle.jpg',
    ingredientsMr: ['ताज्या गावरan हिरव्या मिरच्या', 'मोहरीची डाळ (राई कुरिया)', 'ताज्या लिंबाचा रस', 'हिंग', 'राजापुरी हळद', 'सेंधव मीठ', 'कच्च्या घाण्याचे शेंगदाणा तेल'],
    ingredientsEn: ['Fresh Slit Green Chillies', 'Yellow Mustard Seeds (Rai Kuria)', 'Fresh Lemon Juice', 'Asafoetida (Hing)', 'Turmeric', 'Rock Salt', 'Cold-Pressed Groundnut Oil'],
    pairingRecommendationsMr: ['वरण-भात आणि तूप', 'ज्वारीची भाकरी', 'दाल-खिचडी', 'पराठा'],
    pairingRecommendationsEn: ['Varan Bhaat with Ghee', 'Rustic Jowar Bhakri', 'Dal Khichdi', 'Stuffed Parathas'],
    whereToUseMr: [
      'जेवणात साध्या डाळ-भातासोबत १ चमचा तोंडी लावा.',
      'खिचडी किंवा पराठ्यासोबत चटकदार साइड म्हणून वाढा.'
    ],
    whereToUseEn: [
      'Ideal zesty accompaniment with comforting dal-chawal or khichdi.',
      'Delicious crunchy condiment paired with everyday flatbreads and parathas.'
    ],
    hygienePrecautionsMr: [
      'धुवून पूर्णपणे सुकवलेल्या ताज्या मिरच्या वापरल्या जातात.',
      'लिंबाच्या ताज्या रसाने नैसर्गिक आम्लता टिकवून ठेवली जाते.'
    ],
    hygienePrecautionsEn: [
      'Washed and thoroughly towel-dried chillies to prevent moisture spoilage.',
      'Naturally preserved with fresh lemon juice without chemical vinegar.'
    ],
    storageTipsMr: 'थंड व कोरड्या जागी ठेवा. महिनाभर कुरकुरीत राहते. उन्हाळ्यात फ्रीजमध्ये ठेवणे उत्तम.',
    storageTipsEn: 'Store in a cool dry place or refrigerate to retain maximum crunch. Fresh for 2 months.',
    hsnCode: '20019000',
    nutritionFacts: {
      calories: '95 kcal / 100g',
      protein: '2.0g',
      healthyFats: '6.1g',
      fiber: '3.4g'
    },
    sizes: [
      { size: '250g', grams: 250, price: 135, originalPrice: 165, inStock: true },
      { size: '500g', grams: 500, price: 250, originalPrice: 310, inStock: true },
      { size: '1kg', grams: 1000, price: 470, originalPrice: 590, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: true,
    regionOriginMr: 'खानदेश व मराठवाडा',
    regionOriginEn: 'Khandesh & Marathwada'
  },
  {
    id: 'prod-malvani-masala',
    nameMr: 'अस्सल मालवणी मसाला (Malvani Fish & Veg Masala)',
    nameEn: 'Authentic Konkan Malvani Masala (28-Spice Royal Blend)',
    taglineMr: 'कोकणचा जगप्रसिद्ध २८ मसाल्यांचा पारंपरिक सुगंधी मसाला • नाकेश्वर व दगडफूल',
    taglineEn: 'Legendary coastal Konkan masala with star anise, dagad phool & roasted copra',
    descriptionMr: 'कोकणातील सिंधुदुर्ग व मालवणची खरी ओळख! २८ निवडक खडे मसाले, दगडफूल, त्रिफळा, चक्रफूल, नाकेश्वर आणि मंद आचेवर भाजलेले सुके खोबरे एकत्र करून दगडी खलबत्त्यात कुटलेला अस्सल मालवणी मसाला. माशांचे कालवण, मटण सुक्का किंवा कडधान्यांच्या उसळीसाठी सर्वोत्तम.',
    descriptionEn: 'The pride of the Konkan coastline. A secret heritage blend of 28 sun-cured spices including triphala, stone flower (dagad phool), cobra saffron (nagkeshar), star anise, and slow-roasted dry copra. Imparts an unforgettable coastal aroma to fish curries, chicken rassa, and hearty sprouted bean gravies.',
    category: 'masala',
    spiceLevel: 4,
    badgeMr: 'कोकणची अस्सल शान • 28 Spices',
    badgeEn: 'Konkan Royal Heritage (28 Spices)',
    rating: 4.97,
    reviewCount: 420,
    imageUrl: '/products/kala-masala.jpg',
    ingredientsMr: ['बेडगी व काश्मिरी मिरची', 'दगडफूल', 'नाकेश्वर', 'त्रिफळा', 'चक्रफूल', 'शहाजिरे', 'दालचिनी', 'भाजलेले सुके खोबरे', 'धने व जिरे'],
    ingredientsEn: ['Bedgi & Kashmiri Chillies', 'Stone Flower (Dagad Phool)', 'Nagkeshar', 'Triphala', 'Star Anise', 'Shahjeera', 'Cinnamon', 'Roasted Copra', 'Coriander & Cumin'],
    pairingRecommendationsMr: ['सुरमई / पापलेट कालवण', 'कोंबडी वडे', 'सुकट उसळ', 'काळ्या वाटणाची उसळ'],
    pairingRecommendationsEn: ['Surmai / Pomfret Curry', 'Kombdi Vade', 'Dry Fish Fry', 'Black Coconut Sprouted Usal'],
    whereToUseMr: [
      'मासे किंवा कोळंबीचे कालवण बनवताना फोडणीत २ चमचे मालवणी मसाला घाला.',
      'कोंबडी वड्यांसोबतच्या झणझणीत रश्शासाठी मुख्य मसाला म्हणून वापरा.',
      'वांगी-बटाटा किंवा वालच्या उसळीत खमंग कोकणी स्वादासाठी १ चमचा वापरा.'
    ],
    whereToUseEn: [
      'Incorporate 2 tablespoons into coastal fish or prawn gravies for intense aroma.',
      'Essential signature seasoning for Kombdi Vade chicken curry.',
      'Enhance sprouted bean usal and brinjal curries with distinctive Konkan fragrance.'
    ],
    storageTipsMr: 'थंड व कोरड्या जागी हवाबंद बरणीत ठेवा. १ वर्ष सुवास तसाच टिकतो.',
    storageTipsEn: 'Store in airtight glass or stainless container. Retains peak aroma for 12 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '310 kcal / 100g', protein: '11.2g', healthyFats: '14.5g', fiber: '22.0g' },
    sizes: [
      { size: '100g', grams: 100, price: 95, originalPrice: 120, inStock: true },
      { size: '250g', grams: 250, price: 195, originalPrice: 245, inStock: true },
      { size: '500g', grams: 500, price: 360, originalPrice: 450, inStock: true },
      { size: '1kg', grams: 1000, price: 690, originalPrice: 850, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'सिंधुदुर्ग व मालवण',
    regionOriginEn: 'Konkan (Malvan)'
  },
  {
    id: 'prod-khandeshi-kala-masala',
    nameMr: 'खानदेशी घरगुती काळा मसाला (Khandeshi Kala Masala)',
    nameEn: 'Authentic Khandeshi Kala Masala (Charred Coriander & Coconut)',
    taglineMr: 'शेव भाजी व गावरan उसळीसाठी खास गडद खमंग काळा मसाला • जळगाव स्पेशल',
    taglineEn: 'Deep-roasted dark masala for iconic Khandeshi Shev Bhaji & rustic curries',
    descriptionMr: 'खानदेशची प्रसिद्ध शेव भाजी ज्या मसाल्याशिवाय अपूर्ण आहे तो हा अस्सल खानदेशी काळा मसाला! धने, तीळ, सुके खोबरे आणि २५ खडे मसाले लोखंडी कढईत काळे होईपर्यंत भाजून खलबत्त्यात कुटले जातात. यात कांद्याची काळी पेस्ट न घालताही रश्शाला दाटपणा व आकर्षक गडद रंग येतो.',
    descriptionEn: 'The heart and soul of Khandesh cuisine. Whole coriander seeds, white sesame, dry copra, and 25 whole spices dark-roasted on iron pans until deep mahogany-black, then pulverized in stone mortars. Yields the famous spicy dark gravy of Khandeshi Shev Bhaji, Patodi Rassa, and rustic dal baati.',
    category: 'masala',
    spiceLevel: 5,
    badgeMr: 'खानदेशची खास शेव भाजी मसाला',
    badgeEn: 'Khandesh Shev Bhaji Special',
    rating: 4.96,
    reviewCount: 380,
    imageUrl: '/products/kala-masala.jpg',
    ingredientsMr: ['काळे भाजलेले धने', 'सुके खोबरे', 'तीळ', 'लवंग', 'काळी मिरी', 'दगडफूल', 'तमालपत्र', 'दालचिनी', 'बडीशेप', 'खसखस'],
    ingredientsEn: ['Dark-Roasted Coriander', 'Dry Copra', 'Sesame Seeds', 'Cloves', 'Black Peppercorns', 'Stone Flower', 'Bay Leaf', 'Cinnamon', 'Fennel', 'Poppy Seeds'],
    pairingRecommendationsMr: ['खानदेशी तिखट शेv भाजी', 'पातोडी रस्सा', 'वरण-बट्टी', 'गावरान चिकन सुक्का'],
    pairingRecommendationsEn: ['Spicy Khandeshi Shev Bhaji', 'Patodi Rassa', 'Khandeshi Varan Batti', 'Rustic Chicken Sukka'],
    whereToUseMr: [
      'खानदेशी शेव भाजी बनवताना फोडणीत २ चमचे घालून तेल सुटेपर्यंत परता.',
      'पातोडीच्या रश्शासाठी किंवा वांग्याच्या भाजीसाठी १-२ चमचे वापरा.'
    ],
    whereToUseEn: [
      'Fry 2 tbsp in hot oil for iconic Khandeshi Shev Bhaji until oil floats atop.',
      'Ideal for Patodi Rassa, Bharli Vangi, and winter country curries.'
    ],
    storageTipsMr: 'हवाबंद डब्यात ठेवा. वर्षभर सुवास व गडद रंग कायम राहतो.',
    storageTipsEn: 'Keep sealed in an airtight jar away from light. Stays fresh for 12 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '325 kcal / 100g', protein: '12.0g', healthyFats: '16.2g', fiber: '20.4g' },
    sizes: [
      { size: '100g', grams: 100, price: 90, originalPrice: 115, inStock: true },
      { size: '250g', grams: 250, price: 185, originalPrice: 230, inStock: true },
      { size: '500g', grams: 500, price: 350, originalPrice: 440, inStock: true },
      { size: '1kg', grams: 1000, price: 670, originalPrice: 820, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'जळगाव व धुळे (खानदेश)',
    regionOriginEn: 'Khandesh (Jalgaon & Dhule)'
  },
  {
    id: 'prod-goda-masala',
    nameMr: 'पेशवाई गोडा मसाला (Peshwai Brahmin Goda Masala)',
    nameEn: 'Peshwai Sweet Aromatic Goda Masala (No Onion, No Garlic)',
    taglineMr: 'दगडफूल, पांढरे तीळ व सुक्या खोबऱ्याचा सुवासिक गोडा मसाला • कांदा-लसूण विरहित',
    taglineEn: 'Traditional Brahmin sweet masala with stone flower, sesame & dry copra',
    descriptionMr: 'पुणे व नाशिकच्या ब्राह्मणी परंपरेतील अत्यंत सुगंधी, सात्विक आणि कांदा-लसूण विरहित पेशवाई गोडा मसाला. दगडफूल (Stone Flower), पांढरे तीळ, खसखस, सुके खोबरे आणि दालचिनी मंद आचेवर साजूक तुपाची धार लावून भाजले जातात. वरण, आमटी, भरली वांगी आणि मटकी उसळीला स्वर्गीय सुगंध देणारा मसाला.',
    descriptionEn: 'The aristocratic culinary jewel of Maharashtra. 100% pure vegetarian, no onion, no garlic. Crafted with fragrant stone flower (dagad phool), unpolished white sesame, poppy seeds, dry coconut, and royal cinnamon kissed with desi cow ghee. Essential for authentic Maharashtrian Amti, Bharli Vangi, Katachi Amti, and Matki Usal.',
    category: 'masala',
    spiceLevel: 2,
    badgeMr: 'सात्विक • कांदा-लसूण विरहित',
    badgeEn: 'Pure Sattvik • No Onion Garlic',
    rating: 4.99,
    reviewCount: 610,
    imageUrl: '/products/til-sesame.jpg',
    ingredientsMr: ['धने', 'दगडफूल', 'पांढरे तीळ', 'सुके खोबरे', 'दालचिनी', 'लवंग', 'काळी मिरी', 'नाकेश्वर', 'हिंग', 'शुद्ध साजूक तूप'],
    ingredientsEn: ['Coriander Seeds', 'Stone Flower (Dagad Phool)', 'White Sesame', 'Dry Copra', 'Cinnamon', 'Cloves', 'Black Peppercorns', 'Nagkeshar', 'Asafoetida', 'Desi Cow Ghee'],
    pairingRecommendationsMr: ['मराठमोळी तुरीची आमटी', 'भरली वांगी (मसाला वांगी)', 'कटाची आमटी व पुरणपोळी', 'मटकीची उसळ'],
    pairingRecommendationsEn: ['Traditional Maharashtrian Amti', 'Bharli Vangi (Stuffed Brinjal)', 'Katachi Amti with Puran Poli', 'Matki Sprouted Usal'],
    whereToUseMr: [
      'रोजच्या तुरीच्या डाळीच्या आमटीमध्ये उकळताना १ लहान चमचा गोडा मसाला घाला.',
      'भरली वांगी करताना वाटणात २ चमचे घालून गूळ व चिंचेसोबत शिजवा.',
      'सणासुदीला पुरणपोळीच्या कटाच्या आमटीत खास खमंग चवीसाठी वापरा.'
    ],
    whereToUseEn: [
      'Add 1 teaspoon while simmering everyday Toor Dal Amti for heavenly aroma.',
      'Blend 2 tablespoons into the coconut-peanut stuffing for stuffed brinjals (Bharli Vangi).',
      'The definitive secret spice for festive Katachi Amti alongside Puran Poli.'
    ],
    storageTipsMr: 'कोरड्या जागी काचेच्या बरणीत ठेवा. पाण्याचा स्पर्श होऊ देऊ नका. १२ महिने टिकते.',
    storageTipsEn: 'Store in an airtight glass jar away from moisture. Stays fragrant for 12 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '340 kcal / 100g', protein: '13.5g', healthyFats: '18.4g', fiber: '19.2g' },
    sizes: [
      { size: '100g', grams: 100, price: 95, originalPrice: 120, inStock: true },
      { size: '250g', grams: 250, price: 190, originalPrice: 240, inStock: true },
      { size: '500g', grams: 500, price: 360, originalPrice: 450, inStock: true },
      { size: '1kg', grams: 1000, price: 680, originalPrice: 840, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'पुणे व नाशिक',
    regionOriginEn: 'Pune & Nashik (Peshwai)'
  },
  {
    id: 'prod-agri-koli-masala',
    nameMr: 'अस्सल आगरी-कोळी मसाला (Agri Koli Coastal Masala)',
    nameEn: 'Authentic Agri-Koli Seafood & Mutton Masala',
    taglineMr: 'रायगड-ठाणे किनारपट्टीचा खास झणझणीत २१ मसाल्यांचा खजिना',
    taglineEn: 'Coastal fiery spice blend perfected for fresh seafood, prawns & curries',
    descriptionMr: 'मुंबई, ठाणे, रायगड व अलिबागच्या किनारपट्टीवरील आगरी-कोळी बांधवांची कौटुंबिक रेसिपी! २१ अस्सल मसाले, तेज लवंगी मिरची आणि खडे मसाले लाकडी खलबत्त्यात कुटून तयार केलेला हा मसाला. सुकटाची उसळ, कोळंबी भात किंवा मटणाच्या रश्शाला तिखट आणि लालभडक तर्री आणणारा खास मसाला.',
    descriptionEn: 'The fiery heritage blend of Mumbai, Thane, and Alibaug coastal fishermen and farmers. 21 hand-curated spices ground with high-pungency red chillies in stone mortars. Imparts unmistakable rustic heat and brilliant red natural oil separation (tarri) to prawn curries, crab masala, and mutton preparations.',
    category: 'masala',
    spiceLevel: 5,
    badgeMr: 'आगरी-कोळी स्पेशल • झणझणीत',
    badgeEn: 'Agri Koli Coastal Special',
    rating: 4.95,
    reviewCount: 310,
    imageUrl: '/products/kanda-lasun.jpg',
    ingredientsMr: ['कोल्हापुरी लवंगी मिरची', 'काश्मिरी मिरची', 'नाकेश्वर', 'दगडफूल', 'काळी मिरी', 'जिरे', 'धने', 'जायफळ', 'बडीशेप', 'दालचिनी'],
    ingredientsEn: ['Kolhapuri Lavangi Chilli', 'Kashmiri Chilli', 'Nagkeshar', 'Stone Flower', 'Black Pepper', 'Cumin', 'Coriander', 'Nutmeg', 'Fennel', 'Cinnamon'],
    pairingRecommendationsMr: ['कोळंबी मसाला', 'खेकडा करी', 'सुकट-वांग्याची उसळ', 'आगरी मटण'],
    pairingRecommendationsEn: ['Spicy Prawn Masala', 'Crab Curry', 'Dry Shrimp & Brinjal Fry', 'Agri Mutton'],
    whereToUseMr: [
      'कोळंबी किंवा खेकडा मसाला करताना कांदा-टोमॅटोच्या ग्रेव्हीत २ चमचे परता.',
      'आगरी पद्धतीचे मटण किंवा चिकन बनवताना मुख्य मसाला म्हणून वापरा.'
    ],
    whereToUseEn: [
      'Saute 2 tbsp with onions, tomatoes and garlic for seafood curries.',
      'The core seasoning for hearty Sunday mutton feasts across coastal Maharashtra.'
    ],
    storageTipsMr: 'थंड व कोरड्या जागी हवाबंद बरणीत ठेवा. १ वर्ष टिकते.',
    storageTipsEn: 'Store sealed in a dry dark cabinet. Good for 12 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '315 kcal / 100g', protein: '10.8g', healthyFats: '13.9g', fiber: '21.5g' },
    sizes: [
      { size: '100g', grams: 100, price: 95, originalPrice: 120, inStock: true },
      { size: '250g', grams: 250, price: 195, originalPrice: 245, inStock: true },
      { size: '500g', grams: 500, price: 370, originalPrice: 460, inStock: true },
      { size: '1kg', grams: 1000, price: 710, originalPrice: 870, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: true,
    regionOriginMr: 'रायगड, अलिबाग व ठाणे',
    regionOriginEn: 'Raigad & Thane Coast'
  },
  {
    id: 'prod-puneri-garam-masala',
    nameMr: 'पुणेरी शाही गरम मसाला (Puneri Royal Whole Garam Masala)',
    nameEn: 'Puneri Shahi Garam Masala (Royal Whole Spice Blend)',
    taglineMr: 'हिरवी वेलची, जावित्री, लवंग व दालचिनीची समृद्ध सुगंधित पूड',
    taglineEn: 'Hand-sorted green cardamom, mace, cloves & cinnamon powder',
    descriptionMr: 'हजारो वर्षांची परंपरा असलेला अस्सल शाही गरम मसाला! हिरवी वेलची, मोठी काळी वेलची, जावित्री, लवंग, चक्रीफूल आणि दालचिनी यांना सूर्यप्रकाशात वाळवून कमी वेगावर कुटले जाते, ज्यामुळे यातील नैसर्गिक बाष्पीभवन होणारे तेलाचे घटक (Essential Oils) जसेच तसे टिकून राहतात.',
    descriptionEn: 'The pinnacle of whole-spice aromatics. Green cardamom pods, black cardamom, royal mace (javitri), whole cloves, star anise, and Ceylon cinnamon ground at ultra-low speeds to preserve natural essential oils. Elevates royal biryanis, gravies, and festive curries with a pinch.',
    category: 'masala',
    spiceLevel: 3,
    badgeMr: 'शाही सुगंध • 100% Whole Spices',
    badgeEn: 'Royal Whole Spices Blend',
    rating: 4.98,
    reviewCount: 290,
    imageUrl: '/products/kala-masala.jpg',
    ingredientsMr: ['हिरवी वेलची', 'काळी वेलची', 'जावित्री', 'लवंग', 'दालचिनी', 'चक्रीफूल', 'शहाजिरे', 'जायफळ'],
    ingredientsEn: ['Green Cardamom', 'Black Cardamom', 'Mace (Javitri)', 'Cloves', 'Cinnamon', 'Star Anise', 'Shahjeera', 'Nutmeg'],
    pairingRecommendationsMr: ['शाही पनीर', 'दम बिर्याणी', 'छोले', 'काजू करी'],
    pairingRecommendationsEn: ['Shahi Paneer', 'Dum Biryani', 'Amritsari Chole', 'Rich Nut Curries'],
    whereToUseMr: [
      'कोणत्याही ग्रेव्हीमध्ये स्वयंपाक पूर्ण होताना शेवटी अर्धा चमचा भुरभुरवा आणि झाकून ठेवा.',
      'बिर्याणीचा भात उकळताना किंवा दम देताना १ लहान चमचा वापरा.'
    ],
    whereToUseEn: [
      'Sprinkle 1/2 tsp at the final stage of cooking and cover with lid for maximum fragrance.',
      'Dust over layering rice during Dum Biryani preparation.'
    ],
    storageTipsMr: 'काचेच्या बाटलीत घट्ट झाकण लावून ठेवा. ९ महिने सुगंध कायम.',
    storageTipsEn: 'Store in an airtight glass container. Keeps maximum aroma for 9 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '290 kcal / 100g', protein: '9.4g', healthyFats: '11.8g', fiber: '24.0g' },
    sizes: [
      { size: '100g', grams: 100, price: 110, originalPrice: 140, inStock: true },
      { size: '250g', grams: 250, price: 220, originalPrice: 280, inStock: true },
      { size: '500g', grams: 500, price: 410, originalPrice: 510, inStock: true },
      { size: '1kg', grams: 1000, price: 780, originalPrice: 960, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: false,
    regionOriginMr: 'पुणे',
    regionOriginEn: 'Pune'
  },
  {
    id: 'prod-kolhapuri-misal-kat-masala',
    nameMr: 'कोल्हापुरी तांबडा रस्सा व मिसळ कट मसाला',
    nameEn: 'Kolhapuri Misal Kat & Tambda Rassa Masala (Fiery Tarri Blend)',
    taglineMr: 'अस्सल कोल्हापुरी तर्री व मिसळच्या कटसाठी खास लवंगी मिरची मसाला',
    taglineEn: 'Signature high-heat spice blend for authentic Kolhapuri Misal Kat & Rassa',
    descriptionMr: 'कोल्हापूरच्या मिसळची झणझणीत तर्री आणि तांबड्या रश्शाची चव ज्या मसाल्यामुळे येते, तो हा खास कोल्हापुरी कट मसाला! संकेश्वरी व लवंगी मिरची, खडे मसाले आणि दगडफूल एकत्र करून तयार केलेला हा मसाला रश्शाला खोल लाल रंग आणि घशाला पाणी सुटणारा अस्सल कोल्हापुरी तिखटपणा देतो.',
    descriptionEn: 'The secret behind the fiery crimson oil float (Kat/Tarri) of legendary Kolhapuri Misal. Built around high-heat Sankeshwari & Lavangi red chillies and stone-crushed whole spices. Creates the intoxicating aroma and authentic Kolhapuri punch that food lovers travel miles to experience.',
    category: 'masala',
    spiceLevel: 5,
    badgeMr: 'कोल्हापुरी तर्री स्पेशल • High Heat',
    badgeEn: 'Fiery Kolhapuri Tarri Special',
    rating: 4.97,
    reviewCount: 450,
    imageUrl: '/products/kanda-lasun.jpg',
    ingredientsMr: ['संकेश्वरी मिरची', 'लवंगी मिरची', 'दगडफूल', 'तमालपत्र', 'जिरे', 'धने', 'काळी मिरी', 'लवंग', 'तीळ'],
    ingredientsEn: ['Sankeshwari Chilli', 'Lavangi Chilli', 'Stone Flower', 'Bay Leaf', 'Cumin', 'Coriander', 'Black Pepper', 'Cloves', 'Sesame'],
    pairingRecommendationsMr: ['कोल्हापुरी झणझणीत मिसळ', 'तांबडा रस्सा', 'कट वडा', 'अंडा करी'],
    pairingRecommendationsEn: ['Kolhapuri Misal', 'Tambda Rassa', 'Kat Vada', 'Spicy Egg Curry'],
    whereToUseMr: [
      'मिसळचा रस्सा (कट) बनवताना भरपूर तेलात २ चमचे मसाला परतून उकळते पाणी घाला.',
      'तांबडा रस्सा बनवताना मटणाच्या स्टॉकमध्ये घालून उकळा.'
    ],
    whereToUseEn: [
      'Bloom 2 tbsp in hot oil before adding hot water to release the crimson Kat layer.',
      'Simmer directly in mutton or legume broth for unmistakable Kolhapuri warmth.'
    ],
    storageTipsMr: 'हवाबंद डब्यात ठेवा. १ वर्ष उत्तम टिकते.',
    storageTipsEn: 'Store airtight in a cool dry cabinet. Fresh for 12 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '320 kcal / 100g', protein: '11.0g', healthyFats: '13.5g', fiber: '23.0g' },
    sizes: [
      { size: '100g', grams: 100, price: 85, originalPrice: 110, inStock: true },
      { size: '250g', grams: 250, price: 175, originalPrice: 220, inStock: true },
      { size: '500g', grams: 500, price: 330, originalPrice: 410, inStock: true },
      { size: '1kg', grams: 1000, price: 630, originalPrice: 790, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: true,
    regionOriginMr: 'कोल्हापूर',
    regionOriginEn: 'Kolhapur'
  },
  {
    id: 'prod-saoji-masala',
    nameMr: 'विदर्भ सावजी मसाला (Nagpur Saoji Extreme Masala)',
    nameEn: 'Vidarbha Saoji Extreme Hot Masala (Nagpur Signature)',
    taglineMr: 'काळी मिरी, दगडफूल व खसखसचा अस्सल सावजी झणझणीत मसाला • नागपूर स्पेशल',
    taglineEn: 'Fiery Vidarbha spice blend with heavy black pepper, poppy seeds & cloves',
    descriptionMr: 'विदर्भाची शान! नागपूरच्या हलबा कोष्टी समाजाची गोपनीय सावजी रेसिपी. ३२ प्रकारच्या मसाल्यांचे अचूक मिश्रण ज्यात काळी मिरी, लवंग, खसखस आणि दगडफुलाचा प्रभावी वापर केला जातो. सावजी मटण, चिकन किंवा सावजी पनीरमध्ये तोंडात चव रेंगाळत राहणारा हा जगप्रसिद्ध मसाला आहे.',
    descriptionEn: 'The world-renowned fiery pride of Vidarbha and Nagpur. Sourced from the heritage recipe of the Halba Koshti community. Features an intense symphony of 32 spices highlighted by Tellicherry black peppercorns, poppy seeds, stone flower, and cloves for a slow, deep, lingering rustic heat.',
    category: 'masala',
    spiceLevel: 5,
    badgeMr: 'नागपूर सावजी • Extreme Spice',
    badgeEn: 'Nagpur Saoji Extreme Spice',
    rating: 4.94,
    reviewCount: 340,
    imageUrl: '/products/kala-masala.jpg',
    ingredientsMr: ['काळी मिरी', 'खसखस', 'दगडफूल', 'लवंग', 'बडीशेप', 'दालचिनी', 'धने', 'जायफळ', 'शहाजिरे', 'लवंगी मिरची'],
    ingredientsEn: ['Black Peppercorns', 'Poppy Seeds', 'Stone Flower', 'Cloves', 'Fennel', 'Cinnamon', 'Coriander', 'Nutmeg', 'Shahjeera', 'Lavangi Chilli'],
    pairingRecommendationsMr: ['सावजी मटण रस्सा', 'सावजी चिकन', 'सावजी पनीर भुर्जी', 'खुर खुर रस्सा'],
    pairingRecommendationsEn: ['Saoji Mutton Rassa', 'Saoji Chicken Gravy', 'Saoji Paneer', 'Rustic Trotter Soup'],
    whereToUseMr: [
      'सावजी ग्रेव्हीत कांद्याची पेस्ट भाजल्यावर २ चमचे मसाला घालून मंद आचेवर तेल सुटेपर्यंत परता.',
      'नागपुरी सावजी उसळ किंवा अंड्याच्या भाजीमध्ये वापरा.'
    ],
    whereToUseEn: [
      'Fry 2 tbsp with browned onion paste over low heat until deeply aromatic.',
      'Use for Nagpur-style spicy sprouted curries and slow-cooked rustic meats.'
    ],
    storageTipsMr: 'काचेच्या बरणीत बंद करून ठेवा. १२ महिने टिकते.',
    storageTipsEn: 'Seal tightly in glass container away from humidity. Fresh for 12 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '335 kcal / 100g', protein: '12.4g', healthyFats: '15.8g', fiber: '21.0g' },
    sizes: [
      { size: '100g', grams: 100, price: 95, originalPrice: 125, inStock: true },
      { size: '250g', grams: 250, price: 195, originalPrice: 245, inStock: true },
      { size: '500g', grams: 500, price: 365, originalPrice: 460, inStock: true },
      { size: '1kg', grams: 1000, price: 695, originalPrice: 860, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: true,
    regionOriginMr: 'नागपूर (विदर्भ)',
    regionOriginEn: 'Nagpur (Vidarbha)'
  },
  {
    id: 'prod-pav-bhaji-masala',
    nameMr: 'मुंबई स्ट्रीट स्पेशल पाव भाजी मसाला (Tawa Pav Bhaji Masala)',
    nameEn: 'Mumbai Street Special Pav Bhaji Masala',
    taglineMr: 'आमचूर, बडीशेप व भाजलेल्या धन्याची खमंग मुंबई पावभाजी चव',
    taglineEn: 'Slow-roasted coriander, fennel, star anise & dried mango tawa blend',
    descriptionMr: 'मुंबईच्या चौपाटी व रस्त्यावरील तव्यावर बनणाऱ्या अस्सल पावभाजीचा सुगंध या मसाल्यात सामावलेला आहे! आंबट आमचूर पावडर, बडीशेप, धने, काश्मिरी लाल मिरची आणि दगडफूल यांचे अचूक गुणोत्तर भाजीला दाट टेक्स्चर, अप्रतिम लाल रंग आणि खमंग चव देते.',
    descriptionEn: 'The quintessential aroma of Mumbai street-side iron tawas. Slow-roasted coriander seeds, fennel, dried green mango (amchur), Kashmiri chillies, and star anise ground to perfection. Produces rich, butter-loving red bhaji with zesty depth.',
    category: 'masala',
    spiceLevel: 3,
    badgeMr: 'मुंबई स्ट्रीट स्वाद • Tawa Special',
    badgeEn: 'Mumbai Street Tawa Special',
    rating: 4.96,
    reviewCount: 510,
    imageUrl: '/products/vada-pav-lasun.jpg',
    ingredientsMr: ['धने', 'काश्मिरी मिरची', 'बडीशेप', 'आमचूर', 'जिरे', 'काळी मिरी', 'दालचिनी', 'लवंग', 'चक्रीफूल'],
    ingredientsEn: ['Coriander Seeds', 'Kashmiri Chillies', 'Fennel', 'Dry Mango Powder (Amchur)', 'Cumin', 'Black Pepper', 'Cinnamon', 'Cloves', 'Star Anise'],
    pairingRecommendationsMr: ['बटर पाव भाजी', 'तवा पुलाव', 'मसाला पाव', 'रगडा पॅटीस'],
    pairingRecommendationsEn: ['Butter Pav Bhaji', 'Mumbai Tawa Pulao', 'Masala Pav', 'Ragda Pattice'],
    whereToUseMr: [
      'उकळलेल्या भाज्या मॅश करताना भरपूर बटरमध्ये २ मोठे चमचे पाव भाजी मसाला घाला.',
      'उरलेल्या भातापासून झटपट तवा पुलाव बनवण्यासाठी १ चमचा वापरा.'
    ],
    whereToUseEn: [
      'Add 2 tbsp along with generous butter while mashing boiled vegetables on high flame.',
      'Sprinkle over butter-toasted pav or use for authentic Mumbai street Tawa Pulao.'
    ],
    storageTipsMr: 'थंड जागी हवाबंद बरणीत ठेवा. ९ महिने उत्तम टिकते.',
    storageTipsEn: 'Store in an airtight jar in a cool place. Fresh for 9 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '295 kcal / 100g', protein: '8.8g', healthyFats: '9.5g', fiber: '25.0g' },
    sizes: [
      { size: '100g', grams: 100, price: 85, originalPrice: 110, inStock: true },
      { size: '250g', grams: 250, price: 170, originalPrice: 215, inStock: true },
      { size: '500g', grams: 500, price: 320, originalPrice: 400, inStock: true },
      { size: '1kg', grams: 1000, price: 610, originalPrice: 760, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: false,
    regionOriginMr: 'मुंबई',
    regionOriginEn: 'Mumbai'
  },
  {
    id: 'prod-chai-masala',
    nameMr: 'शाही चहा व काढा मसाला (Royal Sun-Dried Chai & Kadha Masala)',
    nameEn: 'Royal Herbal Chai & Kadha Masala (Ayurvedic Blend)',
    taglineMr: 'गावरान सुंठ, हिरवी वेलची, काळी मिरी, लवंग व दालचिनी • आरोग्यदायी',
    taglineEn: 'Desi dry ginger, green cardamom, pepper, cloves & cinnamon tea booster',
    descriptionMr: 'थंडीच्या दिवसात आणि पावसाळ्यात शरीराला उब व उत्साह देणारा अस्सल गावरान चहा मसाला! सेंद्रिय सुंठ (Sonth), लहान हिरवी वेलची, काळी मिरी, दालचिनी आणि लवंग यांचे सुवर्ण मिश्रण. १ चिमूट मसाला तुमच्या रोजच्या चहाचे रूपांतर शाही अमृततुल्य चहामध्ये करतो.',
    descriptionEn: 'An immunity-boosting Ayurvedic tea elixir. Features organic sun-cured dry ginger (sonth), fragrant green cardamom, Tellicherry black pepper, Ceylon cinnamon, and cloves. A mere pinch transforms everyday milk chai into aromatic Maharashtrian Amrittulya chai.',
    category: 'masala',
    spiceLevel: 2,
    badgeMr: 'आरोग्यदायी • Immunity Booster',
    badgeEn: 'Royal Amrittulya Chai Blend',
    rating: 4.99,
    reviewCount: 480,
    imageUrl: '/products/metkut-rice.jpg',
    ingredientsMr: ['गावरान सुंठ', 'हिरवी वेलची', 'काळी मिरी', 'दालचिनी', 'लवंग', 'जायफळ'],
    ingredientsEn: ['Desi Dry Ginger (Sonth)', 'Green Cardamom', 'Black Pepper', 'Cinnamon', 'Cloves', 'Nutmeg'],
    pairingRecommendationsMr: ['सकाळचा अमृततुल्य चहा', 'रोगप्रतिकारक काढा', 'मसाला दूध'],
    pairingRecommendationsEn: ['Morning Amrittulya Chai', 'Ayurvedic Herbal Kadha', 'Festive Masala Milk'],
    whereToUseMr: [
      '२ कप चहा उकळताना केवळ १/४ चमचा चहा मसाला घाला.',
      'खोकला किंवा सर्दी असल्यास मध व गरम पाण्यात चिमूटभर मिसळून काढा म्हणून प्या.'
    ],
    whereToUseEn: [
      'Add just 1/4 tsp per 2 cups while tea is vigorously boiling.',
      'Sip with warm water and raw honey as a soothing throat elixir.'
    ],
    storageTipsMr: 'काचेच्या लहान बाटलीत ठेवा. १ वर्ष सुवास तसाच राहतो.',
    storageTipsEn: 'Store sealed in an airtight glass container. Retains peak aroma for 12 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '310 kcal / 100g', protein: '8.2g', healthyFats: '7.1g', fiber: '26.4g' },
    sizes: [
      { size: '100g', grams: 100, price: 125, originalPrice: 155, inStock: true },
      { size: '250g', grams: 250, price: 250, originalPrice: 310, inStock: true },
      { size: '500g', grams: 500, price: 460, originalPrice: 580, inStock: true },
      { size: '1kg', grams: 1000, price: 880, originalPrice: 1090, inStock: true }
    ],
    isBestSeller: true,
    isRegionalSpecialty: false,
    regionOriginMr: 'महाराष्ट्र',
    regionOriginEn: 'Maharashtra Heritage'
  },
  {
    id: 'prod-biryani-masala',
    nameMr: 'मराठमोळा शाही बिर्याणी व पुलाव मसाला',
    nameEn: 'Maharashtrian Shahi Dum Biryani & Pulao Masala',
    taglineMr: 'केसर, दगडफूल, शहाजिरे व जावित्रीची शाही बिर्याणी सुगंध',
    taglineEn: 'Royal dum aroma blend with shahjeera, mace, nutmeg & star anise',
    descriptionMr: 'घरोघरी हॉटेलसारखी अस्सल मराठमोळी दम बिर्याणी बनवण्यासाठी खास तयार केलेला शाही मसाला. काश्मिरी केसर, शहाजिरे, जावित्री, मोठी वेलची आणि दगडफूल यांचे अनोखे मिश्रण बिर्याणीच्या प्रत्येक दाण्याला सुगंधित आणि चवदार बनवते.',
    descriptionEn: 'The secret to authentic royal Dum Biryani and celebratory pulavs. Rich with royal caraway (shahjeera), Kashmiri saffron strands, mace, black cardamom, star anise, and stone flower. Imparts irresistible royal fragrance to every grain of rice.',
    category: 'masala',
    spiceLevel: 3,
    badgeMr: 'शाही दम बिर्याणी स्पेशल',
    badgeEn: 'Royal Dum Biryani Special',
    rating: 4.95,
    reviewCount: 315,
    imageUrl: '/products/kala-masala.jpg',
    ingredientsMr: ['शहाजिरे', 'जावित्री', 'दगडफूल', 'चक्रीफूल', 'मोठी वेलची', 'दालचिनी', 'लवंग', 'तमालपत्र', 'केशर'],
    ingredientsEn: ['Royal Caraway (Shahjeera)', 'Mace (Javitri)', 'Stone Flower', 'Star Anise', 'Black Cardamom', 'Cinnamon', 'Cloves', 'Bay Leaf', 'Saffron'],
    pairingRecommendationsMr: ['दम मटण बिर्याणी', 'चिकन दम बिर्याणी', 'मटार पुलाव', 'पनीर टिक्का बिर्याणी'],
    pairingRecommendationsEn: ['Dum Mutton Biryani', 'Chicken Dum Biryani', 'Matar Pulav', 'Paneer Tikka Biryani'],
    whereToUseMr: [
      'मॅरिनेशनमध्ये २ चमचे आणि तांदळाच्या थरावर १ चमचा तूप व दुधासोबत घाला.',
      'मटार पुलाव किंवा व्हेजिटेबल बिर्याणीमध्ये वापरा.'
    ],
    whereToUseEn: [
      'Mix 2 tbsp in meat or veg marinade and sprinkle 1 tsp over rice layers before Dum.',
      'Perfect fragrance enhancer for festive peas pulav and vegetable biryani.'
    ],
    storageTipsMr: 'काचेच्या बरणीत घट्ट झाकून ठेवा. १ वर्ष सुगंध टिकतो.',
    storageTipsEn: 'Store sealed in an airtight glass container. Stays fresh for 12 months.',
    hsnCode: '09109100',
    nutritionFacts: { calories: '315 kcal / 100g', protein: '9.6g', healthyFats: '12.0g', fiber: '22.8g' },
    sizes: [
      { size: '100g', grams: 100, price: 115, originalPrice: 145, inStock: true },
      { size: '250g', grams: 250, price: 235, originalPrice: 295, inStock: true },
      { size: '500g', grams: 500, price: 440, originalPrice: 550, inStock: true },
      { size: '1kg', grams: 1000, price: 840, originalPrice: 1040, inStock: true }
    ],
    isBestSeller: false,
    isRegionalSpecialty: false,
    regionOriginMr: 'पुणे व मराठवाडा',
    regionOriginEn: 'Maharashtra'
  }
];

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'masala',
    nameMr: 'अस्सल मसाले (Pure Masales)',
    nameEn: 'Authentic Masalas & Blends',
    descriptionMr: 'दगडी खलबत्त्यात कुटलेले, खमंग भाजलेले पारंपारिक मसाले व गरम मसाले',
    descriptionEn: 'Stone-crushed slow-roasted authentic gravy, rassa and seasoning masalas',
    icon: 'Flame',
    sortOrder: 1
  },
  {
    id: 'chutney',
    nameMr: 'पारंपरिक चटण्या (Chutneys)',
    nameEn: 'Traditional Dry Chutneys',
    descriptionMr: 'सोलापुरी शेंगदाणा, कोल्हापुरी कांदा-लसूण, जवस, तीळ व कारळे चटण्या',
    descriptionEn: 'Stone-pounded peanut, flaxseed, sesame and roasted garlic dry chutneys',
    icon: 'Sparkles',
    sortOrder: 2
  },
  {
    id: 'pickle',
    nameMr: 'गावरान लोणची (Pickles)',
    nameEn: 'Heritage Pickles (Lonche)',
    descriptionMr: 'राईच्या डाळीत व लाकडी घाण्याच्या तेलात मुरवलेली गावरान लोणची',
    descriptionEn: 'Aged in earthen jars with wood-pressed oil and cracked mustard seeds',
    icon: 'Jar',
    sortOrder: 3
  },
  {
    id: 'specialty',
    nameMr: 'खास मेतकूट व पाचक (Specialties)',
    nameEn: 'Metkut & Digestive Powders',
    descriptionMr: 'पाचक मेतकूट, पंचामृत आणि बहुगुणी पारंपरिक मिश्रण',
    descriptionEn: 'Nutritious roasted lentil powders, Panchamrut and Ayurvedic relishes',
    icon: 'Award',
    sortOrder: 4
  }
];

export const INITIAL_RAW_STOCKS: RawIngredientStock[] = [
  {
    id: 'stock-peanuts',
    nameMr: 'सोलापुरी टपोरे शेंगदाणे',
    nameEn: 'Solapuri Jumbo Peanuts',
    currentStockKg: 340,
    lowStockThresholdKg: 100,
    unitCostPerKg: 130,
    sourceRegion: 'Solapur APMC',
    lastProcuredDate: '2026-08-10'
  },
  {
    id: 'stock-coconut',
    nameMr: 'कोकणी सुके खोबरे वाट्या',
    nameEn: 'Konkani Dry Copra Kernels',
    currentStockKg: 185,
    lowStockThresholdKg: 75,
    unitCostPerKg: 210,
    sourceRegion: 'Ratnagiri Orchards',
    lastProcuredDate: '2026-08-11'
  },
  {
    id: 'stock-garlic',
    nameMr: 'गावरान रानटी गावरान लसूण',
    nameEn: 'Desi Pungent Garlic Bulbs',
    currentStockKg: 120,
    lowStockThresholdKg: 50,
    unitCostPerKg: 190,
    sourceRegion: 'Satara & Junnar',
    lastProcuredDate: '2026-08-12'
  },
  {
    id: 'stock-chilli-bedgi',
    nameMr: 'बेडगी व संकेश्वरी लाल मिरच्या',
    nameEn: 'Bedgi & Sankeshwari Chillies',
    currentStockKg: 210,
    lowStockThresholdKg: 80,
    unitCostPerKg: 240,
    sourceRegion: 'Kolhapur Spice Yard',
    lastProcuredDate: '2026-08-09'
  },
  {
    id: 'stock-sesame',
    nameMr: 'गावरान पांढरे व तपकिरी तीळ',
    nameEn: 'Desi Natural Sesame Seeds',
    currentStockKg: 145,
    lowStockThresholdKg: 60,
    unitCostPerKg: 175,
    sourceRegion: 'Latur Mandi',
    lastProcuredDate: '2026-08-08'
  },
  {
    id: 'stock-flaxseed',
    nameMr: 'गावरान गावठी जवस',
    nameEn: 'Organic Brown Flaxseed',
    currentStockKg: 160,
    lowStockThresholdKg: 50,
    unitCostPerKg: 120,
    sourceRegion: 'Beed Organic Farms',
    lastProcuredDate: '2026-08-12'
  },
  {
    id: 'stock-sendhav',
    nameMr: 'गुलाबी सेंधव खडे मीठ',
    nameEn: 'Himalayan Pink Rock Salt',
    currentStockKg: 290,
    lowStockThresholdKg: 100,
    unitCostPerKg: 45,
    sourceRegion: 'Rock Salt Depot',
    lastProcuredDate: '2026-08-05'
  },
  {
    id: 'stock-oil',
    nameMr: 'लाकडी घाण्याचे शेंगदाणा तेल',
    nameEn: 'Cold-Pressed Groundnut Oil (Liters)',
    currentStockKg: 310,
    lowStockThresholdKg: 100,
    unitCostPerKg: 220,
    sourceRegion: 'Traditional Wood Ghani Sangli',
    lastProcuredDate: '2026-08-13'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'AG-89421',
    customer: {
      fullName: 'सचिन यशवंत पाटील (Sachin Patil)',
      phone: '+91 98220 44192',
      email: 'sachin.patil@example.com',
      addressLine1: 'फ्लॅट ३०२, मोरया रेसिडेन्सी, कर्वे नगर',
      addressLine2: 'कमिन्स कॉलेज जवळ',
      landmark: 'गणपती मंदिराच्या मागे',
      talukaDistrict: 'पुणे (Pune)',
      pincode: '411052',
      state: 'Maharashtra',
      deliveryNotes: 'दुपारी २ च्या आधी डिलिव्हर करा'
    },
    items: [
      {
        id: 'item-1',
        isCustomRecipe: true,
        titleMr: 'रेश्माच्या हातची खास शेंगदाणा-लसूण चटणी',
        titleEn: 'Custom Jar: Reshma’s Special Peanut-Garlic Chutney',
        size: '500g',
        quantity: 1,
        unitPrice: 385,
        totalPrice: 385,
        customDetails: {
          customName: 'रेश्माच्या हातची खास चटणी',
          tagline: 'अस्सल सोलापुरी चव',
          baseIngredients: {
            peanuts: 60,
            dryCoconut: 20,
            sesameSeeds: 10,
            flaxseed: 0,
            redChilliBase: 10
          },
          spiceLevel: 4,
          chilliVariety: 'sankeshwari',
          garlicLevel: 'extra',
          saltType: 'sendhav',
          oilType: 'groundnut_cold_pressed',
          texture: 'coarse_stone_pounded',
          packSizeGrams: 500,
          packagingType: 'glass_heritage_jar',
          calculatedPrice: 385
        }
      },
      {
        id: 'item-2',
        isCustomRecipe: false,
        titleMr: 'सुके खोबरे लसूण चटणी (वडापाव स्पेशल)',
        titleEn: 'Dry Coconut Garlic Vada Pav Chutney',
        size: '250g',
        quantity: 2,
        unitPrice: 175,
        totalPrice: 350
      }
    ],
    subtotal: 735,
    shippingFee: 0,
    discount: 50,
    couponCode: 'GAVRAN50',
    totalAmount: 685,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    transactionId: 'UPI-TXN-90184201',
    orderStatus: 'blending_in_workshop',
    createdAt: '2026-08-15T09:30:00Z',
    estimatedDeliveryDate: '2026-08-16',
    assignedDeliveryPerson: {
      name: 'ज्ञानेश्वर सावंत (Dnyaneshwar Sawant)',
      phone: '+91 97654 32100',
      vehicleNumber: 'MH 12 BK 4091'
    },
    deliveryOtp: '7482'
  },
  {
    id: 'AG-89419',
    customer: {
      fullName: 'सौ. अनघा जोशी (Anagha Joshi)',
      phone: '+91 94231 88201',
      email: 'anagha.joshi@example.com',
      addressLine1: 'बंगलो नं. १२, शांतिनिकेतन सोसायटी, ताराबाई पार्क',
      landmark: 'महालक्ष्मी मंदिर परिसर',
      talukaDistrict: 'कोल्हापूर (Kolhapur)',
      pincode: '416003',
      state: 'Maharashtra'
    },
    items: [
      {
        id: 'item-3',
        isCustomRecipe: false,
        titleMr: 'गावरान कांदा-लसूण चटणी (कोल्हापुरी स्पेशल)',
        titleEn: 'Gavran Kanda-Lasun Chutney (Spicy Kolhapuri)',
        size: '1kg',
        quantity: 1,
        unitPrice: 590,
        totalPrice: 590
      },
      {
        id: 'item-4',
        isCustomRecipe: false,
        titleMr: 'गावरान तिळाची चटणी',
        titleEn: 'Authentic Roasted Sesame Seed Chutney',
        size: '500g',
        quantity: 1,
        unitPrice: 290,
        totalPrice: 290
      }
    ],
    subtotal: 880,
    shippingFee: 0,
    discount: 0,
    totalAmount: 880,
    paymentMethod: 'razorpay_cards',
    paymentStatus: 'paid',
    transactionId: 'RZP-PAY-88391024',
    orderStatus: 'out_for_delivery',
    createdAt: '2026-08-14T14:15:00Z',
    estimatedDeliveryDate: '2026-08-15',
    assignedDeliveryPerson: {
      name: 'विक्रम मोहिते (Vikram Mohite)',
      phone: '+91 98901 12345',
      vehicleNumber: 'MH 09 DX 7712'
    },
    deliveryOtp: '5193'
  },
  {
    id: 'AG-89408',
    customer: {
      fullName: 'अमित कांबळे (Amit Kamble)',
      phone: '+91 98811 00223',
      email: 'amit.kamble@example.com',
      addressLine1: 'रो-हाऊस ४, संस्कृती एन्क्लेव्ह, सातारा रोड',
      talukaDistrict: 'सातारा (Satara)',
      pincode: '415001',
      state: 'Maharashtra'
    },
    items: [
      {
        id: 'item-5',
        isCustomRecipe: false,
        titleMr: 'अस्सल जवसाची चटणी (ओमेगा-३)',
        titleEn: 'Authentic Flaxseed Chutney',
        size: '500g',
        quantity: 1,
        unitPrice: 300,
        totalPrice: 300
      }
    ],
    subtotal: 300,
    shippingFee: 40,
    discount: 0,
    totalAmount: 340,
    paymentMethod: 'cod',
    paymentStatus: 'pending_cod',
    orderStatus: 'delivered',
    createdAt: '2026-08-13T11:00:00Z',
    estimatedDeliveryDate: '2026-08-14',
    deliveryTime: '2026-08-14T16:45:00Z',
    assignedDeliveryPerson: {
      name: 'महेश जाधव (Mahesh Jadhav)',
      phone: '+91 99223 99881',
      vehicleNumber: 'MH 11 AT 1822'
    }
  }
];
