import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Layers, 
  RefreshCw, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  ChefHat, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Search,
  Check,
  BellRing,
  Zap,
  Sliders,
  Sparkles,
  ShieldAlert,
  Flame,
  Volume2,
  VolumeX,
  Radio,
  Building2,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Send,
  CheckCircle2,
  MapPin,
  Calendar,
  Scale,
  Store,
  UtensilsCrossed
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Order, RawIngredientStock, WholesaleRequest, WholesaleRequestStatus } from '../types';
import { 
  updateOrderStatusInFirestore, 
  subscribeToInventory, 
  updateStockInFirestore,
  updateStockThresholdInFirestore,
  deductInventoryForOrderInFirestore,
  subscribeToWholesaleRequests,
  updateWholesaleRequestStatusInFirestore
} from '../lib/firestoreSync';

export const ManagerPortal: React.FC = () => {
  const { language, showToast, refreshOrders } = useApp();
  const { userProfile } = useAuth();
  const isMr = language === 'mr';

  const managerName = userProfile?.displayName || 'Sunil R. (Workshop Production Manager)';

  const [rawStocks, setRawStocks] = useState<RawIngredientStock[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<WholesaleRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'workshop_queue' | 'inventory' | 'wholesale_requests'>('workshop_queue');
  const [selectedStockToRefill, setSelectedStockToRefill] = useState<RawIngredientStock | null>(null);
  const [refillKg, setRefillKg] = useState<number>(50);
  const [editingThresholdStock, setEditingThresholdStock] = useState<RawIngredientStock | null>(null);
  const [newThresholdValue, setNewThresholdValue] = useState<number>(50);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [selectedWholesaleFilter, setSelectedWholesaleFilter] = useState<'all' | WholesaleRequestStatus>('all');
  const [editingManagerNotesId, setEditingManagerNotesId] = useState<string | null>(null);
  const [managerNoteInput, setManagerNoteInput] = useState<string>('');

  const prevLowStockIdsRef = useRef<Set<string>>(new Set());

  // Web Audio Synth for instant audible low-stock warning tone
  const playAlertChirp = () => {
    if (isAudioMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio context might be restricted before user interaction
    }
  };

  // Real-time Firestore Listener on /inventory collection
  useEffect(() => {
    console.log('[ManagerPortal] Attaching real-time Firestore /inventory listener...');
    const unsubscribe = subscribeToInventory((updatedStocks) => {
      setRawStocks(updatedStocks);

      // Check for newly triggered low stock items
      const currentLowStocks = updatedStocks.filter(s => s.currentStockKg <= s.lowStockThresholdKg);
      const currentLowIds = new Set(currentLowStocks.map(s => s.id));

      // Trigger audible chime and toast when a new spice drops below threshold
      const hasNewCriticalDrop = Array.from(currentLowIds).some(id => !prevLowStockIdsRef.current.has(id));
      if (hasNewCriticalDrop && currentLowStocks.length > 0) {
        playAlertChirp();
        const firstLow = currentLowStocks[0];
        showToast(
          isMr 
            ? `🚨 सावधान! ${firstLow.nameMr} साठा मर्यादेखाली (${firstLow.currentStockKg}kg) गेला आहे!` 
            : `🚨 Low Stock Alert! ${firstLow.nameEn} has dropped to ${firstLow.currentStockKg}kg!`
        );
      }

      prevLowStockIdsRef.current = currentLowIds;
    });

    return () => {
      unsubscribe();
    };
  }, [isMr, isAudioMuted]);

  // Real-time Firestore Listener on /wholesale_requests collection
  useEffect(() => {
    console.log('[ManagerPortal] Attaching real-time Firestore /wholesale_requests listener...');
    const unsubscribe = subscribeToWholesaleRequests((requests) => {
      if (requests.length > 0) {
        setWholesaleRequests(requests);
      }
    });

    // Also fetch initial wholesale requests from API backup
    const loadWholesaleInitial = async () => {
      try {
        const res = await fetch('/api/wholesale-requests');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setWholesaleRequests(prev => prev.length === 0 ? data.data : prev);
        }
      } catch (err) {
        console.warn('[ManagerPortal] Initial wholesale fetch:', err);
      }
    };
    loadWholesaleInitial();

    return () => {
      unsubscribe();
    };
  }, []);

  // Load orders
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const ordRes = await fetch('/api/orders');
      const ordData = await ordRes.json();
      if (ordData.success) {
        setOrders(ordData.data);
      }
    } catch (e) {
      console.error('Manager data fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
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
        
        // If transitioning to blending, simulate kitchen mortar deduction in Firestore
        const targetOrder = orders.find(o => o.id === orderId);
        if (targetOrder && newStatus === 'blending_in_workshop') {
          deductInventoryForOrderInFirestore(rawStocks, targetOrder);
        }

        showToast(isMr ? `ऑर्डर #${orderId} स्थिती अपडेट झाली!` : `Order #${orderId} status updated!`);
        loadOrders();
        refreshOrders();
      }
    } catch (e) {
      console.error('Status update failed:', e);
    }
  };

  const handleRefillStock = async () => {
    if (!selectedStockToRefill) return;
    const targetId = selectedStockToRefill.id;
    const newQuantity = selectedStockToRefill.currentStockKg + refillKg;

    try {
      // Direct Cloud Firestore Real-Time Update
      await updateStockInFirestore(targetId, newQuantity, {
        lastProcuredDate: new Date().toISOString().split('T')[0]
      });

      // API Mirror
      await fetch(`/api/inventory/raw-stocks/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addKg: refillKg })
      });

      showToast(isMr ? `✅ ${selectedStockToRefill.nameMr} साठा +${refillKg}kg ने वाढवला!` : `✅ Restocked +${refillKg}kg for ${selectedStockToRefill.nameEn}`);
      setSelectedStockToRefill(null);
    } catch (e) {
      console.error('Stock refill error:', e);
    }
  };

  // Quick 1-Click Quick Restock from Low Stock Alert Banner
  const handleQuickRefill = async (stock: RawIngredientStock, amountKg: number = 50) => {
    const newQty = stock.currentStockKg + amountKg;
    try {
      await updateStockInFirestore(stock.id, newQty, {
        lastProcuredDate: new Date().toISOString().split('T')[0]
      });
      showToast(isMr ? `⚡ त्वरित साठा जोडला: ${stock.nameMr} +${amountKg}kg!` : `⚡ Instant Restocked: ${stock.nameEn} +${amountKg}kg!`);
    } catch (e) {
      console.error('Quick refill error:', e);
    }
  };

  // Update Threshold Handler
  const handleSaveThreshold = async () => {
    if (!editingThresholdStock) return;
    try {
      await updateStockThresholdInFirestore(editingThresholdStock.id, newThresholdValue);
      showToast(isMr ? `🎯 ${editingThresholdStock.nameMr} थ्रेशहोल्ड ${newThresholdValue}kg वर सेट केले!` : `🎯 Alert threshold for ${editingThresholdStock.nameEn} set to ${newThresholdValue}kg!`);
      setEditingThresholdStock(null);
    } catch (e) {
      console.error('Threshold update error:', e);
    }
  };

  // Wholesale Request Status & Notes Handlers
  const handleUpdateWholesaleStatus = async (
    requestId: string,
    newStatus: WholesaleRequestStatus,
    extra?: Partial<WholesaleRequest>
  ) => {
    try {
      // 1. Update Cloud Firestore in real-time
      await updateWholesaleRequestStatusInFirestore(requestId, newStatus, extra);

      // 2. Local state update
      setWholesaleRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus, ...extra } : r));

      // 3. API patch backup
      try {
        await fetch(`/api/wholesale-requests/${requestId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, ...extra })
        });
      } catch (err) {
        console.warn('API backup status update:', err);
      }

      showToast(isMr ? `✅ मागणी #${requestId} स्थिती '${newStatus}' अपडेट झाली.` : `✅ Request #${requestId} status changed to '${newStatus}'.`);
    } catch (e) {
      console.error('Wholesale status update error:', e);
      showToast(isMr ? 'स्थिती बदलताना त्रुटी आली.' : 'Failed to update status.');
    }
  };

  const handleSaveWholesaleNotes = async (requestId: string) => {
    if (!managerNoteInput.trim()) return;
    await handleUpdateWholesaleStatus(requestId, (wholesaleRequests.find(r => r.id === requestId)?.status || 'reviewing'), {
      managerNotes: managerNoteInput.trim()
    });
    setEditingManagerNotesId(null);
    setManagerNoteInput('');
  };

  const generateWhatsAppWholesaleQuote = (req: WholesaleRequest) => {
    const text = encodeURIComponent(
      `🚩 *अस्सल गावरान चटणी & मसाले - अधिकृत B2B कोटेशन*\n` +
      `नमस्कार *${req.contactPerson}* (${req.businessName}),\n\n` +
      `आपल्या B2B होलसेल मागणी क्र. *#${req.id}* साठी खालीलप्रमाणे दरपत्रक निश्चित केले आहे:\n\n` +
      `📦 *मागणी प्रमाण:* ${req.totalEstimatedKg} KG (${req.supplyFrequency})\n` +
      `📍 *वितरण स्थळ:* ${req.city} (${req.pincode})\n` +
      `📅 *अपेक्षित वितरण:* ${req.targetDeliveryDate}\n\n` +
      `📋 *चटणी प्रकार तपशील:*\n` +
      req.products.map(p => `• ${p.productNameMr}: ${p.quantityKg} KG [${p.packagingPreference}]`).join('\n') +
      `\n\n💰 *घाऊक किंमत (Special B2B Rate):* ₹${req.estimatedBudgetInr?.toLocaleString('en-IN')} (~₹${req.quotedPricePerKgAvg}/kg)\n` +
      `🚚 *पॅकिंग & वाहतूक:* फूड-ग्रेड हवाबंद कंटेनर्स, मोफत एक्सप्रेस डिलिव्हरी.\n\n` +
      `📝 *मॅनेजर शेफ टीप:* ${req.managerNotes || 'दगडी खलबत्त्यात ताजी कुटून खास बॅच तयार केली जाईल.'}\n\n` +
      `ऑर्डर कन्फर्म करण्यासाठी व नमुना बॅच तपासण्यासाठी कृपया संपर्क साधावा.\n- सुवर्णा (हेड शेफ & वर्कशॉप मॅनेजर)`
    );
    window.open(`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // Simulation tool for testing real-time alert trigger
  const handleSimulateLowStock = async (stock: RawIngredientStock) => {
    const lowQty = Math.max(5, stock.lowStockThresholdKg - 15);
    await updateStockInFirestore(stock.id, lowQty);
    showToast(isMr ? `🧪 चाचणी: ${stock.nameMr} साठा ${lowQty}kg केला (थ्रेशहोल्ड खाली)` : `🧪 Simulated: ${stock.nameEn} stock dropped to ${lowQty}kg`);
  };

  // Identify active low-stock ingredients
  const activeLowStocks = rawStocks.filter(s => s.currentStockKg <= s.lowStockThresholdKg);
  const visibleLowStockAlerts = activeLowStocks.filter(s => !dismissedAlerts.has(s.id));

  const pendingWorkshopOrders = orders.filter(
    o => o.orderStatus === 'order_placed' || o.orderStatus === 'blending_in_workshop'
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#2D2424] text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl border border-[#443838]">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C84B31]/30 text-[#F5C2B8] text-xs font-semibold">
              <ChefHat className="w-4 h-4" />
              <span>{isMr ? 'वर्कशॉप & इन्व्हेंटरी मॅनेजर पोर्टल' : 'Workshop & Kitchen Manager Portal'}</span>
            </span>

            {/* Realtime Firestore Sync Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isMr ? '🔴 Firestore रिअल-टाइम कनेक्टेड' : '🟢 Live Firestore Sync Active'}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-brand">
            {isMr ? 'खलबत्ता वर्कशॉप & कच्चा माल साठा' : 'Artisanal Blending & Stock Control'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            {isMr ? 'कस्टम रेसिपींचे अचूक घटक प्रमाण पाहून ताजी चटणी तयार करा व रिअल-टाइम साठा अलर्ट तपासा.' : 'Manage mortar blending queues and live Firestore threshold monitors.'}
          </p>
          <p className="text-xs text-amber-300/90 mt-1.5 flex items-center gap-1.5 font-medium">
            <span>👨‍🍳</span>
            <span>Manager: <strong>{managerName}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Alert Toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAudioMuted 
                ? 'bg-stone-800 text-stone-400 hover:bg-stone-700' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title={isAudioMuted ? 'Unmute alert chimes' : 'Mute alert chimes'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={loadOrders}
            disabled={isLoading}
            className="px-4 py-2 bg-[#C84B31] hover:bg-[#A83B23] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isMr ? 'रिफ्रेश रांग' : 'Refresh Queue'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REAL-TIME LOW-STOCK DASHBOARD ALERT BANNER                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {visibleLowStockAlerts.length > 0 && (
          <motion.div
            id="low-stock-realtime-alert-banner"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="bg-linear-to-r from-red-600 via-rose-600 to-amber-600 p-0.5 rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#1A0C0C] p-5 sm:p-6 rounded-[22px] text-white space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner animate-pulse">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-white font-brand flex items-center gap-2">
                        <span>{isMr ? '🚨 रिअल-टाइम लो-स्टॉक चेतावणी!' : '🚨 Live Low-Stock Spice Alert!'}</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-extrabold animate-bounce">
                        {visibleLowStockAlerts.length} {isMr ? 'घटक कमी' : 'Critical'}
                      </span>
                    </div>
                    <p className="text-xs text-red-200/80">
                      {isMr 
                        ? 'खालील मसाल्यांचा साठा सुरक्षित थ्रेशहोल्डच्या खाली गेला आहे. तात्काळ रिफिल करा जेणेकरून खलबत्त्यातील काम थांबू नये.' 
                        : 'The following spice inventory has dropped below minimum threshold in Firestore. Restock now to maintain blending rhythm.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                    <Radio className="w-3.5 h-3.5 text-red-400 animate-ping" />
                    <span>Realtime Monitor</span>
                  </span>
                </div>
              </div>

              {/* Grid of Alerted Ingredients */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {visibleLowStockAlerts.map(stock => {
                  const deficitKg = stock.lowStockThresholdKg - stock.currentStockKg;
                  const pct = Math.min(100, Math.round((stock.currentStockKg / stock.lowStockThresholdKg) * 100));

                  return (
                    <div 
                      key={stock.id}
                      className="bg-white/5 border border-red-500/30 rounded-2xl p-4 space-y-3 relative overflow-hidden backdrop-blur-md hover:border-red-500/60 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-extrabold text-sm text-white flex items-center gap-1.5 font-brand">
                            <Flame className="w-4 h-4 text-amber-400" />
                            <span>{isMr ? stock.nameMr : stock.nameEn}</span>
                          </div>
                          <span className="text-[10px] text-stone-400">
                            Source: {stock.sourceRegion}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-mono font-extrabold text-red-400">
                            {stock.currentStockKg} <span className="text-xs text-stone-300">KG</span>
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            Min: {stock.lowStockThresholdKg}kg ({deficitKg > 0 ? `-${deficitKg}kg` : 'At limit'})
                          </div>
                        </div>
                      </div>

                      {/* Meter Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-stone-400">
                          <span>{pct}% of safety buffer</span>
                          <span className="text-red-400 font-bold">Deficit: {Math.max(0, deficitKg)} KG</span>
                        </div>
                      </div>

                      {/* Quick 1-Click Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          id={`btn-instant-refill-${stock.id}`}
                          onClick={() => handleQuickRefill(stock, 50)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 text-xs font-extrabold transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer shadow-md"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{isMr ? '⚡ +५०KG तात्काळ जोडा' : '⚡ +50KG Instant'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingThresholdStock(stock);
                            setNewThresholdValue(stock.lowStockThresholdKg);
                          }}
                          className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
                          title="Adjust Alert Threshold"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-[#EFE4D8] pb-1">
        <button
          id="tab-workshop-queue"
          onClick={() => setActiveTab('workshop_queue')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'workshop_queue'
              ? 'bg-[#C84B31] text-white shadow-xs'
              : 'bg-white text-[#574B4B] hover:bg-[#FAF6F2]'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>{isMr ? 'कस्टम रेसिपी वर्कशॉप रांग' : 'Workshop Preparation Queue'}</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20">
            {pendingWorkshopOrders.length}
          </span>
        </button>

        <button
          id="tab-raw-inventory"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'inventory'
              ? 'bg-[#C84B31] text-white shadow-xs'
              : 'bg-white text-[#574B4B] hover:bg-[#FAF6F2]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{isMr ? 'कच्चा माल साठा व्यवस्थापन (KG)' : 'Raw Ingredient Stock (KG)'}</span>
          {activeLowStocks.length > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute -top-1 -right-1 ring-2 ring-white animate-pulse" />
          )}
        </button>

        <button
          id="tab-wholesale-requests"
          onClick={() => setActiveTab('wholesale_requests')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'wholesale_requests'
              ? 'bg-[#C84B31] text-white shadow-xs'
              : 'bg-white text-[#574B4B] hover:bg-[#FAF6F2]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isMr ? 'होलसेल / B2B मागण्या (Wholesale)' : 'Wholesale / B2B Requests'}</span>
          {wholesaleRequests.filter(r => r.status === 'new_request' || r.status === 'reviewing').length > 0 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500 text-stone-950 font-black">
              {wholesaleRequests.filter(r => r.status === 'new_request' || r.status === 'reviewing').length} {isMr ? 'नवीन' : 'New'}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Workshop Blending Queue */}
      {activeTab === 'workshop_queue' && (
        <div className="space-y-4">
          {pendingWorkshopOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#EFE4D8] text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
              <h3 className="font-bold text-base text-[#2D2424] font-brand">
                {isMr ? 'सर्व ऑर्डर्स पॅक झाल्या आहेत!' : 'All pending recipes blended & packed!'}
              </h3>
              <p className="text-xs text-gray-500">
                {isMr ? 'सध्या कोणतीही नवीन रेसिपी प्रलंबित नाही.' : 'No orders awaiting stone-mortar grinding right now.'}
              </p>
            </div>
          ) : (
            pendingWorkshopOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-[#EFE4D8] shadow-xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5EDE4] pb-3">
                  <div>
                    <span className="font-mono font-extrabold text-sm text-[#C84B31]">
                      #{order.id}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      Customer: {order.customer.fullName} ({order.customer.talukaDistrict})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                      order.orderStatus === 'order_placed'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}>
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Items & Custom Mixing Gram Breakdown for Kitchen Workshop Staff */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        item.isCustomRecipe
                          ? 'bg-[#FFFBF8] border-[#F5C2B8]'
                          : 'bg-[#FAF8F5] border-[#EFE4D8]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-[#2D2424]">
                            {item.titleMr} ({item.size} x {item.quantity})
                          </span>
                          {item.isCustomRecipe && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-[#C84B31] text-white font-bold">
                              Custom Hand-Crafted
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#C84B31]">₹{item.totalPrice}</span>
                      </div>

                      {/* Workshop Exact Gram Recipe Card */}
                      {item.isCustomRecipe && item.customDetails && (
                        <div className="mt-2 p-3 rounded-lg bg-white border border-[#EADFD5] text-xs space-y-2">
                          <div className="font-bold text-[#C84B31] flex items-center gap-1">
                            <span>🧑‍🍳 {isMr ? 'खलबत्त्यातील अचूक मिश्रण प्रमाण:' : 'Kitchen Mixing Specs:'}</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                            <div className="p-1.5 bg-[#FFF2EE] rounded">
                              <span className="text-gray-500 block">🥜 शेंगदाणे</span>
                              <span className="font-extrabold text-[#2D2424]">{item.customDetails.baseIngredients.peanuts}%</span>
                            </div>
                            <div className="p-1.5 bg-[#FFF2EE] rounded">
                              <span className="text-gray-500 block">🥥 खोबरे</span>
                              <span className="font-extrabold text-[#2D2424]">{item.customDetails.baseIngredients.dryCoconut}%</span>
                            </div>
                            <div className="p-1.5 bg-[#FFF2EE] rounded">
                              <span className="text-gray-500 block">✨ तीळ</span>
                              <span className="font-extrabold text-[#2D2424]">{item.customDetails.baseIngredients.sesameSeeds}%</span>
                            </div>
                            <div className="p-1.5 bg-[#FFF2EE] rounded">
                              <span className="text-gray-500 block">💪 जवस</span>
                              <span className="font-extrabold text-[#2D2424]">{item.customDetails.baseIngredients.flaxseed}%</span>
                            </div>
                            <div className="p-1.5 bg-[#FFF2EE] rounded">
                              <span className="text-gray-500 block">🌶️ तिखट बेस</span>
                              <span className="font-extrabold text-[#2D2424]">{item.customDetails.baseIngredients.redChilliBase}%</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 text-[11px] text-[#574B4B] pt-1">
                            <span>🔥 Spice: <strong>Level {item.customDetails.spiceLevel} ({item.customDetails.chilliVariety})</strong></span>
                            <span>🧄 Garlic: <strong>{item.customDetails.garlicLevel}</strong></span>
                            <span>🧂 Salt: <strong>{item.customDetails.saltType}</strong></span>
                            <span>🫒 Oil: <strong>{item.customDetails.oilType}</strong></span>
                            <span>🪨 Texture: <strong>{item.customDetails.texture}</strong></span>
                          </div>

                          <div className="text-[11px] bg-[#FAF6F0] p-1.5 rounded text-[#2D2424]">
                            🏷️ जारवर छापायचे नाव: <strong>"{item.customDetails.customName}"</strong> | "{item.customDetails.tagline}"
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Status Advancement Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-[#F5EDE4]">
                  {order.orderStatus === 'order_placed' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'blending_in_workshop')}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      {isMr ? '१. खलबत्त्यात कुटणे सुरू करा (Start Blending)' : 'Start Blending in Workshop'}
                    </button>
                  )}

                  {order.orderStatus === 'blending_in_workshop' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'packed_in_airtight_jar')}
                      className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      {isMr ? '२. जार सील व पॅक करा (Pack in Airtight Jar)' : 'Pack & Seal in Glass Jar'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Raw Ingredients Stock Levels */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EFE4D8]">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="font-bold text-[#2D2424]">
                {isMr ? 'रिअल-टाइम स्टॉक मॉनिटर:' : 'Live Spice Inventory:'}
              </span>
              <span>{rawStocks.length} Raw Ingredients Tracked</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500">
                {activeLowStocks.length > 0 
                  ? `${activeLowStocks.length} items below minimum safety threshold` 
                  : 'All ingredient reserves healthy'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rawStocks.map(stock => {
              const isLow = stock.currentStockKg <= stock.lowStockThresholdKg;
              const maxScale = Math.max(300, stock.lowStockThresholdKg * 3);
              const pct = Math.min(100, Math.round((stock.currentStockKg / maxScale) * 100));

              return (
                <div
                  key={stock.id}
                  className={`bg-white rounded-2xl p-5 border shadow-xs transition-all space-y-3 relative ${
                    isLow ? 'border-red-400 ring-2 ring-red-100 bg-red-50/20' : 'border-[#EFE4D8]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#2D2424] font-brand">
                        {isMr ? stock.nameMr : stock.nameEn}
                      </h4>
                      <span className="text-[10px] text-gray-500">
                        {stock.sourceRegion}
                      </span>
                    </div>

                    {isLow ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>Low Alert</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Healthy
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-extrabold font-mono ${isLow ? 'text-red-600' : 'text-[#C84B31]'}`}>
                          {stock.currentStockKg}
                        </span>
                        <span className="text-xs text-gray-500 font-semibold">KG</span>
                      </div>

                      <button
                        onClick={() => {
                          setEditingThresholdStock(stock);
                          setNewThresholdValue(stock.lowStockThresholdKg);
                        }}
                        className="text-[11px] text-stone-500 hover:text-stone-900 underline flex items-center gap-0.5"
                        title="Edit Threshold"
                      >
                        <span>Min: {stock.lowStockThresholdKg}kg</span>
                        <Sliders className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Stock Meter with Threshold Marker */}
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-linear-to-r from-red-600 to-rose-500' : 'bg-linear-to-r from-emerald-500 to-green-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-500 space-y-0.5 pt-1 border-t border-[#F5EDE4] flex justify-between items-center">
                    <div>Unit Cost: ₹{stock.unitCostPerKg}/KG</div>
                    <button
                      onClick={() => handleSimulateLowStock(stock)}
                      className="text-[10px] text-stone-400 hover:text-red-600 underline"
                      title="Simulate low stock for testing"
                    >
                      {isMr ? 'चाचणी' : 'Simulate'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleQuickRefill(stock, 50)}
                      className="py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-amber-600" />
                      <span>+50kg</span>
                    </button>

                    <button
                      onClick={() => setSelectedStockToRefill(stock)}
                      className="py-1.5 rounded-xl bg-[#FAF6F2] hover:bg-[#F2ECE5] text-[#2D2424] text-xs font-bold border border-[#EADFD5] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isMr ? 'सानुकूल' : 'Custom'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Refill Dialog Modal */}
          {selectedStockToRefill && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#EFE4D8] shadow-xl">
                <h3 className="font-extrabold text-base text-[#2D2424] font-brand">
                  {isMr ? 'कच्चा माल साठा वाढवा (Firestore Sync)' : 'Restock Raw Ingredient'}
                </h3>
                <p className="text-xs text-gray-600">
                  {selectedStockToRefill.nameMr} ({selectedStockToRefill.sourceRegion})
                </p>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#2D2424]">
                    {isMr ? 'वाढवायचे वजन (KG):' : 'Add Quantity (KG):'}
                  </label>
                  <div className="flex gap-2">
                    {[25, 50, 100, 200].map(kg => (
                      <button
                        key={kg}
                        onClick={() => setRefillKg(kg)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                          refillKg === kg
                            ? 'border-[#C84B31] bg-[#FFF2EE] text-[#C84B31]'
                            : 'border-gray-200'
                        }`}
                      >
                        +{kg}kg
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#F5EDE4]">
                  <button
                    onClick={() => setSelectedStockToRefill(null)}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleRefillStock}
                    className="px-4 py-2 bg-[#C84B31] hover:bg-[#A83B23] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    {isMr ? 'साठा जोडा' : 'Confirm Stock'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Threshold Adjustment Dialog Modal */}
          {editingThresholdStock && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#EFE4D8] shadow-xl">
                <h3 className="font-extrabold text-base text-[#2D2424] font-brand">
                  {isMr ? 'किमान सुरक्षा थ्रेशहोल्ड बदला' : 'Configure Low Stock Threshold'}
                </h3>
                <p className="text-xs text-gray-600">
                  {editingThresholdStock.nameMr} ({editingThresholdStock.nameEn})
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-700">{isMr ? 'अलर्ट थ्रेशहोल्ड:' : 'Alert Threshold:'}</span>
                    <span className="font-mono font-extrabold text-[#C84B31] text-base">{newThresholdValue} KG</span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={newThresholdValue}
                    onChange={(e) => setNewThresholdValue(Number(e.target.value))}
                    className="w-full accent-[#C84B31] cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>10 KG (Aggressive)</span>
                    <span>100 KG (Standard)</span>
                    <span>200 KG (High Safety)</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#F5EDE4]">
                  <button
                    onClick={() => setEditingThresholdStock(null)}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSaveThreshold}
                    className="px-4 py-2 bg-[#C84B31] hover:bg-[#A83B23] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    {isMr ? 'थ्रेशहोल्ड जतन करा' : 'Save Threshold'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Dedicated Restaurant & Caterer Bulk Wholesale Requests */}
      {activeTab === 'wholesale_requests' && (
        <div className="space-y-6">
          {/* Wholesale Pipeline Overview Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{isMr ? 'एकूण B2B मागण्या' : 'Total B2B Requests'}</span>
                <Building2 className="w-4 h-4 text-[#C84B31]" />
              </div>
              <div className="text-xl font-black text-[#2D2424] font-mono">
                {wholesaleRequests.length}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {wholesaleRequests.filter(r => r.status === 'new_request').length} {isMr ? 'नवीन पुनरावलोकन आवश्यक' : 'Pending Initial Review'}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{isMr ? 'एकूण मागणी खंड' : 'Total Volume Demand'}</span>
                <Scale className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-black text-amber-600 font-mono">
                {wholesaleRequests.reduce((sum, r) => sum + (r.totalEstimatedKg || 0), 0)} <span className="text-xs text-gray-600">KG</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {isMr ? 'रेस्टॉरंट व केटरर्स आवश्यकता' : 'Across all food businesses'}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{isMr ? 'संभाव्य B2B उलाढाल' : 'Pipeline Quote Value'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-emerald-600 font-mono">
                ₹{wholesaleRequests.reduce((sum, r) => sum + (r.estimatedBudgetInr || 0), 0).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {isMr ? 'घाऊक सवलतीसह अंदाजे मूल्य' : 'Estimated commercial billing'}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{isMr ? 'नमुना / करार स्थिती' : 'Sample Dispatch'}</span>
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-black text-blue-600 font-mono">
                {wholesaleRequests.filter(r => r.status === 'tasting_samples_dispatched' || r.status === 'contract_approved').length}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {isMr ? 'चाचणी नमुने / करार मंजूर' : 'Tasting samples / Approved'}
              </div>
            </div>
          </div>

          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EFE4D8]">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', mr: 'सर्व मागण्या (All)', en: 'All Requests' },
                { id: 'new_request', mr: '🔴 नवीन (New)', en: '🔴 New' },
                { id: 'reviewing', mr: '🟡 तपासणी सुरू (Reviewing)', en: '🟡 Reviewing' },
                { id: 'quotation_sent', mr: '📋 कोटेशन दिले (Quoted)', en: '📋 Quoted' },
                { id: 'tasting_samples_dispatched', mr: '🧪 नमुने पाठवले (Samples Sent)', en: '🧪 Samples Sent' },
                { id: 'contract_approved', mr: '✅ करार मंजूर (Approved)', en: '✅ Approved' },
                { id: 'rejected', mr: '❌ बंद (Closed)', en: '❌ Closed' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedWholesaleFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedWholesaleFilter === tab.id
                      ? 'bg-[#C84B31] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isMr ? tab.mr : tab.en}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isMr ? 'Firestore रिअल-टाइम अपडेट' : 'Syncs Live via Firestore'}</span>
            </div>
          </div>

          {/* Wholesale Requests List */}
          {(() => {
            const filtered = wholesaleRequests.filter(r => {
              if (selectedWholesaleFilter === 'all') return true;
              return r.status === selectedWholesaleFilter;
            });

            if (filtered.length === 0) {
              return (
                <div className="bg-white p-12 rounded-3xl border border-[#EFE4D8] text-center space-y-3">
                  <Building2 className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="font-bold text-base text-[#2D2424] font-brand">
                    {isMr ? 'कोणतीही होलसेल मागणी आढळली नाही' : 'No Wholesale Requests Found in this Filter'}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    {isMr 
                      ? 'रेस्टॉरंट किंवा केटरर्सनी भरलेले बल्क फॉर्म्स येथे थेट रिअल-टाइममध्ये दिसतील.' 
                      : 'Submissions from restaurants and catering partners will populate here automatically.'}
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {filtered.map(req => {
                  const isNew = req.status === 'new_request';
                  const isEditingNotes = editingManagerNotesId === req.id;

                  return (
                    <div
                      key={req.id}
                      className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs space-y-5 ${
                        isNew ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-[#EFE4D8]'
                      }`}
                    >
                      {/* Request Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5EDE4] pb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-mono text-xs font-extrabold bg-stone-900 text-amber-300 px-2.5 py-0.5 rounded-md">
                              {req.id}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                              {req.establishmentType.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(req.createdAt).toLocaleString(isMr ? 'mr-IN' : 'en-IN')}</span>
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-extrabold text-[#2D2424] font-brand flex items-center gap-2">
                            <span>{req.businessName}</span>
                            {req.gstNumber && (
                              <span className="text-[10px] font-mono text-gray-400 font-normal">
                                (GSTIN: {req.gstNumber})
                              </span>
                            )}
                          </h3>
                        </div>

                        {/* Status Badge & Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateWholesaleStatus(req.id, e.target.value as WholesaleRequestStatus)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#C84B31] cursor-pointer"
                          >
                            <option value="new_request">🔴 नवीन मागणी (New Request)</option>
                            <option value="reviewing">🟡 तपासणी सुरू (Reviewing)</option>
                            <option value="quotation_sent">📋 कोटेशन पाठवले (Quoted)</option>
                            <option value="tasting_samples_dispatched">🧪 चाचणी नमुने रवाना (Samples Sent)</option>
                            <option value="contract_approved">✅ करार मंजूर (Approved)</option>
                            <option value="rejected">❌ बंद / रद्द (Closed)</option>
                          </select>

                          <button
                            onClick={() => generateWhatsAppWholesaleQuote(req)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            title="Send Quote via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{isMr ? 'व्हॉट्सॲप कोटेशन' : 'WhatsApp Quote'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Column 1: Contact & Location */}
                        <div className="bg-[#FAF6F2] p-3.5 rounded-2xl space-y-2 border border-[#EFE4D8]">
                          <div className="font-bold text-[#574B4B] flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-[#C84B31]" />
                            <span>{isMr ? 'संपर्क व्यक्ती & पत्ता' : 'Contact & Commercial Kitchen'}</span>
                          </div>
                          <div className="space-y-1 text-gray-700">
                            <div>
                              <strong>{req.contactPerson}</strong> ({req.designation || 'Proprietor'})
                            </div>
                            <div className="flex items-center gap-1.5 font-mono">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{req.phone}</span>
                            </div>
                            {req.email && (
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-3 h-3 text-blue-600" />
                                <span className="truncate">{req.email}</span>
                              </div>
                            )}
                            <div className="flex items-start gap-1.5 pt-1 text-[11px]">
                              <MapPin className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                              <span>{req.deliveryAddress}, {req.city} - {req.pincode}</span>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Logistics & Volume */}
                        <div className="bg-[#FAF6F2] p-3.5 rounded-2xl space-y-2 border border-[#EFE4D8]">
                          <div className="font-bold text-[#574B4B] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#C84B31]" />
                            <span>{isMr ? 'वितरण वारंवारता & प्रमाण' : 'Volume & Schedule'}</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">{isMr ? 'वारंवारता:' : 'Frequency:'}</span>
                              <span className="font-bold text-stone-800 uppercase text-[11px] bg-white px-2 py-0.5 rounded border border-stone-200">
                                {req.supplyFrequency.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">{isMr ? 'पहिला पुरवठा तारीख:' : 'Target Date:'}</span>
                              <span className="font-bold text-stone-800">{req.targetDeliveryDate}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-stone-200/60 pt-1">
                              <span className="text-gray-500">{isMr ? 'एकूण किलो मागणी:' : 'Total Volume:'}</span>
                              <span className="font-extrabold text-amber-600 font-mono text-sm">{req.totalEstimatedKg} KG</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">{isMr ? 'अंदाजे दरपत्रक:' : 'Estimated Rate:'}</span>
                              <span className="font-extrabold text-emerald-700 text-sm font-mono">
                                ₹{req.estimatedBudgetInr?.toLocaleString('en-IN')} (~₹{req.quotedPricePerKgAvg}/kg)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Column 3: Manager Notes & Instructions */}
                        <div className="bg-[#FAF6F2] p-3.5 rounded-2xl space-y-2 border border-[#EFE4D8] flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-[#574B4B] flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#C84B31]" />
                              <span>{isMr ? 'मॅनेजर शेफ टीप (Internal Notes)' : 'Manager Notes'}</span>
                            </div>
                            {isEditingNotes ? (
                              <div className="mt-2 space-y-2">
                                <textarea
                                  rows={2}
                                  value={managerNoteInput}
                                  onChange={(e) => setManagerNoteInput(e.target.value)}
                                  placeholder={isMr ? 'उदा. ५० किलो बॅचसाठी लासलगाव लसणाची चव जास्त ठेवावी...' : 'Add notes on formulation or dispatch schedule...'}
                                  className="w-full p-2 bg-white rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-[#C84B31]"
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingManagerNotesId(null)}
                                    className="px-2 py-1 text-[11px] text-gray-500 hover:text-gray-800"
                                  >
                                    {isMr ? 'रद्द' : 'Cancel'}
                                  </button>
                                  <button
                                    onClick={() => handleSaveWholesaleNotes(req.id)}
                                    className="px-3 py-1 bg-[#C84B31] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                                  >
                                    {isMr ? 'जतन करा' : 'Save'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] text-gray-600 mt-1 italic leading-relaxed">
                                {req.managerNotes || (isMr ? 'सध्या कोणतीही अंतर्गत टीप नाही.' : 'No manager notes recorded yet.')}
                              </p>
                            )}
                          </div>

                          {!isEditingNotes && (
                            <button
                              onClick={() => {
                                setEditingManagerNotesId(req.id);
                                setManagerNoteInput(req.managerNotes || '');
                              }}
                              className="text-[11px] font-bold text-[#C84B31] hover:underline self-start pt-1 cursor-pointer"
                            >
                              ✏️ {isMr ? 'टीप बदला / जोडा' : 'Edit / Add Notes'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Products Breakdown Table */}
                      <div className="border border-[#F5EDE4] rounded-2xl overflow-hidden text-xs">
                        <div className="bg-[#FAF6F2] px-4 py-2.5 font-bold text-[#2D2424] flex items-center justify-between">
                          <span>{isMr ? 'मागणी केलेले चटणी प्रकार & पॅकिंग तपशील' : 'Requested Chutney Varieties & Packaging Details'}</span>
                          <span className="text-[11px] text-gray-500 font-normal">{req.products.length} {isMr ? 'प्रकार' : 'Varieties'}</span>
                        </div>

                        <div className="divide-y divide-[#F5EDE4]">
                          {req.products.map((p, idx) => (
                            <div key={idx} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white">
                              <div className="flex-1">
                                <div className="font-extrabold text-[#2D2424]">
                                  {isMr ? p.productNameMr : p.productNameEn}
                                </div>
                                <div className="text-[11px] text-gray-500 flex items-center gap-2 flex-wrap mt-0.5">
                                  <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                                    {p.packagingPreference.replace(/_/g, ' ')}
                                  </span>
                                  <span>•</span>
                                  <span>चव: <strong>{p.spiceLevelPreference.replace(/_/g, ' ')}</strong></span>
                                  {p.customNotes && (
                                    <>
                                      <span>•</span>
                                      <span className="text-stone-600 italic font-medium">"{p.customNotes}"</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="font-mono font-black text-amber-700 text-sm shrink-0 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                                {p.quantityKg} KG
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Special Notes / Tasting Request */}
                      {req.specialRequirements && (
                        <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">{isMr ? 'ग्राहकाची विशेष आवश्यकता:' : 'Special Requirement from Chef/Caterer:'} </span>
                            <span>{req.specialRequirements}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

