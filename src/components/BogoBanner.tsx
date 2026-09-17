import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Gift, Sparkles, ArrowRight, Tag, Clock, ShieldCheck, Copy, Check, Camera, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { compressImage, uploadImageToServer, removeBackgroundClient } from '../utils/imageOptimizer';

interface BogoBannerProps {
  onClaimOffer?: () => void;
  onExploreAll?: () => void;
  language?: 'mr' | 'en';
  customImageUrl?: string;
}

const TRANSPARENT_DEFAULT = '/products/peanut-garlic-pouch-transparent.png';

export const BogoBanner: React.FC<BogoBannerProps> = ({ 
  onClaimOffer, 
  onExploreAll, 
  language = 'en',
  customImageUrl 
}) => {
  const isMr = language === 'mr';
  const { showToast, products, role, updateProduct, bogoConfig, updateBogoConfig } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Featured product (dynamically linked via bogoConfig, or fallback to Shengdana)
  const activeProduct = products.find(p => p.id === bogoConfig?.productId) || products.find(p => p.id === 'prod-shengdana-chutney');

  // Stored custom banner image (defaulting to authentic transparent 3D packaging)
  const [bannerImage, setBannerImage] = useState<string>(() => {
    if (customImageUrl) return customImageUrl;
    if (bogoConfig?.imageUrl) return bogoConfig.imageUrl;
    const stored = localStorage.getItem('ms_bogo_banner_img');
    if (stored && (stored.startsWith('data:image/png') || stored.includes('transparent') || (stored.startsWith('/uploads/') && stored.endsWith('.png')))) {
      return stored;
    }
    return TRANSPARENT_DEFAULT;
  });

  const [isUploading, setIsUploading] = useState(false);

  // Sync when bogoConfig changes
  useEffect(() => {
    if (bogoConfig?.imageUrl) {
      setBannerImage(bogoConfig.imageUrl);
    }
  }, [bogoConfig?.imageUrl]);

  // Handle direct image change on the banner
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      showToast('Optimizing, removing background & updating 3D banner image...');

      // Compress client side
      const compressed = await compressImage(file, 1000, 1000, 0.9);
      // Remove white background automatically
      const transparentDataUrl = await removeBackgroundClient(compressed.dataUrl);
      let finalUrl = transparentDataUrl;

      // Upload to server if available
      try {
        const uploadResult = await uploadImageToServer(transparentDataUrl, file.name.replace(/\.[^/.]+$/, "") + ".png");
        if (uploadResult.url) {
          finalUrl = uploadResult.url;
        }
      } catch (err) {
        console.warn('Server upload fallback to transparent data URL:', err);
      }

      setBannerImage(finalUrl);
      localStorage.setItem('ms_bogo_banner_img', finalUrl);

      // Save to BOGO config
      if (bogoConfig && updateBogoConfig) {
        await updateBogoConfig({
          ...bogoConfig,
          imageUrl: finalUrl
        });
      }

      // Optionally sync to active product in catalog too
      if (activeProduct) {
        try {
          await updateProduct({
            ...activeProduct,
            imageUrl: finalUrl
          });
        } catch (err) {
          console.warn('Could not sync to product document:', err);
        }
      }

      showToast('🎉 3D Transparent banner image updated successfully!');
    } catch (err) {
      console.error('Failed to change banner image:', err);
      showToast('❌ Failed to upload image. Please try another file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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

  if (bogoConfig && bogoConfig.isActive === false && role !== 'admin') {
    return null;
  }

  return (
    <div className="mx-3 sm:mx-6 lg:mx-8">
      {/* Hidden File Input for Direct Banner Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
        id="bogo-banner-file-input"
      />

      {bogoConfig && bogoConfig.isActive === false && role === 'admin' && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-between">
          <span>⚠️ BOGO Banner is currently paused (hidden from customers). Admin preview active.</span>
        </div>
      )}

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
                <span>{isMr ? (bogoConfig?.badgeMr || 'खास सणासुदीची ऑफर') : (bogoConfig?.badgeEn || 'Special Festive Offer')}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>
                  {isMr 
                    ? (bogoConfig?.tagMr || (activeProduct ? `${activeProduct.nameMr} स्पेशल` : 'शेंगदाणा आणि लसूण चटणी स्पेशल'))
                    : (bogoConfig?.tagEn || (activeProduct ? `${activeProduct.nameEn} Special` : 'Peanut & Garlic Chutney Special'))}
                </span>
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
                {isMr 
                  ? (bogoConfig?.titleMr || '१ वर १ मोफत ऑफर (BOGO)!') 
                  : (bogoConfig?.titleEn || 'BUY 1 GET 1 FREE (BOGO)!')}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-amber-100 font-medium leading-relaxed mt-1">
                {isMr 
                  ? (bogoConfig?.descriptionMr || 'खास ऑफर शेंगदाणा आणि लसूण चटणी वर: १ पॅक विकत घ्या आणि १ पॅक १००% मोफत मिळवा!')
                  : (bogoConfig?.descriptionEn || 'Special Offer on Peanut and Garlic Chutney: Buy 1 jar & get 1 jar 100% FREE!')}
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
                <span className="font-mono font-bold text-white tracking-wider">CODE: {bogoConfig?.couponCode || 'BOGO-FREE'}</span>
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

          {/* Right: Authentic Jar Packaging Image Showcase & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shrink-0 w-full md:w-auto">
            {/* Real 3D Transparent Product Packaging Showcase */}
            <div className="relative group/bogo-jar flex flex-col items-center justify-center [perspective:1000px] select-none">
              {/* Luminous Warm Background Glow for 3D depth */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-44 sm:h-44 bg-radial from-amber-300/40 via-orange-400/20 to-transparent rounded-full blur-xl pointer-events-none -z-10" />

              {/* 3D Floating Motion Wrapper */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  rotateY: [-10, -2, -10],
                  rotateX: [4, 8, 4],
                  rotateZ: [-1.5, 1.5, -1.5]
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                whileHover={{
                  scale: 1.12,
                  rotateY: 0,
                  rotateX: 0,
                  rotateZ: 0,
                  transition: { duration: 0.3 }
                }}
                className="relative flex items-center justify-center [transform-style:preserve-3d] cursor-pointer"
                title={role === 'admin' ? 'Click to change banner image' : 'Special BOGO Packaging'}
                onClick={() => {
                  if (role === 'admin' && fileInputRef.current) {
                    fileInputRef.current.click();
                  } else if (onClaimOffer) {
                    onClaimOffer();
                  }
                }}
              >
                {isUploading ? (
                  <div className="w-32 h-40 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-md rounded-2xl border border-amber-300/40 text-white">
                    <RefreshCw className="w-7 h-7 text-amber-400 animate-spin" />
                    <span className="text-[10px] text-amber-200 font-bold">Removing BG & Uploading...</span>
                  </div>
                ) : (
                  <img
                    src={bannerImage}
                    alt={isMr ? "एमएस मसाले शेंगदाणा आणि लसूण चटणी पॅकिंग" : "MS Masale Peanut and Garlic Chutney Packaging"}
                    className="h-36 sm:h-44 md:h-48 w-auto max-w-[135px] sm:max-w-[165px] object-contain transition-all duration-300"
                    style={{
                      filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.45)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 25px rgba(251, 191, 36, 0.35))'
                    }}
                    loading="eager"
                  />
                )}

                {/* Change Image Button for Admin */}
                {role === 'admin' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    title="Change packaging image"
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xl border-2 border-white/90 flex items-center justify-center cursor-pointer transition-transform hover:scale-115 active:scale-95 z-30"
                  >
                    <Camera className="w-4 h-4 text-stone-900" />
                  </button>
                )}
              </motion.div>

              {/* Dynamic 3D Ground Contact Shadow */}
              <motion.div
                animate={{
                  scale: [1, 0.78, 1],
                  opacity: [0.55, 0.28, 0.55]
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-24 sm:w-28 h-3 rounded-[100%] bg-black/45 blur-sm mx-auto mt-0.5 pointer-events-none"
              />

              {/* 3D Floating BOGO Tag */}
              <div className="mt-1.5 flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 uppercase tracking-wider shadow-lg border border-white/60 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-amber-950" />
                  <span>{isMr ? (bogoConfig?.tagMr || '१+१ मोफत (BOGO)') : (bogoConfig?.tagEn || 'Peanut & Garlic (BOGO)')}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                id="btn-claim-bogo-offer"
                onClick={onClaimOffer}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 active:scale-[0.98] text-amber-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer group hover:shadow-2xl"
              >
                <span>{isMr ? 'शेंगदाणा-लसूण चटणी BOGO घ्या' : 'Claim Peanut & Garlic Chutney (BOGO)'}</span>
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
    </div>
  );
};
