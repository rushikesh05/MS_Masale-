import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Layers, 
  Tag, 
  ShoppingCart, 
  RefreshCw, 
  Info, 
  Check, 
  Sliders, 
  ChevronRight, 
  ChevronLeft,
  Heart,
  Award,
  ShieldCheck,
  Zap,
  Leaf
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BASE_INGREDIENTS, SPICE_LEVELS, GARLIC_OPTIONS, SALT_OPTIONS, OIL_OPTIONS } from '../data/initialData';
import { CustomChutneyConfig } from '../types';
import { saveCustomRecipeToFirestore } from '../lib/firestoreSync';

export const CustomChutneyBuilder: React.FC = () => {
  const { language, addToCart, showToast } = useApp();
  const { currentUser } = useAuth();
  const isMr = language === 'mr';
  const customLabelInputId = useId();
  const customTaglineInputId = useId();

  // Wizard Step: 1 = Base Ingredients, 2 = Spice Level, 3 = Garlic, Salt & Oil, 4 = Size & Custom Jar Label
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Configuration State
  const [customName, setCustomName] = useState<string>('माझ्या हातची स्पेशल चटणी');
  const [tagline, setTagline] = useState<string>('पारंपरिक गावरान चव');
  
  // Base Ingredients Percentages (must sum up to 100)
  const [percentages, setPercentages] = useState<Record<string, number>>({
    peanuts: 50,
    dryCoconut: 25,
    sesameSeeds: 15,
    flaxseed: 0,
    redChilliBase: 10
  });

  const [spiceLevel, setSpiceLevel] = useState<number>(3);
  const [chilliVariety, setChilliVariety] = useState<'bedgi' | 'lavangi' | 'sankeshwari'>('bedgi');
  const [garlicLevel, setGarlicLevel] = useState<'none' | 'low' | 'medium' | 'extra'>('medium');
  const [saltType, setSaltType] = useState<'regular' | 'sendhav' | 'low_salt'>('sendhav');
  const [oilType, setOilType] = useState<'none' | 'groundnut_cold_pressed' | 'extra_drizzle'>('groundnut_cold_pressed');
  const [texture, setTexture] = useState<'coarse_stone_pounded' | 'medium_granular' | 'fine_powder'>('coarse_stone_pounded');
  const [packSizeGrams, setPackSizeGrams] = useState<250 | 500 | 1000>(500);
  const [packagingType, setPackagingType] = useState<'glass_heritage_jar' | 'airtight_kraft_pouch'>('glass_heritage_jar');

  // Dynamic Calculated Price & Nutrition
  const [calculatedPrice, setCalculatedPrice] = useState<number>(365);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Auto-balance percentages when an ingredient slider changes
  const handleSliderChange = (ingredientId: string, newValue: number) => {
    setPercentages(prev => {
      const otherKeys = Object.keys(prev).filter(k => k !== ingredientId);
      const otherTotal = otherKeys.reduce((sum: number, k: string) => sum + (Number(prev[k]) || 0), 0);
      const diff = 100 - newValue;
      
      const newValues: Record<string, number> = { ...prev, [ingredientId]: newValue };
      
      if (otherTotal > 0) {
        otherKeys.forEach(k => {
          const proportion = (Number(prev[k]) || 0) / otherTotal;
          newValues[k] = Math.max(0, Math.round(proportion * diff));
        });
      } else {
        const share = Math.floor(diff / otherKeys.length);
        otherKeys.forEach(k => {
          newValues[k] = share;
        });
      }

      // Check sum to make exact 100
      const currentSum = Object.values(newValues).reduce((a: number, b: number) => a + Number(b), 0);
      if (currentSum !== 100 && otherKeys.length > 0) {
        const adjKey = otherKeys[0];
        newValues[adjKey] = Math.max(0, (Number(newValues[adjKey]) || 0) + (100 - Number(currentSum)));
      }

      return newValues;
    });
  };

  // Recipe Presets for quick start
  const applyPreset = (presetType: 'shengdana' | 'vada_pav' | 'omega_fit' | 'satvik') => {
    if (presetType === 'shengdana') {
      setPercentages({ peanuts: 70, dryCoconut: 10, sesameSeeds: 10, flaxseed: 0, redChilliBase: 10 });
      setSpiceLevel(4);
      setGarlicLevel('extra');
      setSaltType('sendhav');
      setOilType('groundnut_cold_pressed');
      setCustomName('खमंग शेंगदाणा चटणी');
      setTagline('जाडसर कुटलेली व गरमागरम भाकरी स्पेशल');
    } else if (presetType === 'vada_pav') {
      setPercentages({ peanuts: 10, dryCoconut: 60, sesameSeeds: 10, flaxseed: 0, redChilliBase: 20 });
      setSpiceLevel(3);
      setGarlicLevel('extra');
      setSaltType('regular');
      setOilType('none');
      setCustomName('वडापाव स्पेशल कुरकुरीत लाल चटणी');
      setTagline('मुंबई-पुणे स्ट्रीट स्टाईल');
    } else if (presetType === 'omega_fit') {
      setPercentages({ peanuts: 20, dryCoconut: 10, sesameSeeds: 30, flaxseed: 35, redChilliBase: 5 });
      setSpiceLevel(2);
      setGarlicLevel('low');
      setSaltType('sendhav');
      setOilType('none');
      setCustomName('ओमेगा-३ & कॅल्शियम सुपरफूड चटणी');
      setTagline('आरोग्यदायी व पौष्टिक गावठी मेजवानी');
    } else if (presetType === 'satvik') {
      setPercentages({ peanuts: 40, dryCoconut: 30, sesameSeeds: 25, flaxseed: 0, redChilliBase: 5 });
      setSpiceLevel(1);
      setGarlicLevel('none');
      setSaltType('sendhav');
      setOilType('groundnut_cold_pressed');
      setCustomName('शुद्ध सात्विक उपवास स्पेशल चटणी');
      setTagline('लसूण विरहित व शुद्ध सेंधव मीठ');
    }
    showToast(isMr ? 'रेसिपी प्रीसेट लागू केले!' : 'Recipe preset applied!');
  };

  // Recalculate price whenever attributes change
  useEffect(() => {
    const calculateLivePrice = async () => {
      setIsCalculating(true);
      try {
        const response = await fetch('/api/custom-builder/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseIngredients: percentages,
            garlicLevel,
            saltType,
            oilType,
            packSizeGrams,
            packagingType
          })
        });
        const data = await response.json();
        if (data.success) {
          setCalculatedPrice(data.data.calculatedPrice);
        }
      } catch (err) {
        console.error('Pricing calculation error:', err);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateLivePrice();
  }, [percentages, garlicLevel, saltType, oilType, packSizeGrams, packagingType]);

  const handleAddToCart = () => {
    const recipeConfig: CustomChutneyConfig = {
      customName: customName || (isMr ? 'माझ्या हातची स्पेशल चटणी' : 'My Custom Chutney Jar'),
      tagline: tagline || (isMr ? 'पारंपरिक गावरान चव' : 'Traditional Recipe Taste'),
      baseIngredients: {
        peanuts: percentages.peanuts || 0,
        dryCoconut: percentages.dryCoconut || 0,
        sesameSeeds: percentages.sesameSeeds || 0,
        flaxseed: percentages.flaxseed || 0,
        redChilliBase: percentages.redChilliBase || 0
      },
      spiceLevel,
      chilliVariety,
      garlicLevel,
      saltType,
      oilType,
      texture,
      packSizeGrams,
      packagingType,
      calculatedPrice
    };

    addToCart({
      isCustomRecipe: true,
      customRecipe: recipeConfig,
      quantity: 1,
      unitPrice: calculatedPrice
    });

    // Cloud Firestore Sync for custom recipe
    const customRecipeId = `recipe-${Date.now()}`;
    saveCustomRecipeToFirestore(
      customRecipeId,
      currentUser?.uid || 'guest-artisan',
      recipeConfig.customName,
      recipeConfig
    );
  };

  return (
    <section id="custom-builder-studio" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAE5] text-[#C84B31] text-xs sm:text-sm font-semibold mb-3 border border-[#F5C2B8]">
          <Sparkles className="w-4 h-4" />
          <span>{isMr ? 'स्वतःची कस्टमाईज्ड चटणी बनवा' : 'Custom Chutney Builder Studio'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2D2424] font-brand tracking-tight">
          {isMr ? 'तुमची आवडती चव, तुमच्याच नावाने छापलेली!' : 'Blend Your Own Chutney with Custom Jar Label'}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#6B5E5E] max-w-2xl mx-auto">
          {isMr 
            ? 'शेंगदाणे, खोबरे, तीळ आणि जवसाचे प्रमाण स्वतः ठरवा. आम्ही खास तुमच्यासाठी पारंपरिक खलबत्त्यात ताजी कुटून जारवर तुमचे नाव छापून पाठवू.'
            : 'Select ingredient ratios, spice intensity, desi garlic, and your personalized name on the jar.'}
        </p>
      </div>

      {/* Quick Presets Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="text-xs font-semibold text-[#8C7A7A] mr-1">
          {isMr ? 'लोकप्रिय रेसिपी निवडा:' : 'Quick Presets:'}
        </span>
        <button
          onClick={() => applyPreset('shengdana')}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FFF2ED] hover:bg-[#FDE4DB] text-[#C84B31] border border-[#F3C9BF] transition-all flex items-center gap-1 cursor-pointer"
        >
          🥜 {isMr ? 'खमंग शेंगदाणा' : 'Crunchy Peanut'}
        </button>
        <button
          onClick={() => applyPreset('vada_pav')}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FFF2ED] hover:bg-[#FDE4DB] text-[#C84B31] border border-[#F3C9BF] transition-all flex items-center gap-1 cursor-pointer"
        >
          🥥 {isMr ? 'वडापाव खोबरे-लसूण' : 'Vada Pav Red Chutney'}
        </button>
        <button
          onClick={() => applyPreset('omega_fit')}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#EBF7EE] hover:bg-[#DCF2DF] text-[#1E7E34] border border-[#BDE5C4] transition-all flex items-center gap-1 cursor-pointer"
        >
          💪 {isMr ? 'ओमेगा-३ जवस-तीळ' : 'Omega-3 Superfood'}
        </button>
        <button
          onClick={() => applyPreset('satvik')}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F5F0FF] hover:bg-[#EAE0FD] text-[#6F42C1] border border-[#D5C2F6] transition-all flex items-center gap-1 cursor-pointer"
        >
          ✨ {isMr ? 'सात्विक उपवास (No Garlic)' : 'Satvik / Fasting'}
        </button>
      </div>

      {/* Main Studio Grid: Left Builder Steps, Right Live 3D Jar Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Step-by-Step Customizer (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-7 border border-[#EFE4D8] shadow-sm">
          
          {/* Step Progress Stepper Bar */}
          <div className="flex items-center justify-between mb-8 border-b border-[#F5EDE4] pb-4">
            {[
              { num: 1, labelMr: '१. मुख्य घटक', labelEn: '1. Base Blend' },
              { num: 2, labelMr: '२. मसाला चव', labelEn: '2. Spice Blend' },
              { num: 3, labelMr: '३. लसूण व तेल', labelEn: '3. Garlic & Oil' },
              { num: 4, labelMr: '४. जार व नाव', labelEn: '4. Size & Label' }
            ].map(step => (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-all text-xs sm:text-sm font-semibold cursor-pointer ${
                  currentStep === step.num 
                    ? 'text-[#C84B31]' 
                    : currentStep > step.num 
                    ? 'text-[#2D4263]' 
                    : 'text-[#B0A4A4]'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === step.num
                    ? 'bg-[#C84B31] text-white ring-4 ring-[#FFE8E3]'
                    : currentStep > step.num
                    ? 'bg-[#2D4263] text-white'
                    : 'bg-[#F2ECE5] text-[#7A6F6F]'
                }`}>
                  {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span className="hidden sm:inline">{isMr ? step.labelMr : step.labelEn}</span>
              </button>
            ))}
          </div>

          {/* STEP 1: Choose Base Ingredients & Percentages */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#2D2424] font-brand">
                    {isMr ? 'पाऊल १: मुख्य घटक व टक्केवारी निवडा' : 'Step 1: Choose Base Ingredients & Ratios'}
                  </h3>
                  <p className="text-xs text-[#7A6E6E]">
                    {isMr ? 'एकूण प्रमाण १००% असावे. तुमच्या आवडीनुसार स्लायडर फिरवा.' : 'Total must equal 100%. Adjust sliders to customize your blend.'}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  Object.values(percentages).reduce((a: number, b: number) => a + b, 0) === 100 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {isMr ? 'एकूण:' : 'Total:'} {Object.values(percentages).reduce((a: number, b: number) => a + b, 0)}%
                </span>
              </div>

              <div className="space-y-4">
                {BASE_INGREDIENTS.map(ingredient => {
                  const val = percentages[ingredient.id] || 0;
                  return (
                    <div 
                      key={ingredient.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        val > 0 ? 'border-[#C84B31]/40 bg-[#FFFDFB] shadow-xs' : 'border-[#EFE4D8] bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3.5 h-3.5 rounded-full inline-block" 
                            style={{ backgroundColor: ingredient.color }} 
                          />
                          <div>
                            <span className="font-bold text-sm text-[#2D2424]">
                              {isMr ? ingredient.nameMr : ingredient.nameEn}
                            </span>
                            <span className="text-xs text-[#8C7B7B] ml-2">
                              (₹{ingredient.pricePer100g}/100g)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-[#C84B31]">{val}%</span>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={val}
                        onChange={(e) => handleSliderChange(ingredient.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-[#EADFD5] rounded-lg appearance-none cursor-pointer accent-[#C84B31]"
                      />

                      <div className="flex justify-between items-center text-[11px] text-[#8C7A7A] mt-1">
                        <span>{ingredient.aromaNotes}</span>
                        <span className="italic">{ingredient.descriptionEn.slice(0, 45)}...</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Texture Selection */}
              <div className="pt-3 border-t border-[#F2ECE5]">
                <label className="block text-xs font-bold text-[#2D2424] mb-2 uppercase tracking-wide">
                  {isMr ? 'चटणीचा पोत (Texture Grinding Style):' : 'Texture & Grinding Style:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'coarse_stone_pounded', labelMr: 'जाडसर खलबत्त्यात कुटलेली', labelEn: 'Coarse Stone-Pounded' },
                    { id: 'medium_granular', labelMr: 'मध्यम रवाळ', labelEn: 'Medium Granular' },
                    { id: 'fine_powder', labelMr: 'बारीक मऊ पूड', labelEn: 'Fine Powder' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTexture(t.id as any)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        texture === t.id
                          ? 'border-[#C84B31] bg-[#FFF4F1] text-[#C84B31]'
                          : 'border-[#EFE4D8] bg-white text-[#574B4B] hover:bg-[#FAF6F2]'
                      }`}
                    >
                      {isMr ? t.labelMr : t.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Spice Level & Chilli Variety */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-[#2D2424] font-brand">
                  {isMr ? 'पाऊल २: मिरची व मसाला चव (Chilli & Spice Blend)' : 'Step 2: Choose Chilli & Spice Blend'}
                </h3>
                <p className="text-xs text-[#7A6E6E]">
                  {isMr ? 'साजूक ते झणझणीत लवंगी ठसका — तुमची आवडती चव निवडा.' : 'From delicate mild aroma to fiery Lavangi.'}
                </p>
              </div>

              {/* Chilli Variety Selection */}
              <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#EFE4D8]">
                <label className="block text-xs font-bold text-[#2D2424] mb-2 uppercase tracking-wide">
                  {isMr ? 'मिरचीची जात (Chilli Heritage Type):' : 'Chilli Heritage Variety:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'bedgi', titleMr: 'बेडगी मिरची', titleEn: 'Bedgi Chilli', descMr: 'सुरेख लाल रंग, मध्यम तिखट' },
                    { id: 'lavangi', titleMr: 'लवंगी मिरची', titleEn: 'Lavangi Hot', descMr: 'लहान आकाराची पण तीव्र तिखट' },
                    { id: 'sankeshwari', titleMr: 'संकेश्वरी गावरान', titleEn: 'Sankeshwari', descMr: 'गावरान झणझणीत ठसकेबाज' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setChilliVariety(c.id as any)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        chilliVariety === c.id 
                          ? 'border-[#C84B31] bg-white ring-2 ring-[#C84B31]/20' 
                          : 'border-[#EFE4D8] bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#2D2424]">{isMr ? c.titleMr : c.titleEn}</div>
                      <div className="text-[11px] text-[#7A6E6E] mt-0.5">{c.descMr}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spice Levels 1-5 Cards */}
              <div className="space-y-2.5">
                {SPICE_LEVELS.map(s => {
                  const isSelected = spiceLevel === s.level;
                  return (
                    <div
                      key={s.level}
                      onClick={() => setSpiceLevel(s.level)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-[#C84B31] bg-[#FFF8F6] ring-2 ring-[#C84B31]/20 shadow-xs' 
                          : 'border-[#EFE4D8] bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Flame 
                              key={i} 
                              className={`w-4 h-4 ${i < s.flameCount ? 'text-[#DC2626] fill-[#DC2626]' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#2D2424]">
                            Level {s.level}: {isMr ? s.labelMr : s.labelEn}
                          </div>
                          <div className="text-xs text-[#7A6E6E]">
                            {isMr ? s.scovilleDescMr : s.scovilleDescEn}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#C84B31] bg-[#C84B31] text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Garlic, Salt & Oil Customization */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-[#2D2424] font-brand">
                  {isMr ? 'पाऊल ३: लसूण, मीठ व लाकडी घाण्याचे तेल' : 'Step 3: Garlic, Salt & Wood-Pressed Oil'}
                </h3>
                <p className="text-xs text-[#7A6E6E]">
                  {isMr ? 'गावरान लसूण व सेंधव मिठाने चटणीला खरी चव व पोषकता मिळते.' : 'Enhance taste with roasted desi garlic and cold-pressed oil drizzle.'}
                </p>
              </div>

              {/* 1. Garlic Level */}
              <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#EFE4D8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2D2424] uppercase tracking-wide">
                    🧄 {isMr ? 'गावरान भाजलेला लसूण (Desi Garlic):' : 'Roasted Desi Garlic Level:'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GARLIC_OPTIONS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGarlicLevel(g.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        garlicLevel === g.id
                          ? 'border-[#C84B31] bg-white ring-2 ring-[#C84B31]/20'
                          : 'border-[#EFE4D8] bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#2D2424]">{isMr ? g.labelMr : g.labelEn}</span>
                        {g.extraPrice > 0 && <span className="text-[11px] font-semibold text-[#C84B31]">+₹{g.extraPrice}</span>}
                      </div>
                      <p className="text-[11px] text-[#7A6E6E] mt-0.5">{isMr ? g.descMr : g.descEn}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Salt Type */}
              <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#EFE4D8] space-y-3">
                <span className="text-xs font-bold text-[#2D2424] uppercase tracking-wide">
                  🧂 {isMr ? 'मिठाचा प्रकार (Salt Variety):' : 'Salt Variety:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SALT_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSaltType(s.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        saltType === s.id
                          ? 'border-[#C84B31] bg-white ring-2 ring-[#C84B31]/20'
                          : 'border-[#EFE4D8] bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#2D2424]">{isMr ? s.labelMr : s.labelEn}</span>
                        {s.extraPrice > 0 && <span className="text-[11px] font-semibold text-[#C84B31]">+₹{s.extraPrice}</span>}
                      </div>
                      <p className="text-[11px] text-[#7A6E6E] mt-0.5">{isMr ? s.descMr : s.descEn}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Oil Type */}
              <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#EFE4D8] space-y-3">
                <span className="text-xs font-bold text-[#2D2424] uppercase tracking-wide">
                  🫒 {isMr ? 'तेल व टिकवण क्षमता (Oil & Moisture):' : 'Oil & Moisture Infusion:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {OIL_OPTIONS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setOilType(o.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        oilType === o.id
                          ? 'border-[#C84B31] bg-white ring-2 ring-[#C84B31]/20'
                          : 'border-[#EFE4D8] bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#2D2424]">{isMr ? o.labelMr : o.labelEn}</span>
                        {o.extraPrice > 0 && <span className="text-[11px] font-semibold text-[#C84B31]">+₹{o.extraPrice}</span>}
                      </div>
                      <p className="text-[11px] text-[#7A6E6E] mt-0.5">{isMr ? o.descMr : o.descEn}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Size, Packaging & Custom Jar Label Personalization */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold text-[#2D2424] font-brand">
                  {isMr ? 'पाऊल ४: पॅक साईज & जारवर तुमचे नाव' : 'Step 4: Pack Size & Personalized Jar Label'}
                </h3>
                <p className="text-xs text-[#7A6E6E]">
                  {isMr ? 'जारवर तुमच्या किंवा भेट देणाऱ्या व्यक्तीचे नाव सुंदर अक्षरात छापले जाईल.' : 'Enter custom label text to be printed on your artisanal jar.'}
                </p>
              </div>

              {/* Pack Size Selector */}
              <div>
                <label className="block text-xs font-bold text-[#2D2424] mb-2 uppercase tracking-wide">
                  {isMr ? 'वजन निवडा (Pack Weight):' : 'Select Jar Size:'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { grams: 250, label: '250g', descMr: 'चाखण्यासाठी / लहान कुटुंब', badgeMr: 'Standard' },
                    { grams: 500, label: '500g', descMr: 'सर्वात जास्त पसंती', badgeMr: 'Best Value' },
                    { grams: 1000, label: '1kg (1000g)', descMr: 'मोठे कुटुंब / बचत पॅक', badgeMr: 'Super Saver' }
                  ].map(p => (
                    <button
                      key={p.grams}
                      onClick={() => setPackSizeGrams(p.grams as any)}
                      className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                        packSizeGrams === p.grams
                          ? 'border-[#C84B31] bg-[#FFF4F1] ring-2 ring-[#C84B31]/20'
                          : 'border-[#EFE4D8] bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {p.badgeMr && (
                        <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-[#C84B31] text-white text-[9px] font-bold rounded">
                          {p.badgeMr}
                        </span>
                      )}
                      <div className="text-base font-extrabold text-[#2D2424]">{p.label}</div>
                      <div className="text-[11px] text-[#7A6E6E] mt-1">{p.descMr}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Packaging Material */}
              <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#EFE4D8] space-y-2">
                <label className="block text-xs font-bold text-[#2D2424] uppercase tracking-wide">
                  {isMr ? 'पॅकेजिंग प्रकार (Packaging Container):' : 'Packaging Type:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setPackagingType('glass_heritage_jar')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      packagingType === 'glass_heritage_jar'
                        ? 'border-[#C84B31] bg-white ring-2 ring-[#C84B31]/20'
                        : 'border-[#EFE4D8] bg-white/70'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#2D2424]">🫙 {isMr ? 'पारंपरिक हेरिटेज ग्लास जार (Glass Jar)' : 'Heritage Glass Jar'}</div>
                    <div className="text-[11px] text-[#7A6E6E] mt-0.5">{isMr ? 'एअरटाइट लाकडी झाकण व प्रिन्टेड लेबल' : 'Airtight wooden lid & personalized label (+₹40)'}</div>
                  </button>

                  <button
                    onClick={() => setPackagingType('airtight_kraft_pouch')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      packagingType === 'airtight_kraft_pouch'
                        ? 'border-[#C84B31] bg-white ring-2 ring-[#C84B31]/20'
                        : 'border-[#EFE4D8] bg-white/70'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#2D2424]">📦 {isMr ? 'पर्यावरणपूरक झिप-लॉक पाऊच' : 'Eco Kraft Pouch'}</div>
                    <div className="text-[11px] text-[#7A6E6E] mt-0.5">{isMr ? 'प्रवासासाठी सोपे व हलके' : 'Travel-friendly resealable kraft pouch'}</div>
                  </button>
                </div>
              </div>

              {/* Custom Jar Label Input Form */}
              <div className="p-4 rounded-xl bg-[#FFF9F6] border border-[#F5C2B8] space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C84B31]" />
                  <span className="text-xs font-bold text-[#C84B31] uppercase tracking-wide">
                    {isMr ? 'जारवरील नाव कस्टमाईज करा (Custom Label Printed on Jar):' : 'Custom Jar Label Text:'}
                  </span>
                </div>

                <div>
                  <label htmlFor={customLabelInputId} className="block text-xs text-[#6B5E5E] mb-1 font-medium">
                    {isMr ? 'मुख्य शीर्षक (उदा. "रेश्माच्या हातची स्पेशल चटणी", "आजीची सोलापुरी चव"):' : 'Jar Title (e.g., "Aai Special Shengdana Chutney"): '}
                  </label>
                  <input
                    id={customLabelInputId}
                    type="text"
                    maxLength={35}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="उदा. रेश्माच्या हातची स्पेशल चटणी"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#EADFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84B31] font-semibold text-[#2D2424]"
                  />
                </div>

                <div>
                  <label htmlFor={customTaglineInputId} className="block text-xs text-[#6B5E5E] mb-1 font-medium">
                    {isMr ? 'उपशीर्षक / मेसेज (उदा. "गावरान चव", "हृदयापासून प्रेमाने बनवलेली"):' : 'Subtitle / Tagline:'}
                  </label>
                  <input
                    id={customTaglineInputId}
                    type="text"
                    maxLength={45}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="उदा. पारंपरिक गावरान चव"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#EADFD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84B31] text-[#6B5E5E]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Controls between Steps */}
          <div className="flex items-center justify-between pt-6 border-t border-[#F5EDE4] mt-6">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#5C4D4D] bg-[#F2ECE5] hover:bg-[#E8DFC5] transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                {isMr ? 'मागे जा' : 'Back'}
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#C84B31] hover:bg-[#A83B23] transition-all flex items-center gap-1 shadow-md shadow-[#C84B31]/20 cursor-pointer"
              >
                {isMr ? 'पुढील पाऊल' : 'Next Step'}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-green-700 hover:bg-green-800 transition-all flex items-center gap-2 shadow-lg shadow-green-700/20 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                {isMr ? 'कार्टमध्ये जोडा (₹' + calculatedPrice + ')' : 'Add Custom Jar to Cart (₹' + calculatedPrice + ')'}
              </button>
            )}
          </div>

        </div>

        {/* RIGHT: Live Visual Jar Simulator & Dynamic Price Ticket (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Visual 3D Layered Chutney Jar Container */}
          <div className="bg-[#2D2424] text-white rounded-2xl p-6 border border-[#443838] relative overflow-hidden shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  {isMr ? 'लाईव्ह जार सिम्युलेटर' : 'Live Jar Simulator'}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-[#443838] text-[#F3C9BF]">
                {packSizeGrams}g
              </span>
            </div>

            {/* Simulated Artisanal Jar Drawing */}
            <div className="relative w-48 h-64 mx-auto my-3 flex flex-col items-center">
              
              {/* Jar Lid (Wood / Brass) */}
              <div className="w-28 h-6 bg-gradient-to-r from-[#8B5A2B] via-[#C68B59] to-[#8B5A2B] rounded-t-lg shadow-md border-b border-[#5C3A1E] z-20 flex items-center justify-center">
                <div className="w-16 h-1 bg-[#5C3A1E]/30 rounded-full" />
              </div>
              
              {/* Jar Neck */}
              <div className="w-24 h-3 bg-white/20 backdrop-blur-xs border-x border-white/30 z-10" />

              {/* Jar Body Glass Container with Layered Ingredients */}
              <div className="w-44 h-52 bg-white/10 backdrop-blur-md rounded-b-3xl border-2 border-white/40 shadow-inner relative overflow-hidden flex flex-col-reverse p-1">
                
                {/* Visual Ingredient Layers stacked according to percentage */}
                {percentages.redChilliBase > 0 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${percentages.redChilliBase * 0.9}%` }}
                    className="w-full bg-[#DC2626] opacity-90 relative"
                    title={`Red Chilli: ${percentages.redChilliBase}%`}
                  >
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#FFF_1px,transparent_1px)] bg-[size:6px_6px]" />
                  </motion.div>
                )}

                {percentages.flaxseed > 0 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${percentages.flaxseed * 0.9}%` }}
                    className="w-full bg-[#8C5242] opacity-90 relative"
                    title={`Flaxseed: ${percentages.flaxseed}%`}
                  >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:4px_4px]" />
                  </motion.div>
                )}

                {percentages.sesameSeeds > 0 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${percentages.sesameSeeds * 0.9}%` }}
                    className="w-full bg-[#E9D8A6] opacity-90 relative"
                    title={`Sesame: ${percentages.sesameSeeds}%`}
                  >
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#78590F_1px,transparent_1px)] bg-[size:5px_5px]" />
                  </motion.div>
                )}

                {percentages.dryCoconut > 0 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${percentages.dryCoconut * 0.9}%` }}
                    className="w-full bg-[#D4A373] opacity-90 relative"
                    title={`Dry Coconut: ${percentages.dryCoconut}%`}
                  />
                )}

                {percentages.peanuts > 0 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${percentages.peanuts * 0.9}%` }}
                    className="w-full bg-[#D97706] opacity-90 relative"
                    title={`Peanuts: ${percentages.peanuts}%`}
                  >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3B2005_1px,transparent_1px)] bg-[size:8px_8px]" />
                  </motion.div>
                )}

                {/* Desi Garlic flakes particles on top layer */}
                {garlicLevel !== 'none' && (
                  <div className="absolute top-2 left-3 right-3 flex justify-around opacity-80 z-10 pointer-events-none">
                    <span className="text-[10px]">🧄</span>
                    <span className="text-[10px]">🧄</span>
                    <span className="text-[10px]">🧄</span>
                  </div>
                )}

                {/* Printed Custom Label Badge on the Jar */}
                <div className="absolute inset-x-2 top-10 bg-[#FFF8EE]/95 text-[#2D2424] rounded-lg p-2.5 border border-[#D5BFA8] shadow-lg text-center z-20">
                  <div className="text-[9px] uppercase tracking-widest text-[#C84B31] font-bold">
                    🌶️ एम एस मसाले (MS Masale)
                  </div>
                  <div className="font-extrabold text-xs text-[#2D2424] font-brand truncate mt-0.5">
                    {customName || 'माझ्या हातची स्पेशल चटणी'}
                  </div>
                  <div className="text-[9px] text-[#7A6E6E] italic truncate">
                    {tagline || 'पारंपरिक खलबत्त्यात कुटलेली'}
                  </div>
                  <div className="flex items-center justify-between text-[8px] border-t border-[#E8DFC5] pt-1 mt-1 font-semibold text-[#574B4B]">
                    <span>Net: {packSizeGrams}g</span>
                    <span>🌶️ Lvl {spiceLevel}</span>
                    <span>100% Purity</span>
                  </div>
                </div>

                {/* Glass reflection glare */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/20 pointer-events-none" />
              </div>
            </div>

            {/* Selected Blend Quick Breakdown Pills */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#443838] text-xs">
              <div className="bg-[#382F2F] p-2 rounded-lg">
                <span className="text-gray-400 block text-[10px] uppercase">
                  {isMr ? 'मसाला चव (Spice):' : 'Spice Blend:'}
                </span>
                <span className="font-bold text-[#F3C9BF]">
                  Level {spiceLevel} ({chilliVariety.toUpperCase()})
                </span>
              </div>
              <div className="bg-[#382F2F] p-2 rounded-lg">
                <span className="text-gray-400 block text-[10px] uppercase">
                  {isMr ? 'लसूण & मीठ:' : 'Garlic & Salt:'}
                </span>
                <span className="font-bold text-[#F3C9BF]">
                  {garlicLevel === 'none' ? 'No Garlic' : `${garlicLevel} Garlic`}, {saltType}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Price Ticket & Add to Cart Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE4D8] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-[#7A6E6E] block font-medium">
                  {isMr ? 'एकूण कस्टमाईज्ड किंमत' : 'Total Dynamic Price'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#C84B31]">
                    ₹{calculatedPrice}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({packSizeGrams}g {isMr ? 'पॅक' : 'Jar'})
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isMr ? '१००% शुद्ध & ताजे' : '100% Fresh Blend'}
                </span>
              </div>
            </div>

            {/* Quality Guarantees */}
            <div className="space-y-2 mb-5 text-xs text-[#574B4B]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0" />
                <span>{isMr ? 'ऑर्डरनंतर थेट लाकडी खलबत्त्यात ताजी कुटणी' : 'Freshly stone-pounded only after order placement'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0" />
                <span>{isMr ? 'शून्य कृत्रिम रंग किंवा प्रिझर्व्हेटिव्ह' : 'Zero artificial colors, fillers or chemical preservatives'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0" />
                <span>{isMr ? 'कस्टम छापलेले वॉटरप्रूफ हेरिटेज लेबल' : 'Custom printed personalized jar label'}</span>
              </div>
            </div>

            {/* Big Add To Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isCalculating}
              className="w-full py-3.5 px-4 bg-[#C84B31] hover:bg-[#A83B23] text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-md shadow-[#C84B31]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{isMr ? 'कस्टम जार कार्टमध्ये जोडा (Add to Cart)' : 'Add Custom Jar to Cart'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
