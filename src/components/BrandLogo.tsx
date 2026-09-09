import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  inverted = false,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: {
      crest: 'w-8 h-8',
      title: 'text-sm sm:text-base',
      subtitle: 'text-[10px]',
      badge: 'text-[9px] px-2 py-0.5'
    },
    md: {
      crest: 'w-10 h-10 sm:w-11 sm:h-11',
      title: 'text-base sm:text-lg',
      subtitle: 'text-[11px]',
      badge: 'text-[9px] px-2.5 py-0.5'
    },
    lg: {
      crest: 'w-13 h-13 sm:w-14 sm:h-14',
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-xs',
      badge: 'text-[10px] px-3 py-1'
    },
    xl: {
      crest: 'w-16 h-16 sm:w-20 sm:h-20',
      title: 'text-2xl sm:text-3xl',
      subtitle: 'text-sm',
      badge: 'text-xs px-3.5 py-1'
    }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      title="MS Masale - Artisanal Spices & Chutneys"
    >
      {/* Minimal Floating Crest Emblem */}
      <div className="relative shrink-0">
        {/* Soft Ambient Floating Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-500/30 to-amber-500/30 opacity-40 blur-xs group-hover:opacity-80 transition-opacity" />

        {/* Minimal Monogram Container */}
        <div
          className={`${currentSize.crest} relative rounded-2xl bg-gradient-to-br from-stone-900 via-[#801414] to-stone-950 text-white flex items-center justify-center shadow-md border border-stone-700/40 group-hover:scale-105 transition-all duration-300 overflow-hidden`}
        >
          {/* Concentric subtle circular rings */}
          <svg
            className="absolute inset-0 w-full h-full opacity-15"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" />
          </svg>

          {/* Minimal 'MS' Monogram */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="font-serif font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 text-[13px] sm:text-[15px]">
              MS
            </span>
            <span className="text-[7px] uppercase tracking-widest text-amber-300/80 font-bold -mt-0.5">
              Spice
            </span>
          </div>
        </div>
      </div>

      {/* Brand Name & Minimal Tagline */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          {/* Main Brand Title: MS Masale */}
          <span
            className={`${currentSize.title} font-black tracking-tight flex items-center gap-1.5 leading-none`}
          >
            <span
              className={
                inverted
                  ? 'text-white'
                  : 'text-stone-900'
              }
            >
              MS Masale
            </span>
          </span>

          {/* Minimal Artisanal Badge */}
          <span
            className={`${currentSize.badge} rounded-full font-medium tracking-wide ${
              inverted
                ? 'bg-stone-800 text-stone-200 border border-stone-700'
                : 'bg-stone-100 text-stone-700 border border-stone-200/80'
            }`}
          >
            Artisanal
          </span>
        </div>

        {showTagline && (
          <div className={`${currentSize.subtitle} ${inverted ? 'text-stone-400' : 'text-stone-500'} font-normal tracking-normal mt-0.5`}>
            Stone-Crushed Heritage Spices
          </div>
        )}
      </div>
    </div>
  );
};

