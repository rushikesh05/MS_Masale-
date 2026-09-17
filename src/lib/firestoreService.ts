import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, ProductCategory, BogoOfferConfig } from '../types';
import { PRODUCTS, INITIAL_CATEGORIES } from '../data/initialData';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const DELETED_PRODUCTS_COLLECTION = 'deleted_products';
const PROMOTIONS_COLLECTION = 'promotions';

export const DEFAULT_BOGO_CONFIG: BogoOfferConfig = {
  id: 'bogo-festive',
  isActive: true,
  productId: 'prod-shengdana-chutney',
  titleEn: 'BUY 1 GET 1 FREE (BOGO)!',
  titleMr: '१ वर १ मोफत ऑफर (BOGO)!',
  descriptionEn: 'Special Offer on Peanut and Garlic Chutney: Buy 1 jar & get 1 jar 100% FREE!',
  descriptionMr: 'खास ऑफर शेंगदाणा आणि लसूण चटणी वर: १ पॅक विकत घ्या आणि १ पॅक १००% मोफत मिळवा!',
  badgeEn: 'Special Festive Offer',
  badgeMr: 'खास सणासुदीची ऑफर',
  tagEn: 'Peanut & Garlic (BOGO)',
  tagMr: 'शेंगदाणा आणि लसूण चटणी (BOGO)',
  couponCode: 'BOGO-FREE',
  imageUrl: '/products/peanut-garlic-pouch-transparent.png',
  countdownHours: 6
};

// Helper to sanitize an object for Firestore (removes undefined fields)
function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) {
        cleaned[key] = sanitizeForFirestore(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
}

// Background auto-seeder to ensure all baseline products exist in Firestore
let isSeedingCatalog = false;
export async function ensureAllProductsInFirestore(): Promise<void> {
  if (isSeedingCatalog) return;
  isSeedingCatalog = true;
  try {
    const existingSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const existingIds = new Set<string>();
    existingSnap.forEach(d => existingIds.add(d.id));

    // For any default product not yet in Firestore, seed it once
    for (const prod of PRODUCTS) {
      if (!existingIds.has(prod.id)) {
        const prodRef = doc(db, PRODUCTS_COLLECTION, prod.id);
        await setDoc(prodRef, sanitizeForFirestore({
          ...prod,
          deleted: false,
          isDeleted: false
        }), { merge: true });
      }
    }

    // Also ensure categories exist
    const catSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const existingCatIds = new Set<string>();
    catSnap.forEach(d => existingCatIds.add(d.id));

    for (const cat of INITIAL_CATEGORIES) {
      if (!existingCatIds.has(cat.id)) {
        const catRef = doc(db, CATEGORIES_COLLECTION, cat.id);
        await setDoc(catRef, sanitizeForFirestore(cat), { merge: true });
      }
    }
  } catch (err) {
    console.warn('ensureAllProductsInFirestore notice:', err);
  } finally {
    isSeedingCatalog = false;
  }
}

/**
 * Sync products in real-time from Firestore, merging with default products
 * so that updating or saving a single product NEVER wipes out the rest of the catalog.
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const remoteMap = new Map<string, Product>();
        const deletedIds = new Set<string>();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data.deleted === true || data.isDeleted === true) {
            deletedIds.add(docSnap.id);
          } else {
            remoteMap.set(docSnap.id, { ...data, id: docSnap.id });
          }
        });

        // Merge logic:
        // 1. Iterate over all baseline PRODUCTS
        // 2. If remote doc exists with this ID, use the remote doc (with updated image, prices, stock, etc.)
        // 3. If baseline product is marked deleted in Firestore, skip it
        // 4. If baseline product is NOT in remoteMap and NOT deleted, keep it intact!
        const mergedList: Product[] = [];
        const processedIds = new Set<string>();

        for (const baseProd of PRODUCTS) {
          if (deletedIds.has(baseProd.id)) {
            continue;
          }
          if (remoteMap.has(baseProd.id)) {
            mergedList.push(remoteMap.get(baseProd.id)!);
            processedIds.add(baseProd.id);
          } else {
            mergedList.push(baseProd);
            processedIds.add(baseProd.id);
          }
        }

        // 5. Add any newly added custom products created by admin in Firestore
        remoteMap.forEach((prod, id) => {
          if (!processedIds.has(id) && !deletedIds.has(id)) {
            mergedList.push(prod);
          }
        });

        onUpdate(mergedList);

        // If Firestore has fewer docs than the baseline catalog, backfill them in the background
        if (snapshot.size < PRODUCTS.length) {
          ensureAllProductsInFirestore().catch(() => {});
        }
      },
      (error) => {
        console.warn('Firestore products snapshot warning:', error);
        if (onError) onError(error);
        // Fallback to local initial data
        onUpdate(PRODUCTS);
      }
    );
  } catch (e) {
    console.warn('Firestore subscription fallback:', e);
    onUpdate(PRODUCTS);
    return () => {};
  }
}

/**
 * Sync categories in real-time from Firestore, with fallback and safe merge
 */
export function subscribeToCategories(
  onUpdate: (categories: ProductCategory[]) => void,
  onError?: (err: any) => void
) {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const remoteMap = new Map<string, ProductCategory>();
        const deletedIds = new Set<string>();

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data.deleted === true || data.isDeleted === true) {
            deletedIds.add(docSnap.id);
          } else {
            remoteMap.set(docSnap.id, { ...data, id: docSnap.id });
          }
        });

        const mergedList: ProductCategory[] = [];
        const processedIds = new Set<string>();

        for (const baseCat of INITIAL_CATEGORIES) {
          if (deletedIds.has(baseCat.id)) continue;
          if (remoteMap.has(baseCat.id)) {
            mergedList.push(remoteMap.get(baseCat.id)!);
            processedIds.add(baseCat.id);
          } else {
            mergedList.push(baseCat);
            processedIds.add(baseCat.id);
          }
        }

        remoteMap.forEach((cat, id) => {
          if (!processedIds.has(id) && !deletedIds.has(id)) {
            mergedList.push(cat);
          }
        });

        mergedList.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
        onUpdate(mergedList);

        if (snapshot.size < INITIAL_CATEGORIES.length) {
          ensureAllProductsInFirestore().catch(() => {});
        }
      },
      (error) => {
        console.warn('Firestore categories snapshot warning:', error);
        if (onError) onError(error);
        onUpdate(INITIAL_CATEGORIES);
      }
    );
  } catch (e) {
    console.warn('Firestore category fallback:', e);
    onUpdate(INITIAL_CATEGORIES);
    return () => {};
  }
}

/**
 * Seed all default products and categories to Cloud Firestore
 */
export async function seedCatalogToFirestore(): Promise<{ productsCount: number; categoriesCount: number }> {
  try {
    // Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      const catRef = doc(db, CATEGORIES_COLLECTION, cat.id);
      await setDoc(catRef, sanitizeForFirestore(cat), { merge: true });
    }

    // Seed Products
    for (const prod of PRODUCTS) {
      const prodRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      await setDoc(prodRef, sanitizeForFirestore({
        ...prod,
        deleted: false,
        isDeleted: false
      }), { merge: true });
    }

    return { productsCount: PRODUCTS.length, categoriesCount: INITIAL_CATEGORIES.length };
  } catch (error) {
    console.error('Error seeding catalog to Firestore:', error);
    throw error;
  }
}

/**
 * Save / Update a product in Firestore safely
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const prodId = product.id || `prod-${Date.now()}`;
  const cleanProduct = sanitizeForFirestore({
    ...product,
    id: prodId,
    deleted: false,
    isDeleted: false,
    updatedAt: new Date().toISOString()
  });
  const prodRef = doc(db, PRODUCTS_COLLECTION, prodId);
  await setDoc(prodRef, cleanProduct, { merge: true });

  // Ensure other catalog products are also stored in Firestore
  ensureAllProductsInFirestore().catch(() => {});
}

/**
 * Delete a product from Firestore with deletion marker
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const prodRef = doc(db, PRODUCTS_COLLECTION, productId);
  // Mark as deleted in document
  await setDoc(prodRef, { deleted: true, isDeleted: true, id: productId }, { merge: true });
  // Also track in deleted_products collection
  try {
    await setDoc(doc(db, DELETED_PRODUCTS_COLLECTION, productId), {
      id: productId,
      deletedAt: new Date().toISOString()
    });
  } catch {}
}

/**
 * Save / Update a category in Firestore
 */
export async function saveCategoryToFirestore(category: ProductCategory): Promise<void> {
  const catId = category.id || `cat-${Date.now()}`;
  const cleanCategory = sanitizeForFirestore({ ...category, id: catId, deleted: false, isDeleted: false });
  const catRef = doc(db, CATEGORIES_COLLECTION, catId);
  await setDoc(catRef, cleanCategory, { merge: true });
}

/**
 * Delete a category from Firestore
 */
export async function deleteCategoryFromFirestore(categoryId: string): Promise<void> {
  const catRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await setDoc(catRef, { deleted: true, isDeleted: true, id: categoryId }, { merge: true });
}

/**
 * Save / Update BOGO Offer configuration in Firestore
 */
export async function saveBogoOfferToFirestore(config: BogoOfferConfig): Promise<void> {
  const promoId = config.id || 'bogo-festive';
  const cleanConfig = sanitizeForFirestore({
    ...config,
    id: promoId,
    updatedAt: new Date().toISOString()
  });
  const promoRef = doc(db, PROMOTIONS_COLLECTION, promoId);
  await setDoc(promoRef, cleanConfig, { merge: true });
}

/**
 * Real-time listener for BOGO Offer configuration
 */
export function subscribeToBogoOffer(onUpdate: (config: BogoOfferConfig | null) => void): () => void {
  try {
    const promoRef = doc(db, PROMOTIONS_COLLECTION, 'bogo-festive');
    const unsubscribe = onSnapshot(promoRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as BogoOfferConfig);
      } else {
        onUpdate(null);
      }
    }, (error) => {
      console.warn('Firestore BOGO subscribe note:', error);
      onUpdate(null);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('subscribeToBogoOffer setup failed:', err);
    return () => {};
  }
}

