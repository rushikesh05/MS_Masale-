import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showFullForm?: boolean;
  isMarathi?: boolean;
  inverted?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  showFullForm = false,
  isMarathi = true,
  inverted = false,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: {
      crest: 'w-9 h-9',
      title: 'text-sm sm:text-base',
      subtitle: 'text-[9px]',
      badge: 'text-[8px] px-1.5 py-0.2',
      fullForm: 'text-[8px]'
    },
    md: {
      crest: 'w-11 h-11 sm:w-12 sm:h-12',
      title: 'text-lg sm:text-xl',
      subtitle: 'text-[10px] sm:text-[11px]',
      badge: 'text-[9px] sm:text-[10px] px-2 py-0.5',
      fullForm: 'text-[10px]'
    },
    lg: {
      crest: 'w-14 h-14 sm:w-16 sm:h-16',
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-xs',
      badge: 'text-[10px] sm:text-[11px] px-2.5 py-0.5',
      fullForm: 'text-xs'
    },
    xl: {
      crest: 'w-20 h-20 sm:w-24 sm:h-24',
      title: 'text-2xl sm:text-3xl',
      subtitle: 'text-sm',
      badge: 'text-xs px-3 py-1',
      fullForm: 'text-sm'
    }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      title="MS Masale - मंगल सुवर्णा मसाले"
    >
      {/* Royal Insignia / Crest for MS Masale */}
      <div className="relative shrink-0">
        {/* Ambient Warm Golden Aura Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-[#C84B31] to-red-600 opacity-60 blur-xs group-hover:opacity-95 transition-opacity" />

        {/* Master Seal Container */}
        <div
          className={`${currentSize.crest} relative rounded-2xl bg-gradient-to-br from-[#801414] via-[#520909] to-[#250404] text-white flex items-center justify-center shadow-xl border-2 border-amber-400/70 group-hover:scale-105 transition-transform overflow-hidden`}
        >
          {/* Subtle concentric decorative gold ring pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="46" stroke="#F6D55C" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="41" stroke="#F6D55C" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="37" stroke="#F6D55C" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
          </svg>

          {/* Luxury Vector Monogram & Khalbatta Emblem */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-1 text-center">
            {/* Crown / Heritage Flame Top Accent */}
            <div className="flex items-center justify-center -mb-0.5">
              <svg className="w-3.5 h-2.5 sm:w-4 sm:h-3 text-amber-300 drop-shadow" viewBox="0 0 24 16" fill="currentColor">
                <path d="M12 0L15 6L21 2L19 14H5L3 2L9 6L12 0Z" />
              </svg>
            </div>

            {/* Regal Intertwined 'MS' Monogram */}
            <div className="font-serif font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2B2] via-[#F4B41A] to-[#D67C00] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] flex items-center justify-center">
              <span className="text-[13px] sm:text-[15px] font-extrabold tracking-tight">M</span>
              <span className="text-[14px] sm:text-[16px] font-black -ml-0.5 text-amber-300">S</span>
            </div>

            {/* Stone Mortar & Pestle (दगडी खलबत्ता) Bottom Vector Accent */}
            <div className="flex items-center justify-center -mt-0.5 text-amber-400">
              <svg className="w-4 h-3 sm:w-4.5 sm:h-3.5 drop-shadow" viewBox="0 0 32 20" fill="currentColor">
                {/* Pestle / Khalbatta Danda */}
                <path d="M19 2L24 7L18 10L14 4L19 2Z" fill="#FCE77D" opacity="0.9" />
                {/* Heavy Stone Mortar Body */}
                <path d="M4 8C4 6.8 5 6 6.5 6H25.5C27 6 28 6.8 28 8L26 15C25.5 17.5 22 19 16 19C10 19 6.5 17.5 6 15L4 8Z" fill="#F4B41A" />
                <ellipse cx="16" cy="8" rx="10" ry="2.5" fill="#801414" />
                {/* Crushed Spices Glow */}
                <circle cx="16" cy="8" r="1.5" fill="#FF5252" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Name & Traditional Tagline */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Main Brand Title: MS Masale */}
          <span
            className={`${currentSize.title} font-black font-brand tracking-tight flex items-center gap-1.5 leading-none`}
          >
            <span
              className={
                inverted
                  ? 'text-white drop-shadow-xs font-black'
                  : 'bg-gradient-to-r from-[#241C1C] via-[#801B05] to-[#C84B31] bg-clip-text text-transparent font-black'
              }
            >
              {isMarathi ? 'MS मसाले' : 'MS Masale'}
            </span>
          </span>

          {/* Premium Heritage Badge */}
          <span
            className={`${currentSize.badge} rounded-full ${
              inverted
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#131921] font-black shadow-xs'
                : 'bg-gradient-to-r from-[#801414] to-[#C84B31] text-white font-black'
            } tracking-wide shadow-xs shrink-0 flex items-center gap-1`}
          >
            <span>🚩</span>
            <span>{isMarathi ? 'अस्सल गावरान' : 'Gavran Authentic'}</span>
          </span>
        </div>

        {/* Full Form Heritage Legend */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`${currentSize.fullForm} font-bold ${
              inverted ? 'text-amber-300' : 'text-[#801414]'
            } tracking-tight leading-tight`}
          >
            {isMarathi ? 'मंगल सुवर्णा मसाले' : 'Mangal Suvarna Masale'}
          </span>

          {showTagline && (
            <>
              <span className={`text-[10px] ${inverted ? 'text-stone-500' : 'text-stone-300'}`}>•</span>
              <span
                className={`${currentSize.subtitle} ${
                  inverted ? 'text-stone-300' : 'text-[#7A6A60]'
                } font-medium tracking-normal`}
              >
                {isMarathi ? 'दगडी खलबत्त्यातील चव' : 'Stone-Pounded Taste'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

