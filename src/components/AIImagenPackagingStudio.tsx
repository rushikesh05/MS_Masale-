import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wand2, 
  Package, 
  CheckCircle2, 
  Download, 
  Copy, 
  RefreshCw, 
  Layers, 
  Flame, 
  Sliders, 
  Eye, 
  Info, 
  Check, 
  AlertCircle,
  Tag,
  Palette,
  Ratio,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

interface GenerationRecord {
  id: string;
  imageUrl: string;
  productName: string;
  productNameEn?: string;
  engineUsed: string;
  promptUsed: string;
  packagingType: string;
  styleVariant: string;
  aspectRatio: string;
  createdAt: string;
}

interface Props {
  initialProductName?: string;
  initialProductId?: string;
  onApplyToProduct?: (imageUrl: string, productId?: string) => void;
  compact?: boolean;
}

export const AIImagenPackagingStudio: React.FC<Props> = ({
  initialProductName,
  initialProductId,
  onApplyToProduct,
  compact = false
}) => {
  const { products, updateProduct, showToast, language } = useApp();
  const isMr = language === 'mr';

  // Form states
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId || '');
  const [productName, setProductName] = useState<string>(
    initialProductName || 'रेश्माच्या हातची खास शेंगदाणा-लसूण चटणी'
  );
  const [productNameEn, setProductNameEn] = useState<string>('Reshma Special Roasted Peanut & Garlic Chutney');
  const [packagingType, setPackagingType] = useState<'glass_jar' | 'standup_pouch' | 'earthen_pot' | 'flat_label'>('glass_jar');
  const [styleVariant, setStyleVariant] = useState<'traditional_heritage' | 'royal_maratha_gold' | 'rustic_artisan_kraft' | 'modern_minimalist_spices'>('traditional_heritage');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '16:9'>('1:1');
  const [brandName, setBrandName] = useState<string>('MS Masale');
  const [netWeight, setNetWeight] = useState<string>('250g Glass Jar');
  const [spiceLevel, setSpiceLevel] = useState<number>(4);
  const [tagline, setTagline] = useState<string>('पारंपरिक खलबत्त्यात कुटलेली चव');
  const [ingredientsHighlight, setIngredientsHighlight] = useState<string>('Roasted Peanuts, Lasalgaon Garlic, Byadagi Chilli, Rock Salt');

  // Generation execution state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [activeResult, setActiveResult] = useState<GenerationRecord | null>(null);
  const [recentHistory, setRecentHistory] = useState<GenerationRecord[]>([]);
  const [showPromptInspector, setShowPromptInspector] = useState<boolean>(false);
  const [zoomPreview, setZoomPreview] = useState<boolean>(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  // When a catalog product is picked from dropdown, sync form
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) return;
    const found = products.find(p => p.id === prodId);
    if (found) {
      setProductName(found.nameMr);
      setProductNameEn(found.nameEn);
      setTagline(found.taglineMr || 'पारंपरिक खलबत्त्यात कुटलेली चव');
      setSpiceLevel(found.spiceLevel || 4);
      setNetWeight(found.sizes?.[1]?.size ? `${found.sizes[1].size} Pack` : '250g Glass Jar');
      if (found.ingredientsEn && found.ingredientsEn.length > 0) {
        setIngredientsHighlight(found.ingredientsEn.join(', '));
      }
    }
  };

  // Fetch initial history on mount
  useEffect(() => {
    fetch('/api/imagen/history')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setRecentHistory(data.data);
          if (!activeResult) {
            setActiveResult(data.data[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const triggerGeneration = async () => {
    if (!productName.trim()) {
      showToast(isMr ? 'कृपया उत्पादनाचे नाव टाका!' : 'Please enter a product name!', 'error');
      return;
    }

    setIsGenerating(true);
    setIsApplied(false);
    setCurrentStep(isMr ? '१. गुगल Imagen 3 (imagen-3.0-generate-002) मॉडेलशी संपर्क साधत आहे...' : '1. Initializing Google Imagen 3 API connection...');

    const stepTimer1 = setTimeout(() => {
      setCurrentStep(isMr ? '२. पॅकेजिंग लेबल डिझाइन व प्रकाश सावल्या (Studio Lighting) तयार करत आहे...' : '2. Synthesizing packaging reflections, glass jar geometry & lighting...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setCurrentStep(isMr ? `३. "${productName}" हे नाव अचूक आणि स्पष्ट अक्षरात एम्बॉस करत आहे...` : `3. Integrating product title "${productName}" with gold embossing...`);
    }, 2500);

    try {
      const response = await fetch('/api/imagen/generate-packaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName.trim(),
          productNameEn: productNameEn.trim(),
          packagingType,
          styleVariant,
          aspectRatio,
          brandName: brandName.trim(),
          netWeight: netWeight.trim(),
          spiceLevel,
          tagline: tagline.trim(),
          ingredientsHighlight: ingredientsHighlight.trim(),
          targetProductId: selectedProductId || undefined
        })
      });

      const resData = await response.json();
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (resData.success && resData.data) {
        setActiveResult(resData.data);
        setRecentHistory(prev => [resData.data, ...prev.filter(item => item.id !== resData.data.id)].slice(0, 15));

        const engineLabel = 
          resData.data.engineUsed === 'imagen-3.0-generate-002' ? 'Google Imagen 3' :
          resData.data.engineUsed === 'gemini-3.1-flash-image' ? 'Gemini Flash Image' : 'AI Studio Packaging Engine';

        showToast(
          isMr 
            ? `✨ ${productName} साठी ब्रँडेड पॅकेजिंग यशस्वीरित्या तयार झाले! (${engineLabel})` 
            : `✨ Branded label packaging generated for ${productName}! (${engineLabel})`
        );
      } else {
        throw new Error(resData.error || 'Generation failed');
      }
    } catch (err: any) {
      console.error('Imagen generation error:', err);
      showToast(isMr ? 'पॅकेजिंग जनरेशन त्रुटी आली.' : 'Failed to generate packaging image.', 'error');
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  const handleApplyToCatalog = () => {
    if (!activeResult) return;
    
    // If a product is selected in dropdown, update it
    if (selectedProductId) {
      updateProduct(selectedProductId, { imageUrl: activeResult.imageUrl });
      const matched = products.find(p => p.id === selectedProductId);
      showToast(
        isMr 
          ? `✅ "${matched?.nameMr || productName}" चे इमेज अपडेट झाले!` 
          : `✅ Updated product image for "${matched?.nameEn || productName}"!`
      );
      setIsApplied(true);
    } else {
      // Find matching product by name
      const matched = products.find(p => 
        p.nameMr.toLowerCase().includes(productName.toLowerCase()) || 
        productName.toLowerCase().includes(p.nameMr.toLowerCase()) ||
        (productNameEn && p.nameEn.toLowerCase().includes(productNameEn.toLowerCase()))
      );

      if (matched) {
        updateProduct(matched.id, { imageUrl: activeResult.imageUrl });
        showToast(
          isMr 
            ? `✅ "${matched.nameMr}" चे इमेज यशस्वीरित्या अपडेट झाले!` 
            : `✅ Updated catalog image for "${matched.nameEn}"!`
        );
        setIsApplied(true);
      } else if (onApplyToProduct) {
        onApplyToProduct(activeResult.imageUrl);
        setIsApplied(true);
      } else {
        showToast(
          isMr 
            ? 'कृपया खालील उत्पादनांची यादी निवडून "कॅटलॉगमध्ये लागू करा" वर क्लिक करा.' 
            : 'Select a product from the dropdown to assign this image.'
        );
      }
    }
  };

  const handleDownload = () => {
    if (!activeResult) return;
    const link = document.createElement('a');
    link.href = activeResult.imageUrl;
    const safeName = (activeResult.productName || 'product-packaging').replace(/\s+/g, '-').toLowerCase();
    link.download = `ms-masale-packaging-${safeName}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isMr ? 'डाउनलोड सुरू झाले!' : 'High-resolution packaging downloaded!');
  };

  const handleCopyUrl = () => {
    if (!activeResult) return;
    navigator.clipboard.writeText(activeResult.imageUrl);
    showToast(isMr ? 'इमेज डेटा / URL कॉपी झाले!' : 'Image data / URL copied to clipboard!');
  };

  return (
    <div className={`space-y-6 ${compact ? '' : 'p-4 sm:p-6 bg-stone-50/70 rounded-3xl border border-[#EFE4D8]'}`}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#2D2424] via-[#3E1B1B] to-[#C84B31] text-white p-5 rounded-2xl shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Imagen 3 Workflow
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-amber-200 border border-white/10">
              Label-Ready Packaging Design
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight font-serif flex items-center gap-2">
            <span>{isMr ? '🎨 AI इमेज-एन पॅकेजिंग & लेबल स्टुडिओ' : '🎨 AI Imagen Packaging & Label Studio'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 max-w-2xl">
            {isMr 
              ? 'कोणत्याही उत्पादनाचे नाव टाका आणि थेट लेबलवर छापलेले काचेची बरणी, पाऊच व ब्रँडेड पॅकेजिंग डिझाइन आपोआप तयार करा.'
              : 'Provide any product name to automatically generate commercial, label-ready packaging with your exact brand and product title integrated into the packaging.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="text-right text-xs hidden sm:block">
            <div className="text-amber-300 font-bold">Active Engine</div>
            <div className="text-stone-300 text-[11px]">imagen-3.0-generate-002</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Configuration Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-2xl border border-[#EFE4D8] shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C84B31]" />
              <h3 className="font-bold text-sm text-[#2D2424]">
                {isMr ? '१. उत्पादन व लेबल माहिती' : '1. Product & Label Configuration'}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-stone-500">
              Step 1 of 2
            </span>
          </div>

          {/* Quick Select from Existing Catalog */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex justify-between">
              <span>{isMr ? 'कॅटलॉगमधील उत्पादन निवडा (पर्यायी)' : 'Select from Existing Catalog (Optional)'}</span>
              <span className="text-[10px] text-amber-700 font-normal">Auto-fills fields</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full text-xs font-medium p-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C84B31]/30 transition"
            >
              <option value="">-- {isMr ? 'कस्टम नाव वापरा किंवा प्रॉडक्ट निवडा' : 'Use Custom Name or Choose Product'} --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nameMr} ({p.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Primary Product Name Input (CRITICAL REQUIREMENT) */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-[#2D2424] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C84B31]" />
                <span>{isMr ? 'उत्पादनाचे मुख्य नाव (लेबलवर छापले जाईल) *' : 'Exact Product Name (Printed on Label) *'}</span>
              </span>
              <span className="text-[10px] text-[#C84B31] font-black uppercase">Required</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="उदा. रेश्माच्या हातची खास शेंगदाणा-लसूण चटणी"
              className="w-full text-sm font-bold p-3 rounded-xl border-2 border-amber-500/40 bg-amber-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C84B31] transition text-[#2D2424]"
            />
            <p className="text-[11px] text-stone-500">
              {isMr 
                ? 'हे नाव AI द्वारे थेट पॅकेजिंगवरील मुख्य लेबलवर ठळक व सोन्याच्या बॉर्डरमध्ये छापले जाईल.'
                : 'This specific product title will be prominently engraved & printed onto the front label.'}
            </p>
          </div>

          {/* English Subtitle / Secondary Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              {isMr ? 'इंग्रजी उपनाव (पर्यायी)' : 'English Sub-Title / Export Name'}
            </label>
            <input
              type="text"
              value={productNameEn}
              onChange={(e) => setProductNameEn(e.target.value)}
              placeholder="e.g. Reshma Special Roasted Peanut & Garlic Chutney"
              className="w-full text-xs font-medium p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C84B31]/30 transition"
            />
          </div>

          {/* Packaging Container Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#C84B31]" />
              <span>{isMr ? 'पॅकेजिंग प्रकार (Container Format)' : 'Packaging Container Format'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPackagingType('glass_jar')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  packagingType === 'glass_jar'
                    ? 'border-[#C84B31] bg-[#C84B31]/5 font-bold text-[#C84B31] shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-base">🫙</span>
                <span>{isMr ? 'काचेची बरणी (Glass Jar)' : 'Glass Hex Jar'}</span>
                <span className="text-[10px] text-stone-500 font-normal">Brushed copper metal lid</span>
              </button>

              <button
                type="button"
                onClick={() => setPackagingType('standup_pouch')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  packagingType === 'standup_pouch'
                    ? 'border-[#C84B31] bg-[#C84B31]/5 font-bold text-[#C84B31] shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-base">📦</span>
                <span>{isMr ? 'क्राफ्ट पाऊच (Kraft Pouch)' : 'Stand-up Pouch'}</span>
                <span className="text-[10px] text-stone-500 font-normal">Resealable matte zip-lock</span>
              </button>

              <button
                type="button"
                onClick={() => setPackagingType('earthen_pot')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  packagingType === 'earthen_pot'
                    ? 'border-[#C84B31] bg-[#C84B31]/5 font-bold text-[#C84B31] shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-base">🏺</span>
                <span>{isMr ? 'मातीची मटकी (Earthen Pot)' : 'Terracotta Pot'}</span>
                <span className="text-[10px] text-stone-500 font-normal">Handmade rustic matki</span>
              </button>

              <button
                type="button"
                onClick={() => setPackagingType('flat_label')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  packagingType === 'flat_label'
                    ? 'border-[#C84B31] bg-[#C84B31]/5 font-bold text-[#C84B31] shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-base">🏷️</span>
                <span>{isMr ? 'प्रिंट लेबल (Print Wrap)' : '2D Print Label'}</span>
                <span className="text-[10px] text-stone-500 font-normal">Commercial print sheet</span>
              </button>
            </div>
          </div>

          {/* Aesthetic Style Variant */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#C84B31]" />
              <span>{isMr ? 'डिझाइन शैली (Aesthetic Theme)' : 'Design Theme & Palette'}</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStyleVariant('traditional_heritage')}
                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                  styleVariant === 'traditional_heritage'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="font-semibold text-xs">{isMr ? 'पारंपरिक हेरिटेज' : 'Traditional Heritage'}</div>
                <div className="text-[10px] text-stone-500">{isMr ? 'खलबत्ता & गडद लाल' : 'Deep Crimson & Gold'}</div>
              </button>

              <button
                type="button"
                onClick={() => setStyleVariant('royal_maratha_gold')}
                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                  styleVariant === 'royal_maratha_gold'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="font-semibold text-xs">{isMr ? 'शाही मराठा गोल्ड' : 'Royal Maratha Gold'}</div>
                <div className="text-[10px] text-stone-500">{isMr ? 'पैठणी नक्षीकाम' : 'Gilded Filigree & Crests'}</div>
              </button>

              <button
                type="button"
                onClick={() => setStyleVariant('rustic_artisan_kraft')}
                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                  styleVariant === 'rustic_artisan_kraft'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="font-semibold text-xs">{isMr ? 'हस्तनिर्मित क्राफ्ट' : 'Rustic Artisan'}</div>
                <div className="text-[10px] text-stone-500">{isMr ? 'नैसर्गिक लाकडी फील' : 'Warm Kraft & Vintage'}</div>
              </button>

              <button
                type="button"
                onClick={() => setStyleVariant('modern_minimalist_spices')}
                className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                  styleVariant === 'modern_minimalist_spices'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="font-semibold text-xs">{isMr ? 'आधुनिक ऑरगॅनिक' : 'Gourmet Minimal'}</div>
                <div className="text-[10px] text-stone-500">{isMr ? 'एक्सपोर्ट ग्रेड' : 'Export Grade Luxury'}</div>
              </button>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Ratio className="w-3.5 h-3.5 text-stone-500" />
              <span>{isMr ? 'आकार प्रमाण (Aspect Ratio)' : 'Output Aspect Ratio'}</span>
            </label>
            <div className="flex gap-2">
              {(['1:1', '3:4', '4:3', '16:9'] as const).map(ratio => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-[#2D2424] text-amber-400 border-[#2D2424]'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Branding Drawer */}
          <div className="pt-2 border-t border-stone-100 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600">{isMr ? 'निव्वळ वजन' : 'Net Weight'}</label>
                <input
                  type="text"
                  value={netWeight}
                  onChange={(e) => setNetWeight(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-stone-50/50"
                  placeholder="250g Glass Jar"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 flex justify-between">
                  <span>{isMr ? 'मसाला चव' : 'Spice Meter'}</span>
                  <span>{'🌶️'.repeat(spiceLevel)}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(Number(e.target.value))}
                  className="w-full accent-[#C84B31] cursor-pointer mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-600">{isMr ? 'ब्रँड घोषवाक्य' : 'Brand Tagline'}</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-stone-200 bg-stone-50/50"
                placeholder="पारंपरिक खलबत्त्यात कुटलेली चव"
              />
            </div>
          </div>

          {/* Prompt Inspector Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowPromptInspector(!showPromptInspector)}
              className="w-full py-2 px-3 rounded-xl bg-stone-100/70 hover:bg-stone-100 text-stone-600 text-[11px] font-semibold flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>{isMr ? '🔍 AI प्रॉम्टचे थेट पूर्वावलोकन (Prompt Preview)' : '🔍 Inspect Real Imagen 3 AI Prompt'}</span>
              </span>
              {showPromptInspector ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showPromptInspector && (
              <div className="mt-2 p-3 rounded-xl bg-[#1E1414] text-amber-200/90 text-[11px] font-mono leading-relaxed max-h-36 overflow-y-auto border border-[#443838]">
                <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">Generated Imagen Prompt:</div>
                Commercial product photograph of a {packagingType === 'standup_pouch' ? 'standup kraft pouch' : 'hexagonal glass jar with brushed copper lid'}. 
                The front label prominently displays the exact product title: "{productName}" in bold gold-embossed typography. 
                Brand header: "{brandName}". Net Wt: "{netWeight}". Level {spiceLevel}/5 spice rating. Traditional gold border motifs, 
                pure veg dot, stone-ground seal. Set on rustic teak-wood table with red Byadagi chillies and garlic cloves. 8K commercial lighting.
              </div>
            )}
          </div>

          {/* GENERATION ACTION BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={triggerGeneration}
              disabled={isGenerating || !productName.trim()}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#C84B31] via-[#E8590C] to-[#C84B31] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{isMr ? 'ब्रँडेड पॅकेजिंग तयार करत आहे...' : 'Synthesizing Branded Packaging...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-amber-300" />
                  <span>{isMr ? '✨ Imagen द्वारे ब्रँडेड पॅकेजिंग तयार करा' : '✨ Generate Branded Packaging (Imagen)'}</span>
                </>
              )}
            </button>

            {isGenerating && currentStep && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">{currentStep}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output Showcase & Direct Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#C84B31]" />
                <h3 className="font-bold text-sm text-[#2D2424]">
                  {isMr ? '२. ब्रँडेड पॅकेजिंग व लेबल प्रीव्ह्यू' : '2. Branded Packaging & Label Output'}
                </h3>
              </div>

              {activeResult && (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {activeResult.engineUsed === 'imagen-3.0-generate-002' ? 'Google Imagen 3' : 
                     activeResult.engineUsed === 'gemini-3.1-flash-image' ? 'Gemini Flash Image' : 'Packaging Studio'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomPreview(!zoomPreview)}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer"
                    title="Toggle Full View"
                  >
                    {zoomPreview ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Packaging Display Canvas */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 flex items-center justify-center border border-stone-200 min-h-[380px] shadow-inner">
              {activeResult ? (
                <div className={`w-full flex items-center justify-center p-2 ${zoomPreview ? 'max-h-[600px]' : 'max-h-[440px]'}`}>
                  <img
                    src={activeResult.imageUrl}
                    alt={activeResult.productName}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-all"
                  />
                  
                  {/* Floating Product Name Overlay Tag */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="font-extrabold text-sm text-amber-300">{activeResult.productName}</div>
                      <div className="text-[11px] text-stone-300">
                        {activeResult.packagingType.replace('_', ' ').toUpperCase()} • {activeResult.styleVariant.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {new Date(activeResult.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-stone-400 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-stone-800/80 border border-stone-700 flex items-center justify-center text-amber-400 text-2xl">
                    🫙
                  </div>
                  <div className="text-sm font-semibold text-stone-300">
                    {isMr ? 'कोणतेही पॅकेजिंग तयार केलेले नाही' : 'No Packaging Generated Yet'}
                  </div>
                  <p className="text-xs max-w-sm text-stone-400">
                    {isMr 
                      ? 'डाव्या बाजूला उत्पादनाचे नाव टाका आणि "Imagen द्वारे ब्रँडेड पॅकेजिंग तयार करा" बटनावर क्लिक करा.'
                      : 'Enter a product title on the left and click "Generate Branded Packaging (Imagen)" to create your first design.'}
                  </p>
                </div>
              )}
            </div>

            {/* Direct Workflow Actions Toolbar */}
            {activeResult && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleApplyToCatalog}
                    className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#C84B31] hover:bg-[#B03E26] text-white shadow-xs'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{isMr ? 'कॅटलॉगमध्ये सेव्ह झाले!' : 'Saved to Store Catalog!'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        <span>{isMr ? 'कॅटलॉगमध्ये लागू करा' : 'Apply to Store Catalog'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 font-bold text-xs text-stone-700 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#C84B31]" />
                    <span>{isMr ? 'इमेज डाउनलोड (High-Res)' : 'Download High-Res PNG'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 font-bold text-xs text-stone-700 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span>{isMr ? 'इमेज URL कॉपी करा' : 'Copy Image Base64/URL'}</span>
                  </button>
                </div>

                {/* Packaging Label Specs Card */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800">Print Specifications:</span>
                    <span>Front Wrap 85×55mm</span>
                    <span>• 300 DPI Ready</span>
                    <span>• Food-Grade Tamper Seal</span>
                  </div>
                  <div className="text-amber-800 font-semibold flex items-center gap-1">
                    <span>FSSAI License Ready</span>
                    <span>• Pure Veg Stamp</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Past Generations Gallery (Quick Switcher) */}
          {recentHistory.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-[#EFE4D8] shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C84B31]" />
                  <span>{isMr ? 'अलीकडील जनरेशन गॅलरी (Recent Generations)' : 'Recent Packaging Generations'}</span>
                </h4>
                <span className="text-[11px] text-stone-500">{recentHistory.length} designs</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {recentHistory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveResult(item);
                      setIsApplied(false);
                    }}
                    className={`group relative rounded-xl overflow-hidden border transition-all text-left cursor-pointer aspect-square ${
                      activeResult?.id === item.id 
                        ? 'border-[#C84B31] ring-2 ring-[#C84B31]/30 shadow-md' 
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-1.5 flex flex-col justify-end">
                      <div className="text-[10px] font-bold text-white truncate">{item.productName}</div>
                      <div className="text-[8px] text-amber-300 uppercase">{item.packagingType.replace('_', ' ')}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
