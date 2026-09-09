import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Leaf, Award, ShieldCheck, Heart, ChefHat } from 'lucide-react';

interface FloatingTextsVisualsProps {
  onTagClick?: (tag: string) => void;
}

interface FloatingBadge {
  id: string;
  mr: string;
  en: string;
  subtext?: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  floatDuration: number;
  delay: number;
}

const FLOATING_BADGES: FloatingBadge[] = [
  {
    id: 'stone-crushed',
    mr: 'दगडी खलबत्ता',
    en: '100% Stone-Crushed',
    subtext: 'पारंपारिक कुटाई',
    icon: Sparkles,
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50/90 dark:bg-amber-950/40',
    border: 'border-amber-200/80 dark:border-amber-800/40',
    floatDuration: 5.5,
    delay: 0
  },
  {
    id: 'wood-pressed',
    mr: 'लाकडी घाणा',
    en: 'Cold Wood-Pressed Oil',
    subtext: 'शुद्ध शेंगदाणा तेल',
    icon: Leaf,
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/40',
    border: 'border-emerald-200/80 dark:border-emerald-800/40',
    floatDuration: 6.2,
    delay: 0.8
  },
  {
    id: 'rustic-heat',
    mr: 'अस्सल गावरान',
    en: 'Pure Rustic Flavors',
    subtext: 'कोल्हापुरी व खानदेशी',
    icon: Flame,
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50/90 dark:bg-rose-950/40',
    border: 'border-rose-200/80 dark:border-rose-800/40',
    floatDuration: 4.8,
    delay: 1.2
  },
  {
    id: 'zero-preservatives',
    mr: 'शून्य प्रिझर्व्हेटिव्ह्ज',
    en: 'Zero Chemical Preservatives',
    subtext: '100% नैसर्गिक घटक',
    icon: ShieldCheck,
    color: 'text-stone-700 dark:text-stone-300',
    bg: 'bg-stone-50/90 dark:bg-stone-900/50',
    border: 'border-stone-200/90 dark:border-stone-700/50',
    floatDuration: 5.8,
    delay: 0.4
  },
  {
    id: 'goda-peshwai',
    mr: 'पेशवाई गोडा मसाला',
    en: 'Royal Stone-Flower Aroma',
    subtext: 'दगडफूल व साजूक तूप',
    icon: Award,
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-50/90 dark:bg-orange-950/40',
    border: 'border-orange-200/80 dark:border-orange-800/40',
    floatDuration: 6.5,
    delay: 1.5
  },
  {
    id: 'handmade-batches',
    mr: 'लहान बॅचेस',
    en: 'Small Batch Roasted',
    subtext: 'दररोज ताजे तयार',
    icon: ChefHat,
    color: 'text-amber-800 dark:text-amber-200',
    bg: 'bg-amber-100/60 dark:bg-amber-950/30',
    border: 'border-amber-300/60 dark:border-amber-700/40',
    floatDuration: 5.2,
    delay: 0.6
  }
];

const STREAMING_WORDS = [
  '• अस्सल सोलापुरी शेंगदाणा चटणी',
  '• कोकणी २८ मसाल्यांचा मालवणी मसाला',
  '• खानदेशी शेव भाजी काळा मसाला',
  '• गावरान राजापुरी हळद',
  '• दगडफूल व नाकेश्वर सुगंध',
  '• कोल्हापुरी संकेश्वरी लवंगी मिरची',
  '• लाकडी घाण्याचे शुद्ध तेल',
  '• घरगुती पाचक मेतकूट',
  '• विदर्भ सावजी रस्सा मसाला',
  '• आजीच्या हाताची पारंपरिक चव'
];

export const FloatingTextsVisuals: React.FC<FloatingTextsVisualsProps> = ({ onTagClick }) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleTagClick = (id: string, text: string) => {
    setActiveTag(id);
    if (onTagClick) onTagClick(text);
    setTimeout(() => setActiveTag(null), 2000);
  };

  return (
    <div className="relative w-full overflow-hidden py-2 sm:py-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Streamlined Ambient Culinary Ticker */}
      <div className="relative flex overflow-x-hidden whitespace-nowrap py-2 px-3 rounded-2xl border border-stone-200/80 bg-white shadow-2xs">
        <motion.div 
          className="flex gap-8 items-center text-xs font-medium text-stone-600 tracking-wide"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
        >
          {[...STREAMING_WORDS, ...STREAMING_WORDS].map((word, idx) => (
            <span 
              key={idx} 
              onClick={() => onTagClick && onTagClick(word.replace('• ', '').trim())}
              className="flex items-center gap-2 hover:text-[#C2410C] transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]"></span>
              {word}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Compact, clean horizontal badge pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
        {FLOATING_BADGES.map((badge) => {
          const Icon = badge.icon;
          const isSelected = activeTag === badge.id;

          return (
            <button
              key={badge.id}
              onClick={() => handleTagClick(badge.id, badge.en)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-2xs hover:border-stone-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#C2410C]" />
              <span className="font-semibold text-stone-900">{badge.mr}</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600 text-[11px]">{badge.en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
