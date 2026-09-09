import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChefHat, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  ArrowRight,
  Award,
  RefreshCw,
  FileText,
  Building2,
  Navigation,
  ShoppingBag,
  Flame,
  Star,
  Layers,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from './ProductCard';
import { CustomChutneyBuilder } from './CustomChutneyBuilder';
import { AISommelier } from './AISommelier';
import { LiveDeliveryTrackerModal } from './LiveDeliveryTrackerModal';
import { FlavorProfileDashboard } from './FlavorProfileDashboard';
import { VoiceSearchBar } from './VoiceSearchBar';
import { Order, ProductCategory } from '../types';
import { ProductVisual } from './ProductVisual';
import { FloatingTextsVisuals } from './FloatingTextsVisuals';

export const CustomerPortal: React.FC = () => {
  const { 
    orders, 
    openWhatsAppAlert, 
    openInvoiceModal, 
    refreshOrders, 
    setIsBulkRequestModalOpen,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    setSelectedProductDetail,
    products,
    categories: dynamicCategories
  } = useApp();
  const { currentUser, setIsAuthModalOpen, setAuthMode, setRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'catalog' | 'builder' | 'sommelier' | 'flavor-profile' | 'orders'>('catalog');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [floatingAmbiance, setFloatingAmbiance] = useState<'amber' | 'crimson' | 'emerald'>('amber');

  // Merged categories with prominent "Pure Masales (Buy Separately)"
  const categories = [
    { id: 'all', en: 'All Items • सर्व उत्पादने' },
    { id: 'masala', en: '🌶️ Pure Masales • अस्सल मसाले (Buy Separately)' },
    { id: 'pickles', en: 'Traditional Pickles (लोणची)' },
    { id: 'thecha', en: 'Thecha & Relishes (ठेचा)' },
    { id: 'dry-chutneys', en: 'Dry Chutneys (कोरड्या चटण्या)' },
    { id: 'metkut', en: 'Heritage Metkut (मेतकूट)' },
    { id: 'kolhapuri', en: 'Kolhapur Flagship' },
    { id: 'bestsellers', en: 'Best Sellers' },
    { id: 'healthy', en: 'High Fiber & Seeds' },
    ...dynamicCategories
      .filter(dc => !['all', 'masala', 'pickles', 'thecha', 'dry-chutneys', 'metkut', 'kolhapuri', 'bestsellers', 'healthy', 'chutney', 'pickle', 'specialty'].includes(dc.id))
      .map(dc => ({ id: dc.id, en: `${dc.nameEn} (${dc.nameMr})` }))
  ];

  const filteredProducts = products.filter(p => {
    // 1. Category Filter
    let matchesCategory = true;
    if (selectedCategory === 'masala') {
      matchesCategory = p.category === 'masala' || p.id.includes('masala');
    } else if (selectedCategory === 'kolhapuri') {
      matchesCategory = p.id.includes('kanda-lasun') || p.id.includes('kolhapuri-thecha') || p.id.includes('sukha-chilli');
    } else if (selectedCategory === 'pickles') {
      matchesCategory = p.category === 'pickle' || p.id.includes('lonche') || p.id.includes('pickle');
    } else if (selectedCategory === 'thecha') {
      matchesCategory = p.id.includes('thecha') || p.id.includes('panchamrut');
    } else if (selectedCategory === 'dry-chutneys') {
      matchesCategory = (p.category === 'chutney' || !p.category) && !p.id.includes('thecha') && !p.id.includes('masala');
    } else if (selectedCategory === 'metkut') {
      matchesCategory = p.id.includes('metkut');
    } else if (selectedCategory === 'bestsellers') {
      matchesCategory = Boolean(p.isBestSeller);
    } else if (selectedCategory === 'healthy') {
      matchesCategory = p.id.includes('javas') || p.id.includes('til') || p.id.includes('karale');
    } else if (selectedCategory !== 'all') {
      matchesCategory = p.category === selectedCategory;
    }

    if (!matchesCategory) return false;

    // 2. Search Filter
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const matchesName = p.nameEn.toLowerCase().includes(q) || p.nameMr.toLowerCase().includes(q);
    const matchesTagline = (p.taglineEn || '').toLowerCase().includes(q) || (p.taglineMr || '').toLowerCase().includes(q);
    const matchesDesc = (p.descriptionEn || '').toLowerCase().includes(q) || (p.descriptionMr || '').toLowerCase().includes(q);
    const matchesIngredients = (p.ingredientsEn || []).some(i => i.toLowerCase().includes(q)) || (p.ingredientsMr || []).some(i => i.toLowerCase().includes(q));
    const matchesRegion = p.regionOriginEn && p.regionOriginEn.toLowerCase().includes(q);
    const matchesBadge = (p.badgeEn && p.badgeEn.toLowerCase().includes(q)) || (p.badgeMr && p.badgeMr.toLowerCase().includes(q));

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
        staggerChildren: 0.07,
        delayChildren: 0.04,
      },
    },
  };

  const cardItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 24,
        mass: 0.8,
      },
    },
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      {/* 1. Hero Brand Presentation Banner - High-End Artisanal & Uncluttered */}
      <section className="relative overflow-hidden text-stone-100 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.12)] mx-4 sm:mx-6 lg:mx-8 bg-gradient-to-br from-[#1C1816] via-[#241F1C] to-[#1A1614] border border-[#332A25] transition-all">
        {/* Soft Warm Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-amber-500/10" />
        <div className="absolute -bottom-24 -left-12 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[#C2410C]/10" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Story & Clear Primary CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#C2410C]/20 text-[#FDBA74] border border-[#C2410C]/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Traditional Stone-Pounded Condiments</span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800/80 text-stone-300 border border-stone-700/60 text-xs font-medium">
                <span>Heritage Recipes</span>
                <span className="text-stone-500">•</span>
                <span>Zero High-Heat Milling</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
              MS Masale
              <span className="block text-xl sm:text-2xl lg:text-3xl mt-2 font-sans font-bold text-amber-400">
                Stone-Crushed Artisanal Chutneys & Spices
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              Legendary Kolhapuri Kanda-Lasun chutney, Solapuri shengdana, fiery green thecha, flaxseed chutney, and pure stone-crushed cooking masalas. Hand-pounded in stone mortars and sealed fresh in airtight glass jars.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveSection('catalog');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 font-bold text-xs sm:text-sm rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer bg-[#C2410C] hover:bg-[#9A3412] text-white"
              >
                <span>Explore All Condiments</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveSection('catalog');
                  setSelectedCategory('masala');
                }}
                className="px-5 py-3 bg-stone-900/90 hover:bg-stone-800 text-amber-300 font-semibold text-xs sm:text-sm rounded-full border border-amber-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>🌶️ Buy Pure Masales (मसाले)</span>
              </button>

              <button
                onClick={() => setActiveSection('builder')}
                className="px-4 py-3 bg-stone-900/60 hover:bg-stone-800 text-stone-300 font-medium text-xs sm:text-sm rounded-full border border-stone-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ChefHat className="w-4 h-4 text-stone-400" />
                <span className="hidden sm:inline">Custom Blend Studio</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Quality Product Showcase with Clean Badges */}
          <div className="lg:col-span-5 relative hidden sm:flex items-center justify-center p-4">
            <div 
              onClick={() => {
                const kandaProduct = products.find(p => p.id === 'prod-kanda-lasun') || products[0];
                if (kandaProduct) setSelectedProductDetail(kandaProduct);
              }}
              className="relative w-full max-w-sm aspect-4/3 rounded-3xl overflow-hidden border border-[#3E342D] shadow-[0_16px_40px_rgba(0,0,0,0.45)] group cursor-pointer"
            >
              {products.length > 0 && (
                <ProductVisual
                  product={products.find(p => p.id === 'prod-kanda-lasun') || products[0]}
                  isMarathi={false}
                  allowToggle={true}
                />
              )}
            </div>

            {/* Single Clean Floating Badge */}
            <div className="absolute -bottom-2 -left-2 z-20 pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-[#1C1816]/95 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs font-semibold shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Stone-Mortar Batch #428 • 100% Wood-Pressed Oil</span>
              </div>
            </div>

            <div className="absolute -top-2 -right-2 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-[#1C1816]/95 backdrop-blur-md border border-stone-700 text-stone-200 text-xs font-semibold shadow-lg flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>4.96/5 (1.2k+ Reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Feature Badges Row */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-800/80 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-100">Stone Mortar Ground</div>
              <div className="text-[10px] text-stone-400">Zero High-Heat Grinders</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-100">100% Pure & Natural</div>
              <div className="text-[10px] text-stone-400">Zero Chemical Preservatives</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-100">Airtight Glass Jars</div>
              <div className="text-[10px] text-stone-400">Preserves Fresh Aroma</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-100">Express Maharashtra Delivery</div>
              <div className="text-[10px] text-stone-400">Packed & Dispatched in 24 Hrs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Texts Visuals & Live Streaming Highlights */}
      <FloatingTextsVisuals 
        onTagClick={(tag) => {
          setSearchQuery(tag);
          setSelectedCategory('all');
        }} 
      />

      {/* 2. Floating Navigation Segmented Bar */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none p-1.5 rounded-full bg-white border border-stone-200/80 shadow-2xs w-fit">
          <button
            onClick={() => {
              setActiveSection('catalog');
              if (selectedCategory === 'masala') setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSection === 'catalog' && selectedCategory !== 'masala'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Condiments & Pickles
          </button>

          <button
            id="tab-pure-masalas"
            onClick={() => {
              setActiveSection('catalog');
              setSelectedCategory('masala');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'catalog' && selectedCategory === 'masala'
                ? 'bg-[#C2410C] text-white shadow-xs'
                : 'text-[#C2410C] hover:bg-orange-50 bg-white border border-orange-200/80'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🌶️ Pure Masales (मसाले)</span>
          </button>

          <button
            onClick={() => setActiveSection('builder')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSection === 'builder'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Custom Spice Studio
          </button>

          <button
            onClick={() => setActiveSection('sommelier')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSection === 'sommelier'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            AI Sommelier
          </button>

          <button
            id="tab-flavor-profile"
            onClick={() => setActiveSection('flavor-profile')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSection === 'flavor-profile'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Flavor DNA
          </button>

          <button
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer relative ${
              activeSection === 'orders'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>My Orders</span>
            {orders.length > 0 && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeSection === 'orders' 
                  ? 'bg-amber-400 text-stone-950' 
                  : 'bg-stone-200 text-stone-800'
              }`}>
                {orders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW: 1. Ready Chutney Catalog */}
      {activeSection === 'catalog' && (
        <section id="catalog-grid-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          
          {/* Minimal Floating Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <VoiceSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isMarathi={false}
              totalResultsCount={filteredProducts.length}
              onClear={() => setSearchQuery('')}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-serif flex items-center gap-2">
                <span>{selectedCategory === 'masala' ? 'Pure Stone-Crushed Masalas (मसाले)' : 'Artisanal Chutneys, Pickles & Spices'}</span>
                {searchQuery && (
                  <span className="text-xs font-normal text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    "{searchQuery}"
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Authentic Maharashtrian stone-pounded recipes & heirloom spices in airtight jars.
              </p>
            </div>

            {/* Category Filter Pills - Clean & Balanced */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? cat.id === 'masala'
                        ? 'bg-[#C2410C] text-white shadow-xs'
                        : 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Masala Notice when Masala Category is Active */}
          {selectedCategory === 'masala' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF7ED] border border-[#FDBA74]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-stone-800 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-[#C2410C]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-stone-900 font-serif flex items-center gap-2">
                    <span>अस्सल घरगुती खडे व बारीक मसाले • Pure Stone-Crushed Spices</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C2410C] text-white">Separate Packs</span>
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">
                    Available in 100g trial pouches, 250g jars, 500g, or 1kg kitchen packs. No chutney required.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer shadow-2xs shrink-0"
              >
                Show All Items
              </button>
            </div>
          )}

          {/* Product Cards Grid with Staggered Fluid Motion */}
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
            <div className="py-12 px-6 rounded-2xl bg-white border border-stone-200 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center text-xl font-bold">
                🔍
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  No products found matching "{searchQuery}"
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Try searching for ingredients: peanut, thecha, garlic, coconut, or flaxseed.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
                >
                  View All Products
                </button>
              </div>
            </div>
          )}

          {/* B2B Wholesale Section - Cleanly positioned below products to avoid congestion */}
          <div className="p-6 rounded-2xl bg-[#1C1816] text-stone-100 border border-[#302722] shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-stone-950">
                    B2B Wholesale Supply
                  </span>
                  <span className="text-xs font-semibold text-amber-300">
                    Bulk Supply from 5 KG to 500 KG
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Need authentic stone-ground batches for restaurants, caterers, or retail?
                </h3>
                <p className="text-xs text-stone-400">
                  Stone-crushed recipes, commercial food-grade packaging, and tiered wholesale pricing.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBulkRequestModalOpen(true)}
              className="w-full md:w-auto px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
            >
              <span>Submit Wholesale Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Promo Banner for Custom Spice Studio */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xs">
            <div className="space-y-1.5">
              <span className="px-3 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[11px] font-semibold">
                Bespoke Custom Blend
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-serif">
                Want your exact spice ratio? Design your own custom jar!
              </h3>
              <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
                Customize peanut-to-coconut ratios, choose spice heat levels, and personalize your own custom label.
              </p>
            </div>
            <button
              onClick={() => setActiveSection('builder')}
              className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-full transition-all shadow-sm shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Custom Studio</span>
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

      {/* VIEW: 5. Customer Active Orders Tracking */}
      {activeSection === 'orders' && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-serif">
                Your Orders & Live Tracking
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Track your freshly ground jars from workshop preparation to doorstep delivery.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="px-3.5 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync Live Status</span>
            </button>
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-700 font-mono">#{order.id}</span>
                    <span className="text-xs text-stone-500 ml-2">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'out_for_delivery'
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : 'bg-stone-100 text-stone-800'
                    }`}>
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-stone-900">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2">
                  <div className="space-y-1">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold shadow-xs">
                      ✓
                    </div>
                    <span className="text-[11px] font-medium text-stone-800">Placed</span>
                  </div>

                  <div className="space-y-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      order.orderStatus !== 'order_placed' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-amber-100 text-amber-800 ring-2 ring-amber-300'
                    }`}>
                      {order.orderStatus !== 'order_placed' ? '✓' : '2'}
                    </div>
                    <span className="text-[11px] font-medium text-stone-800">Stone Ground</span>
                  </div>

                  <div className="space-y-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      order.orderStatus === 'packed_in_airtight_jar' || order.orderStatus === 'out_for_delivery' || order.orderStatus === 'delivered'
                        ? 'bg-emerald-600 text-white shadow-xs' : 'bg-stone-100 text-stone-400'
                    }`}>
                      {order.orderStatus === 'out_for_delivery' || order.orderStatus === 'delivered' ? '✓' : '3'}
                    </div>
                    <span className="text-[11px] font-medium text-stone-800">Sealed Jar</span>
                  </div>

                  <div className="space-y-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                      order.orderStatus === 'delivered' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-stone-100 text-stone-400'
                    }`}>
                      {order.orderStatus === 'delivered' ? '✓' : '4'}
                    </div>
                    <span className="text-[11px] font-medium text-stone-800">Delivered</span>
                  </div>
                </div>

                {/* Delivery details bar + Live GPS Map Trigger Button */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs flex flex-wrap justify-between items-center gap-3">
                  <div className="space-y-0.5">
                    <div>
                      <span className="text-stone-500">Address: </span>
                      <span className="font-semibold text-stone-900">{order.customer.addressLine1}, {order.customer.talukaDistrict}</span>
                    </div>
                    {order.assignedDeliveryPerson && (
                      <div className="text-stone-500">
                        Courier Partner: <strong className="text-stone-800">{order.assignedDeliveryPerson.name}</strong> ({order.assignedDeliveryPerson.phone})
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedTrackingOrder(order)}
                      className="px-3.5 py-1.5 rounded-full bg-stone-900 text-white font-medium flex items-center gap-1.5 shadow-xs hover:bg-stone-800 transition-all cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live GPS</span>
                    </button>

                    <button
                      onClick={() => openInvoiceModal(order)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-600" />
                      <span>Tax Invoice</span>
                    </button>

                    <button
                      onClick={() => openWhatsAppAlert()}
                      className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition-colors cursor-pointer"
                    >
                      WhatsApp
                    </button>

                    <div className="font-semibold text-stone-900 bg-white px-3 py-1.5 rounded-full border border-stone-200">
                      OTP: <span className="font-mono text-amber-800">{order.deliveryOtp}</span>
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
          language="en"
          onClose={() => setSelectedTrackingOrder(null)}
        />
      )}

      {/* Floating Bottom Quick-Action & Cart Dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[94%] sm:w-auto">
        <div className="floating-dock rounded-full bg-stone-950/90 text-white border border-stone-800/80 px-4 py-2.5 flex items-center justify-between sm:justify-center gap-3 sm:gap-4 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveSection('catalog');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeSection === 'catalog'
                  ? 'bg-stone-800 text-amber-300'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Jars
            </button>

            <button
              onClick={() => {
                setActiveSection('builder');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                activeSection === 'builder'
                  ? 'bg-stone-800 text-amber-300'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => {
                setActiveSection('sommelier');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                activeSection === 'sommelier'
                  ? 'bg-stone-800 text-amber-300'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Sommelier</span>
            </button>
          </div>

          <div className="w-px h-5 bg-stone-800 hidden sm:block" />

          {/* Floating Cart Launcher */}
          {cartCount > 0 ? (
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 animate-pulse-subtle"
            >
              <div className="relative">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="absolute -top-2 -right-2 w-3.5 h-3.5 rounded-full bg-stone-950 text-amber-300 text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span>₹{cartSubtotal}</span>
              <span className="opacity-60">•</span>
              <span>Checkout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
