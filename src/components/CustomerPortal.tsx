import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone,
  MessageSquare,
  Search,
  X,
  RefreshCw,
  FileText,
  Navigation,
  ShoppingBag,
  Flame,
  Star,
  ChevronUp,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  StretchHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from './ProductCard';
import { LiveDeliveryTrackerModal } from './LiveDeliveryTrackerModal';
import { Order, Product } from '../types';
import { ProductVisual } from './ProductVisual';
import { BogoBanner } from './BogoBanner';
import { 
  CategorySortFilterControl, 
  SortOption, 
  PriceFilterOption, 
  HeatFilterOption, 
  PopularityFilterOption 
} from './CategorySortFilterControl';

export const CustomerPortal: React.FC = () => {
  const { 
    orders, 
    openWhatsAppAlert, 
    openInvoiceModal, 
    refreshOrders, 
    cartCount, 
    cartSubtotal, 
    setIsCartOpen, 
    setSelectedProductDetail, 
    products, 
    categories: dynamicCategories,
    language,
    showToast,
    bogoConfig
  } = useApp();
  const { currentUser, setIsAuthModalOpen, setAuthMode } = useAuth();
  const isMr = language === 'mr';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'catalog' | 'orders'>('catalog');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic sorting and filtering states
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [priceFilter, setPriceFilter] = useState<PriceFilterOption>('all');
  const [popularityFilter, setPopularityFilter] = useState<PopularityFilterOption>('all');

  // Primary categories matching the authentic MS Masale catalog
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'chutneys', name: 'Chutneys & Thecha' },
    { id: 'achar-lonach', name: 'Pickles (Lonche)' },
    { id: 'masala', name: 'Masalas & Metkut' },
    ...dynamicCategories
      .filter(dc => !['all', 'masala', 'pickles', 'achar-lonach', 'thecha', 'dry-chutneys', 'chutneys', 'metkut', 'bestsellers', 'healthy', 'chutney', 'pickle', 'specialty'].includes(dc.id))
      .map(dc => ({ id: dc.id, name: dc.nameEn }))
  ];

  const getProductMinPrice = (p: Product) => {
    if (!p.sizes || p.sizes.length === 0) return 0;
    return Math.min(...p.sizes.map(s => s.price));
  };

  // Base category products before user-applied filter/search
  const categoryProducts = products.filter(p => {
    if (selectedCategory === 'chutneys' || selectedCategory === 'chutney' || selectedCategory === 'dry-chutneys') {
      return p.category === 'chutney' || p.category === 'chutneys' || p.category === 'thecha' || p.id.includes('chutney') || p.id.includes('thecha') || p.id.includes('kanda-lasun') || p.id.includes('vada-pav') || p.id.includes('shengdana') || p.id.includes('til');
    } else if (selectedCategory === 'achar-lonach' || selectedCategory === 'pickle' || selectedCategory === 'pickles') {
      return p.category === 'pickle' || p.category === 'achar-lonach' || p.id.includes('lonche') || p.id.includes('pickle');
    } else if (selectedCategory === 'masala') {
      return p.category === 'masala' || p.id.includes('masala') || p.id.includes('metkut');
    } else if (selectedCategory !== 'all') {
      return p.category === selectedCategory;
    }
    return true;
  });

  const filteredProducts = categoryProducts.filter(p => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesName = p.nameEn.toLowerCase().includes(q) || p.nameMr.toLowerCase().includes(q);
      const matchesTagline = (p.taglineEn || '').toLowerCase().includes(q) || (p.taglineMr || '').toLowerCase().includes(q);
      const matchesDesc = (p.descriptionEn || '').toLowerCase().includes(q) || (p.descriptionMr || '').toLowerCase().includes(q);
      const matchesIngredients = (p.ingredientsEn || []).some(i => i.toLowerCase().includes(q)) || (p.ingredientsMr || []).some(i => i.toLowerCase().includes(q));

      if (!matchesName && !matchesTagline && !matchesDesc && !matchesIngredients) return false;
    }

    // 2. Price Filter
    if (priceFilter !== 'all') {
      const minPrice = getProductMinPrice(p);
      if (priceFilter === 'under-100' && minPrice >= 100) return false;
      if (priceFilter === '100-200' && (minPrice < 100 || minPrice > 200)) return false;
      if (priceFilter === '200-300' && (minPrice < 200 || minPrice > 300)) return false;
      if (priceFilter === '300-plus' && minPrice < 300) return false;
    }

    // 3. Popularity Filter
    if (popularityFilter !== 'all') {
      if (popularityFilter === 'bestsellers' && !p.isBestSeller) return false;
      if (popularityFilter === 'top-rated' && p.rating < 4.9) return false;
    }

    return true;
  });

  // Dynamic sorting
  const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return getProductMinPrice(a) - getProductMinPrice(b);
    }
    if (sortBy === 'price-desc') {
      return getProductMinPrice(b) - getProductMinPrice(a);
    }
    if (sortBy === 'rating') {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    }
    // Default: 'popular'
    if (a.isBestSeller && !b.isBestSeller) return -1;
    if (!a.isBestSeller && b.isBestSeller) return 1;
    const scoreA = (a.rating || 4.5) * Math.log((a.reviewCount || 10) + 10);
    const scoreB = (b.rating || 4.5) * Math.log((b.reviewCount || 10) + 10);
    return scoreB - scoreA;
  });

  const handleResetAllFilters = () => {
    setSortBy('popular');
    setPriceFilter('all');
    setPopularityFilter('all');
    setSearchQuery('');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const kandaProduct = products.find(p => p.id === 'prod-kanda-lasun') || products[0];

  const scrollToCatalog = (cat?: string) => {
    setActiveSection('catalog');
    if (cat) setSelectedCategory(cat);
    setTimeout(() => {
      const el = document.getElementById('catalog-grid-section') || document.getElementById('browse-masale-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const [mobileDensity, setMobileDensity] = useState<'comfortable' | 'compact'>('comfortable');

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Promotional Buy 1 Get 1 Free Banner */}
      <BogoBanner
        language={language}
        onClaimOffer={() => {
          const featuredProd = products.find(p => p.id === bogoConfig?.productId) || products.find(p => p.id === 'prod-shengdana-chutney');
          const prodName = featuredProd ? (isMr ? featuredProd.nameMr : featuredProd.nameEn) : 'Special Product';
          showToast(isMr ? `🎁 १ वर १ मोफत ऑफर: ${prodName}!` : `🎁 BOGO Offer: ${prodName} (Buy 1 Get 1 Free)!`);
          if (featuredProd) {
            setSelectedProductDetail(featuredProd);
          } else {
            scrollToCatalog('all');
          }
        }}
        onExploreAll={() => {
          scrollToCatalog('all');
        }}
      />

      {/* Main Content: Catalog or Orders */}
      {activeSection === 'catalog' && (
        <section id="catalog-grid-section" data-anchor="browse-masale-catalog" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div id="browse-masale-catalog" className="-mt-8 pt-8" />
          
          {/* Light Gradient Search Bar */}
          <div className="bg-gradient-to-r from-white via-[#FFFDF9] to-amber-50/40 p-3 sm:p-4 rounded-xl border border-amber-200/70 shadow-xs flex items-center gap-3">
            <Search className="w-5 h-5 text-stone-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search masala, chutney, pickle, metkut..."
              className="flex-1 text-sm bg-transparent border-none outline-none text-stone-900 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Section Heading & Category Filter Pills */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-serif">
                {(selectedCategory === 'chutneys' || selectedCategory === 'chutney' || selectedCategory === 'dry-chutneys') ? 'Chutneys & Thecha' : 
                 (selectedCategory === 'achar-lonach' || selectedCategory === 'pickle' || selectedCategory === 'pickles') ? 'Pickles (Lonche)' : 
                 selectedCategory === 'masala' ? 'Masalas & Metkut' : 
                 'All Authentic Products'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Authentic Maharashtrian recipes in hygienic freshness packaging. Phone orders: <strong className="text-stone-800">8591254237</strong>
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveSection('catalog');
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeSection === 'catalog' && selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-amber-200/80 hover:bg-amber-50/70 hover:border-amber-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}

              <button
                onClick={() => setActiveSection(activeSection === 'orders' ? 'catalog' : 'orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSection === 'orders'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-amber-200/80 hover:bg-amber-50/70 hover:border-amber-300'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                <span>My Orders</span>
                {orders.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-stone-950">
                    {orders.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Dynamic Sorting & Filter Control Component */}
          <CategorySortFilterControl
            category={selectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceFilter={priceFilter}
            onPriceFilterChange={setPriceFilter}
            popularityFilter={popularityFilter}
            onPopularityFilterChange={setPopularityFilter}
            totalCount={categoryProducts.length}
            filteredCount={sortedAndFilteredProducts.length}
            onResetAll={handleResetAllFilters}
          />

          {/* Notice when Masala Category is Active */}
          {selectedCategory === 'masala' && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-rose-50/80 border border-amber-200 flex items-center justify-between gap-3 text-stone-800 shadow-2xs">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <strong className="text-stone-900 font-serif text-sm block">Pure Masalas</strong>
                  Order signature cooking spices separately in 100g, 250g, 500g, or 1kg packs.
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-1 text-xs font-semibold bg-white border border-amber-200 hover:bg-amber-50 text-stone-700 rounded-lg cursor-pointer shrink-0 shadow-2xs"
              >
                Show All
              </button>
            </div>
          )}

          {/* Product Grid View Density & Count Header */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-xs sm:text-sm font-medium text-stone-600">
              Showing <span className="font-bold text-stone-900">{sortedAndFilteredProducts.length}</span> handcrafted products
            </div>

            {/* Mobile / Tablet Density Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs text-xs">
              <button
                type="button"
                onClick={() => setMobileDensity('comfortable')}
                title="Spacious View (Full Width)"
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mobileDensity === 'comfortable'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <StretchHorizontal className="w-3.5 h-3.5" />
                <span>Spacious</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileDensity('compact')}
                title="Compact Grid View"
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mobileDensity === 'compact'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Compact</span>
              </button>
            </div>
          </div>

          {/* Spacious & Breathable Product Cards Grid */}
          {sortedAndFilteredProducts.length > 0 ? (
            <div className={`grid ${
              mobileDensity === 'compact' 
                ? 'grid-cols-2 gap-3.5 sm:gap-6' 
                : 'grid-cols-1 gap-6 sm:gap-6'
            } sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8`}>
              {sortedAndFilteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProductDetail(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200 p-8">
              <div className="text-4xl">🌶️</div>
              <h3 className="font-serif font-bold text-lg text-stone-800">
                No products found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No items match your active filters or search. Try adjusting your price, heat intensity, or popularity options.
              </p>
              <button
                onClick={handleResetAllFilters}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Light Gradient Contact Banner at Bottom */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-100/80 via-orange-50/90 to-rose-100/70 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Need Help or Want to Order Directly by Phone?
              </h3>
              <p className="text-xs text-stone-700 mt-0.5">
                We take phone and WhatsApp orders directly with fast home delivery.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:8591254237"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call 8591254237</span>
              </a>
              <a
                href="https://wa.me/918591254237?text=Hello%20MS%20Masale,%20I%20want%20to%20place%20an%20order"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 4. Orders & Tracking Section */}
      {activeSection === 'orders' && (
        <section id="customer-orders-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-serif">
                Your Orders & Tracking
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Track your orders from packaging to doorstep delivery. Helpline: 8591254237
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection('catalog')}
                className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <span>← Back to Products</span>
              </button>

              <button
                onClick={handleRefresh}
                className="px-3.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif font-bold text-stone-800 text-base">No orders placed yet</h3>
              <p className="text-xs text-stone-500">Explore our products and place your first order.</p>
              <button
                onClick={() => setActiveSection('catalog')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-xs cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-amber-200/60 shadow-xs space-y-4"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="text-xs font-bold text-amber-800 font-mono">#{order.id}</span>
                      <span className="text-xs text-stone-500 ml-2">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'out_for_delivery'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-800'
                      }`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-bold text-stone-900">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Delivery details bar */}
                  <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/80 text-xs flex flex-wrap justify-between items-center gap-3">
                    <div className="space-y-0.5">
                      <div>
                        <span className="text-stone-500">Address: </span>
                        <span className="font-semibold text-stone-900">{order.customer.addressLine1}, {order.customer.talukaDistrict}</span>
                      </div>
                      {order.assignedDeliveryPerson && (
                        <div className="text-stone-500">
                          Delivery Partner: <strong className="text-stone-800">{order.assignedDeliveryPerson.name}</strong> ({order.assignedDeliveryPerson.phone})
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedTrackingOrder(order)}
                        className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white font-medium flex items-center gap-1.5 shadow-xs hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                        <span>Live GPS</span>
                      </button>

                      <button
                        onClick={() => openInvoiceModal(order)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-600" />
                        <span>Invoice</span>
                      </button>

                      <button
                        onClick={() => openWhatsAppAlert()}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium transition-colors cursor-pointer"
                      >
                        WhatsApp
                      </button>

                      <div className="font-semibold text-stone-900 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                        OTP: <span className="font-mono text-amber-800">{order.deliveryOtp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Simple Floating Cart Button (only if cart has items) */}
      {cartCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm flex items-center gap-3 shadow-lg transition-transform hover:scale-103 active:scale-98 cursor-pointer border border-amber-300/40"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-100" />
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span>View Cart • ₹{cartSubtotal}</span>
          </button>
        </div>
      )}
    </div>
  );
};
