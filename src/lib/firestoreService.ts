import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, ProductCategory } from '../types';
import { PRODUCTS, INITIAL_CATEGORIES } from '../data/initialData';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

/**
 * Sync products in real-time from Firestore, with fallback to initial data
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
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            list.push({ ...data, id: docSnap.id });
          });
          onUpdate(list);
        } else {
          // If Firestore is empty initially, supply default products
          onUpdate(PRODUCTS);
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
 * Sync categories in real-time from Firestore, with fallback
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
        if (!snapshot.empty) {
          const list: ProductCategory[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as ProductCategory;
            list.push({ ...data, id: docSnap.id });
          });
          list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
          onUpdate(list);
        } else {
          onUpdate(INITIAL_CATEGORIES);
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
      await setDoc(catRef, cat, { merge: true });
    }

    // Seed Products
    for (const prod of PRODUCTS) {
      const prodRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      await setDoc(prodRef, prod, { merge: true });
    }

    return { productsCount: PRODUCTS.length, categoriesCount: INITIAL_CATEGORIES.length };
  } catch (error) {
    console.error('Error seeding catalog to Firestore:', error);
    throw error;
  }
}

/**
 * Save / Update a product in Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const prodId = product.id || `prod-${Date.now()}`;
  const cleanProduct = { ...product, id: prodId };
  const prodRef = doc(db, PRODUCTS_COLLECTION, prodId);
  await setDoc(prodRef, cleanProduct, { merge: true });
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const prodRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(prodRef);
}

/**
 * Save / Update a category in Firestore
 */
export async function saveCategoryToFirestore(category: ProductCategory): Promise<void> {
  const catId = category.id || `cat-${Date.now()}`;
  const cleanCategory = { ...category, id: catId };
  const catRef = doc(db, CATEGORIES_COLLECTION, catId);
  await setDoc(catRef, cleanCategory, { merge: true });
}

/**
 * Delete a category from Firestore
 */
export async function deleteCategoryFromFirestore(categoryId: string): Promise<void> {
  const catRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await deleteDoc(catRef);
}
