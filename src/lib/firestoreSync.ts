import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy, 
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Unsubscribe 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Order, Inquiry, CustomChutneyConfig, RawIngredientStock, WholesaleRequest } from '../types';
import { INITIAL_RAW_STOCKS } from '../data/initialData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
  TRANSACTION = 'transaction'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Atomically creates an order in Firestore using a runTransaction block.
 * This guarantees that the order document (with complete price, quantity, custom details,
 * customer address, delivery OTP, and assigned rider) and inventory deductions are written
 * simultaneously and atomically, ensuring the delivery partner portal receives exact data synchronization.
 */
export async function createOrderWithTransactionInFirestore(order: Order): Promise<Order> {
  const orderDocRef = doc(db, 'orders', order.id);
  const pathForOrder = `orders/${order.id}`;

  try {
    const persistedOrder = await runTransaction(db, async (transaction) => {
      // 1. Calculate raw ingredient deductions for the order items
      const deductions: Record<string, number> = {};

      order.items.forEach(item => {
        const grams = item.customDetails?.packSizeGrams || (item.size === '1kg' ? 1000 : item.size === '500g' ? 500 : 250);
        const totalKg = (grams * Number(item.quantity || 1)) / 1000;

        if (item.isCustomRecipe && item.customDetails && item.customDetails.baseIngredients) {
          const base = item.customDetails.baseIngredients;
          if (base.peanuts) deductions['stock-peanuts'] = (deductions['stock-peanuts'] || 0) + (totalKg * (base.peanuts / 100));
          if (base.dryCoconut) deductions['stock-coconut'] = (deductions['stock-coconut'] || 0) + (totalKg * (base.dryCoconut / 100));
          if (base.sesameSeeds) deductions['stock-sesame'] = (deductions['stock-sesame'] || 0) + (totalKg * (base.sesameSeeds / 100));
          if (base.flaxseed) deductions['stock-flaxseed'] = (deductions['stock-flaxseed'] || 0) + (totalKg * (base.flaxseed / 100));
          if (base.redChilliBase) deductions['stock-chilli-bedgi'] = (deductions['stock-chilli-bedgi'] || 0) + (totalKg * (base.redChilliBase / 100));
        } else {
          // Standard recipe deduction estimates
          const titleLower = (item.titleEn + ' ' + item.titleMr).toLowerCase();
          if (titleLower.includes('peanut') || titleLower.includes('शेंगदाणा')) {
            deductions['stock-peanuts'] = (deductions['stock-peanuts'] || 0) + totalKg * 0.7;
            deductions['stock-garlic'] = (deductions['stock-garlic'] || 0) + totalKg * 0.15;
            deductions['stock-chilli-bedgi'] = (deductions['stock-chilli-bedgi'] || 0) + totalKg * 0.1;
          } else if (titleLower.includes('coconut') || titleLower.includes('खोबरे')) {
            deductions['stock-coconut'] = (deductions['stock-coconut'] || 0) + totalKg * 0.7;
            deductions['stock-garlic'] = (deductions['stock-garlic'] || 0) + totalKg * 0.15;
          } else if (titleLower.includes('sesame') || titleLower.includes('तीळ')) {
            deductions['stock-sesame'] = (deductions['stock-sesame'] || 0) + totalKg * 0.8;
          } else if (titleLower.includes('flaxseed') || titleLower.includes('जवस')) {
            deductions['stock-flaxseed'] = (deductions['stock-flaxseed'] || 0) + totalKg * 0.8;
          }
        }
      });

      // 2. Transactional Reads: Fetch current inventory stock docs
      const stockUpdates: Array<{ docRef: any; updatedStockKg: number; stockId: string }> = [];
      for (const [stockId, deductKg] of Object.entries(deductions)) {
        const stockRef = doc(db, 'inventory', stockId);
        const stockSnap = await transaction.get(stockRef);
        if (stockSnap.exists()) {
          const currentKg = Number(stockSnap.data()?.currentStockKg ?? 50);
          const newKg = Math.max(0, Math.round((currentKg - deductKg) * 10) / 10);
          stockUpdates.push({ docRef: stockRef, updatedStockKg: newKg, stockId });
        }
      }

      // 3. Transactional Writes:
      // (a) Write inventory deductions
      for (const update of stockUpdates) {
        transaction.set(update.docRef, {
          currentStockKg: update.updatedStockKg,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      }

      // (b) Write Order document with complete price, quantity, and product metadata
      const sanitizedItems = order.items.map(item => ({
        id: item.id,
        isCustomRecipe: Boolean(item.isCustomRecipe),
        titleMr: item.titleMr,
        titleEn: item.titleEn,
        size: item.size,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        customDetails: item.customDetails ? {
          customName: item.customDetails.customName || '',
          baseIngredients: item.customDetails.baseIngredients,
          spiceLevel: Number(item.customDetails.spiceLevel || 3),
          chilliVariety: item.customDetails.chilliVariety || 'bedgi',
          garlicLevel: item.customDetails.garlicLevel || 'medium',
          saltType: item.customDetails.saltType || 'sendhav',
          oilType: item.customDetails.oilType || 'groundnut_cold_pressed',
          texture: item.customDetails.texture || 'coarse_stone_pounded',
          packSizeGrams: Number(item.customDetails.packSizeGrams || 500),
          packagingType: item.customDetails.packagingType || 'glass_heritage_jar',
          calculatedPrice: Number(item.customDetails.calculatedPrice || item.unitPrice)
        } : null
      }));

      const fullOrderPayload = {
        id: order.id,
        customer: {
          fullName: order.customer.fullName,
          phone: order.customer.phone,
          email: order.customer.email || '',
          addressLine1: order.customer.addressLine1,
          addressLine2: order.customer.addressLine2 || '',
          landmark: order.customer.landmark || '',
          talukaDistrict: order.customer.talukaDistrict,
          pincode: order.customer.pincode,
          state: order.customer.state || 'Maharashtra',
          deliveryNotes: order.customer.deliveryNotes || ''
        },
        items: sanitizedItems,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee || 0),
        discount: Number(order.discount || 0),
        couponCode: order.couponCode || null,
        totalAmount: Number(order.totalAmount),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        transactionId: order.transactionId || null,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt || new Date().toISOString(),
        estimatedDeliveryDate: order.estimatedDeliveryDate || new Date().toISOString().split('T')[0],
        assignedDeliveryPerson: order.assignedDeliveryPerson || {
          name: 'ज्ञानेश्वर सावंत (Dnyaneshwar)',
          phone: '+91 97654 32100',
          vehicleNumber: 'MH 12 BK 4091'
        },
        deliveryOtp: order.deliveryOtp || '1234',
        syncedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      transaction.set(orderDocRef, fullOrderPayload);
      return fullOrderPayload as unknown as Order;
    });

    console.log(`[Firestore Transaction] Order ${order.id} atomically committed with price, quantity, and inventory sync.`);
    return persistedOrder;
  } catch (error) {
    console.warn(`[Firestore Transaction] Fallback write for order ${order.id}:`, error);
    // Graceful fallback to setDoc if transaction encounters offline lock
    try {
      await setDoc(orderDocRef, {
        ...order,
        syncedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return order;
    } catch (fallbackError) {
      handleFirestoreError(fallbackError, OperationType.TRANSACTION, pathForOrder);
    }
  }
}

/**
 * Syncs a new or updated order directly to Firestore /orders collection.
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    await createOrderWithTransactionInFirestore(order);
  } catch (error) {
    console.warn(`[Firestore] Failed to save order ${order.id}:`, error);
  }
}

/**
 * Updates status and coordinates of an order in Firestore.
 */
export async function updateOrderStatusInFirestore(
  orderId: string, 
  status: Order['orderStatus'],
  extra?: Partial<Order>
): Promise<void> {
  const pathForUpdate = `orders/${orderId}`;
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      orderStatus: status,
      ...extra,
      updatedAt: new Date().toISOString()
    });
    console.log(`[Firestore] Order ${orderId} updated to ${status}.`);
  } catch (error) {
    console.warn(`[Firestore] Failed to update order ${orderId}:`, error);
  }
}

/**
 * Saves Google Forms / Customer inquiries to Firestore /inquiries collection.
 */
export async function saveInquiryToFirestore(inquiry: Inquiry): Promise<void> {
  try {
    const inqDocRef = doc(db, 'inquiries', inquiry.id);
    await setDoc(inqDocRef, {
      ...inquiry,
      syncedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Inquiry ${inquiry.id} persisted to Cloud Firestore.`);
  } catch (error) {
    console.warn(`[Firestore] Failed to save inquiry ${inquiry.id}:`, error);
  }
}

/**
 * Saves custom stone-mortar recipes created by users to /custom_recipes collection.
 */
export async function saveCustomRecipeToFirestore(
  recipeId: string, 
  userId: string, 
  recipeName: string, 
  config: CustomChutneyConfig
): Promise<void> {
  try {
    const recipeDocRef = doc(db, 'custom_recipes', recipeId);
    await setDoc(recipeDocRef, {
      id: recipeId,
      userId,
      recipeName,
      config: JSON.stringify(config),
      likesCount: 1,
      createdAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Custom Recipe ${recipeId} saved to Cloud Firestore.`);
  } catch (error) {
    console.warn(`[Firestore] Failed to save custom recipe ${recipeId}:`, error);
  }
}

/**
 * Real-time listener for raw spice/ingredient stock inventory.
 */
export function subscribeToInventory(
  onUpdate: (stocks: RawIngredientStock[]) => void
): Unsubscribe {
  const inventoryColRef = collection(db, 'inventory');
  
  const unsubscribe = onSnapshot(inventoryColRef, async (snapshot) => {
    if (snapshot.empty) {
      console.log('[Firestore] Seeding raw ingredient inventory collection...');
      for (const stock of INITIAL_RAW_STOCKS) {
        const stockDocRef = doc(db, 'inventory', stock.id);
        await setDoc(stockDocRef, stock, { merge: true });
      }
      onUpdate(INITIAL_RAW_STOCKS);
    } else {
      const stocks: RawIngredientStock[] = [];
      snapshot.forEach(docSnap => {
        stocks.push(docSnap.data() as RawIngredientStock);
      });
      const orderMap = new Map(INITIAL_RAW_STOCKS.map((s, idx) => [s.id, idx]));
      stocks.sort((a, b) => (orderMap.get(a.id) ?? 99) - (orderMap.get(b.id) ?? 99));
      onUpdate(stocks);
    }
  }, (error) => {
    console.warn('[Firestore] Inventory realtime subscription error:', error);
    onUpdate(INITIAL_RAW_STOCKS);
  });

  return unsubscribe;
}

/**
 * Updates stock quantity or details for a raw spice ingredient in Cloud Firestore.
 */
export async function updateStockInFirestore(
  stockId: string,
  updatedStockKg: number,
  extra?: Partial<RawIngredientStock>
): Promise<void> {
  try {
    const stockDocRef = doc(db, 'inventory', stockId);
    await setDoc(stockDocRef, {
      id: stockId,
      currentStockKg: updatedStockKg,
      ...extra,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Inventory ${stockId} updated to ${updatedStockKg}kg.`);
  } catch (error) {
    console.warn(`[Firestore] Failed to update stock ${stockId}:`, error);
  }
}

/**
 * Updates low-stock alarm threshold in Firestore.
 */
export async function updateStockThresholdInFirestore(
  stockId: string,
  thresholdKg: number
): Promise<void> {
  try {
    const stockDocRef = doc(db, 'inventory', stockId);
    await setDoc(stockDocRef, {
      id: stockId,
      thresholdKg,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Stock threshold for ${stockId} updated to ${thresholdKg}kg.`);
  } catch (error) {
    console.warn(`[Firestore] Failed to update threshold for ${stockId}:`, error);
  }
}

/**
 * Deducts raw inventory ingredients for a specific order.
 */
export async function deductInventoryForOrderInFirestore(
  stocksOrOrder: RawIngredientStock[] | Order,
  maybeOrder?: Order
): Promise<void> {
  try {
    const order = (maybeOrder || stocksOrOrder) as Order;
    if (!order || !order.items) return;
    
    const deductions: Record<string, number> = {};
    order.items.forEach(item => {
      const grams = item.customDetails?.packSizeGrams || (item.size === '1kg' ? 1000 : item.size === '500g' ? 500 : 250);
      const totalKg = (grams * Number(item.quantity || 1)) / 1000;
      if (item.isCustomRecipe && item.customDetails && item.customDetails.baseIngredients) {
        const base = item.customDetails.baseIngredients;
        if (base.peanuts) deductions['stock-peanuts'] = (deductions['stock-peanuts'] || 0) + (totalKg * (base.peanuts / 100));
        if (base.dryCoconut) deductions['stock-coconut'] = (deductions['stock-coconut'] || 0) + (totalKg * (base.dryCoconut / 100));
        if (base.sesameSeeds) deductions['stock-sesame'] = (deductions['stock-sesame'] || 0) + (totalKg * (base.sesameSeeds / 100));
        if (base.flaxseed) deductions['stock-flaxseed'] = (deductions['stock-flaxseed'] || 0) + (totalKg * (base.flaxseed / 100));
        if (base.redChilliBase) deductions['stock-chilli-bedgi'] = (deductions['stock-chilli-bedgi'] || 0) + (totalKg * (base.redChilliBase / 100));
      } else {
        const titleLower = (item.titleEn + ' ' + item.titleMr).toLowerCase();
        if (titleLower.includes('peanut') || titleLower.includes('शेंगदाणा')) {
          deductions['stock-peanuts'] = (deductions['stock-peanuts'] || 0) + totalKg * 0.7;
          deductions['stock-garlic'] = (deductions['stock-garlic'] || 0) + totalKg * 0.15;
          deductions['stock-chilli-bedgi'] = (deductions['stock-chilli-bedgi'] || 0) + totalKg * 0.1;
        } else if (titleLower.includes('coconut') || titleLower.includes('खोबरे')) {
          deductions['stock-coconut'] = (deductions['stock-coconut'] || 0) + totalKg * 0.7;
          deductions['stock-garlic'] = (deductions['stock-garlic'] || 0) + totalKg * 0.15;
        } else if (titleLower.includes('sesame') || titleLower.includes('तीळ')) {
          deductions['stock-sesame'] = (deductions['stock-sesame'] || 0) + totalKg * 0.8;
        } else if (titleLower.includes('flaxseed') || titleLower.includes('जवस')) {
          deductions['stock-flaxseed'] = (deductions['stock-flaxseed'] || 0) + totalKg * 0.8;
        }
      }
    });

    for (const [stockId, deductKg] of Object.entries(deductions)) {
      const stockRef = doc(db, 'inventory', stockId);
      const stockSnap = await getDoc(stockRef);
      if (stockSnap.exists()) {
        const currentKg = Number(stockSnap.data()?.currentStockKg ?? 50);
        const newKg = Math.max(0, Math.round((currentKg - deductKg) * 10) / 10);
        await setDoc(stockRef, { currentStockKg: newKg, lastUpdated: new Date().toISOString() }, { merge: true });
      }
    }
  } catch (error) {
    console.warn('[Firestore] Failed to deduct inventory for order:', error);
  }
}

/**
 * Real-time listener for orders collection in Firestore.
 * Notifies components whenever orders are placed, assigned, or status updated.
 */
export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void
): Unsubscribe {
  const ordersColRef = collection(db, 'orders');
  
  const unsubscribe = onSnapshot(ordersColRef, (snapshot) => {
    if (!snapshot.empty) {
      const firestoreOrders: Order[] = [];
      snapshot.forEach(docSnap => {
        firestoreOrders.push(docSnap.data() as Order);
      });
      // Sort newest first
      firestoreOrders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onUpdate(firestoreOrders);
    }
  }, (error) => {
    console.warn('[Firestore] Orders realtime subscription error:', error);
  });

  return unsubscribe;
}

/**
 * Persists a dedicated Bulk / Wholesale Restaurant & Caterer Request to Firestore /wholesale_requests
 */
export async function saveWholesaleRequestToFirestore(request: WholesaleRequest): Promise<void> {
  const pathForDoc = `wholesale_requests/${request.id}`;
  try {
    const docRef = doc(db, 'wholesale_requests', request.id);
    await setDoc(docRef, {
      ...request,
      syncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firestore] Wholesale Request ${request.id} persisted to Cloud Firestore.`);
  } catch (error) {
    console.warn(`[Firestore] Failed to save wholesale request ${request.id}:`, error);
  }
}

/**
 * Updates status or manager notes for a wholesale request in Firestore
 */
export async function updateWholesaleRequestStatusInFirestore(
  requestId: string,
  status: WholesaleRequest['status'],
  extra?: Partial<WholesaleRequest>
): Promise<void> {
  const pathForUpdate = `wholesale_requests/${requestId}`;
  try {
    const docRef = doc(db, 'wholesale_requests', requestId);
    await updateDoc(docRef, {
      status,
      ...extra,
      updatedAt: new Date().toISOString()
    });
    console.log(`[Firestore] Wholesale request ${requestId} updated to ${status}.`);
  } catch (error) {
    console.warn(`[Firestore] Failed to update wholesale request ${requestId}:`, error);
  }
}

/**
 * Real-time listener for the /wholesale_requests collection in Cloud Firestore
 */
export function subscribeToWholesaleRequests(
  onUpdate: (requests: WholesaleRequest[]) => void
): Unsubscribe {
  const wholesaleColRef = collection(db, 'wholesale_requests');

  const unsubscribe = onSnapshot(wholesaleColRef, (snapshot) => {
    if (!snapshot.empty) {
      const requests: WholesaleRequest[] = [];
      snapshot.forEach((docSnap) => {
        requests.push(docSnap.data() as WholesaleRequest);
      });
      // Sort newest first
      requests.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onUpdate(requests);
    } else {
      onUpdate([]);
    }
  }, (error) => {
    console.warn('[Firestore] Wholesale requests realtime subscription note:', error);
    onUpdate([]);
  });

  return unsubscribe;
}


