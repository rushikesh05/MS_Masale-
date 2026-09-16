import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Flame, 
  IndianRupee, 
  Star, 
  Sparkles, 
  Filter, 
  X, 
  RotateCcw, 
  ChevronDown,
  Check,
  Award,
  SlidersHorizontal
} from 'lucide-react';

export type SortOption = 
  | 'popular' 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating';

export type PriceFilterOption = 
  | 'all' 
  | 'under-100' 
  | '100-200' 
  | '200-300' 
  | '300-plus';

export type HeatFilterOption = 
  | 'all';

export type PopularityFilterOption = 
  | 'all' 
  | 'bestsellers' 
  | 'top-rated';

interface CategorySortFilterControlProps {
  category: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  priceFilter: PriceFilterOption;
  onPriceFilterChange: (price: PriceFilterOption) => void;
  heatFilter?: HeatFilterOption;
  onHeatFilterChange?: (heat: HeatFilterOption) => void;
  popularityFilter: PopularityFilterOption;
  onPopularityFilterChange: (popularity: PopularityFilterOption) => void;
  filteredCount: number;
  totalCount: number;
  onResetAll: () => void;
}

export const CategorySortFilterControl: React.FC<CategorySortFilterControlProps> = ({
  category,
  sortBy,
  onSortChange,
  priceFilter,
  onPriceFilterChange,
  popularityFilter,
  onPopularityFilterChange,
  filteredCount,
  totalCount,
  onResetAll
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const isChutneyCategory = 
    category === 'chutneys' || category === 'chutney' || category === 'dry-chutneys';
  const isAcharCategory = 
    category === 'achar-lonach' || category === 'pickle' || category === 'pickles';

  const hasActiveFilters = 
    sortBy !== 'popular' || 
    priceFilter !== 'all' || 
    popularityFilter !== 'all';

  const activeFiltersCount = 
    (sortBy !== 'popular' ? 1 : 0) +
    (priceFilter !== 'all' ? 1 : 0) +
    (popularityFilter !== 'all' ? 1 : 0);

  const sortOptions: { id: SortOption; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'popular', labelEn: 'Popularity & Bestseller', icon: <Award className="w-3.5 h-3.5 text-amber-600" /> },
    { id: 'price-asc', labelEn: 'Price: Low to High', icon: <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'price-desc', labelEn: 'Price: High to Low', icon: <IndianRupee className="w-3.5 h-3.5 text-rose-600" /> },
    { id: 'rating', labelEn: 'Customer Rating', icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> },
  ];

  const priceOptions: { id: PriceFilterOption; label: string }[] = [
    { id: 'all', label: 'All Prices' },
    { id: 'under-100', label: 'Under ₹100' },
    { id: '100-200', label: '₹100 - ₹200' },
    { id: '200-300', label: '₹200 - ₹300' },
    { id: '300-plus', label: '₹300+' },
  ];

  const popularityOptions: { id: PopularityFilterOption; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'bestsellers', label: '⭐ Bestsellers Only' },
    { id: 'top-rated', label: '★ 4.9+ Top Rated' },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-amber-50/60 rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-xs space-y-4">
      
      {/* Category Header with Context Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-2xs shrink-0">
            {isChutneyCategory ? (
              <Sparkles className="w-5 h-5" />
            ) : isAcharCategory ? (
              <Flame className="w-5 h-5" />
            ) : (
              <SlidersHorizontal className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {isChutneyCategory ? 'Chutneys Collection' : 
                 isAcharCategory ? 'Pickles Collection' : 
                 'Catalog Filters & Sorting'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-stone-800 border border-amber-200 shadow-2xs">
                {filteredCount} {filteredCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {isChutneyCategory 
                ? 'Handcrafted dry chutneys & thecha freshly stone-pounded with natural spices'
                : isAcharCategory 
                ? 'Heritage sun-cured pickles steeped in cold-pressed mustard oil with unadulterated hing'
                : 'Refine items by budget, spice heat level, and customer popularity'}
            </p>
          </div>
        </div>

        {/* Quick Clear Button & Mobile Filter Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasActiveFilters && (
            <button
              onClick={onResetAll}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200/80 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset all filters and sorting"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}

          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer sm:hidden ${
              isFilterPanelOpen || hasActiveFilters
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Controls</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-amber-700 text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterPanelOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Controls Grid (Always visible on desktop, toggleable on mobile) */}
      <div className={`space-y-4 ${isFilterPanelOpen ? 'block' : 'hidden sm:block'}`}>
        
        {/* Row 1: Dynamic Sorting Dropdown & Popularity Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* 1. Dynamic Sorting Selector (6 cols) */}
          <div className="lg:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-600" />
                Sort Products By:
              </span>
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full appearance-none px-3.5 py-2.5 rounded-xl bg-white border border-amber-200/90 text-xs sm:text-sm font-semibold text-stone-800 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs cursor-pointer pr-9"
              >
                {sortOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.labelEn}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2. Popularity & Bestsellers Filter (6 cols) */}
          <div className="lg:col-span-6 space-y-1.5">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Popularity & Reviews:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {popularityOptions.map(opt => {
                const isActive = popularityFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onPopularityFilterChange(opt.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-white text-stone-700 border border-amber-200/80 hover:bg-amber-50/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Price Filter */}
        <div className="pt-2 border-t border-amber-200/50 space-y-1.5">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            Filter by Price Range:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {priceOptions.map(opt => {
              const isActive = priceFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onPriceFilterChange(opt.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-stone-700 border border-amber-200/80 hover:bg-amber-50/80'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Active Filters Tags Bar (When any filter is active) */}
        {hasActiveFilters && (
          <div className="pt-2.5 border-t border-amber-200/50 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-stone-500 text-[11px] uppercase tracking-wider">
              Active Filters:
            </span>

            {/* Sort Tag */}
            {sortBy !== 'popular' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-950 font-bold border border-amber-300/80 shadow-2xs">
                <span>Sort: {sortOptions.find(o => o.id === sortBy)?.labelEn}</span>
                <button 
                  onClick={() => onSortChange('popular')}
                  className="p-0.5 hover:bg-amber-200 rounded-full cursor-pointer"
                  title="Remove sort"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Price Tag */}
            {priceFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/90 text-emerald-950 font-bold border border-emerald-300/80 shadow-2xs">
                <span>Price: {priceOptions.find(o => o.id === priceFilter)?.label}</span>
                <button 
                  onClick={() => onPriceFilterChange('all')}
                  className="p-0.5 hover:bg-emerald-200 rounded-full cursor-pointer"
                  title="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Popularity Tag */}
            {popularityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-950 font-bold border border-amber-300/80 shadow-2xs">
                <span>{popularityOptions.find(o => o.id === popularityFilter)?.label}</span>
                <button 
                  onClick={() => onPopularityFilterChange('all')}
                  className="p-0.5 hover:bg-amber-200 rounded-full cursor-pointer"
                  title="Remove popularity filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Clear All action button */}
            <button
              onClick={onResetAll}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline ml-auto cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
