import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Language, LiveDeliveryLocation } from '../types';
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Truck,
  Flame,
  BatteryCharging,
  Compass,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Props {
  order: Order;
  language: Language;
  onClose?: () => void;
}

export const LiveDeliveryTrackerModal: React.FC<Props> = ({ order, language, onClose }) => {
  const isMr = language === 'mr';

  // Live simulated coordinates starting near Pune/Kolhapur workshop to customer address
  const [progressPct, setProgressPct] = useState<number>(() => {
    if (order.orderStatus === 'delivered') return 100;
    if (order.orderStatus === 'out_for_delivery') return 65;
    if (order.orderStatus === 'packed_in_airtight_jar') return 40;
    if (order.orderStatus === 'blending_in_workshop') return 20;
    return 10;
  });

  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<LiveDeliveryLocation>({
    orderId: order.id,
    lat: 18.5204 + (Math.random() - 0.5) * 0.02,
    lng: 73.8567 + (Math.random() - 0.5) * 0.02,
    heading: 42,
    speedKmH: order.orderStatus === 'out_for_delivery' ? 34 : 0,
    currentStop: 'सह्याद्री वर्कशॉप हब (Sahyadri Workshop Hub)',
    nextStop: `${order.customer.addressLine1}, ${order.customer.talukaDistrict}`,
    batteryPct: 88,
    updatedAt: new Date().toLocaleTimeString()
  });

  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [aiTrafficAdvice, setAiTrafficAdvice] = useState<string>(
    isMr
      ? '🚀 AI रूट ऑप्टिमायझर: मुख्य हायवेवर कमी ट्रॅफिक असल्यामुळे ऑर्डर वेळेपूर्वी पोहोचेल. ताज्या खमंग चवीचा सुगंध सुरक्षित ठेवला आहे.'
      : '🚀 AI Route Engine: Optimum low-traffic corridor selected. Ceramic jar insulation maintaining 100% stone-ground freshness.'
  );

  // Live simulation tick
  useEffect(() => {
    if (order.orderStatus !== 'out_for_delivery') return;

    const interval = setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + 1.2;
        if (next >= 95) return 95;
        return next;
      });

      setDeliveryBoyLocation((prev) => ({
        ...prev,
        lat: prev.lat + 0.0002 * (Math.random() > 0.3 ? 1 : -0.5),
        lng: prev.lng + 0.0003 * (Math.random() > 0.3 ? 1 : -0.5),
        speedKmH: Math.floor(28 + Math.random() * 15),
        heading: Math.floor(35 + Math.random() * 20),
        batteryPct: Math.max(20, prev.batteryPct - 0.1),
        updatedAt: new Date().toLocaleTimeString()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [order.orderStatus]);

  const refreshAiRouteAnalysis = () => {
    setIsAiEstimating(true);
    setTimeout(() => {
      const tips = isMr
        ? [
            '🌿 AI रूट अपडेट: घाट रस्ता टाळून द्रुतगती मार्गाने डिलिव्हरी पार्टनर पोहोचत आहे. पार्सल तापमान सामान्य राखले आहे.',
            '⚡ AI स्मार्ट रूट: पुढील १० मिनिटांत सिग्नल क्लिअर आहे. डिलिव्हरी बॉय तुमच्या गल्लीत प्रवेश करत आहे.',
            '📍 AI अचूक अंदाज: अपेक्षित वेळ आता फक्त १२ ते १५ मिनिटे बाकी आहे.'
          ]
        : [
            '🌿 AI Dispatch Analysis: Scenic low-humidity express route active. Packaging vacuum seal intact.',
            '⚡ AI Smart Route: Clear corridor detected. Partner entering customer perimeter shortly.',
            '📍 AI Precision ETA: Estimated remaining transit window: 12 - 15 minutes.'
          ];
      setAiTrafficAdvice(tips[Math.floor(Math.random() * tips.length)]);
      setIsAiEstimating(false);
    }, 800);
  };

  const steps = [
    {
      id: 'order_placed',
      titleMr: 'ऑर्डर स्वीकारली',
      titleEn: 'Order Placed',
      descMr: 'ऑर्डर वर्कशॉपमध्ये नोंदवली गेली',
      descEn: 'Assigned to spice craftsman',
      completed: true,
      time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:30 AM'
    },
    {
      id: 'blending_in_workshop',
      titleMr: 'ताजी तयारी (Preparation)',
      titleEn: 'Fresh Preparation',
      descMr: 'पारंपरिक पद्धतीने ताजी तयारी',
      descEn: 'Handcrafted with authentic recipe',
      completed: ['blending_in_workshop', 'packed_in_airtight_jar', 'out_for_delivery', 'delivered'].includes(order.orderStatus),
      active: order.orderStatus === 'blending_in_workshop'
    },
    {
      id: 'packed_in_airtight_jar',
      titleMr: 'एअरटाइट जार सील',
      titleEn: 'Jar Sealed',
      descMr: 'काचेच्या बरणीत ताज्या सुगंधासह सील',
      descEn: 'Vacuum packed glass heritage jar',
      completed: ['packed_in_airtight_jar', 'out_for_delivery', 'delivered'].includes(order.orderStatus),
      active: order.orderStatus === 'packed_in_airtight_jar'
    },
    {
      id: 'out_for_delivery',
      titleMr: 'रवाना & लाइव्ह ट्रॅकिंग',
      titleEn: 'Out For Delivery',
      descMr: 'डिलिव्हरी पार्टनर रस्त्यावर आहे',
      descEn: 'Partner on transit route',
      completed: ['out_for_delivery', 'delivered'].includes(order.orderStatus),
      active: order.orderStatus === 'out_for_delivery'
    },
    {
      id: 'delivered',
      titleMr: 'घरी पोहोचली (Delivered)',
      titleEn: 'Safely Delivered',
      descMr: 'अस्सल गावरान मेजवानी!',
      descEn: 'Enjoy authentic Maharashtrian taste',
      completed: order.orderStatus === 'delivered',
      active: order.orderStatus === 'delivered'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#F0EAE1] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#2D2424] via-[#3C2A21] to-[#1E1717] p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C84B31] flex items-center justify-center shadow-lg text-white">
              <Truck className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {isMr ? 'लाइव्ह GPS ट्रॅकिंग' : 'Live GPS Fleet Sync'}
                </span>
                <span className="text-xs text-stone-300 font-mono">#{order.id}</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white tracking-tight mt-0.5">
                {isMr ? 'रिअल-टाइम डिलिव्हरी रूट & स्थिती' : 'Real-time Dispatch & Delivery Route'}
              </h2>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Modal Scroll Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Fleet Animated Real-Time Journey Progress Bar */}
          <div className="p-4 rounded-3xl bg-white border-2 border-[#EFE4D8] shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-[#C84B31] flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#241C1C] flex items-center gap-2">
                    <span>{isMr ? 'लाइव्ह प्रवास प्रगती ट्रॅक' : 'Real-time Courier Journey'}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      {isMr ? 'सक्रिय मार्ग' : 'Live In-Transit'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#7A6A60]">
                    {isMr
                      ? 'सह्याद्री कार्यशाळा ➔ तुमचा पत्ता'
                      : 'Sahyadri Workshop Hub ➔ Customer Address'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#7A6A60]">
                    {isMr ? 'अपेक्षित वेळ (ETA)' : 'Estimated ETA'}
                  </div>
                  <div className="text-sm font-black text-[#C84B31]">
                    ~{Math.max(3, Math.round((100 - progressPct) * 0.25))} {isMr ? 'मिनिटे' : 'mins'}
                  </div>
                </div>

                <div className="text-right pl-3 border-l border-stone-200">
                  <div className="text-[10px] uppercase font-bold text-[#7A6A60]">
                    {isMr ? 'उर्वरित अंतर' : 'Distance'}
                  </div>
                  <div className="text-sm font-black text-stone-900">
                    {Math.max(0.3, ((100 - progressPct) * 0.08)).toFixed(1)} km
                  </div>
                </div>
              </div>
            </div>

            {/* Smooth Animated Progress Track */}
            <div className="relative pt-3 pb-1">
              <div className="w-full h-3.5 bg-[#EAE3D9] rounded-full overflow-hidden relative shadow-inner">
                {/* Flowing animated gradient bar */}
                <motion.div
                  className="h-full bg-gradient-to-r from-[#E65100] via-[#C84B31] to-emerald-500 rounded-full relative"
                  style={{ width: `${Math.min(100, Math.max(8, progressPct))}%` }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  {/* Shimmer Light Pulse */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </motion.div>
              </div>

              {/* Courier Moving Pin on Progress Bar */}
              <div
                className="absolute top-0 -translate-y-1 transition-all duration-700 ease-out pointer-events-none"
                style={{ left: `calc(${Math.min(94, Math.max(6, progressPct))}% - 14px)` }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-[#C84B31] text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-[#C84B31]/30 animate-pulse text-xs">
                    🛵
                  </div>
                  <span className="text-[9px] font-black text-[#C84B31] bg-white px-1 rounded shadow-xs mt-0.5">
                    {progressPct.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Progress Stage Nodes */}
              <div className="flex justify-between text-[10px] font-bold text-[#7A6A60] mt-4 px-1">
                <span className={progressPct >= 10 ? 'text-[#C84B31]' : ''}>
                  {isMr ? '१. कार्यशाळा' : '1. Blended'}
                </span>
                <span className={progressPct >= 40 ? 'text-[#C84B31]' : ''}>
                  {isMr ? '२. जार सील' : '2. Sealed'}
                </span>
                <span className={progressPct >= 65 ? 'text-[#C84B31]' : ''}>
                  {isMr ? '३. रस्त्यावर' : '3. En Route'}
                </span>
                <span className={progressPct >= 95 ? 'text-emerald-600' : ''}>
                  {isMr ? '४. घरपोच' : '4. Delivered'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Simulated Map Viewport */}
          <div className="relative w-full h-64 sm:h-72 rounded-3xl bg-[#EBE4D8] border-2 border-[#DFD3C3] overflow-hidden shadow-inner flex flex-col justify-between p-4">
            {/* Background Map Grid & Roads SVG Simulation */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9B8A4" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Curved simulated road */}
                <path
                  d="M 50 200 C 180 230, 260 90, 480 140 S 680 110, 750 60"
                  fill="none"
                  stroke="#C84B31"
                  strokeWidth="8"
                  strokeDasharray="10, 8"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <path
                  d="M 50 200 C 180 230, 260 90, 480 140 S 680 110, 750 60"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Map Top Floating Overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-white/95 backdrop-blur-md border border-stone-200 shadow-lg px-3.5 py-2 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Compass className="w-4 h-4 animate-spin text-[#C84B31]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400">
                    {isMr ? 'चालू वेग & दिशा' : 'Speed & Bearing'}
                  </div>
                  <div className="text-xs font-bold text-stone-800">
                    {deliveryBoyLocation.speedKmH} km/h • {deliveryBoyLocation.heading}° North-East
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-md border border-stone-200 shadow-lg px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold text-stone-800">
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
                <span>{deliveryBoyLocation.batteryPct.toFixed(0)}% Fleet Battery</span>
              </div>
            </div>

            {/* Vehicle Moving Marker */}
            <div
              className="absolute z-10 transition-all duration-1000 ease-out"
              style={{
                left: `${Math.min(85, Math.max(15, progressPct))}%`,
                top: `${45 + Math.sin(progressPct / 10) * 20}%`
              }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                {/* Ripple */}
                <div className="absolute w-12 h-12 rounded-full bg-[#C84B31]/30 animate-ping" />
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#C84B31] to-[#E97777] text-white flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-[#C84B31]/20">
                  <Navigation className="w-5 h-5 -rotate-45" />
                </div>
                <div className="mt-1 bg-stone-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                  {order.assignedDeliveryPerson?.name?.split(' ')[0] || 'डिलिव्हरी रायडर'}
                </div>
              </div>
            </div>

            {/* Destination Target Marker */}
            <div className="absolute right-8 top-12 z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="mt-1 bg-emerald-950/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                {isMr ? 'तुमचा पत्ता (Home)' : 'Your Address'}
              </div>
            </div>

            {/* Map Bottom Status Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-stone-900/85 backdrop-blur-md text-white p-3 rounded-2xl text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-stone-200">
                  {isMr ? 'सध्याचे स्थान:' : 'Current Hub:'} <strong className="text-white">{deliveryBoyLocation.currentStop}</strong>
                </span>
              </div>
              <div className="text-amber-400 font-mono text-xs">
                {isMr ? 'अपडेट वेळ:' : 'Updated:'} {deliveryBoyLocation.updatedAt}
              </div>
            </div>
          </div>

          {/* AI Route & Traffic Engine Advice */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 border border-amber-300/40 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C84B31] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C84B31]">
                  {isMr ? '⚡ AI स्मार्ट मार्ग आणि ताजी गुणवत्ता हमी' : '⚡ AI Freshness & Smart Dispatch'}
                </span>
                <button
                  onClick={refreshAiRouteAnalysis}
                  disabled={isAiEstimating}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAiEstimating ? 'animate-spin' : ''}`} />
                  <span>{isMr ? 'पुन्हा तपासा' : 'Re-calculate'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-800 mt-1 font-medium leading-relaxed">
                {aiTrafficAdvice}
              </p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">
              {isMr ? 'ऑर्डर टप्पे & प्रगती' : 'Dispatch Milestones'}
            </h3>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    step.active
                      ? 'bg-amber-50/80 border-[#C84B31] shadow-md ring-1 ring-[#C84B31]/30'
                      : step.completed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-stone-50/50 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : step.active
                          ? 'bg-[#C84B31] text-white animate-pulse'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-stone-900">
                        {isMr ? step.titleMr : step.titleEn}
                      </div>
                      <div className="text-xs text-stone-500">
                        {isMr ? step.descMr : step.descEn}
                      </div>
                    </div>
                  </div>

                  {step.time && (
                    <span className="text-xs font-mono text-stone-500 bg-white px-2 py-1 rounded-lg border border-stone-200">
                      {step.time}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Partner Details & Security OTP Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Partner Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#F0EAE1] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl shrink-0">
                🛵
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500 font-medium">
                  {isMr ? 'डिलिव्हरी पार्टनर' : 'Assigned Courier'}
                </div>
                <div className="font-bold text-sm text-stone-900 truncate">
                  {order.assignedDeliveryPerson?.name || 'ज्ञानेश्वर सावंत'}
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  {order.assignedDeliveryPerson?.vehicleNumber || 'MH 12 BK 4091'}
                </div>
              </div>
              {order.assignedDeliveryPerson?.phone && (
                <a
                  href={`tel:${order.assignedDeliveryPerson.phone}`}
                  className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors shrink-0"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Delivery OTP Security Verification */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#C84B31]" />
                  <span>{isMr ? 'डिलिव्हरी सुरक्षा OTP' : 'Delivery Secret OTP'}</span>
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  {isMr ? 'डिलिव्हरी बॉयला हा कोड सांगा' : 'Share with driver upon handover'}
                </div>
              </div>
              <div className="bg-white px-3.5 py-1.5 rounded-xl border-2 border-[#C84B31] shadow text-lg font-mono font-black text-[#C84B31] tracking-widest">
                {order.deliveryOtp || '5192'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
