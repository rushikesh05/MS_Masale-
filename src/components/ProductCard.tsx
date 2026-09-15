import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingBag, Eye, Zap, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductVisual } from './ProductVisual';
import { StockBadge } from './StockBadge';
import { getProductStockInfo } from '../lib/stockHelper';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, setSelectedProductDetail, language } = useApp();
  const isMr = language === 'mr';

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0]?.size || '250g');
  const [isPopping, setIsPopping] = useState(false);

  const activeSizeObj = product.sizes?.find(s => s.size === selectedSize) || product.sizes?.[0] || {
    size: '250g',
    grams: 250,
    price: 180,
    originalPrice: 220,
    inStock: true
  };

  const stockInfo = getProductStockInfo(product, selectedSize);

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      setSelectedProductDetail(product);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stockInfo.isOutOfStock) return;

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

  const discountPercent = Math.round(
    ((activeSizeObj.originalPrice - activeSizeObj.price) / activeSizeObj.originalPrice) * 100
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-200/80 shadow-xs hover:shadow-lg hover:border-amber-400/90 transition-all duration-300 flex flex-col justify-between cursor-pointer group group/card relative"
    >
      {/* Standard Square Product Visual Container (1:1 Ratio) */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-[#FDFBF7] to-[#F3ECE1] overflow-hidden border-b border-amber-100/90">
        <ProductVisual 
          product={product} 
          isMarathi={isMr} 
          aspectRatio="square"
        />
        
        {/* Top-Left Badges (Responsive micro-badges) */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.id === 'prod-kanda-lasun' ? (
            <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[11px] font-black shadow-xs flex items-center gap-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white tracking-wide">
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-200 text-amber-200" />
              <span>{isMr ? 'मुख्य शान #1' : 'Flagship #1'}</span>
            </span>
          ) : product.isBestSeller ? (
            <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold shadow-xs flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-200 text-amber-200" />
              <span>{isMr ? 'लोकप्रिय' : 'Best Seller'}</span>
            </span>
          ) : null}

          {discountPercent >= 15 && (
            <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] sm:text-[10px] font-extrabold shadow-xs self-start">
              {discountPercent}% OFF
            </span>
          )}

          {/* Urgent Low Stock Micro-Badge on Image Container */}
          {stockInfo.isLowStock && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/95 text-stone-950 text-[9px] sm:text-[10px] font-extrabold shadow-xs self-start flex items-center gap-1 backdrop-blur-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-900 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-950" />
              </span>
              <span>{isMr ? `फक्त ${stockInfo.stockCount} शिल्लक` : `Only ${stockInfo.stockCount} Left`}</span>
            </span>
          )}
        </div>

        {/* Quick View Button on Desktop Hover */}
        <div className="hidden sm:flex absolute top-2.5 right-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity bg-white/95 backdrop-blur-md p-1.5 rounded-full text-stone-700 hover:text-stone-950 shadow-md z-20">
          <Eye className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Product Content Body - Responsive Padding & Line Heights */}
      <div className="p-2.5 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating Row */}
          <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1 text-amber-600 text-[11px] sm:text-xs font-semibold">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-stone-900 font-extrabold">{product.rating}</span>
              <span className="text-stone-400 text-[10px] sm:text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif font-bold text-xs sm:text-sm md:text-base text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 min-h-[34px] sm:min-h-[40px] leading-snug">
            {isMr ? product.nameMr : product.nameEn}
          </h3>

          {/* Tagline */}
          <p className="text-[10px] sm:text-xs text-stone-500 line-clamp-1 sm:line-clamp-2 mt-0.5 min-h-[16px] sm:min-h-[30px] leading-relaxed">
            {isMr ? product.taglineMr : product.taglineEn}
          </p>

          {/* Stock Transparency & Urgency Indicator */}
          <div className="mt-2 pt-1 flex items-center justify-between gap-1.5">
            <StockBadge stockInfo={stockInfo} isMarathi={isMr} variant="compact" />
            <span className="text-[9px] sm:text-[10px] text-stone-400 font-medium truncate hidden sm:inline">
              {stockInfo.isLowStock 
                ? (isMr ? 'मर्यादित बॅच' : 'Limited Batch') 
                : (isMr ? 'ताजी घाणी' : 'Fresh Ground')}
            </span>
          </div>
        </div>

        {/* Lower Section: Size Selector & Purchase Action */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-amber-100/80">
          {/* Size Pills Selector */}
          <div 
            className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3 overflow-x-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {product.sizes.map(s => {
              const sizeStock = getProductStockInfo(product, s.size);
              return (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => setSelectedSize(s.size)}
                  className={`flex-1 min-w-[42px] py-0.5 sm:py-1 px-1 sm:px-1.5 text-[10px] sm:text-xs rounded-md sm:rounded-lg border transition-all cursor-pointer font-bold whitespace-nowrap text-center relative ${
                    selectedSize === s.size
                      ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                      : 'border-amber-200/90 bg-white text-stone-700 hover:bg-amber-50/70'
                  }`}
                >
                  {s.size}
                  {sizeStock.isLowStock && selectedSize !== s.size && (
                    <span 
                      title={isMr ? `फक्त ${sizeStock.stockCount} शिल्लक` : `Only ${sizeStock.stockCount} left`}
                      className="absolute -top-1 -right-0.5 w-2 h-2 rounded-full bg-amber-500 border border-white"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Price & Add to Cart Button */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-base md:text-lg font-black text-stone-900">
                  <span className="text-[10px] sm:text-xs font-normal align-top">₹</span>
                  {activeSizeObj.price}
                </span>
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                  ₹{activeSizeObj.originalPrice}
                </span>
              </div>
            </div>

            {/* Quick Add Button with Pop Animation */}
            <div className="relative shrink-0">
              <AnimatePresence>
                {isPopping && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: 1, y: -20, scale: 1.1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute -top-3 right-0 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-stone-950 shadow-md border border-amber-300 pointer-events-none z-30 flex items-center gap-0.5"
                  >
                    <span>+1</span>
                    <Sparkles className="w-2 h-2" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                id={`add-to-cart-${product.id}`}
                type="button"
                disabled={stockInfo.isOutOfStock}
                whileTap={stockInfo.isOutOfStock ? undefined : { scale: 0.92 }}
                animate={
                  isPopping
                    ? {
                        scale: [1, 1.1, 0.95, 1],
                        backgroundColor: '#059669',
                      }
                    : stockInfo.isOutOfStock
                    ? { scale: 1, backgroundColor: '#A8A29E' }
                    : { scale: 1, backgroundColor: '#D97706' }
                }
                transition={{ duration: 0.35 }}
                onClick={handleQuickAdd}
                className={`py-1.5 sm:py-2 px-2 sm:px-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-xs flex items-center gap-1 text-white ${
                  stockInfo.isOutOfStock
                    ? 'bg-stone-400 cursor-not-allowed opacity-75'
                    : 'cursor-pointer hover:brightness-110 active:scale-95'
                }`}
              >
                {isPopping ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-100" />
                    <span className="hidden sm:inline text-emerald-100">{isMr ? 'जोडले!' : 'Added!'}</span>
                  </>
                ) : stockInfo.isOutOfStock ? (
                  <span>{isMr ? 'संपला' : 'Sold Out'}</span>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90" />
                    <span className="hidden sm:inline">{isMr ? 'जोडा' : 'Add'}</span>
                    <span className="sm:hidden">+</span>
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

