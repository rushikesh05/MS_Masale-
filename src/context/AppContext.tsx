import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Language, CartItem, Product, CustomChutneyConfig, WhatsAppNotification, Order } from '../types';

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
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'totalPrice'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
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
  const [language, setLanguage] = useState<Language>('mr');
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

  const addToCart = (itemData: Omit<CartItem, 'cartItemId' | 'totalPrice'>) => {
    const cartItemId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const totalPrice = itemData.unitPrice * itemData.quantity;
    
    const newItem: CartItem = {
      ...itemData,
      cartItemId,
      totalPrice
    };

    setCart(prev => [newItem, ...prev]);
    showToast(language === 'mr' ? 'चटणी कार्टमध्ये जोडली गेली! 🌶️' : 'Chutney jar added to your cart!');
    setIsCartOpen(true);
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
        showToast
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
