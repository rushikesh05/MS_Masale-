import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Globe, 
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
    language, 
    setLanguage, 
    cart, 
    setIsCartOpen, 
    setIsWhatsAppModalOpen,
    setIsFeedbackModalOpen,
    setIsBulkRequestModalOpen,
    showToast
  } = useApp();

  const {
    currentUser,
    userProfile,
    role,
    setRole,
    setIsAuthModalOpen,
    setAuthMode,
    logout,
    updateUserRole
  } = useAuth();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isMr = language === 'mr';
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isStaffRole = role === 'manager' || role === 'delivery' || role === 'admin';

  const handleReturnToCustomerStore = async () => {
    await updateUserRole('customer');
    showToast(isMr ? 'ग्राहक स्टोअरफ्रंट उघडले' : 'Switched to Customer Storefront');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#131921] text-white border-b border-[#232F3E] shadow-md transition-colors">
      {/* Top micro announcement bar */}
      <div className="text-[11px] py-1.5 px-4 text-center font-medium flex justify-between items-center bg-[#232F3E] text-stone-200 border-b border-black/30">
        <div className="hidden sm:flex items-center gap-1.5 text-[#FF9900] font-semibold">
          <span>⚡</span>
          <span>
            {isMr ? 'MS मसाले (मंगल सुवर्णा मसाले) • अस्सल दगडी खलबत्ता चटणी & मसाले' : 'MS Masale (Mangal Suvarna Masale) • Authentic Stone-Crushed Condiments & Spices'}
          </span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2">
          <span>✨ {isMr ? 'सर्व ऑर्डर्सवर मोफत डिलिव्हरी (₹४९९+)' : 'Free Express Delivery across Maharashtra on ₹499+'}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-stone-300">
          <PhoneCall className="w-3 h-3 text-[#FF9900]" />
          <span>{isMr ? 'हेल्पलाइन: +91 98234 56789' : 'Helpline: +91 98234 56789'}</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity Logo */}
        <BrandLogo 
          isMarathi={isMr} 
          inverted={true}
          size="md" 
          onClick={handleReturnToCustomerStore} 
        />

        {/* Center: When in authorized Staff Mode, show active portal indicator & switch back button */}
        {isStaffRole && (
          <div className="flex items-center gap-2 bg-[#232F3E] px-3 py-1.5 rounded-2xl border border-amber-500/40">
            <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
              {role === 'manager' && <ChefHat className="w-4 h-4 text-amber-400" />}
              {role === 'delivery' && <Truck className="w-4 h-4 text-emerald-400" />}
              {role === 'admin' && <BarChart3 className="w-4 h-4 text-indigo-400" />}
              <span>
                {role === 'manager' ? (isMr ? 'वर्कशॉप मॅनेजर' : 'Workshop Manager') :
                 role === 'delivery' ? (isMr ? 'डिलिव्हरी पार्टनर' : 'Delivery Rider') :
                 (isMr ? 'ॲडमिन डॅशबोर्ड' : 'Admin Portal')}
              </span>
            </span>

            <button
              onClick={handleReturnToCustomerStore}
              className="ml-2 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#FF9900] text-[#131921] hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Store className="w-3 h-3" />
              <span>{isMr ? 'ग्राहक दुकान पहा' : 'View Storefront'}</span>
            </button>
          </div>
        )}

        {/* Right Controls: Language, Google Forms, User Profile, WhatsApp, Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Bilingual Language Switcher Button */}
          <button
            onClick={() => setLanguage(language === 'mr' ? 'en' : 'mr')}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700 bg-[#232F3E] hover:bg-[#37475A] text-white"
            title="Switch Marathi / English"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>{language === 'mr' ? 'English' : 'मराठी'}</span>
          </button>

          {/* Google Forms / Feedback Button */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#FF9900]/40 bg-[#232F3E] hover:bg-[#37475A] text-[#FF9900]"
            title="Google Forms & Customer Feedback"
          >
            <FileText className="w-3.5 h-3.5 text-[#FF9900]" />
            <span className="hidden md:inline">{isMr ? 'अभिप्राय & फॉर्म' : 'Feedback & Form'}</span>
          </button>

          {/* Dedicated B2B / Bulk Wholesale Request Button */}
          <button
            onClick={() => setIsBulkRequestModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 shadow-sm"
            title="Restaurant & Bulk Wholesale Supply"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isMr ? 'होलसेल / B2B' : 'Wholesale / B2B'}</span>
          </button>

          {/* User Auth / Account Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs bg-[#232F3E] text-white border border-stone-700 hover:bg-[#37475A]"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-[#FF9900]"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#FF9900] text-[#131921]">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[80px] sm:max-w-[110px] truncate hidden xs:inline">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                {isStaffRole && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase hidden sm:inline bg-[#FF9900] text-[#131921]">
                    {role}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {/* Profile Menu Popup */}
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#EFE4D8] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-stone-900"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="p-3 bg-[#FAF6F2] rounded-xl mb-2">
                    <div className="font-bold text-xs text-stone-900 truncate">
                      {currentUser.displayName || (isMr ? 'माझे खाते' : 'My Account')}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate font-mono">
                      {currentUser.email}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Firebase Verified</span>
                    </div>
                  </div>

                  {/* Customer Quick Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        handleReturnToCustomerStore();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-stone-50 text-stone-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C84B31]" />
                      <span>{isMr ? 'माझ्या ऑर्डर्स (My Orders)' : 'My Orders & Tracking'}</span>
                    </button>
                    <button
                      onClick={() => setIsFeedbackModalOpen(true)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-stone-50 text-stone-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isMr ? 'अभिप्राय फॉर्म (Feedback)' : 'Customer Feedback'}</span>
                    </button>
                  </div>

                  <div className="border-t border-stone-100 mt-2 pt-2">
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isMr ? 'बाहेर पडा (Sign Out)' : 'Sign Out'}</span>
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
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs bg-[#232F3E] text-white border border-stone-700 hover:bg-[#37475A]"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF9900]" />
              <span>{isMr ? 'लॉगिन' : 'Sign In'}</span>
            </button>
          )}

          {/* WhatsApp Simulator Drawer Button */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"
            title="Open WhatsApp Notifications"
          >
            <MessageSquare className="w-4 h-4 text-green-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Cart Icon & Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer express-btn-cart text-[#0F1111] shadow-md hover:scale-[1.02]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{isMr ? 'कार्ट' : 'Cart'}</span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center bg-[#131921] text-[#FF9900]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


