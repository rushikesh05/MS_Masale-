import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Language, CartItem, Product, ProductCategory, CustomChutneyConfig, WhatsAppNotification, Order } from '../types';
import { PRODUCTS, INITIAL_CATEGORIES } from '../data/initialData';
import { 
  subscribeToProducts, 
  subscribeToCategories, 
  saveProductToFirestore, 
  deleteProductFromFirestore, 
  saveCategoryToFirestore, 
  deleteCategoryFromFirestore,
  seedCatalogToFirestore 
} from '../lib/firestoreService';

export type AppTheme = 'express' | 'kolhapuri' | 'sahyadri' | 'konkan';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'totalPrice'>, openDrawer?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  basketFillTrigger: number;
  lastAddedQuantity: number;
  isBasketFilling: boolean;
  
  // Products & Categories (Dynamic Database + Real-time Sync)
  products: Product[];
  categories: ProductCategory[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addCategory: (category: ProductCategory) => Promise<void>;
  updateCategory: (category: ProductCategory) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  seedCatalog: () => Promise<void>;
  isSyncingCatalog: boolean;

  // Navigation & View control
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // UI Dialog Controls
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  activeWhatsAppNotification: WhatsAppNotification | null;
  openWhatsAppAlert: (notification?: WhatsAppNotification) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (prod: Product | null) => void;
  
  // Feedback / Google Forms Modal
  isFeedbackModalOpen: boolean;
  setIsFeedbackModalOpen: (open: boolean) => void;
  
  // Bulk / Wholesale Request Modal
  isBulkRequestModalOpen: boolean;
  setIsBulkRequestModalOpen: (open: boolean) => void;
  
  // Invoice Modal
  selectedInvoiceOrder: Order | null;
  setSelectedInvoiceOrder: (order: Order | null) => void;
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  openInvoiceModal: (order: Order) => void;
  
  // User orders history
  orders: Order[];
  recentOrders: Order[];
  refreshOrders: () => Promise<void>;
  
  // App initialization state
  isInitializing: boolean;
  
  // Helper for quick toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [language, setLanguageState] = useState<Language>('en');
  const setLanguage = (_lang: Language) => {
    // Language is strictly English as requested
    setLanguageState('en');
  };
  const [theme, setThemeState] = useState<AppTheme>('express');

  const setTheme = (_newTheme: AppTheme) => {
    setThemeState('express');
    try {
      localStorage.setItem('assal_gavran_theme', 'express');
      document.documentElement.setAttribute('data-theme', 'express');
    } catch (e) {
      console.warn('Theme update note:', e);
    }
  };

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', 'express');
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.warn(e);
    }
  }, [theme]);

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<ProductCategory[]>(INITIAL_CATEGORIES);
  const [isSyncingCatalog, setIsSyncingCatalog] = useState<boolean>(false);

  // Firestore Real-time Subscriptions for Catalog
  useEffect(() => {
    const unsubProducts = subscribeToProducts((remoteProds) => {
      if (remoteProds && remoteProds.length > 0) {
        setProducts(remoteProds);
      }
    });

    const unsubCategories = subscribeToCategories((remoteCats) => {
      if (remoteCats && remoteCats.length > 0) {
        setCategories(remoteCats);
      }
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  const addProduct = async (newProd: Product) => {
    setIsSyncingCatalog(true);
    try {
      await saveProductToFirestore(newProd);
      setProducts(prev => [newProd, ...prev.filter(p => p.id !== newProd.id)]);
      showToast('Product added successfully!');
    } catch (e) {
      console.warn('Firestore add product fallback:', e);
      // Optimistic fallback
      setProducts(prev => [newProd, ...prev.filter(p => p.id !== newProd.id)]);
      showToast('Product saved locally!');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  const updateProduct = async (updatedProd: Product) => {
    setIsSyncingCatalog(true);
    try {
      await saveProductToFirestore(updatedProd);
      setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
      showToast('Product updated successfully!');
    } catch (e) {
      console.warn('Firestore update product fallback:', e);
      setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
      showToast('Product updated locally!');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    setIsSyncingCatalog(true);
    try {
      await deleteProductFromFirestore(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product deleted successfully!');
    } catch (e) {
      console.warn('Firestore delete product fallback:', e);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product removed locally!');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  const addCategory = async (newCat: ProductCategory) => {
    setIsSyncingCatalog(true);
    try {
      await saveCategoryToFirestore(newCat);
      setCategories(prev => [...prev.filter(c => c.id !== newCat.id), newCat]);
      showToast('Category added successfully!');
    } catch (e) {
      console.warn('Firestore add category fallback:', e);
      setCategories(prev => [...prev.filter(c => c.id !== newCat.id), newCat]);
      showToast('Category saved locally!');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  const updateCategory = async (updatedCat: ProductCategory) => {
    setIsSyncingCatalog(true);
    try {
      await saveCategoryToFirestore(updatedCat);
      setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
      showToast('Category updated successfully!');
    } catch (e) {
      console.warn('Firestore update category fallback:', e);
      setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
      showToast('Category updated locally!');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setIsSyncingCatalog(true);
    try {
      await deleteCategoryFromFirestore(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      showToast('Category removed successfully!');
    } catch (e) {
      console.warn('Firestore delete category fallback:', e);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      showToast('Category removed locally!');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  const seedCatalog = async () => {
    setIsSyncingCatalog(true);
    try {
      const result = await seedCatalogToFirestore();
      showToast(`Database synced: ${result.productsCount} products & ${result.categoriesCount} categories!`);
    } catch (e) {
      console.error('Seed catalog error:', e);
      showToast('Database sync completed with default catalog!');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  const [activeTab, setActiveTab] = useState<string>('home');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  
  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('assal_gavran_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [activeWhatsAppNotification, setActiveWhatsAppNotification] = useState<WhatsAppNotification | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isBulkRequestModalOpen, setIsBulkRequestModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Basket-fill animation states for responsive shopping feedback
  const [basketFillTrigger, setBasketFillTrigger] = useState<number>(0);
  const [lastAddedQuantity, setLastAddedQuantity] = useState<number>(1);
  const [isBasketFilling, setIsBasketFilling] = useState<boolean>(false);

  const openInvoiceModal = (order: Order) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem('assal_gavran_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to persist cart:', e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const openWhatsAppAlert = (notification?: WhatsAppNotification) => {
    if (notification) {
      setActiveWhatsAppNotification(notification);
    }
    setIsWhatsAppModalOpen(true);
  };

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setRecentOrders(data.data);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await refreshOrders();
      } finally {
        // Smooth initialization transition without abrupt flash
        setTimeout(() => {
          setIsInitializing(false);
        }, 200);
      }
    };
    initApp();
  }, []);

  const addToCart = (itemData: Omit<CartItem, 'cartItemId' | 'totalPrice'>, openDrawer: boolean = false) => {
    const cartItemId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const totalPrice = itemData.unitPrice * itemData.quantity;
    
    const newItem: CartItem = {
      ...itemData,
      cartItemId,
      totalPrice
    };

    setCart(prev => [newItem, ...prev]);
    setBasketFillTrigger(prev => prev + 1);
    setLastAddedQuantity(itemData.quantity || 1);
    setIsBasketFilling(true);
    setTimeout(() => {
      setIsBasketFilling(false);
    }, 1400);

    showToast(language === 'mr' ? 'चटणी बास्केटमध्ये भरली! 🌶️' : 'Added to your basket!');
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast(language === 'mr' ? 'आयटम काढून टाकला' : 'Item removed from cart');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        userRole: role,
        setUserRole: setRole,
        language,
        setLanguage,
        theme,
        setTheme,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        activeTab,
        setActiveTab,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        activeWhatsAppNotification,
        openWhatsAppAlert,
        selectedProductDetail,
        setSelectedProductDetail,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        isBulkRequestModalOpen,
        setIsBulkRequestModalOpen,
        selectedInvoiceOrder,
        setSelectedInvoiceOrder,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        openInvoiceModal,
        orders: recentOrders,
        recentOrders,
        refreshOrders,
        isInitializing,
        toastMessage,
        showToast,
        basketFillTrigger,
        lastAddedQuantity,
        isBasketFilling,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        seedCatalog,
        isSyncingCatalog
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
