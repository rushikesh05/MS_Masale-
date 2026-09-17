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
    language 
  } = useApp();

  const {
    currentUser,
    userProfile,
    role,
    setRole,
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

          {/* Profile / Account Section (Standard Profile Icon - No User Name Mentioned) */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="header-account-button"
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer bg-amber-50/90 hover:bg-amber-100/90 text-stone-900 border border-amber-300 shadow-2xs group"
                title="Account & Profile (Orders, Addresses, Profile Settings)"
                aria-label="Account and Profile Section"
              >
                {/* Standard Profile Icon */}
                <div className="relative w-6 h-6 rounded-full bg-amber-200/80 group-hover:bg-amber-300/80 flex items-center justify-center text-amber-900 transition-colors">
                  <User className="w-3.5 h-3.5" />
                  {/* Subtle active login indicator */}
                  <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white" />
                </div>
                
                {/* Clean "Account" Label - No personal name mentioned */}
                <div className="flex items-center gap-1">
                  <span className="font-bold text-stone-800 text-xs sm:text-[13px]">
                    Account
                  </span>
                  {role !== 'customer' && (
                    <span className="hidden sm:inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                      {role === 'admin' ? 'Admin' : role === 'manager' ? 'Manager' : 'Rider'}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3 h-3 text-stone-500 group-hover:text-stone-900 transition-colors" />
              </button>

              {/* If an admin is currently in the Admin Dashboard, provide a quick toggle back to the customer storefront */}
              {role === 'admin' && (
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer bg-stone-900 hover:bg-stone-800 text-amber-300 border-stone-800 shadow-2xs"
                  title="Return to Customer Storefront"
                >
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Storefront</span>
                </button>
              )}
            </div>
          ) : (
            <button
              id="header-signin-button"
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-white hover:bg-amber-50 text-stone-800 border border-amber-200 shadow-2xs"
              title="Account & Profile (Sign In)"
              aria-label="Sign In to Account"
            >
              <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                <User className="w-3.5 h-3.5 text-stone-700" />
              </div>
              <span>Account</span>
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
