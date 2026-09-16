import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gift, Sparkles, ArrowRight, Tag, Clock, ShieldCheck, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BogoBannerProps {
  onClaimOffer?: () => void;
  onExploreAll?: () => void;
  language?: 'mr' | 'en';
}

export const BogoBanner: React.FC<BogoBannerProps> = ({ onClaimOffer, onExploreAll, language = 'en' }) => {
  const isMr = language === 'mr';
  const { showToast } = useApp();

  // Simulated live batch timer countdown for excitement
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText('BOGO-FREE');
      setHasCopied(true);
      showToast('🎁 Coupon BOGO-FREE copied! Apply in cart for free jar');
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      showToast('Coupon Code: BOGO-FREE');
    }
  };

  return (
    <div className="mx-3 sm:mx-6 lg:mx-8">
      <div 
        id="bogo-promotional-banner"
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white shadow-lg border-2 border-amber-300/40 p-4 sm:p-6 lg:p-7"
      >
        {/* Subtle Decorative Background Glow Elements */}
        <div className="absolute -top-12 -right-12 w-48 h-48 sm:w-64 sm:h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 sm:w-64 sm:h-64 bg-rose-900/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          
          {/* Left Content Area */}
          <div className="space-y-2.5 sm:space-y-3 text-center md:text-left max-w-2xl">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-amber-400 text-amber-950 shadow-xs uppercase tracking-wide">
                <Gift className="w-3.5 h-3.5 text-amber-950 animate-bounce" />
                <span>Special Festive Offer</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Single Product Special</span>
              </span>

              {/* Countdown badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-black/30 backdrop-blur-md text-amber-200 border border-amber-400/30">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>Ends in: {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span>
              </span>
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white drop-shadow-sm leading-tight">
                BUY 1 GET 1 FREE!
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-amber-100 font-medium leading-relaxed mt-1">
                Special Offer on <span className="font-black text-amber-300">Shengdana Peanut Chutney</span>: Buy 1 jar & get 1 jar <span className="font-black text-amber-300 underline underline-offset-2">100% FREE</span>!
              </p>
            </div>

            {/* Offer details & clickable coupon code */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-xs text-amber-100/90 pt-0.5">
              <button
                type="button"
                onClick={handleCopyCode}
                title="Click to copy coupon code"
                className="flex items-center gap-1.5 bg-black/35 hover:bg-black/50 px-3 py-1.5 rounded-xl border border-amber-300/40 hover:border-amber-300 transition-all cursor-pointer group shadow-xs active:scale-95"
              >
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-mono font-bold text-white tracking-wider">CODE: BOGO-FREE</span>
                {hasCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-amber-300/80 group-hover:text-amber-200 transition-colors" />
                )}
                <span className="text-[10px] text-amber-200 font-normal ml-0.5">
                  {hasCopied ? '(Copied!)' : '(Tap to copy)'}
                </span>
              </button>

              <span className="text-[11px] text-amber-200 font-medium">
                • Auto-applied in basket • Free Delivery above ₹499
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              id="btn-claim-bogo-offer"
              onClick={onClaimOffer}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 active:scale-[0.98] text-amber-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer group hover:shadow-2xl"
            >
              <span>Claim Offer & Shop Jars</span>
              <ArrowRight className="w-4 h-4 text-amber-900 group-hover:translate-x-1 transition-transform" />
            </button>

            {onExploreAll && (
              <button
                type="button"
                onClick={onExploreAll}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-black/25 hover:bg-black/40 text-amber-100 hover:text-white font-bold text-xs border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Browse All Masales & Pickles</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-amber-200/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>100% Pure Traditional Recipe</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
