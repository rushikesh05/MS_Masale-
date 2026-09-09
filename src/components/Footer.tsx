import React from 'react';
import { ShieldCheck, Leaf, Heart, Phone, Mail, MapPin, Building2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { setIsBulkRequestModalOpen } = useApp();

  return (
    <footer className="relative bg-stone-950 text-stone-300 border-t border-stone-800/80 mt-24">
      {/* Subtle floating background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-red-900/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" inverted={true} />
            <p className="text-xs text-stone-400 leading-relaxed">
              Artisanal stone-crushed Maharashtrian condiments, signature spices, and cold-pressed authentic blends crafted in pure small batches.
            </p>

            {/* Minimal Brand Quality Seal */}
            <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>100% Stone-Pounded Purity</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Slow-roasted whole spices crushed in traditional stone mortar (khalbatta) to preserve natural aromatic essential oils.
              </p>
            </div>

            <div className="text-[11px] text-stone-400 font-mono">
              FSSAI Lic. No: 11524036000492 • MS Masale Pvt Ltd
            </div>
          </div>

          {/* Signature Specialties */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-stone-100 tracking-wide">
              Signature Varieties
            </h4>
            <ul className="text-xs text-stone-400 space-y-2.5">
              <li className="hover:text-stone-200 transition-colors cursor-pointer">• Gavran Kanda-Lasun Chutney (Kolhapur)</li>
              <li className="hover:text-stone-200 transition-colors cursor-pointer">• Dry Coconut Garlic Vada Pav Chutney (Mumbai)</li>
              <li className="hover:text-stone-200 transition-colors cursor-pointer">• Solapuri Peanut Chutney (Solapur)</li>
              <li className="hover:text-stone-200 transition-colors cursor-pointer">• Roasted Sesame Seed Chutney (Vidarbha)</li>
              <li className="hover:text-stone-200 transition-colors cursor-pointer">• Omega-3 Golden Flaxseed Chutney (Wellness)</li>
              <li className="hover:text-stone-200 transition-colors cursor-pointer">• Artisan Gavran Kala Masala (Khandesh)</li>
            </ul>
          </div>

          {/* Customer Care & Quality */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-stone-100 tracking-wide">
              Purity & Assurance
            </h4>
            <ul className="text-xs text-stone-400 space-y-2.5">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Stone-Mortar Crushed Authenticity</span>
              </li>
              <li className="flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pure Wood Cold-Pressed Edible Oils</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Artificial Colours & Preservatives</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hygienic Airtight Glass Jar Packing</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => setIsBulkRequestModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-200 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow hover:-translate-y-0.5"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>B2B Wholesale / Bulk Supply</span>
              </button>
            </div>
          </div>

          {/* Contact & Workshop */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-stone-100 tracking-wide">
              Workshop & Enquiries
            </h4>
            <div className="text-xs text-stone-400 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  MS Masale Food Park, Plot No. 12, Baner-Mhalunge Road, Pune, Maharashtra - 411045
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98234 56789 / 020-27290144</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>orders@msmasale.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} MS Masale. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-stone-400">
            <span>Crafted with pride in Maharashtra • MS Masale</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
