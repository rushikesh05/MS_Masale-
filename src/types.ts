export type UserRole = 'customer' | 'manager' | 'delivery' | 'admin';

export type Language = 'mr' | 'en';

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other' | string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  talukaDistrict: string;
  pincode: string;
  state: string;
  isDefault?: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'upi' | 'cod' | 'card';
  upiId?: string;
  cardLast4?: string;
  cardBrand?: string;
  isDefault?: boolean;
  label: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  preferredLanguage?: Language;
  defaultAddress?: CustomerAddress;
  addresses?: SavedAddress[];
  paymentMethods?: SavedPaymentMethod[];
  createdAt: string;
  updatedAt?: string;
}

export interface LiveDeliveryLocation {
  orderId: string;
  lat: number;
  lng: number;
  heading: number;
  speedKmH: number;
  currentStop: string;
  nextStop: string;
  batteryPct: number;
  updatedAt: string;
}

export interface BaseIngredientOption {
  id: string;
  nameMr: string;
  nameEn: string;
  marathiScript: string;
  descriptionMr: string;
  descriptionEn: string;
  color: string;
  patternColor: string;
  pricePer100g: number;
  iconName: string;
  aromaNotes: string;
}

export interface SpiceLevelOption {
  level: number; // 1 to 5
  labelMr: string;
  labelEn: string;
  scovilleDescMr: string;
  scovilleDescEn: string;
  color: string;
  flameCount: number;
}

export interface GarlicOption {
  id: 'none' | 'low' | 'medium' | 'extra';
  labelMr: string;
  labelEn: string;
  extraPrice: number;
  descMr: string;
  descEn: string;
}

export interface SaltOption {
  id: 'regular' | 'sendhav' | 'low_salt';
  labelMr: string;
  labelEn: string;
  extraPrice: number;
  descMr: string;
  descEn: string;
}

export interface OilOption {
  id: 'none' | 'groundnut_cold_pressed' | 'extra_drizzle';
  labelMr: string;
  labelEn: string;
  extraPrice: number;
  descMr: string;
  descEn: string;
}

export interface CustomChutneyConfig {
  id?: string;
  customName: string; // e.g., "रेश्माच्या हातची स्पेशल चटणी"
  tagline?: string;
  baseIngredients: {
    peanuts: number; // percentage (0 - 100)
    dryCoconut: number;
    sesameSeeds: number;
    flaxseed: number;
    redChilliBase: number;
  };
  spiceLevel: number; // 1 - 5
  chilliVariety: 'bedgi' | 'lavangi' | 'sankeshwari';
  garlicLevel: 'none' | 'low' | 'medium' | 'extra';
  saltType: 'regular' | 'sendhav' | 'low_salt';
  oilType: 'none' | 'groundnut_cold_pressed' | 'extra_drizzle';
  texture: 'coarse_stone_pounded' | 'medium_granular' | 'fine_powder';
  packSizeGrams: 250 | 500 | 1000;
  packagingType: 'glass_heritage_jar' | 'airtight_kraft_pouch';
  calculatedPrice: number;
  createdAt?: string;
}

export interface ProductCategory {
  id: string;
  nameMr: string;
  nameEn: string;
  descriptionMr?: string;
  descriptionEn?: string;
  icon?: string;
  sortOrder?: number;
}

export interface ProductSize {
  size: '100g' | '250g' | '500g' | '1kg' | string;
  grams: number;
  price: number;
  originalPrice: number;
  inStock: boolean;
  stockCount?: number;
}

export interface Product {
  id: string;
  nameMr: string;
  nameEn: string;
  taglineMr: string;
  taglineEn: string;
  descriptionMr: string;
  descriptionEn: string;
  category: 'chutney' | 'masala' | 'specialty' | 'pickle' | string;
  spiceLevel: number; // 1-5
  badgeMr?: string;
  badgeEn?: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  ingredientsMr: string[];
  ingredientsEn: string[];
  pairingRecommendationsMr: string[];
  pairingRecommendationsEn: string[];
  whereToUseMr?: string[];
  whereToUseEn?: string[];
  hygienePrecautionsMr?: string[];
  hygienePrecautionsEn?: string[];
  storageTipsMr?: string;
  storageTipsEn?: string;
  hsnCode?: string;
  nutritionFacts: {
    calories: string;
    protein: string;
    healthyFats: string;
    fiber: string;
  };
  sizes: {
    size: '100g' | '250g' | '500g' | '1kg' | string;
    grams: number;
    price: number;
    originalPrice: number;
    inStock: boolean;
    stockCount?: number;
  }[];
  stockCount?: number;
  isLowStock?: boolean;
  isBestSeller?: boolean;
  isRegionalSpecialty?: boolean;
  regionOriginMr?: string;
  regionOriginEn?: string;
}

export interface CartItem {
  cartItemId: string;
  isCustomRecipe: boolean;
  productId?: string;
  product?: Product;
  selectedSize?: '250g' | '500g' | '1kg';
  customRecipe?: CustomChutneyConfig;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'order_placed'
  | 'blending_in_workshop'
  | 'packed_in_airtight_jar'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  isCustomRecipe: boolean;
  titleMr: string;
  titleEn: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customDetails?: CustomChutneyConfig;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  talukaDistrict: string;
  pincode: string;
  state: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string; // e.g. AG-89214
  customer: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'upi' | 'razorpay_cards' | 'cod';
  paymentStatus: 'paid' | 'pending_cod' | 'failed';
  transactionId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDeliveryDate: string;
  assignedDeliveryPerson?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  deliveryOtp?: string;
  deliveryTime?: string;
}

export interface RawIngredientStock {
  id: string;
  nameMr: string;
  nameEn: string;
  currentStockKg: number;
  lowStockThresholdKg: number;
  unitCostPerKg: number;
  sourceRegion: string;
  lastProcuredDate: string;
}

export interface WhatsAppNotification {
  id: string;
  orderId: string;
  recipientPhone: string;
  recipientName: string;
  type: 'order_confirmed' | 'dispatched' | 'delivered';
  messageText: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface SmsNotification {
  id: string;
  orderId: string;
  recipientPhone: string;
  recipientName: string;
  type: 'order_confirmed' | 'dispatched' | 'delivered';
  messageText: string;
  otp?: string;
  deviceSmsUri?: string;
  whatsAppUri?: string;
  timestamp: string;
  status: 'sent' | 'delivered';
  gateway?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'general' | 'bulk_order' | 'complaint' | 'suggestion';
  message: string;
  preferredChutneys?: string[];
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}

export type EstablishmentType =
  | 'restaurant'
  | 'caterer'
  | 'hotel_resort'
  | 'dhaba_khanawal'
  | 'sweet_farsan_shop'
  | 'wedding_event_planner'
  | 'cloud_kitchen'
  | 'retail_distributor'
  | 'other';

export type WholesaleFrequency =
  | 'one_time_event'
  | 'weekly_supply'
  | 'biweekly_supply'
  | 'monthly_contract'
  | 'quarterly_standing_order';

export type PackagingPreference =
  | 'bulk_jerry_cans_5kg'
  | 'bulk_buckets_10kg'
  | 'standup_pouches_1kg'
  | 'standup_pouches_500g'
  | 'glass_jars_heritage'
  | 'custom_private_label';

export interface WholesaleProductRequirement {
  productId: string;
  productNameMr: string;
  productNameEn: string;
  quantityKg: number;
  spiceLevelPreference: 'mild_blend' | 'medium_gavran' | 'extra_spicy_thecha' | 'custom_blend';
  packagingPreference: PackagingPreference;
  customNotes?: string;
}

export type WholesaleRequestStatus =
  | 'new_request'
  | 'reviewing'
  | 'quotation_sent'
  | 'tasting_samples_dispatched'
  | 'contract_approved'
  | 'rejected';

export interface WholesaleRequest {
  id: string; // e.g. B2B-89321
  userId?: string;
  businessName: string;
  contactPerson: string;
  designation: string; // e.g. "Head Chef / Purchase Manager / Proprietor"
  phone: string;
  email: string;
  establishmentType: EstablishmentType;
  gstNumber?: string;
  city: string;
  talukaDistrict?: string;
  pincode: string;
  deliveryAddress: string;
  supplyFrequency: WholesaleFrequency;
  targetDeliveryDate: string;
  products: WholesaleProductRequirement[];
  totalEstimatedKg: number;
  estimatedBudgetInr?: number;
  specialRequirements?: string;
  status: WholesaleRequestStatus;
  managerNotes?: string;
  quotedPricePerKgAvg?: number;
  createdAt: string;
  updatedAt?: string;
}

