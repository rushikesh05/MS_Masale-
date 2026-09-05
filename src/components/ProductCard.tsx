import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Flame, ShoppingBag, Eye, Check, ShieldCheck, Heart, Zap, Truck } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, theme, addToCart, setSelectedProductDetail, showToast } = useApp();
  const isMr = language === 'mr';
  const isExpress = theme === 'express';

  const [selectedSize, setSelectedSize] = useState<'250g' | '500g' | '1kg'>('250g');
  const activeSizeObj = product.sizes.find(s => s.size === selectedSize) || product.sizes[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      isCustomRecipe: false,
      productId: product.id,
      product: product,
      selectedSize: selectedSize,
      quantity: 1,
      unitPrice: activeSizeObj.price
    });
    showToast(isMr ? `✅ कार्टमध्ये जोडले: ${product.nameMr}` : `✅ Added to cart: ${product.nameEn}`);
  };

  const discountPercent = Math.round(((activeSizeObj.originalPrice - activeSizeObj.price) / activeSizeObj.originalPrice) * 100);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => setSelectedProductDetail(product)}
      className={`rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group ${
        isExpress
          ? 'bg-white border border-[#D5D9D9] hover:border-[#A2A6A6]'
          : 'bg-white border border-[#EFE4D8]'
      }`}
    >
      {/* Product Image / Artisan Jar Visual & Badges */}
      <div className="relative h-52 sm:h-56 bg-[#F9F5F0] overflow-hidden">
        <ProductVisual 
          product={product} 
          isMarathi={isMr} 
          allowToggle={true}
          aspectRatio="card"
        />
        
        {/* Top Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold shadow-xs flex items-center gap-1 ${
              isExpress
                ? 'bg-[#E47911] text-white'
                : 'bg-[#C84B31] text-white rounded-full'
            }`}>
              {isExpress && <Zap className="w-3 h-3 fill-white" />}
              <span>{isMr ? 'बेस्ट सेलर (Best Seller)' : '#1 Best Seller'}</span>
            </span>
          )}
          {discountPercent >= 15 && (
            <span className="px-2 py-0.5 rounded-md bg-[#CC0C39] text-white text-[10px] font-extrabold shadow-xs uppercase">
              {isMr ? `${discountPercent}% सवलत` : `Deal -${discountPercent}%`}
            </span>
          )}
          {product.badgeMr && !product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-md bg-[#232F3E] text-amber-300 text-[10px] font-bold shadow-xs">
              {isMr ? product.badgeMr : product.badgeEn}
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute top-10 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-full text-[#2D2424] hover:bg-white shadow-xs z-20">
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Spice Heat Indicator */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1 text-[#FFA41C] text-xs font-bold">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FFA41C] text-[#FFA41C]" />
                ))}
              </div>
              <span className="text-[#0F1111] font-semibold ml-0.5">{product.rating}</span>
              <span className="text-gray-500 text-[11px]">({product.reviewCount})</span>
            </div>

            <div className="flex items-center gap-0.5" title={`Spice Level: ${product.spiceLevel}/5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Flame
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < product.spiceLevel ? 'text-[#DC2626] fill-[#DC2626]' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-extrabold text-base sm:text-lg line-clamp-1 transition-colors ${
            isExpress
              ? 'text-[#0F1111] group-hover:text-[#C45500]'
              : 'text-[#2D2424] font-brand group-hover:text-[#C84B31]'
          }`}>
            {isMr ? product.nameMr : product.nameEn}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-[#565959] line-clamp-2 mt-1 min-h-[32px]">
            {isMr ? product.taglineMr : product.taglineEn}
          </p>

          {/* Assal Express Fast Delivery Badge */}
          {isExpress && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#007185] font-semibold">
              <span className="bg-[#007185]/10 text-[#007185] px-1.5 py-0.2 rounded font-black tracking-tight text-[10px]">
                {isMr ? '⚡ एक्सप्रेस' : '⚡ Express'}
              </span>
              <span className="text-stone-700 font-medium">
                {isMr ? 'मोफत डिलिव्हरी उद्या सकाळपर्यंत' : 'FREE Express Delivery'}
              </span>
            </div>
          )}
        </div>

        <div className={`mt-3 pt-3 border-t ${isExpress ? 'border-[#E7E7E7]' : 'border-[#F5EDE4]'}`}>
          {/* Size Pills Selector */}
          <div className="flex items-center gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
            {product.sizes.map(s => (
              <button
                key={s.size}
                onClick={() => setSelectedSize(s.size)}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedSize === s.size
                    ? isExpress
                      ? 'border-[#FF9900] bg-[#FFF8E7] text-[#0F1111] font-black'
                      : 'border-[#C84B31] bg-[#FFF2EE] text-[#C84B31]'
                    : 'border-[#D5D9D9] bg-white text-[#565959] hover:bg-[#F7FAFA]'
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
                <span className="text-lg sm:text-xl font-black text-[#0F1111]">
                  <span className="text-xs font-normal align-top">₹</span>
                  {activeSizeObj.price}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{activeSizeObj.originalPrice}
                </span>
              </div>
              <span className="text-[10px] text-[#007600] font-bold block">
                {discountPercent}% {isMr ? 'सूट' : 'OFF'}
              </span>
            </div>

            <button
              onClick={handleQuickAdd}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                isExpress
                  ? 'express-btn-cart font-extrabold text-[#0F1111]'
                  : 'bg-[#C84B31] hover:bg-[#A83B23] text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isMr ? 'खरेदी करा' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
