import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  MessageSquare, 
  ChefHat, 
  Truck, 
  BarChart3, 
  PhoneCall,
  LogIn,
  LogOut,
  CheckCircle2,
  ChevronDown,
  Store
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    setIsWhatsAppModalOpen,
    showToast,
    basketFillTrigger,
    lastAddedQuantity,
    isBasketFilling
  } = useApp();

  const {
    currentUser,
    role,
    setIsAuthModalOpen,
    setAuthMode,
    logout,
    updateUserRole
  } = useAuth();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isStaffRole = role === 'manager' || role === 'delivery' || role === 'admin';

  const handleReturnToCustomerStore = async () => {
    await updateUserRole('customer');
    showToast('Switched to Storefront');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white/95 via-[#FFFDF9]/95 to-[#FFF4EA]/95 backdrop-blur-md text-stone-800 border-b border-amber-200/70 shadow-xs transition-all">
      {/* Top classic announcement bar */}
      <div className="text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-rose-100/85 text-stone-800 border-b border-amber-200/60">
        <div className="flex items-center gap-2 font-serif font-bold text-amber-950">
          <span>MS Masale</span>
        </div>
        <div className="hidden sm:block text-[11px] text-stone-700 font-medium">
          Free Delivery across Maharashtra on orders above ₹499
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors">
          <PhoneCall className="w-3.5 h-3.5 text-amber-800" />
          <a href="tel:8591254237" className="underline underline-offset-2">
            Call: 8591254237
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity Logo (Strictly MS Masale) */}
        <BrandLogo 
          inverted={false}
          size="md" 
          onClick={handleReturnToCustomerStore} 
        />

        {/* Center: When in authorized Staff Mode, show active portal indicator */}
        {isStaffRole && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100/80 to-orange-100/80 px-3 py-1.5 rounded-full border border-amber-300/80 shadow-2xs">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              {role === 'manager' && <ChefHat className="w-3.5 h-3.5 text-amber-700" />}
              {role === 'delivery' && <Truck className="w-3.5 h-3.5 text-emerald-700" />}
              {role === 'admin' && <BarChart3 className="w-3.5 h-3.5 text-amber-700" />}
              <span>
                {role === 'manager' ? 'Workshop Manager' :
                 role === 'delivery' ? 'Delivery Fleet' :
                 'Admin Portal'}
              </span>
            </span>

            <button
              onClick={handleReturnToCustomerStore}
              className="ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-stone-800 hover:bg-stone-50 border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Store className="w-3 h-3 text-amber-600" />
              <span>Storefront</span>
            </button>
          </div>
        )}

        {/* Right Controls: Direct Phone, WhatsApp, Profile, Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Call / Order Link */}
          <a
            href="tel:8591254237"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-white to-amber-50 hover:bg-amber-100/60 border border-amber-200 text-stone-800 text-xs font-semibold shadow-2xs transition-colors"
            title="Call to Order"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            <span>8591254237</span>
          </a>

          {/* WhatsApp Support Button */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border border-emerald-500/60 shadow-xs"
            title="Order Updates & Support on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-100" />
            <span className="hidden sm:inline font-bold">WhatsApp</span>
          </button>

          {/* User Auth / Account Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer bg-gradient-to-r from-white to-amber-50/60 text-stone-800 border border-amber-200 hover:bg-amber-100/50 shadow-2xs"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-500 text-white">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[80px] sm:max-w-[100px] truncate hidden xs:inline font-semibold">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {/* Profile Menu Popup */}
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-stone-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-stone-900"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="p-3 bg-stone-50 rounded-xl mb-2">
                    <div className="font-semibold text-xs text-stone-900 truncate">
                      {currentUser.displayName || 'My Account'}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate font-mono">
                      {currentUser.email}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Account</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => handleReturnToCustomerStore()}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-stone-100 text-stone-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
                      <span>My Orders & Tracking</span>
                    </button>
                    <a
                      href="tel:8591254237"
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-stone-100 text-stone-700 flex items-center gap-2 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                      <span>Call Us: 8591254237</span>
                    </a>
                  </div>

                  <div className="border-t border-stone-100 mt-2 pt-2">
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-white to-stone-50 hover:bg-stone-100 text-stone-800 border border-amber-200 shadow-2xs font-semibold"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-600" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Button with Count Badge */}
          <motion.button
            id="header-cart-button"
            onClick={() => setIsCartOpen(true)}
            whileTap={{ scale: 0.94 }}
            className="relative px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center bg-stone-900 text-white shadow-xs">
                {cartItemCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
