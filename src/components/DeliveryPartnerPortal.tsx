import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  KeyRound, 
  RefreshCw, 
  Navigation, 
  Package, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  DollarSign,
  Search,
  MessageCircle,
  IndianRupee,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Receipt,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { updateOrderStatusInFirestore, subscribeToOrders } from '../lib/firestoreSync';

export const DeliveryPartnerPortal: React.FC = () => {
  const { language, showToast, refreshOrders } = useApp();
  const { userProfile } = useAuth();
  const isMr = language === 'mr';

  const riderName = userProfile?.displayName || 'मुकुंद / विशाल (Mukund & Vishal)';

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'active' | 'pending_prep' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderForOtp, setSelectedOrderForOtp] = useState<Order | null>(null);
  const [inputOtp, setInputOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cashCollectedCheckbox, setCashCollectedCheckbox] = useState<boolean>(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  // Real-time Firestore sync on orders collection
  useEffect(() => {
    console.log('[DeliveryPartnerPortal] Subscribing to real-time Firestore orders...');
    const unsubscribe = subscribeToOrders((firestoreOrders) => {
      setOrders(firestoreOrders);
    });

    // Also fetch initial data from API
    loadData();

    return () => {
      unsubscribe();
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error('Failed to load orders for delivery:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Cloud Firestore Synchronization
        updateOrderStatusInFirestore(orderId, newStatus as any);
        showToast(
          isMr 
            ? `ऑर्डर #${orderId} स्थिती अपडेट: ${newStatus.replace(/_/g, ' ')}` 
            : `Order #${orderId} status changed to ${newStatus.replace(/_/g, ' ')}`
        );
        loadData();
        refreshOrders();
      }
    } catch (e) {
      console.error('Failed to update delivery status:', e);
    }
  };

  const handleVerifyOtpAndDeliver = async () => {
    if (!selectedOrderForOtp) return;

    if (inputOtp.trim() !== selectedOrderForOtp.deliveryOtp) {
      setOtpError(isMr ? 'अवैध OTP! कृपया ग्राहकाने दिलेला अचूक ४ अंकी कोड टाका.' : 'Invalid OTP! Please enter correct 4-digit code provided by customer.');
      return;
    }

    if (selectedOrderForOtp.paymentMethod === 'cod' && !cashCollectedCheckbox) {
      setOtpError(isMr ? 'कृपया ग्राहकाकडून रोख/UPI रक्कम स्वीकारल्याची खात्री करा.' : 'Please confirm cash/UPI collection before marking delivered.');
      return;
    }

    try {
      const res = await fetch(`/api/orders/${selectedOrderForOtp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered', otp: inputOtp })
      });
      const data = await res.json();
      if (data.success) {
        // Cloud Firestore Synchronization
        updateOrderStatusInFirestore(selectedOrderForOtp.id, 'delivered', {
          paymentStatus: 'paid'
        });
        showToast(
          isMr 
            ? `🎉 पार्सल #${selectedOrderForOtp.id} यशस्वीरीत्या पोहोचवले! ₹${selectedOrderForOtp.totalAmount} जमा.` 
            : `🎉 Order #${selectedOrderForOtp.id} successfully delivered! ₹${selectedOrderForOtp.totalAmount} collected.`
        );
        setSelectedOrderForOtp(null);
        setInputOtp('');
        setOtpError(null);
        setCashCollectedCheckbox(false);
        loadData();
        refreshOrders();
      }
    } catch (e) {
      console.error('Delivery OTP confirmation error:', e);
    }
  };

  const handleSendWhatsAppEta = (order: Order) => {
    const phoneClean = order.customer.phone.replace(/\D/g, '');
    const msg = `नमस्कार ${order.customer.fullName} जी! 🌶️ मी अस्सल गावरान चटणीचा डिलिव्हरी रायडर बोलतोय. तुमची ऑर्डर #${order.id} घेऊन मी निघालो आहे. रक्कम: ₹${order.totalAmount} (${order.paymentMethod === 'cod' ? 'COD रोख' : 'Prepaid Online'}). पोहचल्यावर डिलिव्हरी कोड सांगावा: ${order.deliveryOtp}. धन्यवाद!`;
    const url = `https://wa.me/${phoneClean.startsWith('91') ? phoneClean : '91' + phoneClean}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Dynamic Financial Calculations
  const codDeliveredTotal = orders
    .filter(o => o.orderStatus === 'delivered' && o.paymentMethod === 'cod')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const codPendingTotal = orders
    .filter(o => (o.orderStatus === 'out_for_delivery' || o.orderStatus === 'packed_in_airtight_jar' || o.orderStatus === 'order_placed') && o.paymentMethod === 'cod')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const activeInTransit = orders.filter(o => o.orderStatus === 'out_for_delivery');
  const readyToPickup = orders.filter(o => o.orderStatus === 'packed_in_airtight_jar');
  const inWorkshopPrep = orders.filter(o => o.orderStatus === 'order_placed' || o.orderStatus === 'blending_in_workshop');
  const completedOrders = orders.filter(o => o.orderStatus === 'delivered');

  // Filtered Orders based on tab and search
  const filteredOrders = orders.filter(order => {
    // Tab filter
    if (activeFilter === 'ready' && order.orderStatus !== 'packed_in_airtight_jar') return false;
    if (activeFilter === 'active' && order.orderStatus !== 'out_for_delivery') return false;
    if (activeFilter === 'pending_prep' && order.orderStatus !== 'order_placed' && order.orderStatus !== 'blending_in_workshop') return false;
    if (activeFilter === 'delivered' && order.orderStatus !== 'delivered') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customer.fullName.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.includes(q);
      const matchCity = (order.customer.talukaDistrict || '').toLowerCase().includes(q);
      const matchAddress = (order.customer.addressLine1 || '').toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchCity || matchAddress;
    }

    return true;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* Driver Card Header */}
      <div className="bg-gradient-to-r from-[#2D4263] via-[#1E2B3E] to-[#141E2C] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
              <Truck className="w-4 h-4" />
              <span>{isMr ? 'डिलिव्हरी रायडर पोर्टल' : 'Express Delivery Partner Portal'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isMr ? '🔴 Firestore रिअल-टाइम कनेक्टेड' : '🟢 Live Order Sync Active'}</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-brand">
            {isMr ? 'आजचे डिलिव्हरी रस्ते, किमती & पार्सल' : 'Today’s Delivery Runs & Cash Ledger'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Rider: <strong>{riderName}</strong> • MH-12-EP-4421 • {orders.length} {isMr ? 'एकूण ऑर्डर्स' : 'Total Orders in System'}
            </span>
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-black text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isMr ? 'रिफ्रेश डेटा' : 'Refresh Orders'}</span>
        </button>
      </div>

      {/* Dynamic Stats Summary Cards with Real COD Cash Calculation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>{isMr ? '🛵 चालू वितरण (In Transit)' : 'Active Runs'}</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          </div>
          <div className="text-2xl font-extrabold text-[#C84B31]">{activeInTransit.length}</div>
          <div className="text-[11px] text-stone-500">
            {readyToPickup.length} {isMr ? 'पिकअपसाठी तयार' : 'Ready for pickup'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>{isMr ? '✅ यशस्वी वितरण (Delivered)' : 'Delivered Today'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{completedOrders.length}</div>
          <div className="text-[11px] text-stone-500">
            {orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0}% completion rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
            <span>{isMr ? '💵 गोळा केलेली COD रोख' : 'COD Cash Collected'}</span>
            <IndianRupee className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900 font-mono">₹{codDeliveredTotal.toLocaleString()}</div>
          <div className="text-[11px] text-amber-700 font-medium">
            {orders.filter(o => o.orderStatus === 'delivered' && o.paymentMethod === 'cod').length} {isMr ? 'रोख ऑर्डर्स जमा' : 'cash orders collected'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>{isMr ? '⏳ रस्त्यावर बाकी COD रोख' : 'Pending COD on Road'}</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#2D2424] font-mono">₹{codPendingTotal.toLocaleString()}</div>
          <div className="text-[11px] text-stone-500">
            {orders.filter(o => o.orderStatus !== 'delivered' && o.paymentMethod === 'cod').length} {isMr ? 'पार्सलमध्ये रोख बाकी' : 'uncollected COD parcels'}
          </div>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', labelMr: 'सर्व ऑर्डर्स', labelEn: 'All Orders', count: orders.length },
              { id: 'active', labelMr: '🛵 चालू रस्ते', labelEn: 'In Transit', count: activeInTransit.length },
              { id: 'ready', labelMr: '📦 पिकअपसाठी तयार', labelEn: 'Ready for Pickup', count: readyToPickup.length },
              { id: 'pending_prep', labelMr: '🛠️ वर्कशॉप तयारीत', labelEn: 'In Prep', count: inWorkshopPrep.length },
              { id: 'delivered', labelMr: '✅ वितरित', labelEn: 'Delivered', count: completedOrders.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#2D4263] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-600 hover:bg-[#F2ECE5] border border-[#EADFD5]'
                }`}
              >
                <span>{isMr ? tab.labelMr : tab.labelEn}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeFilter === tab.id ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMr ? 'ऑर्डर ID, ग्राहक, पत्ता शोधा...' : 'Search ID, name, location...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#EADFD5] rounded-xl focus:ring-2 focus:ring-[#2D4263] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Delivery Task Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#2D2424] font-brand flex items-center gap-2">
            <span>📦 {isMr ? 'डिलिव्हरी टास्क यादी' : 'Delivery Task List'}</span>
            <span className="text-xs font-mono text-stone-500 font-normal">
              ({filteredOrders.length} {isMr ? 'ऑर्डर्स' : 'records'})
            </span>
          </h3>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#EFE4D8] text-center space-y-3 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-extrabold text-lg text-[#2D2424] font-brand">
              {isMr ? 'कोणतेही प्रलंबित पार्सल सापडले नाही!' : 'No Matching Parcels Found!'}
            </h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {isMr 
                ? 'निवडलेल्या फिल्टरनुसार सध्या कोणतीही ऑर्डर उपलब्ध नाही. नवीन ऑर्डर प्लेस झाल्यावर रिअल-टाइम येथे दिसेल.' 
                : 'No orders match this filter. When a new customer places an order, it syncs here automatically.'}
            </p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isExpanded = expandedOrderIds.has(order.id);
            const isCod = order.paymentMethod === 'cod';
            const isPaid = order.paymentStatus === 'paid' || order.orderStatus === 'delivered';
            const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-xs space-y-4 transition-all ${
                  order.orderStatus === 'out_for_delivery'
                    ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/10'
                    : order.orderStatus === 'delivered'
                    ? 'border-emerald-200 bg-emerald-50/10 opacity-90'
                    : 'border-[#EFE4D8]'
                }`}
              >
                {/* Top Row: Order ID, Timestamp, Status & Payment Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5EDE4] pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-extrabold text-base text-[#C84B31] bg-[#FFF2EE] px-2.5 py-1 rounded-xl border border-[#F5C2B8]">
                      #{order.id}
                    </span>
                    <span className="text-xs font-bold text-[#2D2424]">{order.customer.fullName}</span>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Status & Payment Tag */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Pill */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide flex items-center gap-1 ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'out_for_delivery'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : order.orderStatus === 'packed_in_airtight_jar'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {order.orderStatus === 'out_for_delivery' && <Truck className="w-3.5 h-3.5" />}
                      {order.orderStatus === 'delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{order.orderStatus.replace(/_/g, ' ')}</span>
                    </span>

                    {/* Payment Mode Highlight */}
                    {isCod ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-stone-950 flex items-center gap-1 shadow-xs">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>COD (Collect Cash)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-700 text-white flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Paid Online</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Content: Customer Address & Direct Communication */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  {/* Customer & Address Details */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-stone-700">
                      <MapPin className="w-4 h-4 text-[#C84B31] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#2D2424] text-sm">
                          {order.customer.addressLine1}
                          {order.customer.addressLine2 ? `, ${order.customer.addressLine2}` : ''}
                        </div>
                        <div className="text-stone-600 mt-0.5">
                          {order.customer.landmark ? `Landmark: ${order.customer.landmark}, ` : ''}
                          {order.customer.talukaDistrict} - <strong className="text-stone-900">{order.customer.pincode}</strong>
                        </div>
                        {order.customer.deliveryNotes && (
                          <div className="mt-1.5 inline-block bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                            📌 Note: "{order.customer.deliveryNotes}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rider Action Quick Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2 justify-end">
                    <a
                      href={`tel:${order.customer.phone}`}
                      className="flex-1 md:w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isMr ? 'ग्राहकास कॉल करा' : 'Call Customer'}</span>
                    </a>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${order.customer.addressLine1}, ${order.customer.talukaDistrict} ${order.customer.pincode}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 md:w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isMr ? 'गुगल मॅप्स नेव्हिगेशन' : 'GPS Navigation'}</span>
                    </a>

                    <button
                      onClick={() => handleSendWhatsAppEta(order)}
                      className="flex-1 md:w-full py-2 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isMr ? 'व्हॉट्सॲप ETA पाठवा' : 'WhatsApp ETA'}</span>
                    </button>
                  </div>
                </div>

                {/* Price and Items Summary Box (Detailed Breakdown) */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE4D8] space-y-3">
                  {/* Primary Price Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADFD5] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#C84B31]" />
                      <span className="font-extrabold text-sm text-[#2D2424]">
                        {totalItemsCount} {isMr ? 'चटणी जार' : 'Chutney Jars'}
                      </span>
                    </div>

                    {/* Price with COD instruction banner */}
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-xs text-stone-500 font-semibold">{isMr ? 'एकूण देय रक्कम:' : 'Payable:'}</span>
                        <span className="text-xl font-mono font-extrabold text-[#C84B31]">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold">
                        {isCod ? (
                          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                            ⚠️ {isMr ? `ग्राहकाकडून ₹${order.totalAmount} रोख/UPI घ्या!` : `Collect ₹${order.totalAmount} from customer!`}
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            ✅ {isMr ? 'ऑनलाइन पेमेंट झाले आहे (पैसे घेऊ नका)' : 'Already paid online (Do NOT collect cash)'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Itemized List Preview */}
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-stone-700">
                        <div className="flex items-center gap-2 truncate max-w-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31]" />
                          <span className="font-semibold text-[#2D2424]">
                            {isMr ? item.titleMr : item.titleEn}
                          </span>
                          <span className="text-stone-500 font-mono text-[11px]">
                            ({item.size} × {item.quantity})
                          </span>
                          {item.isCustomRecipe && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                              Bespoke
                            </span>
                          )}
                        </div>
                        <div className="font-mono font-bold text-stone-900">
                          ₹{item.totalPrice}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expandable Price & Fare Calculation */}
                  <div className="pt-2 border-t border-[#EADFD5]/60 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-stone-600 hover:text-[#C84B31] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{isExpanded ? (isMr ? 'तपशील लपवा' : 'Hide Bill Details') : (isMr ? 'पूर्ण बिल तपशील पहा' : 'View Full Bill Breakdown')}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <span className="text-[11px] text-stone-400 font-mono">
                      OTP: {order.orderStatus === 'delivered' ? 'Verified' : 'Required at Door'}
                    </span>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2 border-t border-dashed border-[#EADFD5] text-xs space-y-1 text-stone-600"
                    >
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-mono">₹{order.subtotal}</span>
                      </div>
                      {order.discount ? (
                        <div className="flex justify-between text-emerald-700">
                          <span>Promo Discount ({order.couponCode || 'APPLIED'}):</span>
                          <span className="font-mono">-₹{order.discount}</span>
                        </div>
                      ) : null}
                      <div className="flex justify-between">
                        <span>Delivery & Packaging:</span>
                        <span className="font-mono">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-[#2D2424] pt-1 border-t border-stone-200">
                        <span>Final Bill Amount:</span>
                        <span className="font-mono text-[#C84B31]">₹{order.totalAmount}</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sequential Rider Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-stone-500">
                    <span>{isMr ? 'पुढील पायरी:' : 'Next Step:'} </span>
                    <strong className="text-stone-800">
                      {order.orderStatus === 'order_placed' && (isMr ? 'वर्कशॉप पॅकिंगची वाट पहा' : 'Waiting for workshop packing')}
                      {order.orderStatus === 'blending_in_workshop' && (isMr ? 'खलबत्त्यात कुटणी चालू आहे' : 'Grinding in progress')}
                      {order.orderStatus === 'packed_in_airtight_jar' && (isMr ? 'वर्कशॉपमधून पार्सल उचला' : 'Pick up from workshop')}
                      {order.orderStatus === 'out_for_delivery' && (isMr ? 'ग्राहकाकडे OTP मागून डिलिव्हर करा' : 'Verify OTP with customer')}
                      {order.orderStatus === 'delivered' && (isMr ? 'यशस्वीरीत्या वितरित!' : 'Delivered & Completed')}
                    </strong>
                  </div>

                  <div className="flex gap-2">
                    {/* Pick up & start run */}
                    {(order.orderStatus === 'packed_in_airtight_jar' || order.orderStatus === 'order_placed' || order.orderStatus === 'blending_in_workshop') && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{isMr ? '🛵 पार्सल घेतले & वितरण सुरू करा' : '🛵 Pick Up & Start Delivery'}</span>
                      </button>
                    )}

                    {/* Out for delivery -> OTP Delivery Modal */}
                    {order.orderStatus === 'out_for_delivery' && (
                      <button
                        onClick={() => {
                          setSelectedOrderForOtp(order);
                          setInputOtp('');
                          setOtpError(null);
                          setCashCollectedCheckbox(false);
                        }}
                        className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>{isMr ? '🔑 ४ अंकी OTP टाकून डिलिव्हर करा' : '🔑 Verify Customer OTP & Deliver'}</span>
                      </button>
                    )}

                    {order.orderStatus === 'delivered' && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isMr ? 'वितरण पूर्ण झाले' : 'Delivered'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* OTP & Cash Collection Modal Dialog */}
      <AnimatePresence>
        {selectedOrderForOtp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-[#EFE4D8] shadow-2xl"
            >
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-[#2D2424] font-brand">
                  {isMr ? 'डिलिव्हरी खात्री & OTP' : 'Delivery Security Confirmation'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isMr ? `ग्राहक ${selectedOrderForOtp.customer.fullName} यांच्याकडून ४ अंकी OTP विचारा:` : `Ask customer ${selectedOrderForOtp.customer.fullName} for 4-digit code:`}
                </p>
              </div>

              {/* Price & Payment instruction inside OTP dialog */}
              <div className={`p-3.5 rounded-2xl text-xs space-y-1 border ${
                selectedOrderForOtp.paymentMethod === 'cod'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex justify-between items-center font-bold">
                  <span>{isMr ? 'देय रक्कम:' : 'Payable Amount:'}</span>
                  <span className="text-base font-mono font-extrabold text-[#C84B31]">
                    ₹{selectedOrderForOtp.totalAmount}
                  </span>
                </div>
                <div className="text-[11px]">
                  {selectedOrderForOtp.paymentMethod === 'cod' ? (
                    <span>⚠️ Cash on Delivery: ग्राहकाकडून रोख किंवा UPI ने ₹{selectedOrderForOtp.totalAmount} स्वीकारा.</span>
                  ) : (
                    <span>✅ Prepaid Online: रक्कम आधीच अदा केली आहे. ग्राहकाकडून पैसे घेऊ नका.</span>
                  )}
                </div>
              </div>

              {/* Cash collected confirmation check for COD */}
              {selectedOrderForOtp.paymentMethod === 'cod' && (
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#EADFD5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cashCollectedCheckbox}
                    onChange={(e) => setCashCollectedCheckbox(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-green-700 accent-green-700 cursor-pointer"
                  />
                  <span className="text-xs text-stone-800 font-bold">
                    {isMr 
                      ? `मी ग्राहकाकडून ₹${selectedOrderForOtp.totalAmount} रोख/UPI द्वारे प्राप्त केले आहेत.` 
                      : `I have collected ₹${selectedOrderForOtp.totalAmount} in cash/UPI from customer.`}
                  </span>
                </label>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 text-center">
                  {isMr ? '४ अंकी डिलिव्हरी कोड (OTP):' : 'Enter 4-Digit OTP:'}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={inputOtp}
                  onChange={(e) => setInputOtp(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-[0.6em] text-2xl font-mono font-extrabold px-3 py-2 bg-[#FAF8F5] border border-[#EADFD5] rounded-2xl focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
                {otpError && (
                  <p className="text-xs text-red-500 text-center font-medium">{otpError}</p>
                )}
                <p className="text-[10px] text-gray-400 text-center">
                  (Demo Hint: Customer's OTP is <strong className="text-[#C84B31]">{selectedOrderForOtp.deliveryOtp}</strong>)
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrderForOtp(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  {isMr ? 'रद्द करा' : 'Cancel'}
                </button>
                <button
                  onClick={handleVerifyOtpAndDeliver}
                  className="flex-1 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  {isMr ? 'वितरण निश्चित करा' : 'Confirm Delivery'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

