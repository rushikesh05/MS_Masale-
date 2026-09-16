import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CustomerPortal } from './components/CustomerPortal';
import { ManagerPortal } from './components/ManagerPortal';
import { DeliveryPartnerPortal } from './components/DeliveryPartnerPortal';
import { SmartCartDrawer } from './components/SmartCartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { MockWhatsAppModal } from './components/MockWhatsAppModal';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { InvoiceModal } from './components/InvoiceModal';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame } from 'lucide-react';

const AppSkeleton: React.FC = () => {
  return (
    <div id="app-startup-skeleton" className="min-h-screen bg-[#FFFDFB] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-[#FFFDFB]/95 backdrop-blur-md border-b border-[#F0EAE1] px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/80 animate-pulse flex items-center justify-center text-amber-700">
              <Flame className="w-5 h-5 animate-bounce text-[#C84B31]" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-36 sm:w-48 bg-[#EFE8DE] rounded-full animate-pulse" />
              <div className="h-2.5 w-24 sm:w-32 bg-[#F5EFE6] rounded-full animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-[#F5EFE6] rounded-xl">
              <div className="h-7 w-20 bg-white/80 rounded-lg animate-pulse" />
              <div className="h-7 w-20 bg-white/40 rounded-lg animate-pulse" />
            </div>
            <div className="h-9 w-24 bg-[#EFE8DE] rounded-xl animate-pulse" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100/90 via-orange-50/90 to-rose-100/70 p-8 sm:p-12 text-stone-900 border border-amber-200/80 shadow-sm">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/60 border border-amber-300 text-stone-800 text-xs font-semibold">
              <span>MS Masale</span>
            </div>
            <div className="space-y-2">
              <div className="h-8 sm:h-11 w-4/5 bg-stone-300/40 rounded-2xl animate-pulse" />
              <div className="h-4 sm:h-5 w-3/5 bg-stone-300/30 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { 
    toastMessage, 
    isInitializing, 
    selectedInvoiceOrder, 
    isInvoiceModalOpen, 
    setIsInvoiceModalOpen,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    language 
  } = useApp();
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EE] to-[#FFF1E8] text-stone-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white relative">
      {/* Subtle, Organic 'Spice-Grain' SVG Grain Texture Overlay */}
      <div 
        id="spice-grain-overlay"
        className="fixed inset-0 pointer-events-none z-0 opacity-15 mix-blend-multiply print:hidden"
        style={{
          backgroundImage: 'url("/spice-grain.svg")',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px'
        }}
        aria-hidden="true"
      />

      {/* Startup Skeleton Overlay Transition */}
      <AnimatePresence mode="wait">
        {isInitializing ? (
          <motion.div
            key="app-startup-skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="w-full relative z-10"
          >
            <AppSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="app-loaded-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col relative z-10"
          >
            {/* Header */}
            <Header />

            {/* Main Role-Based Portal Router */}
            <main className="flex-1">
              <AnimatePresence mode="wait">
                {role === 'customer' && (
                  <motion.div
                    key="customer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CustomerPortal />
                  </motion.div>
                )}

                {role === 'manager' && (
                  <motion.div
                    key="manager"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ManagerPortal />
                  </motion.div>
                )}

                {role === 'delivery' && (
                  <motion.div
                    key="delivery"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <DeliveryPartnerPortal />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Global Modals & Drawers */}
            <SmartCartDrawer />
            <ProductDetailModal />
            <CheckoutModal />
            <MockWhatsAppModal />
            <AuthModal />
            <AccountModal />
            <InvoiceModal
              order={selectedInvoiceOrder}
              isOpen={isInvoiceModalOpen}
              onClose={() => setIsInvoiceModalOpen(false)}
              language={language}
            />

            {/* Toast Notification Banner */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-6 right-6 z-50 bg-[#2D2424] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#443838] flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-md"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C84B31] shrink-0" />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
