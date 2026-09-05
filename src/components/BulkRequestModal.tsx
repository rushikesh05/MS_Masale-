import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ChefHat, 
  Truck, 
  Scale, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Clock, 
  Send, 
  MessageSquare,
  BadgePercent,
  Layers,
  Store,
  UtensilsCrossed,
  Package,
  Award,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  WholesaleRequest, 
  EstablishmentType, 
  WholesaleFrequency, 
  PackagingPreference,
  WholesaleProductRequirement 
} from '../types';
import { saveWholesaleRequestToFirestore } from '../lib/firestoreSync';

interface SelectedBulkItem {
  quantityKg: number;
  packagingPreference: PackagingPreference;
  spiceLevelPreference: WholesaleProductRequirement['spiceLevelPreference'];
  customNotes: string;
}

// Base signature chutneys available for bulk commercial ordering
const BULK_PRODUCT_CATALOG = [
  {
    id: 'shengdana-chutney',
    nameMr: 'सोलापुरी खमंग शेंगदाणा चटणी',
    nameEn: 'Solapuri Roasted Peanut Chutney',
    basePricePerKg: 420,
    minKg: 5,
    descriptionMr: 'दगडी खलबत्त्यात कुटलेली अस्सल सोलापुरी चव. हॉटेल्स व थाळीसाठी सर्वाधिक पसंती.',
    descriptionEn: 'Stone-pounded with roasted Solapur peanuts. Highest reorder rate for Maharashtrian thalis.',
    tag: 'Bestseller'
  },
  {
    id: 'kanda-lasun-masala',
    nameMr: 'कोल्हापुरी अस्सल कांदा-लसूण मसाला / चटणी',
    nameEn: 'Kolhapuri Kanda-Lasun Chutney / Masala',
    basePricePerKg: 460,
    minKg: 5,
    descriptionMr: 'गावरान कांदा व लासलगाव लसणाचा खमंग ठसका. मटण, चिकन व मिसळ रस्स्यासाठी परिपूर्ण.',
    descriptionEn: 'Authentic fiery red onion & garlic blend for gravies, misal rassa, and spicy curries.',
    tag: 'Kolhapur Special'
  },
  {
    id: 'sukha-coconut-garlic',
    nameMr: 'मुंबई वडापाव सुके खोबरे-लसूण चटणी',
    nameEn: 'Mumbai Vada Pav Dry Coconut Garlic Chutney',
    basePricePerKg: 440,
    minKg: 5,
    descriptionMr: 'कुरकुरीत लाल खोबरे-लसूण चटणी. वडापाव, समोसा, डोसा व स्नॅक्ससाठी खास.',
    descriptionEn: 'Crispy crimson coconut-garlic crumble. Ideal for fast food centers, snack bars & cafes.',
    tag: 'Snack Hit'
  },
  {
    id: 'javas-flaxseed',
    nameMr: 'पौष्टिक जवस (Flaxseed) सुपरफूड चटणी',
    nameEn: 'Omega-3 Flaxseed Superfood Chutney',
    basePricePerKg: 400,
    minKg: 5,
    descriptionMr: 'ओमेगा-३ युक्त भाजलेले जवस. आरोग्यदायी नाश्ता व फिटनेस डाएटसाठी उत्तम.',
    descriptionEn: 'Rich in dietary fiber and omega-3 fatty acids for health-conscious restaurants & buffets.',
    tag: 'Healthy'
  },
  {
    id: 'til-sesame',
    nameMr: 'विदर्भ भाजलेली तीळ चटणी',
    nameEn: 'Vidarbha Roasted Sesame Seed Chutney',
    basePricePerKg: 410,
    minKg: 5,
    descriptionMr: 'पांढरे तीळ, जिरं व लाल मिरचीचे अप्रतिम मिश्रण. भाकरी व चपातीसोबत चविष्ट.',
    descriptionEn: 'Nutty, aromatic roasted sesame seed condiment paired with traditional bhakri.',
    tag: 'Heritage'
  },
  {
    id: 'karale-niger',
    nameMr: 'गावरान कारळे (Niger Seeds) चटणी',
    nameEn: 'Authentic Karale (Niger Seed) Chutney',
    basePricePerKg: 430,
    minKg: 5,
    descriptionMr: 'अस्सल मराठवाडी कारळे चटणी. ज्वारीच्या गरम भाकरीसोबत उत्कृष्ट संगम.',
    descriptionEn: 'Rare artisanal black seed delicacy deeply rooted in rural Maharashtra cuisine.',
    tag: 'Artisan'
  },
  {
    id: 'kolhapuri-thecha-dry',
    nameMr: 'झणझणीत गावरान लाल खर्डा / ठेचा',
    nameEn: 'Fiery Gavran Dry Red Chilli Thecha',
    basePricePerKg: 480,
    minKg: 5,
    descriptionMr: 'लवंगी मिरची व भरपूर लसूण. मिसळ, मटण भाकरी व धाब्यांसाठी अस्सल तडका.',
    descriptionEn: 'Heavy stone-crushed red chillies with garlic cloves for authentic dhaba spice levels.',
    tag: 'Ultra Spicy'
  }
];

export const BulkRequestModal: React.FC = () => {
  const { language, isBulkRequestModalOpen, setIsBulkRequestModalOpen, showToast } = useApp();
  const { currentUser } = useAuth();
  const isMr = language === 'mr';

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState(currentUser?.displayName || '');
  const [designation, setDesignation] = useState('Head Chef / Kitchen Manager');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 ');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [establishmentType, setEstablishmentType] = useState<EstablishmentType>('restaurant');
  const [gstNumber, setGstNumber] = useState('');
  const [city, setCity] = useState('पुणे (Pune)');
  const [talukaDistrict, setTalukaDistrict] = useState('Pune');
  const [pincode, setPincode] = useState('411045');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [supplyFrequency, setSupplyFrequency] = useState<WholesaleFrequency>('monthly_contract');
  const [targetDeliveryDate, setTargetDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Selected Products Map: { [productId]: SelectedBulkItem }
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedBulkItem>>({
    'shengdana-chutney': {
      quantityKg: 20,
      packagingPreference: 'bulk_buckets_10kg',
      spiceLevelPreference: 'medium_gavran',
      customNotes: 'Extra roasted Solapuri aroma'
    },
    'sukha-coconut-garlic': {
      quantityKg: 10,
      packagingPreference: 'standup_pouches_1kg',
      spiceLevelPreference: 'medium_gavran',
      customNotes: 'For Mumbai vada pav counter'
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<WholesaleRequest | null>(null);

  if (!isBulkRequestModalOpen) return null;

  // Toggle item inclusion
  const toggleItem = (productId: string) => {
    setSelectedItems(prev => {
      const next: Record<string, SelectedBulkItem> = { ...prev };
      if (next[productId]) {
        delete next[productId];
      } else {
        next[productId] = {
          quantityKg: 10,
          packagingPreference: 'bulk_buckets_10kg',
          spiceLevelPreference: 'medium_gavran',
          customNotes: ''
        };
      }
      return next;
    });
  };

  const updateItemQuantity = (productId: string, delta: number) => {
    setSelectedItems(prev => {
      const current = prev[productId];
      if (!current) return prev;
      const newQty = Math.max(5, current.quantityKg + delta);
      return {
        ...prev,
        [productId]: {
          ...current,
          quantityKg: newQty
        }
      };
    });
  };

  const updateItemDetails = (
    productId: string, 
    key: 'packagingPreference' | 'spiceLevelPreference' | 'customNotes', 
    value: string
  ) => {
    setSelectedItems(prev => {
      const current = prev[productId];
      if (!current) return prev;
      return {
        ...prev,
        [productId]: {
          ...current,
          [key]: value
        }
      };
    });
  };

  // Calculate Totals & Wholesale Discounts
  const selectedList = Object.values(selectedItems) as SelectedBulkItem[];
  const totalKg = selectedList.reduce((sum: number, item: SelectedBulkItem) => sum + item.quantityKg, 0);

  // Discount tiers: 10-24kg: 15%, 25-49kg: 25%, 50-99kg: 35%, 100kg+: 40%
  let discountPct = 0;
  if (totalKg >= 100) discountPct = 40;
  else if (totalKg >= 50) discountPct = 35;
  else if (totalKg >= 25) discountPct = 25;
  else if (totalKg >= 10) discountPct = 15;

  const rawEstimatedSubtotal = (Object.entries(selectedItems) as [string, SelectedBulkItem][]).reduce((sum: number, [productId, item]) => {
    const catItem = BULK_PRODUCT_CATALOG.find(p => p.id === productId);
    const unitRate = catItem ? catItem.basePricePerKg : 400;
    return sum + (unitRate * item.quantityKg);
  }, 0);

  const discountAmount = Math.round((rawEstimatedSubtotal * discountPct) / 100);
  const finalWholesaleEstimate = rawEstimatedSubtotal - discountAmount;
  const avgRatePerKg = totalKg > 0 ? Math.round(finalWholesaleEstimate / totalKg) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !contactPerson.trim() || !phone.trim()) {
      showToast(isMr ? 'कृपया व्यवसाय नाव, संपर्क व्यक्ती व फोन क्रमांक प्रविष्ट करा' : 'Please enter business name, contact person and phone number');
      return;
    }

    if (totalKg < 5) {
      showToast(isMr ? 'किमान ५ किलो होलसेल मागणी आवश्यक आहे' : 'Minimum 5 KG total wholesale quantity required');
      return;
    }

    setIsSubmitting(true);

    const generatedId = `WS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const productsPayload: WholesaleProductRequirement[] = (Object.entries(selectedItems) as [string, SelectedBulkItem][]).map(([productId, item]) => {
      const cat = BULK_PRODUCT_CATALOG.find(p => p.id === productId);
      return {
        productId,
        productNameMr: cat?.nameMr || productId,
        productNameEn: cat?.nameEn || productId,
        quantityKg: item.quantityKg,
        spiceLevelPreference: item.spiceLevelPreference,
        packagingPreference: item.packagingPreference,
        customNotes: item.customNotes
      };
    });

    const wholesalePayload: WholesaleRequest = {
      id: generatedId,
      userId: currentUser?.uid || 'guest_b2b',
      businessName: businessName.trim(),
      contactPerson: contactPerson.trim(),
      designation: designation.trim(),
      phone: phone.trim(),
      email: email.trim() || 'b2b-client@assalgavran.in',
      establishmentType,
      gstNumber: gstNumber.trim() || undefined,
      city: city.trim(),
      talukaDistrict: talukaDistrict.trim(),
      pincode: pincode.trim(),
      deliveryAddress: deliveryAddress.trim() || `${city} Commercial Kitchen`,
      supplyFrequency,
      targetDeliveryDate,
      products: productsPayload,
      totalEstimatedKg: totalKg,
      estimatedBudgetInr: finalWholesaleEstimate,
      specialRequirements: specialRequirements.trim() || undefined,
      status: 'new_request',
      quotedPricePerKgAvg: avgRatePerKg,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // 1. Direct Cloud Firestore write to /wholesale_requests collection
      await saveWholesaleRequestToFirestore(wholesalePayload);

      // 2. Server-side backup endpoint
      try {
        await fetch('/api/wholesale-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wholesalePayload)
        });
      } catch (apiErr) {
        console.warn('[Wholesale API fallback]', apiErr);
      }

      setSubmittedRequest(wholesalePayload);
      showToast(isMr ? `होलसेल मागणी #${generatedId} यशस्वीरीत्या नोंदवली!` : `Wholesale Request #${generatedId} submitted successfully!`);
    } catch (error) {
      console.error('Failed to submit wholesale request:', error);
      showToast(isMr ? 'मागणी सबमिट करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' : 'Error submitting wholesale request. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsBulkRequestModalOpen(false);
    setSubmittedRequest(null);
  };

  const openWhatsAppToManager = (req: WholesaleRequest) => {
    const text = encodeURIComponent(
      `🚩 *MS Masale (मंगल सुवर्णा मसाले) - B2B Wholesale Request #${req.id}*\n\n` +
      `🏢 *Establishment:* ${req.businessName} (${req.establishmentType})\n` +
      `👤 *Contact:* ${req.contactPerson} (${req.designation}) - ${req.phone}\n` +
      `📍 *Location:* ${req.city}, Pincode ${req.pincode}\n` +
      `📦 *Total Volume:* ${req.totalEstimatedKg} KG (${req.supplyFrequency})\n` +
      `💰 *Estimated Quote:* ₹${req.estimatedBudgetInr?.toLocaleString('en-IN')}\n\n` +
      `📋 *Products Requested:*\n` +
      req.products.map(p => `• ${p.productNameEn}: ${p.quantityKg} KG [${p.packagingPreference}]`).join('\n') +
      `\n\n📝 *Notes:* ${req.specialRequirements || 'Standard batch tasting samples required.'}\n\n` +
      `Please provide formal commercial quotation and sample batch dispatch details.`
    );
    window.open(`https://wa.me/919823456789?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#131921] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-6 text-white max-h-[92vh] flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#232F3E] via-[#1a2430] to-[#232F3E] border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  {isMr ? 'B2B रेस्टॉरंट & केटरर्स पोर्टल' : 'B2B Restaurant & Caterer Supply'}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>FSSAI Certified</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white font-brand mt-0.5">
                {isMr ? 'होलसेल / बल्क ऑर्डर मागणी फॉर्म' : 'Bulk / Wholesale Commercial Supply Form'}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1 text-xs sm:text-sm">
          {submittedRequest ? (
            /* Success Confirmation Screen */
            <div className="py-8 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase bg-stone-800 text-amber-400 px-3 py-1 rounded-full border border-stone-700">
                  {submittedRequest.id}
                </span>
                <h3 className="text-2xl font-extrabold text-white font-brand">
                  {isMr ? 'होलसेल मागणी यशस्वीरीत्या प्राप्त झाली!' : 'Wholesale Request Submitted!'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {isMr
                    ? `धन्यवाद ${submittedRequest.contactPerson}! तुमची मागणी आमचे वर्कशॉप मॅनेजर व हेड शेफ तपासत आहेत. २ तासांत अधिकृत कोटेशन व चाचणी नमुने (Tasting Samples) पाठवले जातील.`
                    : `Thank you ${submittedRequest.contactPerson}! Our workshop manager is reviewing your custom quantity requirements. Official commercial quote & sample batch will be processed shortly.`}
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#232F3E] border border-stone-700 rounded-2xl p-4 text-left space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-stone-700 pb-2">
                  <span className="text-stone-400">{isMr ? 'व्यवसाय:' : 'Establishment:'}</span>
                  <span className="font-bold text-white">{submittedRequest.businessName}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-stone-700 pb-2">
                  <span className="text-stone-400">{isMr ? 'एकूण मागणी:' : 'Total Volume:'}</span>
                  <span className="font-bold text-amber-400">{submittedRequest.totalEstimatedKg} KG ({submittedRequest.supplyFrequency})</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-stone-700 pb-2">
                  <span className="text-stone-400">{isMr ? 'अंदाजे होलसेल किंमत:' : 'Estimated B2B Rate:'}</span>
                  <span className="font-extrabold text-emerald-400 text-sm">₹{submittedRequest.estimatedBudgetInr?.toLocaleString('en-IN')} (~₹{submittedRequest.quotedPricePerKgAvg}/kg)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400">{isMr ? 'वितरण पत्ता:' : 'Delivery Location:'}</span>
                  <span className="text-stone-200 truncate max-w-[200px]">{submittedRequest.city} ({submittedRequest.pincode})</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => openWhatsAppToManager(submittedRequest)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/40"
                >
                  <MessageSquare className="w-4 h-4 text-green-200" />
                  <span>{isMr ? 'मॅनेजरशी व्हॉट्सॲपवर बोला' : 'Chat with Manager on WhatsApp'}</span>
                </button>

                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-bold transition-colors cursor-pointer"
                >
                  <span>{isMr ? 'बंद करा' : 'Done & Close'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Business Identity */}
              <div className="bg-[#232F3E]/70 border border-stone-700 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-stone-700 pb-2">
                  <Store className="w-4 h-4" />
                  <span>{isMr ? '१. व्यावसायिक माहिती (Business & Identity)' : '1. Commercial & Establishment Details'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'हॉटेल / केटरिंग / व्यवसायाचे नाव *' : 'Establishment / Business Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isMr ? 'उदा. हॉटेल शिवराज ग्रँड / अन्नपूर्णा केटरर्स' : 'e.g., Hotel Shivraj Palace / Annapurna Caterers'}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'व्यवसाय प्रकार *' : 'Establishment Type *'}
                    </label>
                    <select
                      value={establishmentType}
                      onChange={(e) => setEstablishmentType(e.target.value as EstablishmentType)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="restaurant">रेस्टॉरंट / भोजनालय (Restaurant / Dining)</option>
                      <option value="caterer">केटरिंग सर्व्हिस (Catering Contractor)</option>
                      <option value="dhaba_khanawal">धाबा / खानावळ (Highway Dhaba / Khanawal)</option>
                      <option value="hotel_resort">हॉटेल & रिसॉर्ट (Hotel & Resort)</option>
                      <option value="sweet_farsan_shop">मिठाई व फरसाण दुकान (Snack / Farsan Mart)</option>
                      <option value="wedding_event_planner">लग्नकार्य / इव्हेंट प्लॅनर (Wedding & Banquet Hall)</option>
                      <option value="cloud_kitchen">क्लाउड किचन / मेस (Cloud Kitchen / Tiffin Service)</option>
                      <option value="retail_distributor">घाऊक वितरक / सुपरमार्केट (Wholesale Distributor)</option>
                      <option value="other">इतर (Other Commercial)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'संपर्क व्यक्तीचे नाव *' : 'Contact Person Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isMr ? 'उदा. शेफ विक्रम सावंत' : 'e.g., Chef Vikram Sawant'}
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'पद / हुद्दा' : 'Designation / Role'}
                    </label>
                    <input
                      type="text"
                      placeholder={isMr ? 'उदा. हेड शेफ / मालक / परचेस मॅनेजर' : 'e.g., Head Chef / Proprietor / Purchase Manager'}
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'व्हॉट्सॲप / मोबाईल नंबर *' : 'WhatsApp / Mobile Number *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98234 56789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'ईमेल पत्ता' : 'Business Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="purchases@hotelshivraj.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'GST नंबर (ऐच्छिक - GST इनव्हॉईससाठी)' : 'GST Number (Optional - for Input Tax Credit)'}
                    </label>
                    <input
                      type="text"
                      placeholder="27AAAAA0000A1Z5"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#131921] border border-stone-600 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Custom Product Quantities & Varieties */}
              <div className="bg-[#232F3E]/70 border border-stone-700 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-700 pb-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Scale className="w-4 h-4" />
                    <span>{isMr ? '२. चटणी प्रकार & आवश्यक किलो प्रमाण (Custom Quantity Requirements)' : '2. Condiment Selection & Custom Quantities (KG)'}</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <BadgePercent className="w-4 h-4" />
                    <span>{discountPct > 0 ? `${discountPct}% Bulk Tier Discount` : 'Tiered Wholesale Rates'}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-300">
                  {isMr 
                    ? 'खालीलपैकी आपल्या मेनूसाठी हव्या असलेल्या चटण्या निवडा आणि आवश्यक किलो प्रमाण (+/-) ठरवा:'
                    : 'Select the signature stone-ground chutneys required for your kitchen and customize quantities (KG):'}
                </div>

                {/* Product Selection List */}
                <div className="space-y-3">
                  {BULK_PRODUCT_CATALOG.map((product) => {
                    const isSelected = Boolean(selectedItems[product.id]);
                    const itemState = selectedItems[product.id];

                    return (
                      <div
                        key={product.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-[#1a2430] border-amber-500/60 shadow-md'
                            : 'bg-[#131921]/60 border-stone-700 hover:border-stone-600 opacity-80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItem(product.id)}
                              className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-white text-xs sm:text-sm">
                                  {isMr ? product.nameMr : product.nameEn}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {product.tag}
                                </span>
                                <span className="text-[11px] text-stone-400 font-mono">
                                  ₹{product.basePricePerKg}/kg
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-400 mt-0.5">
                                {isMr ? product.descriptionMr : product.descriptionEn}
                              </p>
                            </div>
                          </div>

                          {/* KG Adjuster */}
                          {isSelected && itemState && (
                            <div className="flex items-center gap-2 shrink-0 bg-[#131921] p-1.5 rounded-xl border border-stone-700">
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(product.id, -5)}
                                className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <div className="px-2 font-extrabold text-amber-400 text-sm font-mono text-center min-w-[50px]">
                                {itemState.quantityKg} <span className="text-[10px] text-stone-400">KG</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => updateItemQuantity(product.id, 5)}
                                className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#131921] font-bold flex items-center justify-center cursor-pointer transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Extra Customization Controls when Selected */}
                        {isSelected && itemState && (
                          <div className="mt-3 pt-3 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                            <div>
                              <label className="text-stone-400 block mb-1 font-semibold">
                                {isMr ? 'पॅकिंग प्रकार:' : 'Packaging Form:'}
                              </label>
                              <select
                                value={itemState.packagingPreference}
                                onChange={(e) => updateItemDetails(product.id, 'packagingPreference', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#131921] border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                              >
                                <option value="bulk_buckets_10kg">१० किलो बल्क ड्रम (10kg Commercial Drum)</option>
                                <option value="bulk_jerry_cans_5kg">५ किलो कॅन / बकेट (5kg Jerry Can)</option>
                                <option value="standup_pouches_1kg">१ किलो नायट्रोजन पाऊच (1kg Standup Pouch)</option>
                                <option value="standup_pouches_500g">५०० ग्रॅम रिटेल पाऊच (500g Pouch)</option>
                                <option value="glass_jars_heritage">५०० ग्रॅम काचेची बरणी (500g Glass Jar)</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-stone-400 block mb-1 font-semibold">
                                {isMr ? 'तिखटपणा / चव:' : 'Spice Level:'}
                              </label>
                              <select
                                value={itemState.spiceLevelPreference}
                                onChange={(e) => updateItemDetails(product.id, 'spiceLevelPreference', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#131921] border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                              >
                                <option value="medium_gavran">मध्यम गावरान (Medium Gavran - Standard)</option>
                                <option value="mild_kolhapuri">कमी तिखट (Mild - Family Dining)</option>
                                <option value="extra_spicy_thecha">अति झणझणीत (Extra Spicy - Dhaba Style)</option>
                                <option value="custom_blend">जैन / विना लसूण (No Garlic / Jain)</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-stone-400 block mb-1 font-semibold">
                                {isMr ? 'खास सूचना:' : 'Special Instruction:'}
                              </label>
                              <input
                                type="text"
                                placeholder={isMr ? 'उदा. जास्त भाजलेला दाणा' : 'e.g., extra coarse grind'}
                                value={itemState.customNotes}
                                onChange={(e) => updateItemDetails(product.id, 'customNotes', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#131921] border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Wholesale Volume Calculator Summary Bar */}
                <div className="bg-[#131921] rounded-2xl p-4 border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] text-stone-400">{isMr ? 'एकूण निवडलेले प्रमाण:' : 'Total Volume Requested:'}</div>
                    <div className="text-xl font-black text-amber-400 font-mono">
                      {totalKg} <span className="text-xs text-white">KG</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-stone-400">{isMr ? 'घाऊक सवलत दर:' : 'Wholesale Discount:'}</div>
                    <div className="text-sm font-bold text-emerald-400">
                      {discountPct}% OFF {discountAmount > 0 && `(Save ₹${discountAmount.toLocaleString('en-IN')})`}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-stone-400">{isMr ? 'अंदाजे होलसेल रक्कम:' : 'Estimated B2B Rate:'}</div>
                    <div className="text-xl font-black text-white font-mono">
                      ₹{finalWholesaleEstimate.toLocaleString('en-IN')}
                      <span className="text-[10px] text-stone-400 block font-sans">
                        ~₹{avgRatePerKg}/kg (excl. GST)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Delivery Logistics & Frequency */}
              <div className="bg-[#232F3E]/70 border border-stone-700 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-stone-700 pb-2">
                  <Truck className="w-4 h-4" />
                  <span>{isMr ? '३. डिलिव्हरी वारंवारता & वितरण पत्ता (Logistics & Frequency)' : '3. Delivery Logistics & Schedule'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'पुरवठा वारंवारता *' : 'Supply Frequency *'}
                    </label>
                    <select
                      value={supplyFrequency}
                      onChange={(e) => setSupplyFrequency(e.target.value as WholesaleFrequency)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="monthly_contract">दरमहा नियमित करार (Monthly Standing Contract)</option>
                      <option value="weekly_supply">दर आठवड्याला पुरवठा (Weekly Kitchen Supply)</option>
                      <option value="biweekly_supply">दर १५ दिवसांनी (Bi-weekly Recurring)</option>
                      <option value="one_time_event">एकवेळची मोठी मागणी (One-time Event / Wedding)</option>
                      <option value="quarterly_standing_order">तिमाही करार (Quarterly Bulk Order)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'पहिली डिलिव्हरी / सोहळा तारीख *' : 'Target Kickoff / Delivery Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={targetDeliveryDate}
                      onChange={(e) => setTargetDeliveryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'शहर / गाव *' : 'City / Village *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isMr ? 'उदा. पुणे, कोल्हापूर, मुंबई' : 'e.g. Pune, Kolhapur, Mumbai'}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'पिनकोड *' : 'Pincode *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="411045"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">
                      {isMr ? 'किचन / हॉटेलचा पूर्ण पत्ता' : 'Commercial Kitchen / Delivery Address'}
                    </label>
                    <input
                      type="text"
                      placeholder={isMr ? 'उदा. प्लॉट १२, हायवे कॉर्नर, बाणेर, पुणे' : 'e.g. Plot 12, Baner Main Rd, Pune'}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-300 mb-1">
                    {isMr ? 'खास सूचना / नमुने चाचणी / शेफची आवश्यकता (Special Instructions)' : 'Special Formulation Notes / Tasting Samples Request'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={isMr ? 'उदा. २५ किलो ऑर्डरपूर्वी ३०० ग्रॅमचे चाचणी नमुने पाठवावेत. तसेच लग्नकार्यासाठी लसूण कमी असावा.' : 'e.g. Please dispatch 300g tasting sample pack before dispatching 50kg batch. Need low garlic formulation for wedding banquet.'}
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#131921] border border-stone-600 text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Submit Controls */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-800">
                <div className="text-xs text-stone-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {isMr 
                      ? 'मागणी नोंदवताच मॅनेजर पोर्टलवर रिअल-टाइम नोटिफिकेशन पाठवले जाईल.' 
                      : 'Real-time alert will be synced to the Workshop Manager Portal.'}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold transition-colors cursor-pointer"
                  >
                    {isMr ? 'रद्द करा' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || totalKg < 5}
                    className="flex-1 sm:flex-none px-7 py-3 rounded-xl express-btn-cart text-[#131921] font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>{isMr ? 'नोंदवत आहे...' : 'Submitting to Firestore...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isMr ? 'होलसेल मागणी सबमिट करा' : 'Submit Wholesale Request'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
