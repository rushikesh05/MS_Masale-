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
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from './ProductCard';
import { LiveDeliveryTrackerModal } from './LiveDeliveryTrackerModal';
import { Order } from '../types';
import { ProductVisual } from './ProductVisual';

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
    categories: dynamicCategories 
  } = useApp();
  const { currentUser, setIsAuthModalOpen, setAuthMode } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'catalog' | 'orders'>('catalog');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Classic, simple category list
  const categories = [
    { id: 'all', name: 'All Products (सर्व उत्पादने)' },
    { id: 'masala', name: 'Masales (मसाले)' },
    { id: 'dry-chutneys', name: 'Chutneys (चटण्या)' },
    { id: 'pickles', name: 'Pickles (लोणची)' },
    { id: 'thecha', name: 'Thecha (ठेचा)' },
    { id: 'metkut', name: 'Metkut (मेतकूट)' },
    { id: 'kolhapuri', name: 'Kolhapuri Special' },
    ...dynamicCategories
      .filter(dc => !['all', 'masala', 'pickles', 'thecha', 'dry-chutneys', 'metkut', 'kolhapuri', 'bestsellers', 'healthy', 'chutney', 'pickle', 'specialty'].includes(dc.id))
      .map(dc => ({ id: dc.id, name: `${dc.nameEn} (${dc.nameMr})` }))
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

    return matchesName || matchesTagline || matchesDesc || matchesIngredients;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const kandaProduct = products.find(p => p.id === 'prod-kanda-lasun') || products[0];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Light Gradient Hero Banner */}
      <section className="mx-4 sm:mx-6 lg:mx-8 rounded-2xl p-6 sm:p-10 bg-gradient-to-br from-amber-100/90 via-orange-50/95 to-rose-100/80 text-stone-900 shadow-sm border border-amber-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Strictly MS Masale, Contact & Fast Actions */}
          <div className="lg:col-span-7 space-y-4">
            {/* Title: Strictly MS Masale without brand tagline */}
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-stone-900 tracking-tight">
              MS Masale
            </h1>

            <p className="text-sm sm:text-base text-stone-700 max-w-xl leading-relaxed">
              Authentic Maharashtrian spices, masalas, and condiments made with pure ingredients and traditional recipes. Delivered fresh to your home.
            </p>

            {/* Direct Contact & Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveSection('catalog');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 font-bold text-xs sm:text-sm rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white transition-all shadow-xs cursor-pointer"
              >
                Order Online
              </button>

              <button
                onClick={() => {
                  setActiveSection('catalog');
                  setSelectedCategory('masala');
                }}
                className="px-5 py-3 font-bold text-xs sm:text-sm rounded-xl bg-white hover:bg-amber-50/80 text-stone-900 border border-amber-300/80 transition-all shadow-2xs cursor-pointer flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Masales (मसाले)</span>
              </button>

              {/* Direct Phone Call Button */}
              <a
                href="tel:8591254237"
                className="px-5 py-3 font-bold text-xs sm:text-sm rounded-xl bg-white hover:bg-amber-50/80 text-amber-900 border border-amber-200/80 transition-all shadow-2xs flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Call: 8591254237</span>
              </a>

              {/* Direct WhatsApp Button */}
              <a
                href="https://wa.me/918591254237?text=Hello%20MS%20Masale,%20I%20want%20to%20order"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 font-bold text-xs sm:text-sm rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-xs flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-100" />
                <span>WhatsApp: 8591254237</span>
              </a>
            </div>

            {/* Simple Contact Banner Badge */}
            <div className="pt-1 text-xs text-stone-700 flex items-center gap-2">
              <span className="font-semibold">Helpline & Orders:</span>
              <a href="tel:8591254237" className="font-mono font-bold text-amber-900 underline">
                8591254237
              </a>
              <span className="text-stone-500">• Fast Delivery Across Maharashtra</span>
            </div>
          </div>

          {/* Right Column: Clean Product Showcase Image */}
          <div className="lg:col-span-5 hidden sm:flex items-center justify-center">
            <div 
              onClick={() => {
                if (kandaProduct) setSelectedProductDetail(kandaProduct);
              }}
              className="w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden border border-amber-200/90 shadow-md hover:shadow-xl hover:shadow-amber-500/20 hover:border-amber-400 transition-all duration-500 cursor-pointer bg-white group group/hero"
            >
              {kandaProduct && (
                <ProductVisual
                  product={kandaProduct}
                  imageUrl={kandaProduct.imageUrl}
                  name={kandaProduct.nameEn}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* 3 Simple Pillars */}
        <div className="mt-8 pt-6 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-stone-900">100% Pure & Traditional</div>
              <div className="text-[11px] text-stone-600">No chemical preservatives</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-stone-900">Express Maharashtra Delivery</div>
              <div className="text-[11px] text-stone-600">Packed fresh upon order</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-stone-900">Direct Phone Ordering</div>
              <div className="text-[11px] text-stone-600">Call or WhatsApp: 8591254237</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Navigation Tabs (Light Gradient) */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none p-1.5 rounded-xl bg-gradient-to-r from-white via-amber-50/60 to-orange-50/50 border border-amber-200/70 shadow-2xs w-fit">
          <button
            onClick={() => {
              setActiveSection('catalog');
              setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'catalog' && selectedCategory === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-amber-100/60'
            }`}
          >
            All Products
          </button>

          <button
            onClick={() => {
              setActiveSection('catalog');
              setSelectedCategory('masala');
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'catalog' && selectedCategory === 'masala'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-amber-100/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Masales (मसाले)</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('catalog');
              setSelectedCategory('dry-chutneys');
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'catalog' && selectedCategory === 'dry-chutneys'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-amber-100/60'
            }`}
          >
            Chutneys (चटण्या)
          </button>

          <button
            onClick={() => {
              setActiveSection('catalog');
              setSelectedCategory('pickles');
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'catalog' && selectedCategory === 'pickles'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-amber-100/60'
            }`}
          >
            Pickles (लोणची)
          </button>

          <button
            onClick={() => setActiveSection('orders')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
              activeSection === 'orders'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-950 hover:bg-amber-100/60'
            }`}
          >
            <span>My Orders</span>
            {orders.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-stone-950">
                {orders.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Main Content: Catalog or Orders */}
      {activeSection === 'catalog' && (
        <section id="catalog-grid-section" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          
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
                {selectedCategory === 'masala' ? 'Masales (मसाले)' : 
                 selectedCategory === 'pickles' ? 'Traditional Pickles (लोणची)' : 
                 selectedCategory === 'dry-chutneys' ? 'Chutneys (चटण्या)' : 
                 'All Products'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Authentic Maharashtrian recipes packed in sealed jars. For phone orders call: <strong className="text-stone-800">8591254237</strong>
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-amber-200/80 hover:bg-amber-50/70 hover:border-amber-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notice when Masala Category is Active */}
          {selectedCategory === 'masala' && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-rose-50/80 border border-amber-200 flex items-center justify-between gap-3 text-stone-800 shadow-2xs">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <strong className="text-stone-900 font-serif text-sm block">मसाले (Pure Masales)</strong>
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

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredProducts.map(product => (
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
                No items match your search. Try another query or browse all items.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer shadow-xs"
              >
                View All Products
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
                We take phone and WhatsApp orders directly across Maharashtra.
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

            <button
              onClick={handleRefresh}
              className="px-3.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
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
