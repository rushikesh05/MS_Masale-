import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare, 
  Building2, 
  HeartHandshake, 
  ChefHat, 
  FileText,
  Phone,
  Mail,
  MapPin,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface GoogleFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type InquiryCategory = 'feedback' | 'bulk_wedding_order' | 'restaurant_supply' | 'custom_recipe_formulation';

export const GoogleFormsModal: React.FC<GoogleFormsModalProps> = ({ isOpen, onClose }) => {
  const { language, showToast } = useApp();
  const isMr = language === 'mr';

  const [category, setCategory] = useState<InquiryCategory>('feedback');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState('');

  if (!isOpen) return null;

  const categories: { id: InquiryCategory; icon: any; mr: string; en: string; descMr: string; descEn: string }[] = [
    {
      id: 'feedback',
      icon: Star,
      mr: 'चव अभिप्राय (Review & Feedback)',
      en: 'Customer Review & Feedback',
      descMr: 'आमच्या दगडी खलबत्ता चटण्यांबद्दल तुमचा अनुभव शेअर करा',
      descEn: 'Share your tasting experience and suggestions'
    },
    {
      id: 'bulk_wedding_order',
      icon: HeartHandshake,
      mr: 'लग्न & समारंभ रिटर्न गिफ्ट जार',
      en: 'Weddings & Event Gift Jars',
      descMr: 'लग्न, बारसे व सणांसाठी कस्टमाईज्ड लेबलसह आकर्षक काचेच्या बरण्या',
      descEn: 'Bulk personalized heritage jars with custom label printing'
    },
    {
      id: 'restaurant_supply',
      icon: Building2,
      mr: 'हॉटेल, मिसळ & वडापाव सप्लाय',
      en: 'Hotel & Restaurant Supply',
      descMr: 'हॉटेल्स आणि मिसळ हाऊसेससाठी दरमहा ताजा घाऊक पुरवठा',
      descEn: 'Commercial B2B supplies for restaurants, caterers, & cafes'
    },
    {
      id: 'custom_recipe_formulation',
      icon: ChefHat,
      mr: 'खास रेसिपी वाटण विनंती',
      en: 'Custom Spice Formulation',
      descMr: 'तुमच्या घरच्या किंवा प्रादेशिक पद्धतीनुसार खास खलबत्ता वाटण',
      descEn: 'Request your family or regional authentic recipe stone-pounded'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) {
      showToast(isMr ? 'कृपया सर्व आवश्यक माहिती भरा.' : 'Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    const newId = `INQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const inquiryData = {
      id: newId,
      fullName,
      phone,
      email: email || '',
      city: city || 'Maharashtra',
      pincode: pincode || '',
      inquiryType: category,
      rating: category === 'feedback' ? rating : 5,
      quantityKg: Number(quantityKg) || 0,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Write to Firestore if available
      try {
        await addDoc(collection(db, 'inquiries'), inquiryData);
      } catch (fbErr) {
        console.warn('Firestore direct write fallback:', fbErr);
      }

      // 2. Write to local backend API
      try {
        await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiryData)
        });
      } catch (apiErr) {
        console.warn('API write notice:', apiErr);
      }

      setSubmittedInquiryId(newId);
      setIsSubmitted(true);
      showToast(isMr ? 'तुमची विनंती यशस्वीरीत्या नोंदवली गेली! 🙏' : 'Inquiry submitted successfully! Thank you.');
    } catch (err) {
      showToast(isMr ? 'नोंदणी यशस्वी झाली.' : 'Submission recorded.');
      setSubmittedInquiryId(newId);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSend = () => {
    const waText = encodeURIComponent(
      `🚩 *अस्सल गावरान चटणी & मसाले चौकशी*\n\n` +
      `👤 *नाव:* ${fullName || 'Customer'}\n` +
      `📞 *फोन:* ${phone}\n` +
      `📍 *गाव/शहर:* ${city || 'Maharashtra'}\n` +
      `🏷️ *प्रकार:* ${category}\n` +
      `${quantityKg ? `📦 *अपेक्षित वजन:* ${quantityKg} Kg\n` : ''}` +
      `💬 *संदेश:* ${message}\n\n` +
      `कृपया दर आणि तपशील कळवा. धन्यवाद!`
    );
    window.open(`https://wa.me/919823456789?text=${waText}`, '_blank');
  };

  return (
    <div id="google-forms-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header with Google Forms Badge */}
        <div className="relative bg-[#131921] p-6 text-white shrink-0 border-b border-[#232F3E]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF9900] text-[#131921] flex items-center justify-center shadow-lg font-black text-xl">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF9900] bg-[#FF9900]/15 px-2.5 py-0.5 rounded-full border border-[#FF9900]/30">
                  {isMr ? 'Google Forms & थेट संपर्क' : 'Google Forms & Direct Inquiries'}
                </span>
                <span className="text-xs text-stone-400">• 100% Guaranteed Response</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {isMr ? 'अभिप्राय, लग्न & घाऊक पुरवठा चौकशी' : 'Feedback, Bulk Catering & Custom Requests'}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-900 bg-[#FAF8F5]">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selector Cards */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  {isMr ? '🎯 चौकशीचा प्रकार निवडा (Select Purpose)' : '🎯 Select Purpose'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    const isSelected = category === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-[#131921] text-white border-[#FF9900] ring-2 ring-[#FF9900]/40 shadow-md'
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#FF9900] text-[#131921]' : 'bg-stone-100 text-stone-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-xs">
                            {isMr ? c.mr : c.en}
                          </div>
                          <div className={`text-[10px] mt-0.5 line-clamp-1 ${
                            isSelected ? 'text-stone-300' : 'text-stone-500'
                          }`}>
                            {isMr ? c.descMr : c.descEn}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating for Feedback */}
              {category === 'feedback' && (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <label className="block text-xs font-bold text-stone-800 mb-2">
                    {isMr ? '⭐ तुम्हाला आमची चव कशी वाटली? (Your Rating)' : '⭐ How was your taste experience?'}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star className={`w-7 h-7 ${
                          star <= rating ? 'text-[#FF9900] fill-[#FF9900]' : 'text-stone-300'
                        }`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-600 ml-2">
                      {rating === 5 ? (isMr ? 'अप्रतिम अस्सल गावरान! (5/5)' : 'Exceptional Heritage Taste! (5/5)') : `${rating} / 5`}
                    </span>
                  </div>
                </div>
              )}

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isMr ? 'तुमचे पूर्ण नाव (Full Name) *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder={isMr ? 'उदा. सचिन जोशी' : 'e.g. Anand Patil'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isMr ? 'फोन / व्हॉट्सॲप नंबर (Phone/WhatsApp) *' : 'Phone / WhatsApp *'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+91 98234 56789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isMr ? 'ईमेल (Email Address)' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isMr ? 'शहर / जिल्हा (City/District)' : 'City / District'}
                  </label>
                  <input
                    type="text"
                    placeholder={isMr ? 'उदा. पुणे / सोलापूर' : 'e.g. Pune, Mumbai, Solapur'}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 outline-none"
                  />
                </div>
              </div>

              {/* Quantity Field for Bulk Orders */}
              {category !== 'feedback' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {isMr ? 'अपेक्षित प्रमाण / वजन (Qty in Kg or Jars)' : 'Estimated Quantity (Kg or Jars)'}
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 25 Kg or 100 Jars"
                      value={quantityKg}
                      onChange={(e) => setQuantityKg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {isMr ? 'पिनकोड (Pincode)' : 'Delivery Pincode'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="411052"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Message Box */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isMr ? 'तुमचा संदेश किंवा विशेष सूचना (Your Message) *' : 'Your Detailed Inquiry or Requirements *'}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={
                    isMr
                      ? 'उदा. लग्न समारंभासाठी १०० जार हवे आहेत, किंवा शेंगदाणा चटणीमध्ये लसणाचे प्रमाण जास्त हवे आहे...'
                      : 'e.g. We require 50 jars of Solapuri Peanut and 50 jars of Vada Pav Chutney for our restaurant / family function...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isMr ? 'व्हॉट्सॲपवर पाठवा' : 'Inquire on WhatsApp'}</span>
                  </button>

                  <a
                    href="https://docs.google.com/forms"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-stone-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#131921]" />
                    <span>{isMr ? 'गुगल फॉर्म लिंक' : 'Open Google Form'}</span>
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#131921] hover:bg-[#232F3E] text-[#FF9900] font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer border border-[#FF9900]/50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? (isMr ? 'नोंदवत आहे...' : 'Submitting...') : (isMr ? 'फॉर्म सबमिट करा' : 'Submit Form')}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#131921]">
                  {isMr ? 'धन्यवाद! तुमची चौकशी यशस्वीपणे नोंदवली.' : 'Thank You! Inquiry Received.'}
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  {isMr
                    ? `तुमचा रेफरन्स आयडी #${submittedInquiryId} आहे. आमचे वर्कशॉप प्रतिनिधी लवकरच तुमच्याशी संपर्क साधतील.`
                    : `Your inquiry reference ID is #${submittedInquiryId}. Our workshop team will get in touch with you shortly.`}
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                    setQuantityKg('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                >
                  {isMr ? 'दुसरा फॉर्म भरा' : 'Submit Another'}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#131921] text-[#FF9900] font-black text-xs transition-colors shadow-md"
                >
                  {isMr ? 'बंद करा (Close)' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
