import { Product } from '../types';

export interface StockInfo {
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  badgeTextEn: string;
  badgeTextMr: string;
  detailTextEn: string;
  detailTextMr: string;
  urgencyLevel: 'high' | 'medium' | 'normal' | 'none';
}

// Consistent seed-based generator to ensure reproducible stock levels across reloads
function getSeedStock(productId: string, sizeName: string = ''): { count: number; isLow: boolean } {
  const combined = `${productId}-${sizeName}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // High-demand items flagged as low stock for batch tracking
  const highDemandProducts = [
    'prod-kanda-lasun',
    'prod-kolhapuri-thecha',
    'prod-saoji-masala',
    'prod-karale-khurasani',
    'prod-malvani-masala',
    'prod-hirvi-mirchi-lonche',
    'prod-khandeshi-kala-masala'
  ];

  if (highDemandProducts.includes(productId)) {
    // 2 to 6 packs left
    const count = (absHash % 5) + 2;
    return { count, isLow: true };
  }

  // Mixed distribution: ~30% items are low stock (3-7 left), others are well-stocked (14-36 left)
  const isUrgent = absHash % 3 === 0;
  if (isUrgent) {
    const count = (absHash % 5) + 3;
    return { count, isLow: true };
  }

  const count = (absHash % 23) + 14;
  return { count, isLow: false };
}

export function getProductStockInfo(product: Product, selectedSize?: string): StockInfo {
  const activeSize = product.sizes?.find(s => s.size === selectedSize) || product.sizes?.[0];

  // If explicitly flagged as out of stock
  if (activeSize && activeSize.inStock === false) {
    return {
      status: 'out_of_stock',
      stockCount: 0,
      isLowStock: false,
      isOutOfStock: true,
      badgeTextEn: 'Out of Stock',
      badgeTextMr: 'साठा संपला',
      detailTextEn: 'Batch sold out • Restocking soon',
      detailTextMr: 'बॅच संपली • लवकरच उपलब्ध होईल',
      urgencyLevel: 'none'
    };
  }

  // Determine stock count:
  // 1. Explicit activeSize.stockCount
  // 2. Explicit product.stockCount
  // 3. Fallback to deterministic pseudo-random seed
  let stockCount: number;
  let isLowStock: boolean;

  if (activeSize && typeof activeSize.stockCount === 'number') {
    stockCount = activeSize.stockCount;
    isLowStock = stockCount <= 8;
  } else if (typeof product.stockCount === 'number') {
    stockCount = product.stockCount;
    isLowStock = Boolean(product.isLowStock || stockCount <= 8);
  } else {
    const fallback = getSeedStock(product.id, activeSize?.size || '250g');
    stockCount = fallback.count;
    isLowStock = fallback.isLow;
  }

  if (stockCount <= 0) {
    return {
      status: 'out_of_stock',
      stockCount: 0,
      isLowStock: false,
      isOutOfStock: true,
      badgeTextEn: 'Out of Stock',
      badgeTextMr: 'साठा संपला',
      detailTextEn: 'Sold out • New batch in progress',
      detailTextMr: 'साठा संपला • नवीन बॅच तयार होत आहे',
      urgencyLevel: 'none'
    };
  }

  if (isLowStock) {
    const isVeryLow = stockCount <= 3;
    return {
      status: 'low_stock',
      stockCount,
      isLowStock: true,
      isOutOfStock: false,
      badgeTextEn: isVeryLow ? `Only ${stockCount} left!` : `Low Stock: ${stockCount} left`,
      badgeTextMr: isVeryLow ? `फक्त ${stockCount} शिल्लक!` : `कमी साठा: ${stockCount} शिल्लक`,
      detailTextEn: isVeryLow ? `Hurry, only ${stockCount} packs left in current batch` : `Only ${stockCount} packs left in stock`,
      detailTextMr: isVeryLow ? `त्वरा करा, चालू बॅचमध्ये फक्त ${stockCount} पॅक शिल्लक आहेत` : `चालू साठ्यात फक्त ${stockCount} पॅक शिल्लक`,
      urgencyLevel: isVeryLow ? 'high' : 'medium'
    };
  }

  return {
    status: 'in_stock',
    stockCount,
    isLowStock: false,
    isOutOfStock: false,
    badgeTextEn: 'In Stock',
    badgeTextMr: 'शिल्लक उपलब्ध',
    detailTextEn: `In Stock (${stockCount} packs available • Fresh batch)`,
    detailTextMr: `शिल्लक उपलब्ध (${stockCount} पॅक उपलब्ध • ताजी घाणी)`,
    urgencyLevel: 'normal'
  };
}
