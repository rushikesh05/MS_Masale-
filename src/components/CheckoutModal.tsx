import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight,
  QrCode,
  FileText,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomerAddress, OrderItem, Order, WhatsAppNotification } from '../types';
import confetti from 'canvas-confetti';
import { createOrderWithTransactionInFirestore } from '../lib/firestoreSync';
import { useAuth } from '../context/AuthContext';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    clearCart, 
    openWhatsAppAlert,
    refreshOrders,
    addLocalOrder,
    openInvoiceModal,
    showToast
  } = useApp();

  const {
    currentUser,
    userProfile,
    setIsAuthModalOpen,
    setAuthMode
  } = useAuth();

  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Address form initialized dynamically
  const defaultSaved = userProfile?.addresses?.find(a => a.isDefault) || userProfile?.addresses?.[0];

  const [address, setAddress] = useState<CustomerAddress>({
    fullName: defaultSaved?.fullName || userProfile?.displayName || currentUser?.displayName || '',
    phone: defaultSaved?.phone || userProfile?.phone || '8591254237',
    email: currentUser?.email || 'customer@msmasale.com',
    addressLine1: defaultSaved?.addressLine1 || 'Flat 402, Swamini Heights, Baner Road',
    addressLine2: defaultSaved?.landmark || 'Near D-Mart',
    landmark: defaultSaved?.landmark || 'Near Ganpati Temple',
    talukaDistrict: defaultSaved?.talukaDistrict || 'Pune',
    pincode: defaultSaved?.pincode || '411045',
    state: defaultSaved?.state || 'Maharashtra',
    deliveryNotes: 'Please ring bell at gate'
  });

  // When default address or userProfile updates, update address state if empty or changed
  React.useEffect(() => {
    if (defaultSaved) {
      setAddress(prev => ({
        ...prev,
        fullName: defaultSaved.fullName || prev.fullName,
        phone: defaultSaved.phone || prev.phone,
        addressLine1: defaultSaved.addressLine1 || prev.addressLine1,
        landmark: defaultSaved.landmark || prev.landmark,
        talukaDistrict: defaultSaved.talukaDistrict || prev.talukaDistrict,
        pincode: defaultSaved.pincode || prev.pincode,
        email: currentUser?.email || prev.email
      }));
    } else if (currentUser) {
      setAddress(prev => ({
        ...prev,
        fullName: prev.fullName || userProfile?.displayName || currentUser.displayName || '',
        email: currentUser.email || prev.email,
        phone: prev.phone || userProfile?.phone || ''
      }));
    }
  }, [userProfile, currentUser]);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay_cards' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const deliveryFee = cartSubtotal > 499 ? 0 : 40;
  const discount = 50; // default coupon simulation
  const totalAmount = Math.max(0, cartSubtotal - discount + deliveryFee);

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.pincode) {
      showToast('Please fill all required address fields!');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty!');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems: OrderItem[] = cart.map(item => ({
        id: item.cartItemId,
        isCustomRecipe: item.isCustomRecipe,
        titleMr: item.isCustomRecipe && item.customRecipe ? item.customRecipe.customName : item.product?.nameEn || 'Chutney',
        titleEn: item.isCustomRecipe && item.customRecipe ? item.customRecipe.customName : item.product?.nameEn || 'Chutney',
        size: item.isCustomRecipe && item.customRecipe ? `${item.customRecipe.packSizeGrams}g` : item.selectedSize || '250g',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        customDetails: item.customRecipe
      }));

      const payload = {
        customer: address,
        items: orderItems,
        subtotal: cartSubtotal,
        shippingFee: deliveryFee,
        discount: discount,
        couponCode: 'FESTIVE50',
        totalAmount: totalAmount,
        paymentMethod: paymentMethod
      };

      let confirmedOrder: Order | null = null;
      let confirmedNotification: WhatsAppNotification | null = null;

      // 1. Try server-side API first (runs in local dev / Node container)
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const result = await response.json();
          if (result && result.success && result.data) {
            confirmedOrder = result.data;
            confirmedNotification = result.notification || null;
          }
        } else {
          console.warn('[Checkout] /api/orders responded with status', response.status, 'content-type', contentType, '- activating client order handler.');
        }
      } catch (apiErr) {
        console.warn('[Checkout] Server API unreachable (e.g. static Vercel host or network offline):', apiErr);
      }

      // 2. Client-side fallback if server API is unavailable or non-JSON (e.g. Vercel static deployment)
      if (!confirmedOrder) {
        const orderId = `AG-${Math.floor(10000 + Math.random() * 90000)}`;
        const randomOtp = String(Math.floor(1000 + Math.random() * 9000));
        const deliveryBoys = [
          { name: 'ज्ञानेश्वर सावंत (Dnyaneshwar)', phone: '+91 97654 32100', vehicleNumber: 'MH 12 BK 4091' },
          { name: 'विक्रम मोहिते (Vikram Mohite)', phone: '+91 98901 12345', vehicleNumber: 'MH 09 DX 7712' },
          { name: 'महेश जाधव (Mahesh Jadhav)', phone: '+91 99223 99881', vehicleNumber: 'MH 11 AT 1822' }
        ];
        const assigned = deliveryBoys[Math.floor(Math.random() * deliveryBoys.length)];

        confirmedOrder = {
          id: orderId,
          customer: address,
          items: orderItems,
          subtotal: cartSubtotal,
          shippingFee: deliveryFee,
          discount: discount,
          couponCode: 'FESTIVE50',
          totalAmount: totalAmount,
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
          transactionId: paymentMethod === 'cod' ? undefined : `TXN-${Date.now()}`,
          orderStatus: 'order_placed',
          createdAt: new Date().toISOString(),
          estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          assignedDeliveryPerson: assigned,
          deliveryOtp: randomOtp
        };

        const itemsSummary = orderItems.map((i) => `• ${i.titleMr || i.titleEn} (${i.size} x ${i.quantity}) - ₹${i.totalPrice}`).join('\n');
        const waMsgText = `🚩 *अस्सल गावरान चटणी & मसाले - ऑर्डर निश्चित झाली!* 🌶️\n\nनमस्कार ${address.fullName}, तुमची ऑर्डर *#${orderId}* वर्कशॉपमध्ये नोंदवण्यात आली आहे.\n\n📦 *ऑर्डर तपशील:*\n${itemsSummary}\n\n💰 *एकूण रक्कम:* ₹${totalAmount} (${paymentMethod === 'cod' ? 'Pay on Delivery - COD' : 'Paid Online'})\n📍 *पत्ता:* ${address.addressLine1}, ${address.talukaDistrict} - ${address.pincode}\n🚚 *डिलिव्हरी पार्टनर:* ${assigned.name} (${assigned.phone})\n🔑 *डिलिव्हरी OTP:* ${randomOtp}\n\nगावरान चवीचा खरा आनंद घ्या! 🙏`;

        confirmedNotification = {
          id: `wa-${Date.now()}`,
          orderId,
          recipientPhone: address.phone,
          recipientName: address.fullName,
          type: 'order_confirmed',
          messageText: waMsgText,
          timestamp: new Date().toISOString(),
          status: 'delivered'
        };
      }

      // 3. Complete order flow immediately
      setCreatedOrder(confirmedOrder);
      setStep('success');
      clearCart();
      addLocalOrder(confirmedOrder);
      refreshOrders();

      // 4. Cloud Firestore Transaction synchronization (safe, non-blocking)
      try {
        await createOrderWithTransactionInFirestore(confirmedOrder);
      } catch (fsErr) {
        console.warn('[Checkout] Firestore sync notice (order saved locally):', fsErr);
      }

      // 5. Trigger celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C84B31', '#D83A56', '#F59E0B', '#10B981']
        });
      } catch (e) {
        // ignore
      }

      // 6. Open WhatsApp alert
      if (confirmedNotification) {
        const notif = confirmedNotification;
        setTimeout(() => {
          openWhatsAppAlert(notif);
        }, 1500);
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      showToast('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-amber-200/80 my-8 relative"
        >
          {/* Header */}
          <div className="p-5 border-b border-amber-200/70 flex items-center justify-between bg-gradient-to-r from-amber-50/80 to-orange-50/80">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌶️</span>
              <h3 className="font-extrabold text-lg text-stone-900 font-serif">
                {step === 'address' && 'Delivery Address & Shipping'}
                {step === 'payment' && 'Select Payment Method'}
                {step === 'success' && 'Order Confirmed!'}
              </h3>
            </div>

            {step !== 'success' && (
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-200/60 flex items-center justify-center text-stone-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* STEP 1: Address Details */}
          {step === 'address' && (
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* If user is not logged in, prompt to log in */}
              {!currentUser && (
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Have an account with MS Masale?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer text-xs"
                  >
                    Sign In for 1-Click Saved Addresses
                  </button>
                </div>
              )}

              {/* If user has saved addresses, display quick chips */}
              {userProfile?.addresses && userProfile.addresses.length > 0 && (
                <div className="space-y-1.5 pb-2 border-b border-stone-100">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Select from Saved Addresses:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.addresses.map((saved) => (
                      <button
                        key={saved.id}
                        type="button"
                        onClick={() => {
                          setAddress(prev => ({
                            ...prev,
                            fullName: saved.fullName,
                            phone: saved.phone,
                            addressLine1: saved.addressLine1,
                            landmark: saved.landmark || '',
                            talukaDistrict: saved.talukaDistrict,
                            pincode: saved.pincode
                          }));
                          showToast(`Selected ${saved.label} address`);
                        }}
                        className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 bg-stone-50 hover:bg-amber-50 hover:border-amber-400 text-stone-800 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-bold">{saved.label}:</span>
                        <span className="max-w-[150px] truncate">{saved.addressLine1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Joshi"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone / WhatsApp Number *:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    House/Flat No, Building, Street Address *:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Swamini Heights, Baner Road"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City / District *:
                  </label>
                  <select
                    value={address.talukaDistrict}
                    onChange={(e) => setAddress({ ...address, talukaDistrict: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Mumbai / Thane">Mumbai / Thane</option>
                    <option value="Satara">Satara</option>
                    <option value="Sangli">Sangli</option>
                    <option value="Nashik">Nashik</option>
                    <option value="Ahmednagar">Ahmednagar</option>
                    <option value="Chhatrapati Sambhaji Nagar">Chhatrapati Sambhaji Nagar</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Kolhapur">Kolhapur</option>
                    <option value="Other Cities (All India)">Other Cities (All India)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pincode *:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="411045"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Order Summary Preview */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50/70 to-orange-50/70 border border-amber-200/80 text-xs flex justify-between items-center">
                <div>
                  <span className="text-stone-600">Cart Items: {cart.length}</span>
                  <span className="font-extrabold text-amber-900 text-sm block">₹{totalAmount}</span>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment (UPI, Cards, COD) */}
          {step === 'payment' && (
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="space-y-3">
                {/* 1. UPI Payment Option */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                      : 'border-amber-200/70 bg-white hover:bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-xs border border-emerald-200">
                        UPI
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-stone-900">
                          Instant UPI Transfer (GPay, PhonePe, Paytm, QR)
                        </div>
                        <div className="text-xs text-stone-500">
                          Zero transaction fees, instant confirmation
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      Instant
                    </span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                          { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                          { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
                          { id: 'qr', name: 'Show QR', icon: '📱' }
                        ].map(app => (
                          <button
                            key={app.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUpiApp(app.id as any);
                            }}
                            className={`p-2 rounded-lg border text-center text-xs font-semibold transition-all ${
                              selectedUpiApp === app.id
                                ? 'border-amber-500 bg-amber-50 font-bold text-amber-900 shadow-2xs'
                                : 'border-stone-200 bg-white text-stone-600'
                            }`}
                          >
                            <span className="block text-sm">{app.icon}</span>
                            <span className="text-[10px] mt-0.5 block truncate">{app.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Mock UPI QR Preview */}
                      {selectedUpiApp === 'qr' && (
                        <div className="p-3 bg-white rounded-xl border border-amber-200 text-center max-w-[200px] mx-auto space-y-1">
                          <QrCode className="w-24 h-24 mx-auto text-stone-800" />
                          <span className="text-[10px] font-mono font-bold text-stone-700 block">UPI: msmasale@icici</span>
                          <span className="text-[9px] text-stone-500">Scan with any UPI App</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Razorpay Cards & Netbanking */}
                <div 
                  onClick={() => setPaymentMethod('razorpay_cards')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'razorpay_cards'
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                      : 'border-amber-200/70 bg-white hover:bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xs border border-blue-200">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-stone-900">
                        Credit / Debit Cards & Netbanking
                      </div>
                      <div className="text-xs text-stone-500">
                        Visa, MasterCard, RuPay, Netbanking
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Cash on Delivery */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                      : 'border-amber-200/70 bg-white hover:bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-extrabold text-xs border border-amber-200">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-stone-900">
                        Cash on Delivery (COD)
                      </div>
                      <div className="text-xs text-stone-500">
                        Pay in cash/UPI upon jar delivery at your door
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-200/60">
                <button
                  onClick={() => setStep('address')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Back
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Processing...'
                      : `Place Order (₹${totalAmount})`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Placed Success */}
          {step === 'success' && createdOrder && (
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold uppercase tracking-wider">
                  Order ID: #{createdOrder.id}
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900 font-serif mt-3">
                  Thank You! Your Order has been placed
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
                  We are blending your artisanal spices fresh in our workshop. WhatsApp confirmation receipt generated!
                </p>
              </div>

              {/* Delivery & OTP Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-rose-50/80 border border-amber-200 text-left text-xs space-y-2 max-w-md mx-auto shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-600">Delivery Partner:</span>
                  <span className="font-bold text-stone-900">{createdOrder.assignedDeliveryPerson?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-600">Delivery Verification OTP:</span>
                  <span className="text-sm font-mono font-extrabold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200 shadow-2xs">
                    {createdOrder.deliveryOtp}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-600">Est. Delivery:</span>
                  <span className="font-bold text-emerald-700">{createdOrder.estimatedDeliveryDate}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-3">
                <button
                  onClick={() => {
                    if (createdOrder) {
                      openInvoiceModal(createdOrder);
                    }
                  }}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Tax Invoice</span>
                </button>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
