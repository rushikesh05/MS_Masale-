import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChefHat, Flame, ArrowRight, ShoppingCart, RefreshCw, Star, Info, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/initialData';

export const AISommelier: React.FC = () => {
  const { language, addToCart, setSelectedProductDetail } = useApp();
  const isMr = language === 'mr';

  const [dishInput, setDishInput] = useState<string>('गरम ज्वारीची भाकरी (Hot Jowar Bhakri)');
  const [spicePreference, setSpicePreference] = useState<string>('Medium');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<any>({
    dishIdentified: 'गरम ज्वारीची भाकरी',
    recommendedChutneyMr: 'सोलापुरी शेंगदाणा चटणी व गावरान कांदा-लसूण चटणी',
    recommendedChutneyEn: 'Solapuri Crunchy Peanut Chutney & Gavran Kanda-Lasun',
    whyPairingMr: 'कडक किंवा मऊ गरम भाकरीसोबत शेंगदाणा चटणीत कच्चे लाकडी घाण्याचे तेल किंवा पांढरे लोणी मिसळल्यास स्वर्गीय चव मिळते. सोबत कांदा चुरडून खावा.',
    whyPairingEn: 'The nutty richness of Solapuri roasted peanuts and spicy garlic creates the ultimate rustic Maharashtrian staple with hot Jowar/Bajra Bhakri and raw wood-pressed oil.',
    proTipMr: 'भाकरीवर १ चमचा शेंगदाणा चटणी पसरवा आणि त्यावर २ चमचे कोमट शेंगदाणा तेल शिंपडा.',
    proTipEn: 'Spread 1 tbsp chutney on hot Bhakri and drizzle 2 tbsp warm groundnut oil or homemade white butter.',
    flavorProfile: {
      spice: 'गावरान खमंग ठसका',
      crunch: '१०/१० खलबत्त्यात कुटलेली',
      traditionScore: '१००% अस्सल गावरान'
    },
    suggestedProductId: 'prod-shengdana-chutney'
  });

  const popularDishes = [
    { mr: 'ज्वारी/बाजरीची भाकरी', en: 'Jowar / Bajra Bhakri', icon: '🫓' },
    { mr: 'कांदे पोहे / दडपे पोहे', en: 'Kanda Poha / Pohe', icon: '🍚' },
    { mr: 'भाजणीचे थालीपीठ', en: 'Bhajani Thalipeeth', icon: '🥞' },
    { mr: 'मुंबई-पुणे वडापाव', en: 'Vada Pav', icon: '🍔' },
    { mr: 'तूप-वरण-भात', en: 'Ghee & Varan Bhaat', icon: '🍲' },
    { mr: 'झणझणीत मिसळ', en: 'Kolhapuri Misal', icon: '🌶️' },
    { mr: 'उकडपेंडी / उपमा', en: 'Ukadpendi / Upma', icon: '🥣' }
  ];

  const handleAskSommelier = async (dishToAsk?: string) => {
    const selectedDish = dishToAsk || dishInput;
    if (!selectedDish.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/sommelier/pairings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName: selectedDish,
          spicePreference,
          language
        })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setRecommendation(data.data);
      }
    } catch (err) {
      console.error('Sommelier error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const matchedProduct = PRODUCTS.find(p => p.id === recommendation?.suggestedProductId) || PRODUCTS[0];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-[#2D2424] to-[#1F1818] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-[#443838] relative overflow-hidden">
        
        {/* Background decorative spice motif glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C84B31]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E89F4C]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C84B31]/40 text-[#F5C2B8] border border-[#C84B31]/50 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isMr ? 'AI अस्सल चव पारखी (Chutney Sommelier)' : 'AI Maharashtrian Chutney Sommelier'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-brand tracking-tight">
            {isMr ? 'आज जेवणात काय आहे? योग्य चटणी जोडीदार शोधा!' : 'What are you eating today? Find the perfect chutney pairing!'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mt-2">
            {isMr 
              ? 'भाकरी, पोहे, थालीपीठ किंवा वरण-भात — कोणत्याही पदार्थासाठी पारंपरिक चवीचे परिपूर्ण कॉम्बिनेशन विचारा.'
              : 'Our culinary AI pairs your dish with the exact stone-pounded chutney and serving tip.'}
          </p>
        </div>

        {/* Input & Quick Select Dishes */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={dishInput}
              onChange={(e) => setDishInput(e.target.value)}
              placeholder={isMr ? 'उदा. ज्वारीची भाकरी, कांदे पोहे, थालीपीठ...' : 'e.g. Jowar Bhakri, Kanda Poha, Thalipeeth...'}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C84B31] text-sm"
            />
            <button
              onClick={() => handleAskSommelier()}
              disabled={isLoading}
              className="px-6 py-3 bg-[#C84B31] hover:bg-[#A83B23] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ChefHat className="w-4 h-4" />
              )}
              <span>{isMr ? 'चव पारखा' : 'Find Pairing'}</span>
            </button>
          </div>

          {/* Quick Dishes Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            <span className="text-[11px] text-gray-400 mr-1">{isMr ? 'पटकन निवडा:' : 'Quick Select:'}</span>
            {popularDishes.map((dish, i) => (
              <button
                key={i}
                onClick={() => {
                  setDishInput(dish.mr);
                  handleAskSommelier(dish.mr);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-gray-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{dish.icon}</span>
                <span>{isMr ? dish.mr : dish.en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendation Result Card */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            {/* Left AI Analysis (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {isMr ? 'शिफारस केलेली जोडी' : 'Perfect Pairing'}
                </span>
                <span className="text-xs text-gray-400">
                  {recommendation.dishIdentified}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-amber-200 font-brand">
                {isMr ? recommendation.recommendedChutneyMr : recommendation.recommendedChutneyEn}
              </h3>

              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {isMr ? recommendation.whyPairingMr : recommendation.whyPairingEn}
              </p>

              {/* Masterchef Pro Tip Box */}
              <div className="p-3.5 rounded-xl bg-[#C84B31]/30 border border-[#C84B31]/50 text-xs">
                <span className="font-extrabold text-amber-300 flex items-center gap-1.5 mb-1">
                  💡 {isMr ? 'पारंपरिक खाण्याची पद्धत (Grandmother’s Secret Tip):' : 'Grandmother’s Secret Serving Tip:'}
                </span>
                <p className="text-gray-100 italic">
                  "{isMr ? recommendation.proTipMr : recommendation.proTipEn}"
                </p>
              </div>

              {/* Flavor Profile Tags */}
              <div className="flex flex-wrap gap-2 text-[11px] text-gray-300">
                <span className="bg-black/30 px-2.5 py-1 rounded-md">
                  🔥 {recommendation.flavorProfile?.spice || 'गावरान ठसका'}
                </span>
                <span className="bg-black/30 px-2.5 py-1 rounded-md">
                  🥜 {recommendation.flavorProfile?.crunch || 'खमंग खलबत्त्यात कुटलेली'}
                </span>
                <span className="bg-black/30 px-2.5 py-1 rounded-md">
                  🚩 {recommendation.flavorProfile?.traditionScore || '१००% अस्सल'}
                </span>
              </div>
            </div>

            {/* Right Product Card Match (4 cols) */}
            <div className="md:col-span-4 bg-white text-[#2D2424] rounded-xl p-4 shadow-xl border border-white/20 text-center">
              <img
                src={matchedProduct.imageUrl}
                alt={isMr ? matchedProduct.nameMr : matchedProduct.nameEn}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596040033283-912165c845f3?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-28 object-cover rounded-lg mb-2"
              />
              <div className="font-bold text-xs line-clamp-1 font-brand">
                {isMr ? matchedProduct.nameMr : matchedProduct.nameEn}
              </div>
              <div className="text-sm font-extrabold text-[#C84B31] my-1">
                ₹{matchedProduct.sizes[0].price} <span className="text-[10px] text-gray-400 font-normal">/ {matchedProduct.sizes[0].size}</span>
              </div>
              <div className="flex gap-1.5 mt-3">
                <button
                  onClick={() => setSelectedProductDetail(matchedProduct)}
                  className="flex-1 py-1.5 rounded-lg border border-[#EFE4D8] text-[11px] font-bold text-[#574B4B] hover:bg-[#FAF6F2] transition-colors cursor-pointer"
                >
                  {isMr ? 'तपशील' : 'Details'}
                </button>
                <button
                  onClick={() => {
                    addToCart({
                      isCustomRecipe: false,
                      productId: matchedProduct.id,
                      product: matchedProduct,
                      selectedSize: matchedProduct.sizes[0].size,
                      quantity: 1,
                      unitPrice: matchedProduct.sizes[0].price
                    });
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-[#C84B31] hover:bg-[#A83B23] text-white text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>{isMr ? 'कार्टमध्ये घ्या' : 'Add Jar'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
