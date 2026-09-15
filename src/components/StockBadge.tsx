import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StockInfo } from '../lib/stockHelper';

interface StockBadgeProps {
  stockInfo: StockInfo;
  isMarathi?: boolean;
  variant?: 'compact' | 'inline' | 'detailed';
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  stockInfo,
  isMarathi = false,
  variant = 'compact',
  className = ''
}) => {
  const { status, stockCount, isLowStock, isOutOfStock, badgeTextEn, badgeTextMr, detailTextEn, detailTextMr, urgencyLevel } = stockInfo;

  if (isOutOfStock) {
    return (
      <div
        id="product-stock-out"
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-stone-100 text-stone-600 border border-stone-200/80 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
        <span className="truncate">{isMarathi ? badgeTextMr : badgeTextEn}</span>
      </div>
    );
  }

  if (isLowStock) {
    const isVeryLow = urgencyLevel === 'high';
    return (
      <div
        id="product-stock-low"
        title={isMarathi ? detailTextMr : detailTextEn}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold tracking-tight transition-all duration-300 ${
          isVeryLow
            ? 'bg-rose-50 text-rose-800 border border-rose-300/80 shadow-2xs'
            : 'bg-amber-50 text-amber-900 border border-amber-300/80 shadow-2xs'
        } ${className}`}
      >
        {/* Subtle pulsing live indicator */}
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isVeryLow ? 'bg-rose-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${
              isVeryLow ? 'bg-rose-500' : 'bg-amber-500'
            }`}
          />
        </span>

        <span className="truncate">
          {isMarathi ? badgeTextMr : badgeTextEn}
        </span>

        {variant === 'detailed' && (
          <span className="hidden sm:inline text-[9px] opacity-80 pl-1 border-l border-amber-300/60 font-medium">
            {isMarathi ? 'ताजी बॅच संपण्यापूर्वी' : 'Fresh batch'}
          </span>
        )}
      </div>
    );
  }

  // In Stock
  return (
    <div
      id="product-stock-in"
      title={isMarathi ? detailTextMr : detailTextEn}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 transition-colors ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
      <span className="truncate">{isMarathi ? badgeTextMr : badgeTextEn}</span>
      {variant === 'detailed' && (
        <span className="hidden sm:inline text-[9px] text-emerald-700/80 pl-1 border-l border-emerald-300/60">
          {isMarathi ? 'ताजी घाणी' : 'Fresh batch'}
        </span>
      )}
    </div>
  );
};
