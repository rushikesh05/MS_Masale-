import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5ECE0] text-stone-700 border-t border-amber-200/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <BrandLogo size="md" inverted={false} />
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Authentic Maharashtrian spices, masalas, and condiments made with quality ingredients and traditional recipes.
            </p>
            <div className="text-[11px] text-amber-900 font-mono font-bold">
              FSSAI Lic. No: 11524036000492
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-sm text-stone-900 tracking-wide">
              Popular Items
            </h4>
            <ul className="text-xs text-stone-600 space-y-2">
              <li>• Kolhapuri Kanda Lasun Masala</li>
              <li>• Gavran Kala Masala</li>
              <li>• Solapuri Shengdana Chutney</li>
              <li>• Malvani Masala</li>
              <li>• Authentic Goda Masala</li>
              <li>• Traditional Mango Pickle</li>
            </ul>
          </div>

          {/* Contact & Ordering */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900 tracking-wide">
              Contact Us
            </h4>
            <div className="text-xs text-stone-700 space-y-2.5">
              <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="tel:8591254237" className="hover:underline">
                  8591254237
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-stone-600">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Pune, Maharashtra, India
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-600">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span>contact@msmasale.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-amber-200/70 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} MS Masale. All rights reserved.
          </div>
          <div className="text-stone-600">
            For orders & enquiries: <a href="tel:8591254237" className="text-amber-900 font-bold hover:underline">8591254237</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
