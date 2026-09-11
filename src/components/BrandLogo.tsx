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
  inverted = false,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: {
      crest: 'w-8 h-8',
      title: 'text-base sm:text-lg',
    },
    md: {
      crest: 'w-10 h-10',
      title: 'text-lg sm:text-xl',
    },
    lg: {
      crest: 'w-12 h-12',
      title: 'text-2xl',
    },
    xl: {
      crest: 'w-16 h-16',
      title: 'text-3xl',
    }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      title="MS Masale"
    >
      {/* Classic Crest Emblem */}
      <div
        className={`${currentSize.crest} relative rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white flex items-center justify-center shadow-xs border border-orange-400/40 shrink-0 font-serif font-black tracking-tight leading-none text-[15px] sm:text-[17px]`}
      >
        MS
      </div>

      {/* Brand Name: Strictly MS Masale */}
      <div className="flex items-center">
        <span
          className={`${currentSize.title} font-serif font-black tracking-tight leading-none ${
            inverted ? 'text-white' : 'text-stone-900'
          }`}
        >
          MS Masale
        </span>
      </div>
    </div>
  );
};
