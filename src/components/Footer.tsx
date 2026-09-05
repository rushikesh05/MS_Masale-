import React from 'react';
import { ShieldCheck, Leaf, Heart, Phone, Mail, MapPin, Building2, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { language, setUserRole, setIsBulkRequestModalOpen, setIsFeedbackModalOpen } = useApp();
  const isMr = language === 'mr';

  return (
    <footer className="bg-[#1E1717] text-white border-t border-[#3A2E2E] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo isMarathi={isMr} size="md" inverted={true} />
            <p className="text-xs text-gray-300 leading-relaxed">
              {isMr
                ? 'महाराष्ट्राच्या प्रत्येक घराची अस्सल चव. दगडी खलबत्त्यात कुटलेली आणि लाकडी घाण्याच्या शुद्ध तेलात परतून बनवलेली अस्सल घरगुती चटणी व स्पेशल मसाले.'
                : 'Preserving Maharashtra’s culinary heritage through authentic stone-pounded condiments, signature masale, and wood cold-pressed oils.'}
            </p>

            {/* MS Full Form Heritage Badge */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#C84B31]/10 to-transparent border border-amber-400/40 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs">
                <span>👑</span>
                <span>{isMr ? 'MS चा पूर्ण विस्तार:' : 'MS Full Form:'}</span>
                <span className="text-white font-black underline decoration-amber-400 underline-offset-2">
                  {isMr ? 'मंगल सुवर्णा मसाले' : 'Mangal Suvarna Masale'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                {isMr
                  ? 'श्रीमती मंगल आणि श्रीमती सुवर्णा यांच्या पारंपरिक हातच्या चवीचा व आजीच्या दगडी खलबत्ता कुटाईचा अभिमानास्पद वारसा.'
                  : 'Founded on the revered culinary heritage and stone-pounded secret recipes of Smt. Mangal & Smt. Suvarna.'}
              </p>
            </div>

            <div className="text-[11px] text-amber-300 font-mono">
              FSSAI Lic. No: 11524036000492 • MS Masale Pvt Ltd
            </div>
          </div>

            {/* Heritage Specialties */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-amber-400 font-brand">
                {isMr ? 'पारंपरिक खमंग प्रकार' : 'Signature Varieties'}
              </h4>
              <ul className="text-xs text-gray-300 space-y-2">
                <li>• {isMr ? 'गावरान कांदा-लसूण चटणी (कोल्हापूर)' : 'Gavran Kanda-Lasun Chutney (Kolhapur)'}</li>
                <li>• {isMr ? 'सुके खोबरे लसूण वडापाव चटणी (मुंबई)' : 'Dry Coconut Garlic Vada Pav Chutney (Mumbai)'}</li>
                <li>• {isMr ? 'सोलापुरी शेंगदाणा चटणी (सोलापूर)' : 'Solapuri Peanut Chutney (Solapur)'}</li>
                <li>• {isMr ? 'खमंग भाजलेली तीळ चटणी (विदर्भ)' : 'Roasted Sesame Seed Chutney (Vidarbha)'}</li>
                <li>• {isMr ? 'ओमेगा-३ युक्त जवसाची चटणी (आरोग्य)' : 'Omega-3 Flaxseed Chutney (Wellness)'}</li>
                <li>• {isMr ? 'खास गावरान काळा मसाला (खान्देश)' : 'Artisan Gavran Kala Masala (Khandesh)'}</li>
              </ul>
            </div>

            {/* Customer Care & Assurance */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-amber-400 font-brand">
                {isMr ? 'ग्राहक सेवा & गुणवत्ता' : 'Customer Care & Purity'}
              </h4>
              <ul className="text-xs text-gray-300 space-y-2">
                <li>• {isMr ? '१००% दगडी खलबत्त्यात कुटलेली अस्सल चव' : '100% Stone-Mortar Crushed Authencity'}</li>
                <li>• {isMr ? 'लाकडी घाण्याचे शुद्ध खाद्यतेल वापर' : 'Pure Wood Cold-Pressed Oils Used'}</li>
                <li>• {isMr ? 'शून्य कृत्रिम रंग, रसायने व प्रिजर्व्हेटिव्ह' : 'Zero Artificial Colors & Preservatives'}</li>
                <li>• {isMr ? 'हवाबंद काचेच्या बरणीत सुरक्षित पॅकिंग' : 'Hygienic Airtight Glass Jar Packing'}</li>
                <li>• {isMr ? 'संपूर्ण महाराष्ट्रात सुपरफास्ट होम डिलिव्हरी' : 'Express Delivery Across Maharashtra'}</li>
                <li>• {isMr ? 'FSSAI मानांकित व स्वच्छ लॅब चाचणी' : 'FSSAI Certified & Lab Tested'}</li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => setIsBulkRequestModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{isMr ? 'हॉटेल & केटरर्स होलसेल मागणी' : 'B2B Wholesale / Bulk Supply'}</span>
                </button>
              </div>
            </div>

            {/* Contact & Workshop */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-amber-400 font-brand">
                {isMr ? 'वर्कशॉप & संपर्क' : 'Artisanal Workshop'}
              </h4>
              <div className="text-xs text-gray-300 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C84B31] shrink-0 mt-0.5" />
                  <span>
                    {isMr
                      ? 'MS मसाले संकुल (मंगल सुवर्णा मसाले), प्लॉट क्र. १२, बाणेर-म्हाळुंगे रोड, पुणे, महाराष्ट्र - ४११०४५'
                      : 'MS Masale Complex (Mangal Suvarna Masale), Plot No. 12, Baner-Mhalunge Road, Pune, MH - 411045'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400 shrink-0" />
                  <span>+91 98234 56789 / 020-27290144</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>orders@msmasale.com</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom copyright */}
          <div className="pt-8 border-t border-[#3A2E2E] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <div>
              {isMr 
                ? `© ${new Date().getFullYear()} MS Masale (मंगल सुवर्णा मसाले - Mangal Suvarna Masale). सर्व हक्क राखीव.` 
                : `© ${new Date().getFullYear()} MS Masale (Mangal Suvarna Masale). All rights reserved.`}
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <span>{isMr ? 'महाराष्ट्रात प्रेमाने निर्मित • MS मसाले' : 'Crafted with pride in Maharashtra, India • MS Masale'}</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </div>
          </div>
      </div>
    </footer>
  );
};
