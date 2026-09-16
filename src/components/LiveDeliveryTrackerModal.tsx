import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Truck, 
  Navigation, 
  Clock, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Order, LiveDeliveryLocation } from '../types';
import { RealLeafletMap } from './RealLeafletMap';

interface Props {
  order: Order;
  language?: 'mr' | 'en';
  onClose?: () => void;
}

export const LiveDeliveryTrackerModal: React.FC<Props> = ({ order, onClose }) => {
  // Live simulated coordinates starting near workshop to customer address
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
    currentStop: 'MS Masale Central Hub',
    nextStop: `${order.customer.addressLine1}, ${order.customer.talukaDistrict}`,
    batteryPct: 88,
    updatedAt: new Date().toLocaleTimeString()
  });

  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [aiTrafficAdvice, setAiTrafficAdvice] = useState<string>(
    '🚀 Smart Route Engine: Optimum low-traffic corridor selected. Ceramic jar insulation maintaining 100% stone-ground freshness.'
  );

  // Live simulation tick
  useEffect(() => {
    if (order.orderStatus !== 'out_for_delivery') return;

    const interval = setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + 1.2;
        if (next >= 98) {
          return 98;
        }
        return next;
      });

      setDeliveryBoyLocation((prev) => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.48) * 0.0012,
        lng: prev.lng + (Math.random() - 0.48) * 0.0012,
        speedKmH: Math.floor(28 + Math.random() * 12),
        updatedAt: new Date().toLocaleTimeString()
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, [order.orderStatus]);

  const handleRefreshAiRoute = () => {
    setIsAiEstimating(true);
    setTimeout(() => {
      setIsAiEstimating(false);
      const advices = [
        '🌿 Route update: Delivery partner bypassing traffic via express ring road. Package temperature optimal.',
        '⚡ Smart Route: Clear signals for the next 2 km. Delivery rider arriving shortly in your neighborhood.',
        '📍 Accurate ETA: Expected arrival in 12 to 15 minutes.'
      ];
      setAiTrafficAdvice(advices[Math.floor(Math.random() * advices.length)]);
    }, 900);
  };

  const steps = [
    {
      key: 'pending',
      titleEn: 'Order Confirmed',
      descEn: 'Order received at workshop'
    },
    {
      key: 'blending_in_workshop',
      titleEn: 'Fresh Blending',
      descEn: 'Traditional stone mortar preparation'
    },
    {
      key: 'packed_in_airtight_jar',
      titleEn: 'Airtight Jar Sealed',
      descEn: 'Sealed in glass jar with aroma lock'
    },
    {
      key: 'out_for_delivery',
      titleEn: 'Out for Delivery',
      descEn: 'Delivery rider is on the way'
    },
    {
      key: 'delivered',
      titleEn: 'Delivered',
      descEn: 'Arrived at your doorstep'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 my-4 relative flex flex-col max-h-[92vh]"
        >
          {/* Top Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#B82A16] flex items-center justify-center text-white shadow-md">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full">
                    Live GPS Fleet Sync
                  </span>
                  <span className="text-xs font-mono text-stone-300">
                    #{order.id}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Real-time Dispatch & Delivery Route
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Live Status & ETA Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center justify-between text-xs text-amber-900 font-bold mb-1">
                  <span>Real-time Courier Journey</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div className="text-base font-extrabold text-stone-900">
                  Live In-Transit
                </div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">
                  MS Masale Hub ➔ Your Address
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-xs text-emerald-900 font-bold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Estimated ETA</span>
                </div>
                <div className="text-base font-extrabold text-emerald-800">
                  ~{Math.max(3, Math.round((100 - progressPct) * 0.25))} mins
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Speed: {deliveryBoyLocation.speedKmH} km/h
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200">
                <div className="text-xs text-stone-600 font-bold mb-1">
                  Distance
                </div>
                <div className="text-base font-extrabold text-stone-900">
                  {Math.max(0.4, ((100 - progressPct) * 0.08)).toFixed(1)} km left
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Destination: {order.customer.talukaDistrict}
                </div>
              </div>
            </div>

            {/* Simulated Live Interactive GPS Map */}
            <div className="space-y-2">
              <div className="rounded-2xl overflow-hidden border-2 border-stone-300 shadow-md h-[280px] sm:h-[340px] relative">
                <RealLeafletMap
                  currentLat={deliveryBoyLocation.lat}
                  currentLng={deliveryBoyLocation.lng}
                  speedKmH={deliveryBoyLocation.speedKmH}
                  riderName={order.assignedDeliveryPerson?.name || 'Vikram Mohite'}
                  destinationName={order.customer.fullName}
                  destinationAddress={`${order.customer.addressLine1}, ${order.customer.talukaDistrict}`}
                />
              </div>

              {/* AI Traffic & Route Engine Advisor */}
              <div className="p-3.5 rounded-2xl bg-stone-900 text-white flex items-start sm:items-center justify-between gap-3 text-xs shadow-md">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-stone-200 leading-snug">
                    {aiTrafficAdvice}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRefreshAiRoute}
                  disabled={isAiEstimating}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isAiEstimating ? 'animate-spin' : ''}`} />
                  <span>Re-calculate</span>
                </button>
              </div>
            </div>

            {/* Milestone Timeline */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
                Dispatch Milestones
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                {steps.map((st, i) => {
                  const isDone = (i / (steps.length - 1)) * 100 <= progressPct;
                  const isCurrent = Math.abs((i / (steps.length - 1)) * 100 - progressPct) < 20;

                  return (
                    <div 
                      key={st.key}
                      className={`p-3 rounded-xl border transition-all ${
                        isDone 
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                          : isCurrent 
                          ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs ring-1 ring-amber-400' 
                          : 'bg-white border-stone-200 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                        )}
                        <span className="font-bold text-xs">
                          {st.titleEn}
                        </span>
                      </div>
                      <p className="text-[10px] leading-tight opacity-80">
                        {st.descEn}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Rider Contact & Delivery OTP Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Assigned Courier
                    </span>
                    <div className="font-bold text-sm text-stone-900">
                      {order.assignedDeliveryPerson?.name || 'Dnyaneshwar Sawant'}
                    </div>
                    <div className="text-xs text-stone-500 font-mono">
                      📞 {order.assignedDeliveryPerson?.phone || '8591254237'}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${order.assignedDeliveryPerson?.phone || '8591254237'}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-[#B82A16]" />
                    <span>Delivery Secret OTP</span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Share with driver upon handover
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-white rounded-xl border border-amber-300 shadow-xs font-mono font-black text-base text-[#B82A16]">
                  {order.deliveryOtp || '4921'}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
