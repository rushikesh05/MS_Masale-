import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChutneyArtwork } from './ChutneyArtwork';

export const SmartCartDrawer: React.FC = () => {
  const { language, cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, setIsCheckoutOpen } = useApp();
  const isMr = language === 'mr';

  const [couponInput, setCouponInput] = useState<string>('GAVRAN50');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === 'GAVRAN50' || couponInput.toUpperCase() === 'ASSAL10') {
      const discountVal = couponInput.toUpperCase() === 'GAVRAN50' ? 50 : Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discountVal);
      setCouponError(null);
    } else {
      setCouponError(isMr ? 'अवैध कूपन कोड!' : 'Invalid coupon code!');
      setAppliedDiscount(0);
    }
  };

  const deliveryFee = cartSubtotal > 499 || cartSubtotal === 0 ? 0 : 40;
  const finalTotal = Math.max(0, cartSubtotal - appliedDiscount + deliveryFee);

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white border-l border-[#EFE4D8] shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-amber-200/70 flex items-center justify-between bg-gradient-to-r from-amber-50/80 to-orange-50/80">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-lg text-stone-900 font-brand">
                  {isMr ? 'तुमचे खरेदी कार्ट' : 'Your Spice Cart'}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-200/60 flex items-center justify-center text-stone-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#FAF6F2] flex items-center justify-center mx-auto text-[#C84B31]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-base text-[#2D2424] font-brand">
                    {isMr ? 'तुमचे कार्ट रिकामे आहे' : 'Your cart is empty'}
                  </h4>
                  <p className="text-xs text-[#7A6E6E] max-w-xs mx-auto">
                    {isMr ? 'आमच्या लोकप्रिय गावरान चटण्या किंवा स्वतःचा कस्टमाईज्ड जार तयार करा!' : 'Explore our delicious chutneys or design your custom blend jar!'}
                  </p>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.cartItemId}
                    className="p-4 rounded-xl border border-[#EFE4D8] bg-[#FFFDFB] shadow-2xs space-y-2 relative"
                  >
                    <div className="flex gap-3 items-start">
                      {/* Product Thumbnail / Custom Badge with hover zoom & shadow */}
                      <div className="w-14 h-14 rounded-lg bg-[#FAF6F2] border border-[#EFE4D8] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-300 group/thumb">
                        {item.isCustomRecipe ? (
                          <div className="text-center">
                            <span className="text-lg">🫙</span>
                            <span className="text-[8px] font-bold text-[#C84B31] block">Custom</span>
                          </div>
                        ) : item.product ? (
                          <div className="w-full h-full overflow-hidden">
                            <img
                              src={item.product.imageUrl || '/products/kanda-lasun.jpg'}
                              alt={isMr ? item.product.nameMr : item.product.nameEn}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/products/kanda-lasun.jpg';
                              }}
                              className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover/thumb:scale-110"
                            />
                          </div>
                        ) : (
                          <span className="text-lg">🌶️</span>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs sm:text-sm text-[#2D2424] truncate font-brand">
                            {item.isCustomRecipe && item.customRecipe
                              ? item.customRecipe.customName
                              : item.product
                              ? (isMr ? item.product.nameMr : item.product.nameEn)
                              : 'Chutney Jar'}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Size / Custom Ingredient breakdown */}
                        {item.isCustomRecipe && item.customRecipe ? (
                          <div className="text-[10px] text-[#7A6E6E] space-y-0.5 mt-0.5">
                            <span className="font-medium text-[#C84B31]">
                              {item.customRecipe.packSizeGrams}g • Level {item.customRecipe.spiceLevel} Spice • {item.customRecipe.garlicLevel} Garlic
                            </span>
                            <p className="truncate italic">
                              "{item.customRecipe.tagline || 'Special Custom Recipe'}"
                            </p>
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#7A6E6E]">
                            {isMr ? 'पॅक साईज:' : 'Size:'} {item.selectedSize || '250g'}
                          </div>
                        )}

                        {/* Quantity controls & Price */}
                        <div className="flex items-center justify-between mt-2 pt-1">
                          <div className="flex items-center border border-[#EADFD5] rounded-lg bg-white">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-gray-100 text-gray-700 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-[#2D2424]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs font-bold hover:bg-gray-100 text-gray-700 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="font-extrabold text-sm text-[#C84B31]">
                            ₹{item.totalPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Free delivery bar */}
              {cart.length > 0 && (
                <div className="p-3 rounded-xl bg-[#FAF6F2] border border-[#EFE4D8] text-xs">
                  {cartSubtotal >= 499 ? (
                    <div className="text-green-700 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isMr ? 'अभिनंदन! तुमची डिलिव्हरी मोफत आहे!' : 'Congratulations! You qualify for Free Delivery!'}</span>
                    </div>
                  ) : (
                    <div className="text-[#6B5E5E]">
                      {isMr ? `मोफत डिलिव्हरीसाठी अजून ₹${499 - cartSubtotal} ची खरेदी करा.` : `Add ₹${499 - cartSubtotal} more for Free Delivery.`}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#F5EDE4] bg-[#FFFDFB] space-y-3">
                {/* Coupon Code Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#EADFD5] rounded-lg uppercase font-semibold text-[#2D2424] focus:outline-none focus:ring-1 focus:ring-[#C84B31]"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 rounded-lg bg-[#2D2424] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isMr ? 'लागू करा' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                {appliedDiscount > 0 && <p className="text-[11px] text-green-600 font-bold">✓ ₹{appliedDiscount} Discount Applied!</p>}

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-[#6B5E5E] pt-2 border-t border-[#F5EDE4]">
                  <div className="flex justify-between">
                    <span>{isMr ? 'उपएकूण (Subtotal):' : 'Subtotal:'}</span>
                    <span className="font-semibold text-[#2D2424]">₹{cartSubtotal}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>{isMr ? 'कूपन सूट (Discount):' : 'Discount:'}</span>
                      <span className="font-bold">-₹{appliedDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{isMr ? 'डिलिव्हरी शुल्क (Delivery):' : 'Delivery Charges:'}</span>
                    <span className="font-semibold text-[#2D2424]">
                      {deliveryFee === 0 ? (
                        <span className="text-green-700 font-bold">{isMr ? 'मोफत' : 'FREE'}</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-[#F5EDE4]">
                    <span>{isMr ? 'एकूण देय रक्कम:' : 'Total Payable:'}</span>
                    <span className="text-amber-900">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isMr ? 'ऑर्डर पूर्ण करा (Checkout)' : 'Proceed to Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
