import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Flame, ShoppingBag, Check, ShieldCheck, Heart, Sparkles, ChefHat, Leaf } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductVisual } from './ProductVisual';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductDetail, setSelectedProductDetail, addToCart } = useApp();
  const isMr = false; // Strictly English as requested

  const [selectedSize, setSelectedSize] = useState<'250g' | '500g' | '1kg'>('500g');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  if (!selectedProductDetail) return null;
  const product = selectedProductDetail;
  const activeSizeObj = product.sizes.find(s => s.size === selectedSize) || product.sizes[0];

  const handleAdd = () => {
    setIsAdding(true);
    addToCart({
      isCustomRecipe: false,
      productId: product.id,
      product: product,
      selectedSize: selectedSize,
      quantity: quantity,
      unitPrice: activeSizeObj.price
    });
    setTimeout(() => {
      setIsAdding(false);
      setSelectedProductDetail(null);
    }, 450);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EFE4D8] my-8 relative"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#2D2424] flex items-center justify-center shadow-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Image / Real Food Photography */}
            <div className="relative h-72 md:h-full bg-stone-900 min-h-[340px]">
              <ProductVisual 
                product={product} 
                isMarathi={isMr} 
                aspectRatio="modal"
                className="w-full h-full"
              />
            </div>

            {/* Right Details */}
            <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                {/* Badge & Rating */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFEAE5] text-[#C84B31] text-xs font-bold">
                    {isMr ? product.badgeMr : product.badgeEn}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400">({product.reviewCount} {isMr ? 'पुनरावलोकने' : 'reviews'})</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D2424] font-brand">
                  {isMr ? product.nameMr : product.nameEn}
                </h2>
                
                {/* Tagline */}
                <p className="text-xs sm:text-sm text-[#7A6E6E] mt-1 font-medium">
                  {isMr ? product.taglineMr : product.taglineEn}
                </p>

                {/* Spice Meter */}
                <div className="flex items-center gap-2 my-3 p-2.5 rounded-xl bg-[#FAF6F2] border border-[#EFE4D8]">
                  <span className="text-xs font-bold text-[#2D2424]">
                    {isMr ? 'तिखटपणा:' : 'Spice Heat:'}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Flame
                        key={i}
                        className={`w-4 h-4 ${i < product.spiceLevel ? 'text-[#DC2626] fill-[#DC2626]' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    (Level {product.spiceLevel}/5)
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#574B4B] leading-relaxed my-3">
                  {isMr ? product.descriptionMr : product.descriptionEn}
                </p>

                {/* Ingredients Tags */}
                <div className="my-3">
                  <span className="text-xs font-bold text-[#2D2424] block mb-1.5 uppercase tracking-wide">
                    🌿 {isMr ? 'सामग्री (Ingredients):' : 'Key Ingredients:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(isMr ? product.ingredientsMr : product.ingredientsEn).map((ing, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#F2ECE5] text-[#574B4B] font-medium">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Serving Pairings & Where to Use Section */}
                <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-[#C84B31] uppercase tracking-wider">
                    <ChefHat className="w-4 h-4 text-[#C84B31]" />
                    <span>{isMr ? 'कुठे आणि कसे वापरावे? (Culinary Uses & Pairings):' : 'Culinary Uses & Best Pairings:'}</span>
                  </div>
                  {Array.isArray(isMr ? product.whereToUseMr : product.whereToUseEn) ? (
                    <ul className="space-y-1.5 text-xs text-stone-800">
                      {((isMr ? product.whereToUseMr : product.whereToUseEn) as string[]).map((use, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#C84B31] font-bold mt-0.5">•</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                      {isMr
                        ? (product.whereToUseMr || (product.pairingRecommendationsMr ? product.pairingRecommendationsMr.join(' • ') : ''))
                        : (product.whereToUseEn || (product.pairingRecommendationsEn ? product.pairingRecommendationsEn.join(' • ') : ''))}
                    </p>
                  )}
                </div>

                {/* 100% Preservative-Free & Hygiene Guarantee Section */}
                <div className="my-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isMr ? '१००% प्रिझर्व्हेटिव्ह-मुक्त & स्वच्छता हमी (Hygiene & Precautions):' : 'Preservative-Free & Hygiene Precautions:'}</span>
                  </div>
                  {Array.isArray(isMr ? product.hygienePrecautionsMr : product.hygienePrecautionsEn) ? (
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {((isMr ? product.hygienePrecautionsMr : product.hygienePrecautionsEn) as string[]).map((prec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{prec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-stone-700 leading-relaxed font-medium">
                      {isMr
                        ? (product.hygienePrecautionsMr || 'कोणतेही कृत्रिम रंग, केमिकल प्रिझर्व्हेटिव्ह किंवा पाम ऑईल न वापरता पारंपरिक लाकडी/दगडी खलबत्त्यात कुटून हवाबंद काचेच्या बरणीत पॅक केली जाते.')
                        : (product.hygienePrecautionsEn || 'Crafted with zero chemical preservatives, no palm oil, and zero artificial colors. Processed in stainless steel food-grade facilities and sealed in sanitized glass jars.')}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-emerald-800">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> {isMr ? 'FSSAI प्रमाणित' : 'FSSAI Certified'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> {isMr ? '०% पाम ऑइल' : 'Zero Palm Oil'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> {isMr ? '६ महिने ताजे' : '6 Months Shelf Life'}
                    </span>
                  </div>
                </div>

                {/* Storage & Shelf Life Guidelines */}
                <div className="my-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-stone-700">
                    <Leaf className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isMr ? 'साठवणूक पद्धत (Storage Tips):' : 'Storage Guidelines:'}</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    {isMr
                      ? (product.storageTipsMr || 'थंड आणि कोरड्या जागी ठेवा. चटणी काढताना नेहमी कोरड्या चमच्याचा वापर करा. ओला हात किंवा ओला चमचा लावू नका.')
                      : (product.storageTipsEn || 'Store in a cool, dry place. Always use a clean dry spoon. Keep the lid tightly sealed after each use.')}
                  </p>
                </div>

                {/* Nutrition Highlights */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] my-3 p-2 bg-[#FAF8F5] rounded-xl border border-[#EFE4D8]">
                  <div>
                    <span className="text-gray-400 block">{isMr ? 'कॅलरीज' : 'Energy'}</span>
                    <span className="font-bold text-[#2D2424]">{product.nutritionFacts.calories.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">{isMr ? 'प्रोटीन' : 'Protein'}</span>
                    <span className="font-bold text-[#2D2424]">{product.nutritionFacts.protein}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">{isMr ? 'फायबर' : 'Fiber'}</span>
                    <span className="font-bold text-[#2D2424]">{product.nutritionFacts.fiber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">{isMr ? 'हेल्दी फॅट्स' : 'Fats'}</span>
                    <span className="font-bold text-[#2D2424]">{product.nutritionFacts.healthyFats.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="my-4">
                  <label className="block text-xs font-bold text-[#2D2424] mb-2 uppercase tracking-wide">
                    {isMr ? 'पॅक वजन निवडा (Choose Size):' : 'Select Pack Size:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.sizes.map(s => (
                      <button
                        key={s.size}
                        onClick={() => setSelectedSize(s.size)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedSize === s.size
                            ? 'border-[#C84B31] bg-[#FFF2EE] text-[#C84B31] ring-2 ring-[#C84B31]/20 font-bold'
                            : 'border-[#EFE4D8] bg-white text-[#574B4B] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="text-sm font-extrabold">{s.size}</div>
                        <div className="text-xs font-bold text-[#2D2424] mt-0.5">₹{s.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions: Quantity and Add To Cart */}
              <div className="pt-4 border-t border-[#F5EDE4] flex items-center justify-between gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-[#EADFD5] rounded-xl bg-[#FAF8F5] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-sm font-bold hover:bg-[#EAE0D5] text-[#2D2424] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-extrabold text-[#2D2424]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-sm font-bold hover:bg-[#EAE0D5] text-[#2D2424] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button with Pop animation */}
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  animate={
                    isAdding
                      ? { scale: [1, 1.08, 0.95, 1], backgroundColor: '#059669' }
                      : { scale: 1 }
                  }
                  onClick={handleAdd}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#C84B31] hover:bg-[#A83B23] text-white font-extrabold text-sm sm:text-base transition-all shadow-md shadow-[#C84B31]/25 flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
                >
                  {isAdding ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-200 animate-bounce" />
                      <span className="text-white">Added to Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>{isMr ? `कार्टमध्ये जोडा (₹${activeSizeObj.price * quantity})` : `Add to Cart (₹${activeSizeObj.price * quantity})`}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
