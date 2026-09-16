import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, Check, ShieldCheck, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductVisual } from './ProductVisual';
import { StockBadge } from './StockBadge';
import { getProductStockInfo } from '../lib/stockHelper';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductDetail, setSelectedProductDetail, addToCart, language } = useApp();
  const isMr = language === 'mr';

  const product = selectedProductDetail;

  // Standard sizes: 250g, 500g, 1kg
  const selectableSizes = useMemo(() => {
    if (!product) return [];
    if (!product.sizes || product.sizes.length === 0) {
      return [
        { size: '250g', grams: 250, price: 165, originalPrice: 195, inStock: true },
        { size: '500g', grams: 500, price: 310, originalPrice: 380, inStock: true },
        { size: '1kg', grams: 1000, price: 590, originalPrice: 740, inStock: true }
      ];
    }
    const standard = product.sizes.filter(s => ['250g', '500g', '1kg'].includes(s.size));
    if (standard.length > 0) {
      const orderMap: Record<string, number> = { '250g': 1, '500g': 2, '1kg': 3 };
      return [...standard].sort((a, b) => (orderMap[a.size] || 99) - (orderMap[b.size] || 99));
    }
    return product.sizes;
  }, [product]);

  const [selectedSize, setSelectedSize] = useState<string>('250g');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Sync default size when product opens
  useEffect(() => {
    if (selectableSizes.length > 0) {
      const defaultSize = selectableSizes.some(s => s.size === '250g') 
        ? '250g' 
        : selectableSizes[0].size;
      setSelectedSize(defaultSize);
    }
    setQuantity(1);
  }, [product, selectableSizes]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProductDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProductDetail]);

  if (!product) return null;

  const activeSizeObj = selectableSizes.find(s => s.size === selectedSize) || selectableSizes[0] || {
    size: '250g',
    grams: 250,
    price: 165,
    originalPrice: 195,
    inStock: true
  };
  const stockInfo = getProductStockInfo(product, selectedSize);

  const handleAdd = () => {
    if (stockInfo.isOutOfStock) return;
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
    }, 400);
  };

  return (
    <AnimatePresence>
      <div 
        id="product-modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedProductDetail(null);
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      >
        <motion.div
          id="product-detail-modal-card"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-white rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md md:max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 relative"
        >
          {/* Always Visible Fixed High-Contrast Close Button */}
          <button
            id="close-product-modal-btn"
            type="button"
            onClick={() => setSelectedProductDetail(null)}
            aria-label="Close product view"
            className="absolute top-2.5 right-2.5 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-300 shadow-md flex items-center justify-center transition-all active:scale-95 cursor-pointer hover:text-stone-950"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Modal Content Layout: 1 col on mobile, 2 cols on desktop */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-5 scrollbar-thin">
            {/* Visual Header / Image Container (Compact on mobile) */}
            <div className="md:col-span-2 relative aspect-[16/10] md:aspect-auto md:h-full bg-gradient-to-b from-[#FDFBF7] to-[#F5ECE0] overflow-hidden border-b md:border-b-0 md:border-r border-stone-200/80">
              <ProductVisual 
                product={product} 
                isMarathi={isMr} 
                aspectRatio="modal"
                className="w-full h-full object-cover"
              />
              {/* Product Badge Overlay */}
              <div className="absolute bottom-2 left-2 pointer-events-none">
                <span className="px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {isMr ? product.nameMr : product.badgeEn || 'MS Masale'}
                </span>
              </div>
            </div>

            {/* Product Essentials & Selection (Clean & Minimal) */}
            <div className="md:col-span-3 p-4 sm:p-5 flex flex-col justify-between space-y-3.5">
              <div className="space-y-2.5">
                {/* Rating & Stock */}
                <div className="flex items-center justify-between gap-2 pr-7">
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400 font-normal">({product.reviewCount})</span>
                  </div>
                  <StockBadge stockInfo={stockInfo} isMarathi={false} variant="detailed" />
                </div>

                {/* Product Name */}
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif leading-tight">
                    {isMr ? product.nameMr : product.nameEn}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {isMr ? product.nameEn : product.taglineEn}
                  </p>
                </div>

                {/* Concise Description */}
                <p className="text-xs text-stone-700 leading-relaxed line-clamp-3">
                  {isMr ? product.descriptionMr : product.descriptionEn}
                </p>

                {/* Key Ingredients Chips */}
                {product.ingredientsEn && product.ingredientsEn.length > 0 && (
                  <div className="pt-0.5">
                    <div className="text-[11px] font-bold text-stone-700 mb-1">
                      Ingredients:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.ingredientsEn.slice(0, 5).map((ing, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Minimal Quality Guarantee */}
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/70">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">100% Preservative-Free • Traditional Recipe</span>
                </div>

                {/* Size Selection Dropdown */}
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label 
                      htmlFor={`modal-size-select-${product.id}`}
                      className="font-bold text-stone-800 cursor-pointer"
                    >
                      Select Pack Size:
                    </label>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm sm:text-base font-black text-amber-900">
                        ₹{activeSizeObj.price}
                      </span>
                      {activeSizeObj.originalPrice > activeSizeObj.price && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{activeSizeObj.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      id={`modal-size-select-${product.id}`}
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
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
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Bar: Quantity & Add to Cart */}
          <div className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
            {/* Quantity Selector */}
            <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={stockInfo.isOutOfStock}
                className="w-8 h-9 text-sm font-bold text-stone-800 hover:bg-stone-200/80 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-black text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                disabled={stockInfo.isOutOfStock}
                className="w-8 h-9 text-sm font-bold text-stone-800 hover:bg-stone-200/80 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              type="button"
              whileTap={stockInfo.isOutOfStock ? undefined : { scale: 0.96 }}
              disabled={stockInfo.isOutOfStock}
              animate={
                isAdding
                  ? { scale: [1, 1.05, 0.95, 1], backgroundColor: '#059669' }
                  : { scale: 1 }
              }
              onClick={handleAdd}
              className={`flex-1 py-2.5 sm:py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                stockInfo.isOutOfStock
                  ? 'bg-stone-400 cursor-not-allowed opacity-75 shadow-none'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/20'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200 animate-bounce" />
                  <span>Added to Basket!</span>
                </>
              ) : stockInfo.isOutOfStock ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-amber-100" />
                  <span>Add to Cart • ₹{activeSizeObj.price * quantity}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
