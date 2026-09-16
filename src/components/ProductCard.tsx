import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingBag, Zap, Check, Sparkles, Gift, ChevronDown } from 'lucide-react';
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

  // Standard sizes: 250g, 500g, 1kg
  const selectableSizes = useMemo(() => {
    if (!product.sizes || product.sizes.length === 0) {
      return [
        { size: '250g', grams: 250, price: 165, originalPrice: 195, inStock: true },
        { size: '500g', grams: 500, price: 310, originalPrice: 380, inStock: true },
        { size: '1kg', grams: 1000, price: 590, originalPrice: 740, inStock: true }
      ];
    }
    
    // Prioritize standard 250g, 500g, 1kg sizes
    const standard = product.sizes.filter(s => ['250g', '500g', '1kg'].includes(s.size));
    if (standard.length > 0) {
      const orderMap: Record<string, number> = { '250g': 1, '500g': 2, '1kg': 3 };
      return [...standard].sort((a, b) => (orderMap[a.size] || 99) - (orderMap[b.size] || 99));
    }
    return product.sizes;
  }, [product.sizes]);

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (selectableSizes.some(s => s.size === '250g')) return '250g';
    return selectableSizes[0]?.size || '250g';
  });
  const [isPopping, setIsPopping] = useState(false);

  const activeSizeObj = selectableSizes.find(s => s.size === selectedSize) || selectableSizes[0] || {
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

  const isBogoEligible = product.id === 'prod-shengdana-chutney';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between cursor-pointer group group/card relative"
    >
      {/* Product Image Container (1:1 Aspect Ratio) */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-[#FDFBF7] to-[#F3ECE1] overflow-hidden border-b border-stone-100">
        <ProductVisual 
          product={product} 
          isMarathi={isMr} 
          aspectRatio="square"
        />
        
        {/* Single Primary Highlight Badge (Top-Left) */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          {isBogoEligible ? (
            <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white text-[10px] sm:text-xs font-black shadow-md flex items-center gap-1">
              <Gift className="w-3 h-3 text-amber-200" />
              <span>Buy 1 Get 1 Free</span>
            </span>
          ) : product.id === 'prod-kanda-lasun' ? (
            <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] sm:text-xs font-black shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-200 text-amber-200" />
              <span>Flagship Blend</span>
            </span>
          ) : product.isBestSeller ? (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 text-[10px] sm:text-xs font-black shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-stone-950 text-stone-950" />
              <span>Best Seller</span>
            </span>
          ) : null}
        </div>

        {/* Discount Badge on Image Bottom-Left */}
        {discountPercent >= 10 && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] sm:text-[11px] font-black shadow-sm">
              {discountPercent}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Spacious Product Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 sm:gap-3.5">
        <div className="space-y-2">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50/90 border border-amber-200/70 px-2 py-0.5 rounded-md uppercase tracking-wide">
              {product.category === 'chutneys' ? 'Chutney' :
               product.category === 'achar-lonach' ? 'Pickle' :
               product.category === 'masala' ? 'Masala' :
               product.category}
            </span>
            <div className="flex items-center gap-1 text-stone-900 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 text-[11px] font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
            {product.nameEn}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed min-h-[32px]">
            {product.taglineEn}
          </p>

          {/* Stock Status & Authenticity Indicator */}
          <div className="pt-1 flex items-center justify-between gap-2 text-xs">
            <StockBadge stockInfo={stockInfo} isMarathi={false} variant="compact" />
            <span className="text-[11px] text-stone-500 font-medium truncate">
              {stockInfo.isLowStock 
                ? `Only ${stockInfo.stockCount} Left`
                : '100% Pure Traditional'}
            </span>
          </div>
        </div>

        {/* Lower Section: Size Dropdown & Pricing CTA */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          {/* Clean Size Selection Dropdown */}
          <div 
            className="space-y-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
              <label htmlFor={`select-size-${product.id}`} className="cursor-pointer">
                Select Size:
              </label>
              <span className="text-amber-800 font-bold">
                {selectedSize === '1kg' ? '1 kg' : selectedSize}
              </span>
            </div>

            <div className="relative">
              <select
                id={`select-size-${product.id}`}
                value={selectedSize}
                onChange={(e) => {
                  e.stopPropagation();
                  setSelectedSize(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full appearance-none bg-stone-50 hover:bg-stone-100/90 focus:bg-white text-stone-900 font-bold text-xs sm:text-sm py-2 px-3 pr-8 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all cursor-pointer shadow-2xs"
              >
                {selectableSizes.map((s) => (
                  <option key={s.size} value={s.size}>
                    {s.size === '1kg' ? '1kg' : s.size}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-stone-500">
                <ChevronDown className="w-4 h-4 text-stone-500" />
              </div>
            </div>
          </div>

          {/* Price & Add to Cart Button */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-stone-100">
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Net Price</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-black text-stone-900">
                  ₹{activeSizeObj.price}
                </span>
                {activeSizeObj.originalPrice > activeSizeObj.price && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{activeSizeObj.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Actionable Button */}
            <div className="relative shrink-0">
              <AnimatePresence>
                {isPopping && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: 1, y: -22, scale: 1.1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute -top-3 right-0 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 shadow-md border border-amber-300 pointer-events-none z-30 flex items-center gap-1"
                  >
                    <span>+1 Added</span>
                    <Sparkles className="w-2.5 h-2.5" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                id={`add-to-cart-${product.id}`}
                type="button"
                disabled={stockInfo.isOutOfStock}
                whileTap={stockInfo.isOutOfStock ? undefined : { scale: 0.94 }}
                onClick={handleQuickAdd}
                className={`min-h-[42px] px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 text-white ${
                  stockInfo.isOutOfStock
                    ? 'bg-stone-400 cursor-not-allowed opacity-75'
                    : isPopping
                    ? 'bg-emerald-600 shadow-md'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 hover:shadow-md cursor-pointer'
                }`}
              >
                {isPopping ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-100" />
                    <span>Added!</span>
                  </>
                ) : stockInfo.isOutOfStock ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white" />
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

