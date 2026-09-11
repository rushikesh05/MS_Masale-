import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Flame, ShoppingBag, Eye, Zap, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProductDetail, showToast } = useApp();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0]?.size || '250g');
  const [isPopping, setIsPopping] = useState(false);
  const activeSizeObj = product.sizes?.find(s => s.size === selectedSize) || product.sizes?.[0] || {
    size: '250g',
    grams: 250,
    price: 180,
    originalPrice: 220,
    inStock: true
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 900);
    
    addToCart({
      isCustomRecipe: false,
      productId: product.id,
      product: product,
      selectedSize: selectedSize,
      quantity: 1,
      unitPrice: activeSizeObj.price
    });
  };

  const discountPercent = Math.round(((activeSizeObj.originalPrice - activeSizeObj.price) / activeSizeObj.originalPrice) * 100);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onClick={() => setSelectedProductDetail(product)}
      className="bg-gradient-to-b from-white via-white to-amber-50/30 rounded-3xl overflow-hidden border border-amber-200/70 shadow-[0_4px_18px_rgba(217,119,6,0.05)] hover:shadow-[0_22px_42px_-10px_rgba(217,119,6,0.22),0_8px_16px_-4px_rgba(0,0,0,0.04)] hover:border-amber-400/90 transition-all duration-300 flex flex-col justify-between cursor-pointer group group/card relative"
    >
      {/* Product Thumbnail with subtle zoom & shadow expansion */}
      <div className="relative h-52 sm:h-56 bg-stone-100 overflow-hidden transition-all duration-500 shadow-xs group-hover/card:shadow-[0_10px_25px_-5px_rgba(217,119,6,0.24)] border-b border-amber-100/90">
        <ProductVisual 
          product={product} 
          isMarathi={false} 
          allowToggle={true}
          aspectRatio="card"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.id === 'prod-kanda-lasun' ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs flex items-center gap-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white tracking-wide">
              <Zap className="w-3 h-3 fill-amber-200 text-amber-200" />
              <span>★ Kolhapur Flagship #1</span>
            </span>
          ) : product.isBestSeller ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-xs flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <Zap className="w-3 h-3 fill-amber-200 text-amber-200" />
              <span>Best Seller</span>
            </span>
          ) : null}
          {discountPercent >= 15 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs">
              Save {discountPercent}%
            </span>
          )}
          {product.badgeEn && product.id !== 'prod-kanda-lasun' && !product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-100 text-[10px] font-medium shadow-xs">
              {product.badgeEn}
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md p-2 rounded-full text-stone-700 hover:text-stone-950 shadow-md z-20">
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Heat Indicator */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-stone-800 font-bold ml-0.5">{product.rating}</span>
              <span className="text-stone-400 text-[11px]">({product.reviewCount})</span>
            </div>

            <div className="flex items-center gap-0.5" title={`Spice Heat: ${product.spiceLevel}/5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Flame
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < product.spiceLevel ? 'text-amber-600 fill-amber-600' : 'text-stone-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.nameEn}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
            {product.taglineEn}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-100">
          {/* Size Pills Selector */}
          <div className="flex items-center gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
            {product.sizes.map(s => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s.size)}
                className={`flex-1 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  selectedSize === s.size
                    ? 'border-amber-500 bg-amber-500 text-white shadow-xs font-bold'
                    : 'border-amber-200/80 bg-white text-stone-700 hover:bg-amber-50/50'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-stone-900">
                  <span className="text-xs font-normal align-top">₹</span>
                  {activeSizeObj.price}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  ₹{activeSizeObj.originalPrice}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Animated Pop Add to Cart Button */}
            <div className="relative">
              <AnimatePresence>
                {isPopping && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: 1, y: -24, scale: 1.15 }}
                    exit={{ opacity: 0, y: -36, scale: 0.8 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="absolute -top-3 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 shadow-md border border-amber-300 pointer-events-none z-30 flex items-center gap-0.5"
                  >
                    <span>+1</span>
                    <Sparkles className="w-2.5 h-2.5" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                id={`add-to-cart-${product.id}`}
                whileTap={{ scale: 0.9 }}
                animate={
                  isPopping
                    ? {
                        scale: [1, 1.14, 0.94, 1.04, 1],
                        backgroundColor: '#059669',
                        boxShadow: '0 0 16px rgba(16,185,129,0.5)'
                      }
                    : { scale: 1, backgroundColor: '#D97706' }
                }
                transition={{ duration: 0.45, ease: "easeOut" }}
                onClick={handleQuickAdd}
                className="py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer text-white relative overflow-hidden hover:brightness-110"
              >
                {isPopping ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span className="text-emerald-100 font-bold">Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-white/90" />
                    <span>Add to Cart</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
