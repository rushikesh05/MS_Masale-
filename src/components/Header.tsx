import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  MessageSquare, 
  PhoneCall,
  LogIn,
  LogOut,
  User,
  MapPin,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    setIsWhatsAppModalOpen,
    language 
  } = useApp();

  const {
    currentUser,
    userProfile,
    setIsAuthModalOpen,
    setIsAccountModalOpen,
    setAuthMode,
    logout
  } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displayName = userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Customer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-stone-800 border-b border-amber-200/80 shadow-2xs transition-all">
      {/* Top classic announcement bar */}
      <div className="text-xs py-1.5 px-3 sm:px-8 flex justify-between items-center bg-gradient-to-r from-amber-100/90 via-orange-100/85 to-rose-100/85 text-stone-800 border-b border-amber-200/60">
        <div className="flex items-center gap-1.5 font-serif font-bold text-amber-950 text-[11px] sm:text-xs">
          <span>MS Masale</span>
          <span className="hidden sm:inline text-amber-700/60 font-sans">•</span>
          <span className="hidden sm:inline font-sans text-amber-800 font-semibold">
            Pure Traditional Spices & Fresh Chutneys
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('bogo-promotional-banner') || document.getElementById('catalog-grid-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hidden md:flex items-center gap-1.5 text-[11px] text-amber-900 hover:text-amber-950 font-bold bg-amber-200/50 hover:bg-amber-200/80 px-2.5 py-0.5 rounded-full transition-all cursor-pointer shadow-2xs"
        >
          <span>🎁 Festive BOGO: Buy 1 Shengdana Chutney & Get 1 FREE</span>
          <span className="underline underline-offset-2 text-amber-950 font-extrabold">Claim Offer</span>
        </button>
        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors">
          <PhoneCall className="w-3 h-3 text-amber-800" />
          <a href="tel:8591254237" className="underline underline-offset-2">
            Call: 8591254237
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity Logo */}
        <div className="shrink-0">
          <BrandLogo inverted={false} size="md" />
        </div>

        {/* Right Controls: WhatsApp, Customer Name / Account Section, and Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Quick Call Link (Desktop) */}
          <a
            href="tel:8591254237"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-amber-50/80 border border-amber-200 text-stone-800 text-xs font-semibold shadow-2xs transition-colors"
            title="Call to Order"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            <span>8591254237</span>
          </a>

          {/* WhatsApp Support Button */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border border-emerald-500/60 shadow-2xs"
            title="Order Updates & Support on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-100" />
            <span className="hidden md:inline font-bold">WhatsApp</span>
          </button>

          {/* Top Right Customer Name & Account Section */}
          {currentUser ? (
            <div className="relative">
              <button
                id="header-account-button"
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-amber-50 to-orange-50/80 hover:from-amber-100 hover:to-orange-100 text-stone-900 border border-amber-300 shadow-2xs group"
                title="Open Account Section (Manage Addresses, Payments, Orders)"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
                    {displayName[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                
                {/* Customer Name written on top right near cart */}
                <div className="text-left flex items-center gap-1">
                  <span className="font-black text-stone-900 max-w-[85px] sm:max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-semibold text-amber-700 bg-amber-200/60 px-1.5 py-0.2 rounded-full">
                    Account
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-stone-500 group-hover:text-stone-900 transition-colors" />
              </button>
            </div>
          ) : (
            <button
              id="header-signin-button"
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-white hover:bg-amber-50 text-stone-800 border border-amber-200 shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Button with Count Badge */}
          <motion.button
            id="header-cart-button"
            onClick={() => setIsCartOpen(true)}
            whileTap={{ scale: 0.94 }}
            className="relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-black flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-sm"
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
