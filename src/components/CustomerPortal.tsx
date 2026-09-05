import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  ChefHat, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Leaf, 
  Clock, 
  ArrowRight,
  Star,
  Award,
  SlidersHorizontal,
  PackageCheck,
  Navigation,
  CheckCircle2,
  RefreshCw,
  FileText,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from './ProductCard';
import { CustomChutneyBuilder } from './CustomChutneyBuilder';
import { AISommelier } from './AISommelier';
import { LiveDeliveryTrackerModal } from './LiveDeliveryTrackerModal';
import { FlavorProfileDashboard } from './FlavorProfileDashboard';
import { VoiceSearchBar } from './VoiceSearchBar';
import { PRODUCTS } from '../data/initialData';
import { Order } from '../types';

export const CustomerPortal: React.FC = () => {
  const { language, theme, orders, openWhatsAppAlert, openInvoiceModal, refreshOrders, setIsBulkRequestModalOpen } = useApp();
  const { currentUser, setIsAuthModalOpen, setAuthMode, setRole } = useAuth();
  const isMr = language === 'mr';
  const isExpress = theme === 'express';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'catalog' | 'builder' | 'sommelier' | 'flavor-profile' | 'orders'>('catalog');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = [
    { id: 'all', mr: 'सर्व उत्पादने (All)', en: 'All Chutneys' },
    { id: 'bestsellers', mr: '🔥 बेस्ट सेलर्स (Top Deals)', en: '🔥 Best Sellers' },
    { id: 'kolhapuri', mr: '🌶️ कोल्हापुरी झणझणीत', en: '🌶️ Spicy Kolhapuri' },
    { id: 'solapuri', mr: '🥜 सोलापुरी शेंगदाणा', en: '🥜 Solapuri Peanut' },
    { id: 'healthy', mr: '💪 ओमेगा-३ व फिटनेस', en: '💪 High Fiber & Omega-3' }
  ];

  const filteredProducts = PRODUCTS.filter(p => {
    // 1. Category Filter
    let matchesCategory = true;
    if (selectedCategory === 'bestsellers') matchesCategory = p.isBestSeller;
    else if (selectedCategory === 'kolhapuri') matchesCategory = p.id.includes('kanda-lasun') || p.id.includes('kolhapuri-thecha') || p.id.includes('sukha-chilli');
    else if (selectedCategory === 'solapuri') matchesCategory = p.id.includes('shengdana');
    else if (selectedCategory === 'healthy') matchesCategory = p.id.includes('javas') || p.id.includes('til') || p.id.includes('karale');

    if (!matchesCategory) return false;

    // 2. Voice / Text Search Filter
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const matchesName = p.nameMr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
    const matchesTagline = p.taglineMr.toLowerCase().includes(q) || p.taglineEn.toLowerCase().includes(q);
    const matchesDesc = p.descriptionMr.toLowerCase().includes(q) || p.descriptionEn.toLowerCase().includes(q);
    const matchesIngredients = 
      p.ingredientsMr.some(i => i.toLowerCase().includes(q)) ||
      p.ingredientsEn.some(i => i.toLowerCase().includes(q));
    const matchesRegion = 
      (p.regionOriginMr && p.regionOriginMr.toLowerCase().includes(q)) ||
      (p.regionOriginEn && p.regionOriginEn.toLowerCase().includes(q));
    const matchesBadge = 
      (p.badgeMr && p.badgeMr.toLowerCase().includes(q)) ||
      (p.badgeEn && p.badgeEn.toLowerCase().includes(q));

    return matchesName || matchesTagline || matchesDesc || matchesIngredients || matchesRegion || matchesBadge;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const cardItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 22,
        mass: 0.8,
      },
    },
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-12">
      {/* 1. Hero Brand Presentation Banner */}
      <section className={`relative overflow-hidden text-white rounded-3xl p-6 sm:p-10 shadow-xl mx-4 sm:mx-6 lg:mx-8 transition-colors ${
        isExpress 
          ? 'bg-gradient-to-r from-[#131921] via-[#232F3E] to-[#131921] border border-stone-800'
          : 'bg-gradient-to-br from-[#2D2424] via-[#3C2E2E] to-[#1E1717] border border-[#443838]'
      }`}>
        {/* Ambient Glow */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isExpress ? 'bg-[#FF9900]/15' : 'bg-[#C84B31]/25'
        }`} />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
              isExpress
                ? 'bg-[#FF9900]/20 text-[#FFB84D] border border-[#FF9900]/40'
                : 'bg-[#C84B31]/40 text-[#F5C2B8] border border-[#C84B31]/50'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#FFA41C]" />
              <span>{isMr ? 'पारंपरिक दगडी खलबत्त्यात कुटलेली अस्सल चव' : '100% Stone-Pounded Heritage Maharashtrian Chutneys'}</span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007185]/30 text-[#6CE0F5] border border-[#007185]/60 text-[11px] font-bold">
              <span>🎬 {isMr ? 'लाईव्ह खलबत्ता' : 'Live Blending'}</span>
              <span className="text-white/80">• {isMr ? 'पारंपरिक पद्धत' : 'Heritage Stone Grinding'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-brand leading-tight tracking-tight">
            {isMr ? (
              <>
                MS मसाले <span className="text-amber-400 font-normal text-lg sm:text-2xl block sm:inline sm:ml-2">(मंगल सुवर्णा मसाले)</span>
                <span className={`block text-xl sm:text-3xl mt-1.5 font-bold ${
                  isExpress ? 'text-[#FF9900]' : 'text-[#E89F4C]'
                }`}>
                  दगडी खलबत्त्यातील अस्सल गावरान चव व ठसका!
                </span>
              </>
            ) : (
              <>
                MS Masale <span className="text-amber-400 font-normal text-lg sm:text-2xl block sm:inline sm:ml-2">(Mangal Suvarna Masale)</span>
                <span className={`block text-xl sm:text-3xl mt-1.5 font-bold ${
                  isExpress ? 'text-[#FF9900]' : 'text-[#E89F4C]'
                }`}>
                  Stone-Crushed Heritage Maharashtrian Chutneys & Spices
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            {isMr
              ? 'सोलापूरची प्रसिद्ध शेंगदाणा चटणी, कोल्हापूरचा अस्सल कांदा-लसूण मसाला, जवसाची सुपरफूड चटणी आणि वडापावची खोबरे-लसूण चटणी. थेट खलबत्त्यातून ताज्या काचेच्या बरणीत तुमच्या दारात.'
              : 'Solapuri roasted peanut chutney, fiery Kolhapuri Kanda-Lasun masala, omega-3 flaxseed, and authentic Mumbai Vada Pav coconut-garlic crumble.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveSection('catalog')}
              className={`px-6 py-3 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                isExpress
                  ? 'express-btn-cart text-[#0F1111] font-black'
                  : 'bg-[#C84B31] hover:bg-[#A83B23] text-white shadow-[#C84B31]/30'
              }`}
            >
              <span>{isMr ? 'सर्व चटण्या पहा (Explore Catalog)' : 'Explore Chutney Jars'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSection('builder')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ChefHat className="w-4 h-4 text-amber-300" />
              <span>{isMr ? 'स्वतःची चटणी बनवा' : 'Custom Spice Studio'}</span>
            </button>

            {!currentUser && (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className={`px-4 py-3 border font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isExpress
                    ? 'bg-[#FF9900]/20 hover:bg-[#FF9900]/30 text-amber-300 border-[#FF9900]/40'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/30'
                }`}
              >
                <span>🔑 {isMr ? 'गुगल / ईमेल लॉगिन' : 'Sign In / Register'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Badges Row */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">{isMr ? 'दगडी खलबत्ता कुटाई' : 'Stone Mortar Ground'}</div>
              <div className="text-[10px] text-gray-400">{isMr ? 'कधीही मिक्सर नाही' : 'Zero High-Heat Grinders'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">{isMr ? '१००% नैसर्गिक' : '100% Pure & Vegan'}</div>
              <div className="text-[10px] text-gray-400">{isMr ? 'शून्य कृत्रिम रंग' : 'Zero Preservatives'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">{isMr ? 'एअरटाइट ग्लास जार' : 'Heritage Glass Jar'}</div>
              <div className="text-[10px] text-gray-400">{isMr ? '९० दिवस टिकणारा खमंगपणा' : 'Preserves Natural Aroma'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">{isMr ? 'प्राईम सुपरफास्ट' : 'Prime Fast Fleet'}</div>
              <div className="text-[10px] text-gray-400">{isMr ? '२४-४८ तासांत घरपोच' : 'Live Fleet Tracking'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive App Navigation Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none p-1.5 rounded-2xl border w-fit ${
          isExpress
            ? 'bg-[#232F3E] border-stone-700 text-stone-200'
            : 'bg-[#FAF6F2] border-[#EFE4D8]'
        }`}>
          <button
            onClick={() => setActiveSection('catalog')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'catalog'
                ? isExpress
                  ? 'bg-[#FF9900] text-[#131921] font-black shadow-xs'
                  : 'bg-[#C84B31] text-white shadow-xs'
                : isExpress
                  ? 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                  : 'text-[#574B4B] hover:bg-white'
            }`}
          >
            {isMr ? '🌶️ तयार चटण्या (Catalog)' : '🌶️ Heritage Jars'}
          </button>

          <button
            onClick={() => setActiveSection('builder')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'builder'
                ? isExpress
                  ? 'bg-[#FF9900] text-[#131921] font-black shadow-xs'
                  : 'bg-[#C84B31] text-white shadow-xs'
                : isExpress
                  ? 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                  : 'text-[#574B4B] hover:bg-white'
            }`}
          >
            {isMr ? '✨ स्वतःची बनवा (Custom)' : '✨ Custom Builder Studio'}
          </button>

          <button
            onClick={() => setActiveSection('sommelier')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'sommelier'
                ? isExpress
                  ? 'bg-[#FF9900] text-[#131921] font-black shadow-xs'
                  : 'bg-[#B82A16] text-white shadow-xs'
                : isExpress
                  ? 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                  : 'text-[#574B4B] hover:bg-white'
            }`}
          >
            {isMr ? '🤖 AI चव पारखी (Sommelier)' : '🤖 AI Sommelier'}
          </button>

          <button
            id="tab-flavor-profile"
            onClick={() => setActiveSection('flavor-profile')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'flavor-profile'
                ? isExpress
                  ? 'bg-[#FF9900] text-[#131921] font-black shadow-xs'
                  : 'bg-[#B82A16] text-white shadow-xs'
                : isExpress
                  ? 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                  : 'text-[#574B4B] hover:bg-white'
            }`}
          >
            <span>📊 {isMr ? 'चव प्रोफाइल (Flavor DNA)' : 'Flavor Profile & Trends'}</span>
          </button>

          {/* Dedicated B2B / Bulk Wholesale Action Tab */}
          <button
            id="btn-open-b2b-wholesale-modal"
            onClick={() => setIsBulkRequestModalOpen(true)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              isExpress
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/50'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
            }`}
            title="Bulk Supply for Restaurants & Caterers"
          >
            <Building2 className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>{isMr ? '🏢 होलसेल / केटरर्स (B2B)' : '🏢 Wholesale / B2B (Bulk)'}</span>
          </button>

          <button
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
              activeSection === 'orders'
                ? isExpress
                  ? 'bg-[#FF9900] text-[#131921] font-black shadow-xs'
                  : 'bg-[#B82A16] text-white shadow-xs'
                : isExpress
                  ? 'text-stone-300 hover:text-white hover:bg-stone-700/60'
                  : 'text-[#574B4B] hover:bg-white'
            }`}
          >
            <span>{isMr ? '📦 माझ्या ऑर्डर्स' : '📦 My Orders'}</span>
            {orders.length > 0 && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeSection === 'orders' 
                  ? 'bg-[#131921] text-[#FF9900]' 
                  : isExpress ? 'bg-[#FF9900] text-[#131921]' : 'bg-[#B82A16] text-white'
              }`}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            id="btn-seller-manage-orders"
            onClick={() => {
              if (!currentUser) {
                setAuthMode('login');
                setIsAuthModalOpen(true);
                return;
              }
              // If user is authenticated, switch role to manager
              setRole('manager');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isExpress
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300'
            }`}
            title="Seller / Workshop Order Fulfillment"
          >
            <ChefHat className="w-3.5 h-3.5 text-[#FF9900]" />
            <span>{isMr ? '🔒 सेलर ऑर्डर मॅनेज (Manage Orders)' : '🔒 Manage Orders (Seller)'}</span>
          </button>
        </div>
      </div>

      {/* VIEW: 1. Ready Chutney Catalog */}
      {activeSection === 'catalog' && (
        <section id="catalog-grid-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          
          {/* Marathi Web Speech Voice & Text Search Bar */}
          <div className="bg-gradient-to-r from-[#FAF6F2] via-white to-[#FAF6F2] p-4 sm:p-5 rounded-3xl border border-[#EFE4D8] shadow-xs">
            <VoiceSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isMarathi={isMr}
              totalResultsCount={filteredProducts.length}
              onClear={() => setSearchQuery('')}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
            <div>
              <h2 className="text-2xl font-extrabold text-[#2D2424] font-brand flex items-center gap-2">
                <span>{isMr ? 'आमच्या लोकप्रिय अस्सल चटण्या' : 'Signature Heritage Jars'}</span>
                {searchQuery && (
                  <span className="text-xs font-normal text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    "{searchQuery}"
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isMr ? '२५० ग्रॅम, ५०० ग्रॅम आणि १ किलो काचेच्या सुरक्षित जारमध्ये उपलब्ध.' : 'Available in 250g, 500g, and 1kg glass jars.'}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#C84B31] text-white shadow-xs'
                      : 'bg-[#FAF6F2] text-[#574B4B] hover:bg-[#EFE4D8]'
                  }`}
                >
                  {isMr ? cat.mr : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* B2B Wholesale / Bulk Supply Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#232F3E] via-[#1c2633] to-[#232F3E] border border-amber-500/40 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-[#131921]">
                    {isMr ? 'हॉटेल & केटरर्स खास' : 'B2B Wholesale'}
                  </span>
                  <span className="text-xs font-bold text-amber-300">
                    {isMr ? 'किमान ५ किलोपासून ५०० किलोपर्यंत घाऊक पुरवठा' : 'Bulk Supply from 5 KG to 500 KG'}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold font-brand text-white">
                  {isMr 
                    ? 'आपल्या रेस्टॉरंट, मेस किंवा लग्नकार्यासाठी हवी आहे अस्सल गावरान चव?' 
                    : 'Need authentic stone-ground batches for your restaurant or catering event?'}
                </h3>
                <p className="text-xs text-stone-300">
                  {isMr 
                    ? 'दगडी खलबत्त्यात कुटलेली चटणी, बल्क बकेट/ड्रम पॅकिंग, थेट किचन डिलिव्हरी व सवलतीचे घाऊक दर.' 
                    : 'Stone-crushed recipes, commercial food-grade drums, custom spice levels & tiered B2B pricing.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBulkRequestModalOpen(true)}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#131921] font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
            >
              <span>{isMr ? 'बल्क मागणी फॉर्म भरा' : 'Submit Wholesale Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Cards Grid with Staggered Fluid Motion or Empty State */}
          {filteredProducts.length > 0 ? (
            <motion.div 
              key={`${selectedCategory}-${searchQuery}`}
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product, idx) => (
                <motion.div 
                  key={product.id} 
                  variants={cardItemVariants}
                  custom={idx}
                  layout
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-12 px-6 rounded-3xl bg-white border border-[#EFE4D8] text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center text-2xl font-bold">
                🔍
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-900">
                  {isMr ? `"${searchQuery}" साठी कोणतीही चटणी सापडली नाही` : `No products found matching "${searchQuery}"`}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  {isMr 
                    ? 'कृपया इतर शब्द बोला किंवा खालील लोकप्रिय पर्यायांवर टॅप करा: शेंगदाणा, ठेचा, कांदा-लसूण, खोबरे किंवा जवस.'
                    : 'Try another search term or click one of our quick tags: Peanut, Thecha, Garlic, Coconut or Flaxseed.'}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C84B31] text-white text-xs font-bold hover:bg-[#A83B23] transition-colors cursor-pointer shadow-xs"
                >
                  {isMr ? 'सर्व उत्पादने पहा' : 'View All Products'}
                </button>
              </div>
            </div>
          )}

          {/* Banner Promo for Custom Studio */}
          <div className="mt-10 p-8 rounded-3xl bg-[#FFF9F6] border border-[#F5C2B8] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#C84B31] text-white text-[11px] font-bold">
                {isMr ? 'विशेष सेवा' : 'Bespoke Custom Blend'}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2424] font-brand">
                {isMr ? 'हवी तशी चटणी हवी आहे? स्वतःचे घटक निवडा!' : 'Want your exact spice ratio? Design your own custom jar!'}
              </h3>
              <p className="text-xs text-gray-600 max-w-xl">
                {isMr
                  ? 'शेंगदाणे, खोबरे, तीळ आणि लसूण यांचे अचूक टक्केवारी प्रमाण निवडा, आणि जारवर तुमचे स्वतःचे नाव प्रिंट करून घ्या.'
                  : 'Customize peanut-to-coconut ratios, choose Bedgi or Lavangi heat, and personalize your name on the label.'}
              </p>
            </div>
            <button
              onClick={() => setActiveSection('builder')}
              className="px-6 py-3.5 bg-[#C84B31] hover:bg-[#A83B23] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>{isMr ? 'कस्टम स्टुडिओ उघडा' : 'Launch Custom Studio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* VIEW: 2. Custom Chutney Builder Studio */}
      {activeSection === 'builder' && (
        <section id="custom-builder-section">
          <CustomChutneyBuilder />
        </section>
      )}

      {/* VIEW: 3. AI Chutney Sommelier */}
      {activeSection === 'sommelier' && (
        <section>
          <AISommelier />
        </section>
      )}

      {/* VIEW: 4. Flavor Profile & Analytics Dashboard */}
      {activeSection === 'flavor-profile' && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FlavorProfileDashboard
            onNavigateToBuilder={() => setActiveSection('builder')}
            onNavigateToCatalog={() => setActiveSection('catalog')}
          />
        </section>
      )}

      {/* VIEW: 5. Customer Active Orders Tracking with Live GPS Tracker Trigger */}
      {activeSection === 'orders' && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-[#2D2424] font-brand">
                {isMr ? 'तुमच्या ऑर्डर्स व डिलिव्हरी ट्रॅकिंग' : 'Your Orders & Live Tracking'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isMr ? 'खलबत्त्यातील ताज्या वाटणापासून घरपोच वितरणापर्यंतचा प्रवास.' : 'Track your freshly blended jars from mortar grinding to doorstep.'}
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C84B31] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isMr ? 'ताजी स्थिती तपासा' : 'Sync Live Status'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-[#EFE4D8] shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#F5EDE4] pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#C84B31] font-mono">#{order.id}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'out_for_delivery'
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : 'bg-stone-100 text-stone-800'
                    }`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-extrabold text-[#2D2424]">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2">
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold shadow">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-[#2D2424]">{isMr ? 'नोंदणी' : 'Placed'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      order.orderStatus !== 'order_placed' ? 'bg-emerald-600 text-white shadow' : 'bg-amber-100 text-amber-800 ring-2 ring-amber-300'
                    }`}>
                      {order.orderStatus !== 'order_placed' ? '✓' : '2'}
                    </div>
                    <span className="text-[11px] font-bold text-[#2D2424]">{isMr ? 'खलबत्ता वाटण' : 'Blending'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      order.orderStatus === 'packed_in_airtight_jar' || order.orderStatus === 'out_for_delivery' || order.orderStatus === 'delivered'
                        ? 'bg-emerald-600 text-white shadow' : 'bg-stone-100 text-stone-400'
                    }`}>
                      {order.orderStatus === 'out_for_delivery' || order.orderStatus === 'delivered' ? '✓' : '3'}
                    </div>
                    <span className="text-[11px] font-bold text-[#2D2424]">{isMr ? 'जार सील पॅक' : 'Packed'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      order.orderStatus === 'delivered' ? 'bg-emerald-600 text-white shadow' : 'bg-stone-100 text-stone-400'
                    }`}>
                      {order.orderStatus === 'delivered' ? '✓' : '4'}
                    </div>
                    <span className="text-[11px] font-bold text-[#2D2424]">{isMr ? 'वितरित' : 'Delivered'}</span>
                  </div>
                </div>

                {/* Delivery details bar + Live GPS Map Trigger Button */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE4D8] text-xs flex flex-wrap justify-between items-center gap-3">
                  <div className="space-y-0.5">
                    <div>
                      <span className="text-gray-500">{isMr ? 'वितरण पत्ता:' : 'Address:'} </span>
                      <span className="font-semibold text-[#2D2424]">{order.customer.addressLine1}, {order.customer.talukaDistrict}</span>
                    </div>
                    {order.assignedDeliveryPerson && (
                      <div className="text-stone-500">
                        {isMr ? 'डिलिव्हरी रायडर:' : 'Courier Partner:'} <strong className="text-stone-800">{order.assignedDeliveryPerson.name}</strong> ({order.assignedDeliveryPerson.phone})
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setSelectedTrackingOrder(order)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C84B31] to-[#A0331C] text-white font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isMr ? '🗺️ लाइव्ह GPS ट्रॅक' : '🗺️ Live GPS'}</span>
                    </button>

                    <button
                      onClick={() => openInvoiceModal(order)}
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C84B31]" />
                      <span>{isMr ? 'कर बीजक (Invoice)' : 'Tax Invoice'}</span>
                    </button>

                    <button
                      onClick={() => openWhatsAppAlert()}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-colors cursor-pointer"
                    >
                      {isMr ? 'व्हॉट्सॲप' : 'WhatsApp'}
                    </button>

                    <div className="font-bold text-[#C84B31] bg-white px-2.5 py-1.5 rounded-xl border border-[#EADFD5]">
                      OTP: <span className="font-mono text-stone-900">{order.deliveryOtp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live GPS Tracker Modal */}
      {selectedTrackingOrder && (
        <LiveDeliveryTrackerModal
          order={selectedTrackingOrder}
          language={language}
          onClose={() => setSelectedTrackingOrder(null)}
        />
      )}
    </div>
  );
};
