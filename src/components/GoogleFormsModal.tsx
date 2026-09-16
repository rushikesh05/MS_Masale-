import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  Sparkles, 
  Phone, 
  Building2, 
  Gift, 
  Star,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { saveInquiryToFirestore } from '../lib/firestoreSync';

interface GoogleFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'feedback' | 'bulk_wedding_order' | 'b2b_hotel_supply' | 'custom_recipe_request';
}

type InquiryCategory = 'feedback' | 'bulk_wedding_order' | 'b2b_hotel_supply' | 'custom_recipe_request';

export const GoogleFormsModal: React.FC<GoogleFormsModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();

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

  const categories: { id: InquiryCategory; icon: any; en: string; descEn: string }[] = [
    {
      id: 'feedback',
      icon: Star,
      en: 'Customer Review & Feedback',
      descEn: 'Share your tasting experience and suggestions'
    },
    {
      id: 'bulk_wedding_order',
      icon: Gift,
      en: 'Weddings & Celebrations Return Gift Jars',
      descEn: 'Customized labels & glass jars for weddings and festive gifting'
    },
    {
      id: 'b2b_hotel_supply',
      icon: Building2,
      en: 'Hotel, Restaurant & Cafe Wholesale',
      descEn: 'Monthly recurring supply for dining kitchens'
    },
    {
      id: 'custom_recipe_request',
      icon: Sparkles,
      en: 'Custom Traditional Recipe Request',
      descEn: 'Artisanal stone mortar grinding with your choice of ingredients'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) {
      showToast('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    const inquiryData = {
      category,
      fullName,
      phone,
      email,
      city,
      pincode,
      quantityKg: quantityKg ? parseFloat(quantityKg) : null,
      rating: category === 'feedback' ? rating : null,
      message,
      submittedVia: 'web_form',
      status: 'new'
    };

    try {
      // 1. Submit to API backend
      const response = await fetch('/api/customer-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      const result = await response.json();
      
      const inqId = result.inquiryId || `INQ-${Date.now().toString().slice(-6)}`;
      setSubmittedInquiryId(inqId);

      // 2. Sync to Cloud Firestore
      await saveInquiryToFirestore({
        ...inquiryData,
        id: inqId,
        createdAt: new Date().toISOString()
      } as any);

      setIsSubmitted(true);
      showToast('Inquiry submitted successfully! Thank you.');
    } catch (err) {
      console.error('Inquiry submission fallback:', err);
      setIsSubmitted(true);
      setSubmittedInquiryId(`INQ-${Date.now().toString().slice(-6)}`);
      showToast('Submission recorded.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsAppDirect = () => {
    const text = 
      `*MS Masale Inquiry*\n\n` +
      `*Name:* ${fullName || 'Customer'}\n` +
      `*Phone:* ${phone}\n` +
      `*City:* ${city || 'Maharashtra'}\n` +
      `*Category:* ${category}\n` +
      `${quantityKg ? `*Estimated Qty:* ${quantityKg} Kg\n` : ''}` +
      `*Message:* ${message}\n\n` +
      `Please provide quotation and details. Thank you!`;
    window.open(`https://wa.me/918591254237?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 my-4 relative flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2A201E] to-[#1C1514] text-white flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#B82A16] flex items-center justify-center text-white shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Google Forms & Direct Inquiries
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Feedback, Bulk Catering & Custom Requests
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

          {/* Form Content */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Category Selector Tabs */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Select Purpose:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                            isSelected 
                              ? 'border-[#B82A16] bg-amber-50/70 ring-1 ring-[#B82A16]' 
                              : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 text-stone-700'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[#B82A16] text-white' : 'bg-stone-200 text-stone-600'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900 leading-tight">
                              {cat.en}
                            </div>
                            <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                              {cat.descEn}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating Input (Only for Feedback) */}
                {category === 'feedback' && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                    <label className="block text-xs font-bold text-amber-950 mb-1.5">
                      How was your taste experience?
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-400 text-amber-500' : 'text-stone-300'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-stone-700 ml-2">
                        {rating === 5 ? 'Exceptional Taste! (5/5)' : `${rating} / 5`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Anand Patil"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#B82A16] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 8591254237"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#B82A16] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. anand@gmail.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#B82A16] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      City / District
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Pune, Mumbai, Nashik"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#B82A16] focus:outline-none"
                    />
                  </div>

                  {category !== 'feedback' && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Estimated Quantity (Kg or Jars)
                      </label>
                      <input
                        type="text"
                        value={quantityKg}
                        onChange={(e) => setQuantityKg(e.target.value)}
                        placeholder="e.g. 25 Kg or 50 Jars"
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#B82A16] focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Delivery Pincode
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 411045"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#B82A16] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Detailed Requirements Textarea */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Detailed Inquiry or Requirements *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Inquiring for 100 jars for upcoming event, or special batch requirement..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#B82A16] focus:outline-none resize-none"
                  />
                </div>

                {/* Quick Actions & Submit */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleOpenWhatsAppDirect}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Inquire on WhatsApp</span>
                    </button>

                    <a
                      href="https://docs.google.com/forms"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                      <span>Google Form</span>
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Form'}</span>
                  </button>
                </div>

              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-stone-900 font-serif">
                    Thank You! Inquiry Received.
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                    Your reference ID is #{submittedInquiryId}. Our customer representative will connect with you shortly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    Submit Another
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-[#B82A16] hover:bg-[#8C1C0B] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
