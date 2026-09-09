import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  MessageSquare, 
  ChefHat, 
  Truck, 
  BarChart3, 
  User, 
  Sparkles,
  PhoneCall,
  LogIn,
  LogOut,
  Shield,
  CheckCircle2,
  ChevronDown,
  FileText,
  Store,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    setIsWhatsAppModalOpen,
    setIsFeedbackModalOpen,
    setIsBulkRequestModalOpen,
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
    showToast('Switched to Customer Storefront');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#1C1917]/95 text-stone-100 border-b border-[#2E2824] shadow-[0_4px_24px_rgba(0,0,0,0.14)] transition-all">
      {/* Top minimal micro announcement bar */}
      <div className="text-[11px] py-1.5 px-4 sm:px-8 flex justify-between items-center bg-[#141210] text-stone-300 border-b border-[#24201C] tracking-wide">
        <div className="hidden sm:flex items-center gap-2 text-stone-300 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>MS Masale • Artisanal Stone-Crushed Condiments & Pure Spices</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2 text-amber-300/90 font-medium">
          <span>Free Express Delivery across Maharashtra on ₹499+</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-stone-400">
          <PhoneCall className="w-3 h-3 text-amber-400" />
          <span>Support: +91 98234 56789</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity Logo */}
        <BrandLogo 
          inverted={true}
          size="md" 
          onClick={handleReturnToCustomerStore} 
        />

        {/* Center: When in authorized Staff Mode, show active portal indicator & switch back button */}
        {isStaffRole && (
          <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-full border border-amber-500/40 shadow-sm">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              {role === 'manager' && <ChefHat className="w-3.5 h-3.5 text-amber-400" />}
              {role === 'delivery' && <Truck className="w-3.5 h-3.5 text-emerald-400" />}
              {role === 'admin' && <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />}
              <span>
                {role === 'manager' ? 'Workshop Manager' :
                 role === 'delivery' ? 'Delivery Fleet' :
                 'Admin Portal'}
              </span>
            </span>

            <button
              onClick={handleReturnToCustomerStore}
              className="ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Store className="w-3 h-3" />
              <span>Storefront</span>
            </button>
          </div>
        )}

        {/* Right Controls: Feedback, Wholesale B2B, WhatsApp, Profile, Cart */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Feedback Button */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-stone-700/80 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white"
            title="Customer Feedback & Surveys"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Feedback</span>
          </button>

          {/* Dedicated B2B Wholesale Request Button */}
          <button
            onClick={() => setIsBulkRequestModalOpen(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-rose-500/15 hover:from-amber-500/25 hover:to-rose-500/25 text-amber-200 hover:text-white shadow-sm"
            title="Restaurant & Bulk Wholesale Supply"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Wholesale / B2B</span>
          </button>

          {/* WhatsApp Simulator Drawer Button */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60"
            title="Open WhatsApp Notifications"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* User Auth / Account Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer bg-stone-900 text-stone-200 border border-stone-700 hover:bg-stone-800 hover:text-white"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-amber-400 text-stone-950">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[80px] sm:max-w-[100px] truncate hidden xs:inline">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {/* Profile Menu Popup */}
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-stone-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-stone-900"
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

                  {/* Customer Quick Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => handleReturnToCustomerStore()}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-stone-100 text-stone-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
                      <span>My Orders & Tracking</span>
                    </button>
                    <button
                      onClick={() => setIsFeedbackModalOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-stone-100 text-stone-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>Customer Feedback</span>
                    </button>
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
              className="px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer bg-stone-900 text-stone-200 border border-stone-700 hover:bg-stone-800 hover:text-white shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Floating Pill Button with Animated Basket-Fill Indicator & Pop */}
          <motion.button
            id="header-cart-button"
            onClick={() => setIsCartOpen(true)}
            whileTap={{ scale: 0.92 }}
            animate={
              isBasketFilling
                ? {
                    scale: [1, 1.22, 0.94, 1.1, 1],
                    rotate: [0, -5, 6, -3, 0],
                    boxShadow: [
                      '0 4px 12px rgba(0,0,0,0.1)',
                      '0 0 28px rgba(245,158,11,0.7)',
                      '0 4px 12px rgba(0,0,0,0.1)'
                    ]
                  }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`relative p-2 sm:px-4 sm:py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg ${
              isBasketFilling
                ? 'bg-amber-300 text-stone-950 ring-4 ring-amber-400/50'
                : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
            }`}
          >
            {/* Flying +Qty burst animation when an item is added */}
            <AnimatePresence>
              {isBasketFilling && (
                <motion.div
                  key={`fill-${basketFillTrigger}`}
                  initial={{ opacity: 0, y: 8, scale: 0.6 }}
                  animate={{ opacity: 1, y: -26, scale: 1.15 }}
                  exit={{ opacity: 0, y: -38, scale: 0.8 }}
                  transition={{ duration: 0.75, ease: "easeOut" }}
                  className="absolute -top-3 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg border border-amber-300 pointer-events-none z-30 flex items-center gap-0.5"
                >
                  <span>+{lastAddedQuantity || 1}</span>
                  <Sparkles className="w-2.5 h-2.5 text-amber-200" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom Basket Icon with dynamic spice-fill liquid level */}
            <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible" fill="none">
                <defs>
                  <clipPath id="headerBasketClip">
                    <path d="M5.5 9.5 L18.5 9.5 L17.2 19 C17 19.8 16.3 20.5 15.5 20.5 L8.5 20.5 C7.7 20.5 7 19.8 6.8 19 Z" />
                  </clipPath>
                  <linearGradient id="headerSpiceFill" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#C84B31" />
                    <stop offset="60%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FDE68A" />
                  </linearGradient>
                </defs>

                {/* Animated Spice Fill Level */}
                <g clipPath="url(#headerBasketClip)">
                  <rect
                    x="0"
                    y={24 - (24 * Math.min(100, Math.max(cartItemCount > 0 ? 25 : 0, cartItemCount * 25))) / 100}
                    width="24"
                    height="24"
                    fill="url(#headerSpiceFill)"
                    className="transition-all duration-500 ease-out"
                  />
                  {cartItemCount > 0 && (
                    <line
                      x1="5"
                      y1={24 - (24 * Math.min(100, Math.max(cartItemCount > 0 ? 25 : 0, cartItemCount * 25))) / 100}
                      x2="19"
                      y2={24 - (24 * Math.min(100, Math.max(cartItemCount > 0 ? 25 : 0, cartItemCount * 25))) / 100}
                      stroke="#FEF3C7"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}
                </g>

                {/* Basket Silhouette and Handle */}
                <path
                  d="M9 9V6a3 3 0 0 1 6 0v3M4.5 9h15l-1.4 10.3a2 2 0 0 1-2 1.7H7.9a2 2 0 0 1-2-1.7L4.5 9z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="hidden sm:inline font-bold">
              {isBasketFilling ? 'Filling...' : 'Basket'}
            </span>

            {/* Cart Count Badge with spring pop bounce */}
            {cartItemCount > 0 && (
              <motion.span
                key={cartItemCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center bg-stone-950 text-amber-300 shadow-sm border border-stone-800"
              >
                {cartItemCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};


