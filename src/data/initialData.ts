import { Product, ProductCategory, BaseIngredientOption, SpiceLevelOption, GarlicOption, SaltOption, OilOption, RawIngredientStock, Order } from '../types';

export const BASE_INGREDIENTS: BaseIngredientOption[] = [
  {
    id: 'peanuts',
    nameMr: 'भाजलेले शेंगदाणे',
    nameEn: 'Roasted Peanuts',
    marathiScript: 'शेंगदाणे',
    descriptionMr: 'खरपूस भाजलेले आणि खमंग खुसखुशीत',
    descriptionEn: 'Crispy slow-roasted peanuts rich in protein and crunchy bite',
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
    descriptionMr: 'दर्जेदार सुके खोबरे, मंद आचेवर भाजलेले',
    descriptionEn: 'Sun-dried roasted coconut flakes for natural texture',
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
    descriptionMr: 'ओमेगा-३ युक्त निरोगी जवस, हृदयासाठी उत्तम',
    descriptionEn: 'Omega-3 power-packed roasted flaxseeds for digestion and health',
    color: '#8C5242',
    patternColor: '#5C3826',
    pricePer100g: 38,
    iconName: 'HeartPulse',
    aromaNotes: 'सुदृढ आरोग्यासाठी खास गावठी जवस'
  },
  {
    id: 'redChilliBase',
    nameMr: 'खास लवंगी / बेडगी तिखट बेस',
    nameEn: 'Pure Bedgi & Lavangi Chilli Base',
    marathiScript: 'लाल तिखट बेस',
    descriptionMr: 'लाल मिरचीची खरी धगधगती चव व नैसर्गिक गडद लाल रंग',
    descriptionEn: 'Sun-dried whole chillies with natural color',
    color: '#DC2626',
    patternColor: '#991B1B',
    pricePer100g: 50,
    iconName: 'Flame',
    aromaNotes: 'गावरान चव आणि सुरेख लाल रंग'
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
    scovilleDescEn: 'Zesty kick with bold chilli heat',
    color: '#F97316',
    flameCount: 3
  },
  {
    level: 4,
    labelMr: 'लवंगी ठसका',
    labelEn: 'Fiery (Extra Hot)',
    scovilleDescMr: 'जिभेवर ठसका देणारी गावरान लवंगी मिरची',
    scovilleDescEn: 'Spicy kick that opens up all senses',
    color: '#EF4444',
    flameCount: 4
  },
  {
    level: 5,
    labelMr: 'गावरान अंगार (Extreme Hot)',
    labelEn: 'Gavran Angar (Extreme)',
    scovilleDescMr: 'रस्सा प्रेमींसाठी खास जळजळीत चव',
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
    descMr: 'गावरान खमंग लसणाचा स्वाद',
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
    labelMr: 'शुद्ध मीठ',
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
    labelMr: 'लाकडी घाण्याचे शेंगदाणा तेल',
    labelEn: 'Wood-Pressed Groundnut Oil Drizzle',
    extraPrice: 25,
    descMr: 'पारंपरिक पद्धतीने मुरवलेली ओली चटणी',
    descEn: 'Infused with cold-pressed groundnut oil'
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
    "id": "prod-kanda-lasun",
    "nameMr": "कांदा-लसूण चटणी",
    "nameEn": "Kanda-Lasun Chutney",
    "taglineMr": "भाजलेला कांदा, लसूण आणि लाल मिरचीचा खमंग मसाला",
    "taglineEn": "Roasted onion, garlic & red chilli spice blend",
    "descriptionMr": "मंद आचेवर भाजलेला कांदा, लसूण आणि लाल मिरची एकत्र करून तयार केलेला मसाला. रस्सा भाजी, उसळ, मिसळ किंवा जेवणात रोजच्या वापरासाठी उत्तम.",
    "descriptionEn": "Slow-roasted onions, garlic cloves, and red chillies blended into a flavorful dry spice blend. Great for everyday gravies, curries, and dal.",
    "category": "chutney",
    "spiceLevel": 4,
    "badgeMr": "बेस्ट सेलर",
    "badgeEn": "Best Seller",
    "rating": 4.98,
    "reviewCount": 780,
    "imageUrl": "/products/1000170201.jpg",
    "ingredientsMr": [
      "भाजलेला कांदा",
      "लसूण",
      "लाल मिरची",
      "तेल",
      "मीठ",
      "धने-जिरे"
    ],
    "ingredientsEn": [
      "Roasted Onion",
      "Garlic Cloves",
      "Red Chillies",
      "Oil",
      "Sea Salt",
      "Coriander & Cumin"
    ],
    "pairingRecommendationsMr": [
      "गरम भाकरी",
      "मिसळ",
      "पिठलं-भात",
      "सुक्की भाजी"
    ],
    "pairingRecommendationsEn": [
      "Hot Bhakri",
      "Misal",
      "Pithla Bhaat",
      "Curry Accompaniment"
    ],
    "whereToUseMr": [
      "भाजी किंवा रस्सा बनवताना फोडणीत १-२ चमचे घालून खमंग चव आणा.",
      "पिठलं आणि शेव भाजीसाठी मुख्य मसाला म्हणून वापरा.",
      "गरम भाकरी आणि दह्यासोबत थेट तोंडी लावण्यासाठी वापरा."
    ],
    "whereToUseEn": [
      "Add 1-2 tablespoons while cooking gravies and curries for rich flavor.",
      "Use as base seasoning for Pithla and Shev Bhaji.",
      "Serve alongside hot Bhakri and curd."
    ],
    "hygienePrecautionsMr": [
      "नैसर्गिकरीत्या सुकवलेल्या मिरच्या: कोणत्याही रासायनिक प्रक्रियेविना सूर्यप्रकाशात वाळवलेल्या लाल मिरच्या.",
      "घाण्याचे शुद्ध तेल: फोडणी व भाजणीसाठी केवळ शुद्ध घाण्याचे तेल वापरले जाते.",
      "स्वच्छतेची त्रिसूत्री: लसूण व कांदा हाताने निवडून, स्वच्छ धुवून व वाळवूनच तयार केला जातो."
    ],
    "hygienePrecautionsEn": [
      "Naturally Sun-Dried Chillies: Raw peppers naturally cured under direct sunlight.",
      "Pure Cold-Pressed Oil: Roasted solely using unadulterated groundnut oil.",
      "Hand-Inspected & Sorted: Each clove of garlic and bulb of onion is cleaned and sorted manually."
    ],
    "storageTipsMr": "कोरड्या जागी हवाबंद बरणीत ठेवा. पाण्याचा थेंबही लागू देऊ नका. ९ महिने उत्तम टिकते.",
    "storageTipsEn": "Store in an airtight jar in a cool place. Avoid moisture contact. Best before 9 months.",
    "hsnCode": "21039090",
    "nutritionFacts": {
      "calories": "185 kcal / 100g",
      "protein": "6.4g",
      "healthyFats": "8.2g",
      "fiber": "7.1g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 165,
        "originalPrice": 195,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 310,
        "originalPrice": 380,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 590,
        "originalPrice": 740,
        "inStock": true
      }
    ],
    "isBestSeller": true,
    "isRegionalSpecialty": true,
    "regionOriginMr": "खास मिश्रण",
    "regionOriginEn": "Special Blend"
  },
  {
    "id": "prod-shengdana-chutney",
    "nameMr": "शेंगदाणा आणि लसूण चटणी",
    "nameEn": "Peanut and Garlic Chutney",
    "taglineMr": "खमंग भाजलेले शेंगदाणे आणि लसणाची कोरडी चटणी",
    "taglineEn": "Classic roasted peanut dry chutney with garlic",
    "descriptionMr": "मंद आचेवर खमंग भाजलेले शेंगदाणे, लसूण, लाल मिरची आणि मीठ एकत्र करून तयार केलेली चवदार कोरडी चटणी.",
    "descriptionEn": "Slow-roasted peanuts prepared with garlic, sea salt, and red chilli flakes. A classic savory dry chutney for everyday meals.",
    "category": "chutney",
    "spiceLevel": 3,
    "badgeMr": "लोकप्रिय",
    "badgeEn": "Popular",
    "rating": 4.95,
    "reviewCount": 512,
    "imageUrl": "/products/1000170225.jpg",
    "ingredientsMr": [
      "शेंगदाणे",
      "लसूण",
      "लाल मिरची",
      "कच्चे शेंगदाणा तेल",
      "मीठ"
    ],
    "ingredientsEn": [
      "Jumbo Peanuts",
      "Garlic",
      "Red Chilli",
      "Groundnut Oil",
      "Salt"
    ],
    "pairingRecommendationsMr": [
      "गरम भाकरी",
      "दही-पोहे",
      "उपमा",
      "तूप-वरण-भात",
      "थालीपीठ लोणी"
    ],
    "pairingRecommendationsEn": [
      "Crisp Bhakri",
      "Dahi Poha",
      "Upma",
      "Varan Bhaat with Ghee",
      "Thalipeeth with Butter"
    ],
    "whereToUseMr": [
      "गरमागरम ज्वारीच्या किंवा बाजरीच्या भाकरीवर १ चमचा चटणी व त्यावर थोडे तेल ओतून खा.",
      "सकाळच्या पोहे, उपमा किंवा शिऱ्यावर भुरभुरवून खमंग चव वाढवा.",
      "वरण-भातावर साजूक तूप आणि १ चमचा शेंगदाणा चटणी घालून आस्वाद घ्या.",
      "गरम थालीपीठासोबत घरचे लोणी आणि ही चटणी छान लागते."
    ],
    "whereToUseEn": [
      "Sprinkle generously on hot Jowar or Bajra Bhakri with a drizzle of oil.",
      "Dust over morning Poha, Upma, or Khichdi for instant crunch and garlic warmth.",
      "Spoon over steaming Varan Bhaat (Dal Rice) along with melted Ghee.",
      "Serve alongside Thalipeeth and fresh butter."
    ],
    "hygienePrecautionsMr": [
      "१००% शून्य प्रिझर्व्हेटिव्ह: आम्ही कोणत्याही प्रकारचे कृत्रिम रंग किंवा प्रिझर्व्हेटिव्ह वापरत नाही.",
      "पारंपारिक पद्धत: मंद वेगाने तयार केल्यामुळे शेंगदाण्यातील नैसर्गिक तेल व चव सुरक्षित राहते."
    ],
    "hygienePrecautionsEn": [
      "Zero Chemical Preservatives: 100% free from artificial flavor enhancers or synthetic food colorings.",
      "Slow Traditional Preparation: Processed gently to retain wholesome natural plant oils."
    ],
    "storageTipsMr": "नेहमी कोरड्या चमच्याने वापरा. थेट सूर्यप्रकाशापासून दूर थंड व कोरड्या जागी ठेवा. ६ महिने ताजी राहते.",
    "storageTipsEn": "Always use a dry spoon. Store in a cool, dry place away from direct sunlight. Shelf life: 6 months.",
    "hsnCode": "21039090",
    "nutritionFacts": {
      "calories": "280 kcal / 100g",
      "protein": "11.5g",
      "healthyFats": "21.0g",
      "fiber": "5.8g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 150,
        "originalPrice": 180,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 280,
        "originalPrice": 340,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 540,
        "originalPrice": 660,
        "inStock": true
      }
    ],
    "isBestSeller": true,
    "isRegionalSpecialty": true,
    "regionOriginMr": "खास मिश्रण",
    "regionOriginEn": "Special Blend"
  },
  {
    "id": "prod-vada-pav-coconut",
    "nameMr": "सुख खोबरं आणि लसूण चटणी",
    "nameEn": "Dried Coconut and Garlic Chutney",
    "taglineMr": "भाजलेले सुके खोबरे आणि लसणाची कुरकुरीत लाल कोरडी चटणी",
    "taglineEn": "Crispy roasted coconut & golden garlic red dry chutney powder",
    "descriptionMr": "भाजलेले सुके खोबरे, भाजलेला लसूण आणि लाल मिरची यांचे खमंग आणि कुरकुरीत मिश्रण. वडापाव, समोसा आणि स्नॅक्ससाठी उत्तम.",
    "descriptionEn": "Toasted dry coconut, crisp roasted garlic flakes, and vibrant red chilli blended into a crispy savory powder.",
    "category": "chutney",
    "spiceLevel": 3,
    "badgeMr": "१००% नैसर्गिक",
    "badgeEn": "100% Natural",
    "rating": 4.8,
    "reviewCount": 289,
    "imageUrl": "/products/1000170174.jpg",
    "ingredientsMr": [
      "सुके खोबरे",
      "भाजलेला लसूण",
      "लाल मिरची",
      "सेंधव मीठ",
      "हिंग"
    ],
    "ingredientsEn": [
      "Dried Coconut",
      "Crisp Fried Garlic",
      "Red Chilli Powder",
      "Rock Salt",
      "Asafoetida"
    ],
    "pairingRecommendationsMr": [
      "गरमागरम वडा पाव",
      "समोसा",
      "कांदा भजी",
      "तूप-भात",
      "थालीपीठ"
    ],
    "pairingRecommendationsEn": [
      "Steaming Hot Vada Pav",
      "Samosa & Kanda Bhaji",
      "Ghee Rice",
      "Crispy Thalipeeth"
    ],
    "whereToUseMr": [
      "वडापावच्या पावामध्ये भरून छान चव मिळवा.",
      "गरमागरम भजी व समोसा सोबत क्रिस्पी डीप म्हणून सर्व्ह करा.",
      "गरम साध्या भातावर थोडे तूप आणि ही चटणी खाऊन बघा."
    ],
    "whereToUseEn": [
      "Stuff inside hot Pav alongside Vada for delicious savory crunch.",
      "Serve as a crispy crunchy dry dip with piping hot pakoras and samosas.",
      "Mix with plain hot steamed rice and butter for a quick treat."
    ],
    "hygienePrecautionsMr": [
      "निवडक वाळवलेले खोबरे: दर्जेदार ताजे खोबरे वापरले जाते.",
      "कमी तापमानावर भाजणी: खोबरे करपू न देता मंद आचेवर सोनेरी भाजल्याने नैसर्गिक चव टिकते."
    ],
    "hygienePrecautionsEn": [
      "Select Copra: Only sweet-smelling dry coconut used without artificial treatment.",
      "Slow Low-Heat Toasting: Toasted gently to golden perfection without burning delicate coconut fats."
    ],
    "storageTipsMr": "बरणीचे झाकण घट्ट बंद ठेवा. सूर्यप्रकाशापासून दूर कोरड्या जागी ठेवा. ६ महिने कुरकुरीत राहते.",
    "storageTipsEn": "Keep lid tightly closed. Store away from heat and direct sunlight. 6 months shelf life.",
    "hsnCode": "21039090",
    "nutritionFacts": {
      "calories": "240 kcal / 100g",
      "protein": "5.2g",
      "healthyFats": "16.8g",
      "fiber": "8.4g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 175,
        "originalPrice": 210,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 330,
        "originalPrice": 400,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 620,
        "originalPrice": 780,
        "inStock": true
      }
    ],
    "isBestSeller": true,
    "isRegionalSpecialty": true,
    "regionOriginMr": "खास मिश्रण",
    "regionOriginEn": "Special Blend"
  },
  {
    "id": "prod-til-chutney",
    "nameMr": "तीळाची चटणी",
    "nameEn": "Til (Sesame) Chutney",
    "taglineMr": "भाजलेले तीळ आणि लसणाची सुवासिक व पौष्टिक कोरडी चटणी",
    "taglineEn": "Naturally calcium-rich roasted sesame seeds with mild garlic spice",
    "descriptionMr": "मंद आचेवर भाजलेले तीळ, जिरे आणि लसूण एकत्र करून तयार केलेली पौष्टिक आणि खमंग चटणी. रोजच्या जेवणात चव वाढवण्यासाठी उत्तम.",
    "descriptionEn": "Slow-roasted unpolished sesame seeds prepared with cumin and mild garlic into a nutty dry chutney powder. Rich in natural calcium and dietary fiber.",
    "category": "chutney",
    "spiceLevel": 2,
    "badgeMr": "कॅल्शियमयुक्त",
    "badgeEn": "High Calcium",
    "rating": 4.9,
    "reviewCount": 198,
    "imageUrl": "/products/1000170198.jpg",
    "ingredientsMr": [
      "तीळ",
      "लसूण पाकळ्या",
      "भाजलेले जिरे",
      "लाल तिखट",
      "सेंधव मीठ"
    ],
    "ingredientsEn": [
      "Roasted Sesame Seeds",
      "Garlic Cloves",
      "Roasted Cumin",
      "Mild Red Chilli",
      "Sendhav Salt"
    ],
    "pairingRecommendationsMr": [
      "बाजरीची भाकरी व लोणी",
      "पोहे",
      "उकडपेंडी",
      "दडपे पोहे",
      "वरण-भात"
    ],
    "pairingRecommendationsEn": [
      "Bajra Bhakri with Homemade Butter",
      "Poha",
      "Ukadpendi",
      "Dadpe Pohe",
      "Varan Bhaat"
    ],
    "whereToUseMr": [
      "बाजरीच्या भाकरीवर साजूक तूप किंवा लोण्यासोबत १ चमचा तिळाची चटणी खा.",
      "पोहे किंवा उपम्यावर वरून भुरभुरवून पोषकता व खमंगपणा वाढवा.",
      "मुलांच्या डब्यामध्ये चपातीवर थोडे तूप आणि तिळाची चटणी रोल करून द्या."
    ],
    "whereToUseEn": [
      "Enjoy with hot Bajra Bhakri and fresh butter for a classic wholesome meal.",
      "Sprinkle over Poha or Upma for natural crunch and bone-strengthening calcium.",
      "Spread on Ghee Chapati and roll up for a wholesome school tiffin snack."
    ],
    "hygienePrecautionsMr": [
      "न पॉलिश केलेले तीळ: थेट शेतकऱ्यांचे नैसर्गिक तीळ वापरले जातात.",
      "शून्य प्रिझर्व्हेटिव्ह: आरोग्यदायी सेंधव मिठाचा समतोल वापर."
    ],
    "hygienePrecautionsEn": [
      "Unpolished Sesame: Sourced directly without chemical bleaching or polish.",
      "Pure Himalayan Rock Salt: Prepared with natural mineral-rich rock salt."
    ],
    "storageTipsMr": "थंड व कोरड्या जागी ठेवा. ६ महिने टिकते.",
    "storageTipsEn": "Store in a cool and dry pantry. Best for 6 months.",
    "hsnCode": "21039090",
    "nutritionFacts": {
      "calories": "265 kcal / 100g",
      "protein": "8.8g",
      "healthyFats": "19.2g",
      "fiber": "6.5g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 155,
        "originalPrice": 185,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 290,
        "originalPrice": 350,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 550,
        "originalPrice": 680,
        "inStock": true
      }
    ],
    "isBestSeller": false,
    "isRegionalSpecialty": true,
    "regionOriginMr": "नैसर्गिक",
    "regionOriginEn": "Natural"
  },
  {
    "id": "prod-kolhapuri-thecha",
    "nameMr": "हिरवी मिरची ठेचा",
    "nameEn": "Hiravi Mirchi Thecha",
    "taglineMr": "हिरवी मिरची, लसूण आणि शेंगदाण्याचा जाडसर ठेचा",
    "taglineEn": "Spicy green chilli, garlic & roasted peanut thecha",
    "descriptionMr": "तव्यावर भाजलेली ताजी हिरवी मिरची, लसूण, शेंगदाणे आणि मीठ एकत्र करून तयार केलेला खमंग ठेचा. भाकरी आणि जेवणासोबत उत्तम.",
    "descriptionEn": "Fresh green chillies, garlic, roasted peanuts, and sea salt coarsely crushed. Great companion for bhakri and dal rice.",
    "category": "thecha",
    "spiceLevel": 5,
    "badgeMr": "झणझणीत ठेचा",
    "badgeEn": "Spicy Thecha",
    "rating": 4.96,
    "reviewCount": 420,
    "imageUrl": "/products/1000170204.jpeg",
    "ingredientsMr": [
      "हिरवी लवंगी मिरची",
      "लसूण",
      "भाजलेले शेंगदाणे",
      "खडे मीठ",
      "तेल"
    ],
    "ingredientsEn": [
      "Green Lavangi Chillies",
      "Garlic",
      "Roasted Peanuts",
      "Sea Salt",
      "Groundnut Oil"
    ],
    "pairingRecommendationsMr": [
      "बाजरीची भाकरी",
      "पिठलं",
      "दही-भात",
      "वरण-भात"
    ],
    "pairingRecommendationsEn": [
      "Bajra Bhakri",
      "Pithla",
      "Curd Rice",
      "Varan Bhaat"
    ],
    "whereToUseMr": [
      "गरमागरम बाजरीची किंवा ज्वारीची भाकरी आणि पिठल्यासोबत हा ठेचा तोंडी लावा.",
      "दही-भातासोबत खाल्ल्यास ठेच्याचा ठसका आणि दह्याचा गारवा छान लागतो.",
      "सुख्या भाज्यांमध्ये किंवा उसळीमध्ये १ चमचा ठेचा टाकून चव वाढवा."
    ],
    "whereToUseEn": [
      "The companion to hot Bajra Bhakri and Pithla.",
      "Pair with curd rice to create a balanced contrast between spice and cool yoghurt.",
      "Stir into stir-fried veggies or sprout curries for green chilli zest."
    ],
    "hygienePrecautionsMr": [
      "ताजी शेतातील हिरवी लवंगी मिरची: थेट शेतातून तोडलेली ताजी मिरची वापरली जाते.",
      "शुद्ध तेल: हलक्या भाजणीसाठी दर्जेदार तेल वापरले जाते."
    ],
    "hygienePrecautionsEn": [
      "Farm-Fresh Lavangi Peppers: Fresh green peppers sorted and cleaned carefully.",
      "Pure Cold-Pressed Oil: Prepared without refined oils or artificial additives."
    ],
    "storageTipsMr": "उघडल्यानंतर फ्रीजमध्ये ठेवल्यास १ महिना ताजेपणा टिकून राहतो. कोरडा चमचा वापरा.",
    "storageTipsEn": "Refrigerate after opening to preserve green vibrancy. Use a dry spoon. 1-2 months.",
    "hsnCode": "21039090",
    "nutritionFacts": {
      "calories": "160 kcal / 100g",
      "protein": "4.8g",
      "healthyFats": "9.2g",
      "fiber": "6.0g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 170,
        "originalPrice": 200,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 320,
        "originalPrice": 390,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 600,
        "originalPrice": 750,
        "inStock": true
      }
    ],
    "isBestSeller": true,
    "isRegionalSpecialty": true,
    "regionOriginMr": "नैसर्गिक",
    "regionOriginEn": "Natural"
  },
  {
    "id": "prod-kala-masala",
    "nameMr": "काळा मसाला",
    "nameEn": "Kala Masala",
    "taglineMr": "दगडफूल, दालचिनी व भाजलेल्या खोबऱ्याचा सुगंधित मसाला",
    "taglineEn": "Roasted black spice blend for curries and vegetables",
    "descriptionMr": "सुगंधी खडे मसाले, दगडफूल, नागकेशर आणि खोबरे लोखंडी कढईत मंद आचेवर भाजून तयार केलेला हा काळा मसाला. शेव भाजी, उसळ आणि रस्सा भाजीला उत्तम चव देतो.",
    "descriptionEn": "A blend of whole spices including Stone Flower (Dagad Phool), Cobra Saffron (Nagkeshar), and dry copra slow-roasted in iron woks into a dark aromatic spice powder.",
    "category": "masala",
    "spiceLevel": 3,
    "badgeMr": "खडे मसाले",
    "badgeEn": "Whole Spices",
    "rating": 4.9,
    "reviewCount": 164,
    "imageUrl": "/products/1000170207.jpeg",
    "ingredientsMr": [
      "धने",
      "दगडफूल",
      "दालचिनी",
      "लवंग",
      "वेलदोडे",
      "तीळ",
      "खोबरे",
      "नागकेशर",
      "तमालपत्र",
      "जिरे",
      "हळकुंड"
    ],
    "ingredientsEn": [
      "Coriander",
      "Stone Flower",
      "Cassia Bark",
      "Cloves",
      "Cardamom",
      "Sesame",
      "Copra",
      "Nagkeshar",
      "Bay Leaves",
      "Cumin"
    ],
    "pairingRecommendationsMr": [
      "भरली वांगी",
      "तर्री उसळ",
      "काळा रस्सा",
      "कट वडा"
    ],
    "pairingRecommendationsEn": [
      "Stuffed Brinjal (Bharli Vangi)",
      "Spiced Usal",
      "Kala Rassa",
      "Kat Vada"
    ],
    "whereToUseMr": [
      "भरली वांगी, शेव भाजी, मटकी उसळ व चणा उसळ बनवताना १-२ चमचे काळा मसाला घाला.",
      "काळा रस्सा तयार करण्यासाठी मुख्य घटक.",
      "वांग्याचे भरीत, बटाट्याची सुकी भाजी व आमटीला सुवासिक चव देण्यासाठी."
    ],
    "whereToUseEn": [
      "Use 1-2 teaspoons for Bharli Vangi (Stuffed Eggplant), Shev Bhaji, and sprout curries.",
      "The flavorful heart of Black Curry (Kala Rassa).",
      "Adds rich dark aroma to Dal, vegetables, and gravies."
    ],
    "hygienePrecautionsMr": [
      "औषधी मसाले: कोणतेही भेसळयुक्त घटक न वापरता शुद्ध खडे मसाले वापरले जातात.",
      "लोखंडी कढईत मंद भाजणी: खडे मसाल्यांचा सुगंध व तेल जळून न जाता परिपूर्ण काळा रंग येतो."
    ],
    "hygienePrecautionsEn": [
      "Whole Aromatic Spices: Stone Flower, Nagkeshar, and natural condiments without synthetic fillers.",
      "Traditional Iron Wok Roasting: Roasted in heavy iron woks to yield signature deep complexity."
    ],
    "storageTipsMr": "हवाबंद काचेच्या बरणीत ठेवा. १२ महिने सुवास टिकून राहतो.",
    "storageTipsEn": "Store in airtight glass container. Maintains freshness for 12 months.",
    "hsnCode": "09109929",
    "nutritionFacts": {
      "calories": "190 kcal / 100g",
      "protein": "7.1g",
      "healthyFats": "9.4g",
      "fiber": "14.2g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 195,
        "originalPrice": 240,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 370,
        "originalPrice": 450,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 710,
        "originalPrice": 880,
        "inStock": true
      }
    ],
    "isBestSeller": false,
    "isRegionalSpecialty": true,
    "regionOriginMr": "खास मिश्रण",
    "regionOriginEn": "Special Blend"
  },
  {
    "id": "prod-metkut",
    "nameMr": "मेतकूट",
    "nameEn": "Metkut (Dry Lentil & Spice Mix)",
    "taglineMr": "भाजलेल्या डाळी, गहू, तांदूळ आणि सुंठीचे पाचक पीठ",
    "taglineEn": "Roasted lentils, grains and mild digestive spices for rice and ghee",
    "descriptionMr": "भाजलेली हरभरा डाळ, उडीद डाळ, मूग डाळ, गहू, तांदूळ, धने, जिरे, सुंठ आणि हळद मंद आचेवर भाजून बारीक केलेले हे पौष्टिक मेतकूट. भात आणि तुपासोबत अप्रतिम लागते.",
    "descriptionEn": "Roasted lentils (chana, urad, and moong dal) and golden grains ground with dry ginger, turmeric, coriander, and cumin. Delicious mixed into warm rice with ghee or curd.",
    "category": "masala",
    "spiceLevel": 1,
    "badgeMr": "पाचक मेतकूट",
    "badgeEn": "Digestive Powder",
    "rating": 4.97,
    "reviewCount": 342,
    "imageUrl": "/products/1000170234.jpeg",
    "ingredientsMr": [
      "भाजलेली हरभरा डाळ",
      "उडीद डाळ",
      "मूग डाळ",
      "गहू",
      "तांदूळ",
      "धने",
      "जिरे",
      "सुंठ",
      "हळद",
      "हिंग",
      "सेंधव मीठ"
    ],
    "ingredientsEn": [
      "Roasted Bengal Gram (Chana Dal)",
      "Black Gram (Urad Dal)",
      "Moong Dal",
      "Whole Wheat",
      "Rice",
      "Coriander Seeds",
      "Cumin",
      "Dry Ginger (Sunth)",
      "Turmeric",
      "Asafoetida (Hing)",
      "Rock Salt"
    ],
    "pairingRecommendationsMr": [
      "गरम वाफाळलेला भात आणि साजूक तूप",
      "दही-भात",
      "पोळीवर तूप लावून",
      "उपमा / दलिया"
    ],
    "pairingRecommendationsEn": [
      "Steaming Hot Rice with Ghee",
      "Curd Rice (Dahi Bhaat)",
      "Warm Roti with Ghee",
      "Savory Porridge / Upma"
    ],
    "whereToUseMr": [
      "गरम पांढऱ्या भातावर १-२ चमचे मेतकूट आणि तूप घालून कालवून खा.",
      "दही-भातात मिसळून खाल्ल्याने पचनक्रिया सुधारते आणि शरीराला थंडावा मिळतो.",
      "तोंडे चव नसताना किंवा पोटाच्या आरामासाठी तांदळाच्या पेजसोबत उपयुक्त."
    ],
    "whereToUseEn": [
      "Sprinkle 1-2 spoons over steaming hot white rice, crown with melted ghee, and mix gently.",
      "Mix into fresh curd rice for a comforting, gut-friendly meal.",
      "Ideal mild, nourishing diet with warm rice porridge."
    ],
    "hygienePrecautionsMr": [
      "मंद आचेवर खरपूस भाजणी: कडधान्ये व डाळी न जळता आतपर्यंत भाजल्या जातात.",
      "सुंठ आणि हिंगाची शुद्धता: नैसर्गिक पाचक गुणधर्म टिकवून ठेवले जातात."
    ],
    "hygienePrecautionsEn": [
      "Slow Dry Roasting: Roasted slowly to eliminate moisture and preserve aroma.",
      "Natural Healing Spices: Prepared with ginger and pure asafoetida."
    ],
    "storageTipsMr": "कोरड्या जागी हवाबंद बरणीत ठेवा. ६ महिने ताजे राहते.",
    "storageTipsEn": "Store in an airtight container away from moisture. Fresh for 6 months.",
    "hsnCode": "09109990",
    "nutritionFacts": {
      "calories": "345 kcal / 100g",
      "protein": "16.8g",
      "healthyFats": "4.2g",
      "fiber": "11.5g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 140,
        "originalPrice": 175,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 260,
        "originalPrice": 320,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 490,
        "originalPrice": 620,
        "inStock": true
      }
    ],
    "isBestSeller": true,
    "isRegionalSpecialty": true,
    "regionOriginMr": "नैसर्गिक",
    "regionOriginEn": "Natural"
  },
  {
    "id": "prod-ambyache-lonche",
    "nameMr": "आंब्याचं लोणचं",
    "nameEn": "Mango Loncha (Pickle)",
    "taglineMr": "मेथी-मोहरीच्या दाणेदार मसाल्यात आणि मोहरीच्या तेलात मुरवलेले कैरीचे लोणचे",
    "taglineEn": "Raw mango pickle cured with split mustard & fenugreek in mustard oil",
    "descriptionMr": "कच्च्या कैरीचे सुबक तुकडे, मेथीची डाळ, मोहरीची डाळ, हळद, हिंग आणि लाल तिखट एकत्र करून मोहरीच्या तेलात मुरवलेले रुचकर लोणचे. भाकरी, वरण-भात किंवा चपातीसोबत उत्तम लागते.",
    "descriptionEn": "Raw green mangoes diced and marinated in crushed fenugreek seeds, split yellow mustard seeds, asafoetida, and red chillies bathed in cold-pressed mustard oil.",
    "category": "pickle",
    "spiceLevel": 4,
    "badgeMr": "कैरीचे लोणचे",
    "badgeEn": "Raw Mango Pickle",
    "rating": 4.96,
    "reviewCount": 420,
    "imageUrl": "/products/1000170213.jpg",
    "ingredientsMr": [
      "कच्ची कैरी",
      "मोहरीची डाळ",
      "मेथीची डाळ",
      "मोहरीचे तेल",
      "बेडगी मिरची पूड",
      "हळद",
      "खडे मीठ",
      "हिंग"
    ],
    "ingredientsEn": [
      "Raw Green Mangoes",
      "Split Mustard Seeds",
      "Fenugreek Seeds",
      "Cold-Pressed Mustard Oil",
      "Bedgi Chilli Powder",
      "Turmeric",
      "Sea Salt",
      "Asafoetida (Hing)"
    ],
    "pairingRecommendationsMr": [
      "गरम वाफाळलेला वरण-भात व साजूक तूप",
      "कडक भाकरी",
      "दही-भात",
      "गरम चपाती व पोळी",
      "मठ्ठा"
    ],
    "pairingRecommendationsEn": [
      "Steaming Varan Bhaat with Ghee",
      "Crisp Bhakri",
      "Curd Rice (Dahi Bhaat)",
      "Fresh Wheat Phulka / Roti",
      "Spiced Buttermilk"
    ],
    "whereToUseMr": [
      "दुपारच्या जेवणात पानात डाव्या बाजूला वाढून जेवणाची रंगत वाढवा.",
      "मठ्ठा आणि वाफाळलेल्या मऊ भातावर साजूक तूप व १ फोड लोणचे कालवून खा.",
      "प्रवासात चपाती-रोलसोबत उत्तम टिकणारा सोबती."
    ],
    "whereToUseEn": [
      "Serve as an indispensable condiment on your daily meal plate.",
      "Pairs matchlessly with soft curd rice or steaming hot dal-rice crowned with ghee.",
      "Classic travel companion rolled inside warm rotis or parathas."
    ],
    "hygienePrecautionsMr": [
      "काचेच्या किंवा मातीच्या बरणीत नैसर्गिक ऊन देऊन मुरवले जाते.",
      "कोणताही कृत्रिम रंग किंवा रसायन वापरलेले नाही, शुद्ध मोहरीचे तेल नैसर्गिक संरक्षक म्हणून कार्य करते."
    ],
    "hygienePrecautionsEn": [
      "Cured naturally in sterilized ceramic and glass containers under filtered sun.",
      "100% free from artificial food colorings; preserved solely by rock salt and cold-pressed mustard oil."
    ],
    "storageTipsMr": "नेहमी कोरड्या चमच्याने काढावे. तेलाचा थर फोडींवर राहील याची काळजी घ्या. १२ महिने उत्तम टिकते.",
    "storageTipsEn": "Always handle with a dry spoon. Keep mango pieces immersed beneath the spice oil layer. Fresh for 12 months.",
    "hsnCode": "20019000",
    "nutritionFacts": {
      "calories": "165 kcal / 100g",
      "protein": "2.1g",
      "healthyFats": "12.4g",
      "fiber": "4.8g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 160,
        "originalPrice": 195,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 295,
        "originalPrice": 360,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 560,
        "originalPrice": 700,
        "inStock": true
      }
    ],
    "isBestSeller": true,
    "isRegionalSpecialty": true,
    "regionOriginMr": "नैसर्गिक",
    "regionOriginEn": "Natural"
  },
  {
    "id": "prod-limbache-lonche",
    "nameMr": "लिंबूचं लोणचं",
    "nameEn": "Limbuncha Loncha (Lemon Pickle)",
    "taglineMr": "ओवा, सेंधव मीठ व गूळ-मसाल्यात मुरवलेले तेलविरहित पाचक लिंबू लोणचे",
    "taglineEn": "Oil-free lemon pickle with carom seeds and digestive spices",
    "descriptionMr": "पातळ सालीचे रसदार कागदी लिंबू, ओवा, सेंधव मीठ, काळे मीठ, भाजलेले जिरे आणि सेंद्रिय गुळाच्या पाकात मुरवून तयार केलेले तेलविरहित लोणचे. पचनासाठी अत्यंत गुणकारी.",
    "descriptionEn": "Paper-thin juicy yellow lemons cubed and naturally matured with carom seeds (ajwain), black salt, roasted cumin, and unrefined jaggery syrup. 100% oil-free and naturally soothing for digestion.",
    "category": "pickle",
    "spiceLevel": 2,
    "badgeMr": "पाचक लिंबू लोणचे",
    "badgeEn": "Oil-Free Lemon Pickle",
    "rating": 4.98,
    "reviewCount": 388,
    "imageUrl": "/products/1000170210.jpg",
    "ingredientsMr": [
      "रसदार कागदी लिंबू",
      "सेंद्रिय गूळ",
      "ओवा (अजवायन)",
      "सेंधव व काळे मीठ",
      "भाजलेली जिरे पूड",
      "काश्मिरी लाल तिखट"
    ],
    "ingredientsEn": [
      "Juicy Thin-Skinned Lemons",
      "Organic Jaggery",
      "Carom Seeds (Ajwain)",
      "Rock Salt & Black Salt",
      "Roasted Cumin Powder",
      "Kashmiri Mild Chilli"
    ],
    "pairingRecommendationsMr": [
      "मुगाची मऊ खिचडी",
      "थालीपीठ",
      "दही-भात",
      "तोंडी लावण्यासाठी"
    ],
    "pairingRecommendationsEn": [
      "Comforting Moong Dal Khichdi",
      "Crispy Thalipeeth",
      "Curd Rice",
      "Appetite restoring side with light meals"
    ],
    "whereToUseMr": [
      "मऊ गरमागरम खिचडीवर साजूक तूप आणि १ चमचा लिंबू लोणचे घालून खा.",
      "अपचन, मळमळ किंवा तोंडाची चव गेली असल्यास १ छोटा तुकडा खाल्ल्याने आराम मिळतो.",
      "लहान मुलांना पोळीसोबत रोल करून देण्यासाठी चांगला पर्याय."
    ],
    "whereToUseEn": [
      "Crown hot moong dal khichdi with ghee and a spoonful of this sweet-tangy lemon pickle.",
      "Natural remedy to settle digestion and stimulate taste buds.",
      "Delicious spread for toddler rotis or soft parathas without greasy oils."
    ],
    "hygienePrecautionsMr": [
      "उन्हाच्या नैसर्गिक उष्णतेने काचेच्या बरणीत मुरवले जाते.",
      "कोणतेही व्हिनेगर किंवा रासायनिक ऍसिड न वापरता लिंबाच्या नैसर्गिक रसातच तयार होते."
    ],
    "hygienePrecautionsEn": [
      "Slow sun-ripened in sterilized glass vessels without artificial fermentation.",
      "Completely vinegar-free and oil-free; preserved purely by natural lemon citric juices and jaggery."
    ],
    "storageTipsMr": "कोरड्या जागी हवाबंद काचेच्या बरणीत ठेवा. जसजसे जुने होते तसतसा याचा स्वाद अधिक समृद्ध होतो. १८ महिने टिकते.",
    "storageTipsEn": "Store in an airtight glass jar. Grows richer and darker with age. Shelf life: 18 months.",
    "hsnCode": "20019000",
    "nutritionFacts": {
      "calories": "142 kcal / 100g",
      "protein": "1.4g",
      "healthyFats": "0.4g",
      "fiber": "3.6g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 150,
        "originalPrice": 185,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 280,
        "originalPrice": 340,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 530,
        "originalPrice": 650,
        "inStock": true
      }
    ],
    "isBestSeller": true,
    "isRegionalSpecialty": true,
    "regionOriginMr": "नैसर्गिक",
    "regionOriginEn": "Natural"
  },
  {
    "id": "prod-hirvi-mirchi-lonche",
    "nameMr": "मिरचीचं लोणचं",
    "nameEn": "Chili Pickle (Loncha)",
    "taglineMr": "मोहरीची डाळ, लिंबाचा रस व हिंगाच्या खमंग फोडणीत ताजी हिरवी मिरची",
    "taglineEn": "Fresh green chillies with yellow mustard seeds, lemon juice and asafoetida",
    "descriptionMr": "कुरकुरीत ताज्या हिरव्या मिरच्या उभ्या चिरून त्यात मोहरीची डाळ, हळद, हिंग, मीठ आणि ताज्या लिंबाचा रस घालून गरम तेलाची खमंग फोडणी देऊन तयार केलेले रुचकर लोणचे.",
    "descriptionEn": "Slit tender green chillies tossed with cracked yellow mustard seeds, turmeric, sea salt, fragrant hing, fresh lemon juice and warm oil. Crunchy, tangy, and zesty.",
    "category": "pickle",
    "spiceLevel": 3,
    "badgeMr": "मिरचीचे लोणचे",
    "badgeEn": "Green Chilli Pickle",
    "rating": 4.91,
    "reviewCount": 260,
    "imageUrl": "/products/1000170219.jpg",
    "ingredientsMr": [
      "ताज्या हिरव्या मिरच्या",
      "मोहरीची डाळ",
      "ताज्या लिंबाचा रस",
      "हिंग",
      "हळद",
      "सेंधव मीठ",
      "शेंगदाणा तेल"
    ],
    "ingredientsEn": [
      "Fresh Green Chillies",
      "Yellow Mustard Seeds",
      "Fresh Lemon Juice",
      "Asafoetida (Hing)",
      "Turmeric",
      "Rock Salt",
      "Groundnut Oil"
    ],
    "pairingRecommendationsMr": [
      "वरण-भात आणि तूप",
      "भाकरी",
      "दाल-खिचडी",
      "पराठा"
    ],
    "pairingRecommendationsEn": [
      "Varan Bhaat with Ghee",
      "Rustic Bhakri",
      "Dal Khichdi",
      "Stuffed Parathas"
    ],
    "whereToUseMr": [
      "जेवणात साध्या डाळ-भातासोबत १ चमचा तोंडी लावा.",
      "खिचडी किंवा पराठ्यासोबत चटकदार साइड म्हणून वाढा."
    ],
    "whereToUseEn": [
      "Ideal accompaniment with comforting dal-rice or khichdi.",
      "Delicious crunchy condiment paired with everyday flatbreads and parathas."
    ],
    "hygienePrecautionsMr": [
      "धुवून पूर्णपणे सुकवलेल्या ताज्या मिरच्या वापरल्या जातात.",
      "लिंबाच्या ताज्या रसाने नैसर्गिक आम्लता टिकवून ठेवली जाते."
    ],
    "hygienePrecautionsEn": [
      "Washed and thoroughly towel-dried chillies to prevent moisture spoilage.",
      "Naturally preserved with fresh lemon juice without chemical vinegar."
    ],
    "storageTipsMr": "थंड व कोरड्या जागी ठेवा. महिनाभर कुरकुरीत राहते. उन्हाळ्यात फ्रीजमध्ये ठेवणे उत्तम.",
    "storageTipsEn": "Store in a cool dry place or refrigerate to retain maximum crunch. Fresh for 2 months.",
    "hsnCode": "20019000",
    "nutritionFacts": {
      "calories": "95 kcal / 100g",
      "protein": "2.0g",
      "healthyFats": "6.1g",
      "fiber": "3.4g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 135,
        "originalPrice": 165,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 250,
        "originalPrice": 310,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 470,
        "originalPrice": 590,
        "inStock": true
      }
    ],
    "isBestSeller": false,
    "isRegionalSpecialty": true,
    "regionOriginMr": "नैसर्गिक",
    "regionOriginEn": "Natural"
  },
  {
    "id": "prod-lasun-lonche",
    "nameMr": "लसणाचं लोणचं",
    "nameEn": "Garlic Pickle (Loncha)",
    "taglineMr": "लसूण पाकळ्या, हळद, तिखट, तेल, मोहरी डाळ, मेथी दाणे व हिंग",
    "taglineEn": "Whole garlic cloves steeped in cracked mustard seeds, hing & spiced oil",
    "descriptionMr": "टपोऱ्या लसूण पाकळ्या, हळद, तिखट, मोहरी डाळ, मेथी दाणे, मीठ, हिंग आणि ताज्या लिंबाचा रस एकत्र करून घाण्याच्या तेलात मुरवलेले रुचकर लोणचे. पचनासाठी गुणकारी.",
    "descriptionEn": "Whole peeled garlic cloves cured in cold-pressed oil with split mustard seeds, fenugreek seeds, turmeric, pungent hing, and fresh lemon juice. Rich flavor and soothing for digestion.",
    "category": "pickle",
    "spiceLevel": 3,
    "badgeMr": "लसूण लोणचे",
    "badgeEn": "Garlic Pickle",
    "rating": 4.96,
    "reviewCount": 340,
    "imageUrl": "/products/1000170216.jpg",
    "ingredientsMr": [
      "लसूण पाकळ्या",
      "हळद",
      "तिखट",
      "तेल",
      "मोहरी डाळ",
      "मेथी दाणे",
      "हिंग",
      "लिंबू रस",
      "खडे मीठ"
    ],
    "ingredientsEn": [
      "Garlic Cloves",
      "Turmeric",
      "Red Chilli Powder",
      "Cold-Pressed Oil",
      "Yellow Mustard Dal",
      "Fenugreek Seeds",
      "Asafoetida",
      "Lemon Juice",
      "Rock Salt"
    ],
    "pairingRecommendationsMr": [
      "गरमागरम भाकरी",
      "वरण-भात आणि तूप",
      "दाल खिचडी",
      "थालीपीठ"
    ],
    "pairingRecommendationsEn": [
      "Piping Hot Bhakri",
      "Comforting Varan Bhaat with Ghee",
      "Moong Dal Khichdi",
      "Thalipeeth"
    ],
    "whereToUseMr": [
      "दुपारच्या किंवा रात्रीच्या जेवणात १-२ लसूण पाकळ्या लोणच्यासह तोंडी लावा.",
      "गरम वरण-भातावर साजूक तूप आणि लसणाचं लोणचं एकत्र करून खा.",
      "भाकरीसोबत ठेचा आणि लसणाचं लोणचं अप्रतिम लागते."
    ],
    "whereToUseEn": [
      "Relish 1-2 spiced garlic cloves alongside daily meals for incredible taste and digestion.",
      "Pair with warm steamed dal-rice and melted ghee.",
      "Serve alongside rustic flatbreads and pitla for an earthy meal."
    ],
    "hygienePrecautionsMr": [
      "हाताने सोललेल्या ताज्या लसूण पाकळ्या वापरल्या जातात.",
      "कोणतेही कृत्रिम रंग अथवा ॲसिड नसलेली शुद्ध पद्धत."
    ],
    "hygienePrecautionsEn": [
      "Carefully sorted and hand-peeled garlic cloves to ensure complete cleanliness.",
      "100% natural curing in oil with no synthetic preservatives or acidity regulators."
    ],
    "storageTipsMr": "काचेच्या हवाबंद बरणीत ठेवा. नेहमी कोरड्या चमच्याचा वापर करा. १ वर्ष उत्तम टिकते.",
    "storageTipsEn": "Store in an airtight glass jar. Always use a dry spoon. Shelf life 12 months.",
    "hsnCode": "20019000",
    "nutritionFacts": {
      "calories": "145 kcal / 100g",
      "protein": "4.5g",
      "healthyFats": "8.2g",
      "fiber": "2.8g"
    },
    "sizes": [
      {
        "size": "250g",
        "grams": 250,
        "price": 160,
        "originalPrice": 195,
        "inStock": true
      },
      {
        "size": "500g",
        "grams": 500,
        "price": 295,
        "originalPrice": 360,
        "inStock": true
      },
      {
        "size": "1kg",
        "grams": 1000,
        "price": 560,
        "originalPrice": 700,
        "inStock": true
      }
    ],
    "isBestSeller": true,
    "isRegionalSpecialty": true,
    "regionOriginMr": "नैसर्गिक",
    "regionOriginEn": "Natural"
  }

];

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'chutney',
    nameMr: 'चटण्या व ठेचा (Chutneys & Thecha)',
    nameEn: 'Chutneys & Thecha',
    descriptionMr: 'शेंगदाणा-लसूण, कांदा-लसूण, सुके खोबरे-लसूण, तीळ व हिरवी मिरची ठेचा',
    descriptionEn: 'Authentic stone-pounded peanut garlic, onion-garlic, dry coconut garlic, sesame & thecha',
    icon: 'Sparkles',
    sortOrder: 1
  },
  {
    id: 'pickle',
    nameMr: 'लोणचे (Pickles)',
    nameEn: 'Pickles (Lonche)',
    descriptionMr: 'आंब्याचे लोणचे, लिंबाचे लोणचे, लसणाचे लोणचे व मिरचीचे लोणचे',
    descriptionEn: 'Traditional homemade pickling: Mango, Lemon, Garlic & Green Chilli Pickles',
    icon: 'Jar',
    sortOrder: 2
  },
  {
    id: 'masala',
    nameMr: 'मसाले व मेतकूट (Masalas & Metkut)',
    nameEn: 'Masalas & Metkut',
    descriptionMr: 'पारंपरिक खमंग भाजलेला काळा मसाला आणि पौष्टिक घरगुती मेतकूट',
    descriptionEn: 'Authentic dark-roasted special Kala Masala and traditional nourishing Metkut',
    icon: 'Flame',
    sortOrder: 3
  }
];

export const INITIAL_RAW_STOCKS: RawIngredientStock[] = [
  {
    id: 'stock-peanuts',
    nameMr: 'टपोरे शेंगदाणे',
    nameEn: 'Jumbo Peanuts',
    currentStockKg: 340,
    lowStockThresholdKg: 100,
    unitCostPerKg: 130,
    sourceRegion: 'Farmers Mandi',
    lastProcuredDate: '2026-08-10'
  },
  {
    id: 'stock-coconut',
    nameMr: 'सुके खोबरे वाट्या',
    nameEn: 'Dry Copra Kernels',
    currentStockKg: 185,
    lowStockThresholdKg: 75,
    unitCostPerKg: 210,
    sourceRegion: 'Orchards',
    lastProcuredDate: '2026-08-11'
  },
  {
    id: 'stock-garlic',
    nameMr: 'गावरान लसूण',
    nameEn: 'Pungent Garlic Bulbs',
    currentStockKg: 120,
    lowStockThresholdKg: 50,
    unitCostPerKg: 190,
    sourceRegion: 'Local Farms',
    lastProcuredDate: '2026-08-12'
  },
  {
    id: 'stock-chilli-bedgi',
    nameMr: 'बेडगी व संकेश्वरी लाल मिरच्या',
    nameEn: 'Bedgi & Sankeshwari Chillies',
    currentStockKg: 210,
    lowStockThresholdKg: 80,
    unitCostPerKg: 240,
    sourceRegion: 'Spice Yard',
    lastProcuredDate: '2026-08-09'
  },
  {
    id: 'stock-sesame',
    nameMr: 'पांढरे व तपकिरी तीळ',
    nameEn: 'Natural Sesame Seeds',
    currentStockKg: 145,
    lowStockThresholdKg: 60,
    unitCostPerKg: 175,
    sourceRegion: 'Mandi',
    lastProcuredDate: '2026-08-08'
  },
  {
    id: 'stock-flaxseed',
    nameMr: 'जवस',
    nameEn: 'Brown Flaxseed',
    currentStockKg: 160,
    lowStockThresholdKg: 50,
    unitCostPerKg: 120,
    sourceRegion: 'Farms',
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
    sourceRegion: 'Wood Ghani',
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
          tagline: 'खमंग चव',
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
      landmark: 'मंदिर परिसर',
      talukaDistrict: 'पुणे (Pune)',
      pincode: '416003',
      state: 'Maharashtra'
    },
    items: [
      {
        id: 'item-3',
        isCustomRecipe: false,
        titleMr: 'कांदा-लसूण चटणी',
        titleEn: 'Kanda-Lasun Chutney',
        size: '1kg',
        quantity: 1,
        unitPrice: 590,
        totalPrice: 590
      },
      {
        id: 'item-4',
        isCustomRecipe: false,
        titleMr: 'गावरान तिळाची चटणी',
        titleEn: 'Roasted Sesame Seed Chutney',
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
        titleMr: 'जवसाची चटणी (ओमेगा-३)',
        titleEn: 'Flaxseed Chutney',
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
