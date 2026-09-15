import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Leaf, 
  Award, 
  TrendingUp, 
  Calendar, 
  Utensils, 
  ChefHat, 
  ShoppingBag,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/initialData';
import { Order, CartItem } from '../types';

interface FlavorProfileProps {
  onNavigateToBuilder?: () => void;
  onNavigateToCatalog?: () => void;
}

export const FlavorProfileDashboard: React.FC<FlavorProfileProps> = ({
  onNavigateToBuilder,
  onNavigateToCatalog
}) => {
  const { language, orders, addToCart, showToast } = useApp();
  const isMr = language === 'mr';

  const [spiceTolerance, setSpiceTolerance] = useState<number>(75);
  const [favoriteBase, setFavoriteBase] = useState<string>('peanut');

  // Compute flavor statistics from real or simulated customer orders
  const analyticsData = useMemo(() => {
    let totalJars = 0;
    let totalGrams = 0;
    let spicyScore = 0;
    let peanutScore = 0;
    let garlicScore = 0;
    let omegaScore = 0;
    let coconutScore = 0;

    // Monthly aggregation
    const monthlyMap: { [key: string]: { month: string; jars: number; amount: number; zanzanitIndex: number } } = {
      'Jan': { month: isMr ? 'जाने' : 'Jan', jars: 2, amount: 480, zanzanitIndex: 65 },
      'Feb': { month: isMr ? 'फेब्रु' : 'Feb', jars: 3, amount: 720, zanzanitIndex: 78 },
      'Mar': { month: isMr ? 'मार्च' : 'Mar', jars: 4, amount: 960, zanzanitIndex: 85 },
      'Apr': { month: isMr ? 'एप्रिल' : 'Apr', jars: 3, amount: 690, zanzanitIndex: 72 },
      'May': { month: isMr ? 'मे' : 'May', jars: 5, amount: 1250, zanzanitIndex: 90 },
      'Jun': { month: isMr ? 'जून' : 'Jun', jars: 4, amount: 1020, zanzanitIndex: 82 },
    };

    if (orders && orders.length > 0) {
      orders.forEach(ord => {
        const orderDate = new Date(ord.createdAt);
        const mKey = orderDate.toLocaleString('en-US', { month: 'short' });
        
        ord.items.forEach(item => {
          totalJars += item.quantity;
          const weightGrams = item.size.includes('1kg') ? 1000 : item.size.includes('500g') ? 500 : 250;
          totalGrams += weightGrams * item.quantity;

          const title = (item.titleMr + ' ' + item.titleEn).toLowerCase();
          if (title.includes('masala') || title.includes('thecha') || title.includes('kanda')) spicyScore += item.quantity * 3;
          if (title.includes('shengdana') || title.includes('peanut')) peanutScore += item.quantity * 3;
          if (title.includes('lasun') || title.includes('garlic')) garlicScore += item.quantity * 2;
          if (title.includes('javas') || title.includes('til') || title.includes('flaxseed')) omegaScore += item.quantity * 3;
          if (title.includes('khobare') || title.includes('vada pav') || title.includes('coconut')) coconutScore += item.quantity * 2;
        });

        if (monthlyMap[mKey]) {
          monthlyMap[mKey].jars += ord.items.reduce((acc, it) => acc + it.quantity, 0);
          monthlyMap[mKey].amount += ord.totalAmount;
        }
      });
    }

    // Default baseline weights if user is fresh
    if (totalJars === 0) {
      totalJars = 6;
      totalGrams = 1850;
      spicyScore = 85;
      peanutScore = 92;
      garlicScore = 88;
      omegaScore = 70;
      coconutScore = 65;
    } else {
      spicyScore = Math.min(100, Math.max(40, spicyScore * 10));
      peanutScore = Math.min(100, Math.max(40, peanutScore * 10));
      garlicScore = Math.min(100, Math.max(40, garlicScore * 10));
      omegaScore = Math.min(100, Math.max(30, omegaScore * 10));
      coconutScore = Math.min(100, Math.max(30, coconutScore * 10));
    }

    const radarData = [
      { subject: isMr ? '🌶️ झणझणीत तिखट' : '🌶️ Fiery Spice', score: spicyScore, fullMark: 100 },
      { subject: isMr ? '🥜 शेंगदाणा खमंग' : '🥜 Roasted Nutty', score: peanutScore, fullMark: 100 },
      { subject: isMr ? '🧄 गावरान लसूण' : '🧄 Rustic Garlic', score: garlicScore, fullMark: 100 },
      { subject: isMr ? '💪 ओमेगा-३ सुपरफूड' : '💪 Omega-3 Health', score: omegaScore, fullMark: 100 },
      { subject: isMr ? '🥥 खोबरे-तीळ चव' : '🥥 Roasted Coconut', score: coconutScore, fullMark: 100 },
      { subject: isMr ? '🪵 खलबत्ता क्रंच' : '🪵 Stone-Ground Crunch', score: 94, fullMark: 100 }
    ];

    const pieData = [
      { name: isMr ? 'कांदा-लसूण' : 'Kanda-Lasun', value: spicyScore, color: '#B82A16' },
      { name: isMr ? 'शेंगदाणा' : 'Peanut', value: peanutScore, color: '#D97706' },
      { name: isMr ? 'जवसाची ओमेगा-३' : 'Flaxseed Omega-3', value: omegaScore, color: '#15803D' },
      { name: isMr ? 'वडापाव खोबरं-लसूण' : 'Vada Pav Coconut', value: coconutScore, color: '#EA580C' }
    ];

    const monthlyTrends = Object.values(monthlyMap);

    const ingredientFavorites = [
      { name: isMr ? 'गावरान लसूण' : 'Desi Garlic', count: 18, fill: '#8C1C0B' },
      { name: isMr ? 'बेडगी मिरची' : 'Bedgi Chilli', count: 15, fill: '#B82A16' },
      { name: isMr ? 'भाजलेले दाणे' : 'Roasted Peanuts', count: 14, fill: '#D97706' },
      { name: isMr ? 'लाकडी घाणा तेल' : 'Wood-pressed Oil', count: 12, fill: '#059669' },
      { name: isMr ? 'गावरान जवस' : 'Flaxseed (Jawas)', count: 9, fill: '#2563EB' }
    ];

    return {
      totalJars,
      totalGrams,
      preservativesAvoided: (totalGrams * 0.04).toFixed(1), // ~4% chemicals in commercial condiments
      omegaFiberGrams: Math.round(totalGrams * 0.18),
      radarData,
      pieData,
      monthlyTrends,
      ingredientFavorites
    };
  }, [orders, isMr]);

  // Recommended Chutney based on user's current tolerance
  const recommendedProduct = useMemo(() => {
    if (spiceTolerance > 80) {
      return PRODUCTS.find(p => p.id === 'prod-kanda-lasun') || PRODUCTS[0];
    } else if (spiceTolerance > 50) {
      return PRODUCTS.find(p => p.id === 'prod-shengdana') || PRODUCTS[1];
    } else {
      return PRODUCTS.find(p => p.id === 'prod-javas') || PRODUCTS[2];
    }
  }, [spiceTolerance]);

  const handleQuickAddRecommended = () => {
    addToCart({
      productId: recommendedProduct.id,
      titleMr: recommendedProduct.nameMr,
      titleEn: recommendedProduct.nameEn,
      size: '250g',
      unitPrice: recommendedProduct.price250g,
      quantity: 1,
      image: recommendedProduct.image,
      spiceLevel: recommendedProduct.spiceLevel
    });
    showToast(isMr ? `✅ ${recommendedProduct.nameMr} कार्टमध्ये जोडली!` : `✅ ${recommendedProduct.nameEn} added to cart!`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner: Personalized Palate Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#241C1A] via-[#382A25] to-[#1C1614] p-6 sm:p-8 text-white border border-[#4D3A33] shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B82A16]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B82A16]/30 border border-[#B82A16]/50 text-amber-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isMr ? 'तुमची वैयक्तिक चव कुंडली (Personalized Palate Intelligence)' : 'Flavor DNA & Consumption Analytics'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              {isMr ? 'गावरान चव प्रोफाइल & ट्रेंड्स' : 'Customer Flavor Profile & Ordering Trends'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {isMr
                ? 'तुमच्या ऑर्डर्स, आवडत्या मसाल्यांचे प्रमाण आणि दगडी खलबत्त्यातील ताज्या चवींचे रीअल-टाइम व्हिज्युअलायझेशन.'
                : 'Interactive visual analytics of your spice preferences, ordering velocity, and nutritional health benefits.'}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {analyticsData.totalJars}
              </div>
              <div className="text-[11px] font-bold text-stone-300 mt-0.5">
                {isMr ? 'एकूण बरण्या (Jars)' : 'Total Jars'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {analyticsData.totalGrams}g
              </div>
              <div className="text-[11px] font-bold text-stone-300 mt-0.5">
                {isMr ? 'खलबत्ता कुटाई' : 'Fresh Stone-Crushed'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-xs text-center col-span-2 sm:col-span-1">
              <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                0%
              </div>
              <div className="text-[11px] font-bold text-emerald-200 mt-0.5">
                {isMr ? 'शून्य केमिकल्स' : 'Zero Preservatives'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Charts Grid: Radar Flavor Map & Monthly Ordering Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Spice Heat & Flavor Palate (RadarChart) */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#B82A16]" />
                <span>{isMr ? 'तुमची चव दिशा (Spice & Flavor Palate)' : 'Palate Affinity Matrix'}</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {isMr ? '६ प्रमुख चवींचे वितरण आणि आवड' : 'Distribution across 6 distinct spice notes'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#B82A16] text-[11px] font-extrabold">
              {isMr ? '९४% गावरान जुळणी' : '94% Match'}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={analyticsData.radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 600 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" tick={false} />
                <Radar
                  name={isMr ? 'तुमची आवड (Your Palate)' : 'Your Palate Score'}
                  dataKey="score"
                  stroke="#B82A16"
                  fill="#B82A16"
                  fillOpacity={0.45}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}/100`, isMr ? 'प्राधान्य गुण' : 'Palate Score']}
                  contentStyle={{ backgroundColor: '#241C1A', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span><strong>{isMr ? 'प्रमुख वैशिष्ट्य:' : 'Top Characteristic:'}</strong> {isMr ? 'खमंग सोलापुरी शेंगदाणा & लसूण प्रेमी' : 'Rustic Garlic & Roasted Peanut Enthusiast'}</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Monthly Ordering Trends & Jar Velocity (Area / Bar Composed) */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>{isMr ? 'ऑर्डरिंग ट्रेंड्स & बरण्यांचा वेग' : 'Monthly Jar Frequency & Velocity'}</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {isMr ? 'दरमहा खरेदी केलेल्या ताज्या बरण्या आणि ठसका इंडेक्स' : 'Monthly jars ordered and average spice heat index'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold">
              {isMr ? '📈 +२५% वाढता वापर' : '📈 +25% Velocity'}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="jarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="heatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B82A16" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B82A16" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#241C1A', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="jars" 
                  name={isMr ? 'बरण्यांची संख्या (Jars)' : 'Jars Count'} 
                  stroke="#D97706" 
                  fillOpacity={1} 
                  fill="url(#jarGradient)" 
                  strokeWidth={2.5}
                />
                <Area 
                  type="monotone" 
                  dataKey="zanzanitIndex" 
                  name={isMr ? 'झणझणीत इंडेक्स (Heat %)' : 'Heat Index (%)'} 
                  stroke="#B82A16" 
                  fillOpacity={1} 
                  fill="url(#heatGradient)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>{isMr ? 'सरासरी रि-ऑर्डर चक्र: दर ३० ते ४५ दिवसांनी' : 'Avg Re-order Cadence: Every 30–45 days for fresh aroma'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Secondary Row: Regional Chutney Split & Top Loved Ingredients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Donut Chart: Regional Flavor Split */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-600" />
              <span>{isMr ? 'प्रादेशिक चव विभागणी' : 'Regional Flavor Share'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isMr ? 'तुमच्या आवडीनुसार प्रांतांची टक्केवारी' : 'Volume share across regional varieties'}
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#241C1A', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            {analyticsData.pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Most-Loved Ingredients */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>{isMr ? 'सर्वात आवडते घटक' : 'Most Loved Ingredients'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isMr ? 'तुमच्या आहारात समाविष्ट नैसर्गिक जिन्नस' : 'Frequency of natural stone-crushed ingredients'}
            </p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.ingredientFavorites} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#374151', fontSize: 10, fontWeight: 600 }} width={85} />
                <Tooltip 
                  formatter={(val) => [`${val} ${isMr ? 'वेळा' : 'servings'}`, isMr ? 'वापर' : 'Usage']}
                  contentStyle={{ backgroundColor: '#241C1A', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {analyticsData.ingredientFavorites.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 text-[11px] text-stone-600 flex items-center justify-between">
            <span>{isMr ? '१००% कोल्ड-प्रेस्ड लाकडी घाणा तेल' : '100% Cold-Pressed Wood Oil'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Health & Purity Impact Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{isMr ? 'आरोग्य & शुद्धता प्रभाव (Health Impact)' : 'Artisanal Purity Report'}</span>
            </div>
            <p className="text-xs text-emerald-950/80 leading-relaxed">
              {isMr 
                ? 'पारंपरिक गावरान चटणी वापरून तुम्ही बाजारातील केमिकल प्रिझर्व्हेटिव्ह व पाम ऑइल पूर्णपणे टाळले आहे.'
                : 'By choosing stone-crushed heritage condiments, you have completely eliminated artificial colors, palm oil, and benzoates.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200/80 shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-700">{isMr ? 'टाळलेले केमिकल्स:' : 'Chemicals Avoided:'}</span>
                <span className="font-mono font-black text-emerald-700 text-sm">{analyticsData.preservativesAvoided}g</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200/80 shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-700">{isMr ? 'नैसर्गिक फायबर & ओमेगा-३:' : 'Natural Omega-3 & Fiber:'}</span>
                <span className="font-mono font-black text-amber-700 text-sm">+{analyticsData.omegaFiberGrams}g</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isMr ? 'दगडी कुटाईमुळे पोषणमूल्ये १००% टिकून राहतात.' : 'Cold-crushing preserves natural heat-sensitive enzymes.'}</span>
          </div>
        </div>

      </div>

      {/* 4. Interactive Spice Calibration & Next Flavor Recommendation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
          <div>
            <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#B82A16]" />
              <span>{isMr ? 'तुमची तिखट सहनशीलता कॅलिब्रेट करा (Spice Heat Tuner)' : 'Interactive Spice Heat Calibrator'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isMr ? 'स्लाइडर हलवून तुमच्या सध्याच्या आवडीनुसार योग्य चटणी शोधा' : 'Tune your spice preference to receive real-time culinary recommendations'}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono font-black text-sm px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[#B82A16]">
            <span>{isMr ? 'तिखट स्तर:' : 'Heat Index:'}</span>
            <span className="text-base">{spiceTolerance}/100</span>
          </div>
        </div>

        {/* Heat Range Slider */}
        <div className="space-y-3">
          <input
            type="range"
            min="20"
            max="100"
            step="5"
            value={spiceTolerance}
            onChange={(e) => setSpiceTolerance(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#B82A16]"
          />
          <div className="flex justify-between text-[11px] font-bold text-stone-500">
            <span>{isMr ? '🌿 खमंग व सौम्य (Mild)' : '🌿 Mild & Nutty'}</span>
            <span>{isMr ? '🌶️ मध्यम मसालेदार (Medium)' : '🌶️ Medium Spice'}</span>
            <span>{isMr ? '🔥 झणझणीत तिखट (Fiery)' : '🔥 Extra Fiery'}</span>
          </div>
        </div>

        {/* Dynamic AI Recommendation Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-red-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={recommendedProduct.image}
              alt={recommendedProduct.nameEn}
              className="w-16 h-16 rounded-2xl object-cover border border-amber-200 shrink-0 shadow-sm"
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#B82A16] tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {isMr ? 'तुमच्यासाठी सर्वोत्तम शिफारस (Best Pairing)' : 'Recommended Match for Your Heat Level'}
              </span>
              <h4 className="text-base font-extrabold text-stone-900 mt-0.5">
                {isMr ? recommendedProduct.nameMr : recommendedProduct.nameEn}
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">
                {isMr ? recommendedProduct.descriptionMr : recommendedProduct.descriptionEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleQuickAddRecommended}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#B82A16] hover:bg-[#981E0D] text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isMr ? 'कार्टमध्ये टाका (₹' + recommendedProduct.price250g + ')' : 'Add Jar (₹' + recommendedProduct.price250g + ')'}</span>
            </button>

            {onNavigateToBuilder && (
              <button
                onClick={onNavigateToBuilder}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">{isMr ? 'कस्टम खलबत्त्यात कुटा' : 'Custom Crush'}</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
