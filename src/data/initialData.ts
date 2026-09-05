import { Product, BaseIngredientOption, SpiceLevelOption, GarlicOption, SaltOption, OilOption, RawIngredientStock, Order } from '../types';

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
    id: 'prod-shengdana-chutney',
    nameMr: 'सोलापुरी खमंग शेंगदाणा चटणी (Shenga Chutney)',
    nameEn: 'Solapuri Roasted Peanut Chutney (Shenga Chutney)',
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
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1000&q=85',
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
    id: 'prod-kanda-lasun',
    nameMr: 'गावरान कांदा-लसूण चटणी (कोल्हापुरी स्पेशल)',
    nameEn: 'Gavran Kanda-Lasun Chutney (Kolhapuri Special)',
    taglineMr: 'कोल्हापूरच्या लवंगी मिरचीची व भाजलेल्या कांद्याची अस्सल चव',
    taglineEn: 'Slow-roasted onions & stone-pounded fiery Kolhapuri garlic blend',
    descriptionMr: 'महाराष्ट्रातील अस्सल गृहिणींच्या परंपरेतून साकारलेली ही कांदा-लसूण चटणी. मंद आचेवर भाजलेला कांदा, गावरान लसूण आणि कोल्हापूरची लवंगी मिरची एकत्र खलबत्त्यात कुटून तयार केली जाते. लाल गडद रंग व खमंग सुवास.',
    descriptionEn: 'The pride of Maharashtrian kitchens. Authentic slow-caramelized onions, hand-peeled desi garlic, and sun-cured Kolhapuri chillies stone-pounded to rich perfection. Authentic rustic red paste and powder blend.',
    category: 'chutney',
    spiceLevel: 4,
    badgeMr: 'खवय्यांची पसंती (Best Seller)',
    badgeEn: 'Best Seller',
    rating: 4.9,
    reviewCount: 342,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
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
    regionOriginMr: 'कोल्हापूर & सांगली',
    regionOriginEn: 'Kolhapur & Sangli'
  },
  {
    id: 'prod-vada-pav-coconut',
    nameMr: 'सुके खोबरे लसूण चटणी (वडापाव स्पेशल कोरडी लाल चटणी)',
    nameEn: 'Dry Coconut Garlic Chutney (Vada Pav Red Chutney)',
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
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
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
    nameMr: 'गावरान तिळाची चटणी (कॅल्शियमयुक्त पारंपरिक चव)',
    nameEn: 'Authentic Roasted Sesame Seed Chutney (Til Chutney)',
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
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1000&q=85',
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
    nameMr: 'अस्सल जवसाची चटणी (ओमेगा-३ हेल्दी सुपरफूड)',
    nameEn: 'Authentic Flaxseed Chutney (Javas / Alsi Chutney)',
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
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
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
    nameMr: 'हिरवा मिरची-लसूण अस्सल कोल्हापुरी ठेचा / खर्डा',
    nameEn: 'Authentic Kolhapuri Green Chilli & Garlic Thecha (Kharda)',
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
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
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
    nameMr: 'अस्सल खुरासणी / कारळे चटणी (Khurasani Chutney)',
    nameEn: 'Authentic Khurasani / Karale Niger Seed Chutney',
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
    imageUrl: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80',
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
    nameMr: 'अस्सल गावरान काळा मसाला (२४ मसाल्यांचा मेळ)',
    nameEn: 'Traditional Gavran Goda / Kala Masala (24 Spices)',
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
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
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
