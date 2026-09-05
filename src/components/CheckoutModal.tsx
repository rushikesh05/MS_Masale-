import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  QrCode, 
  Smartphone, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  Phone,
  User,
  Mail,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { CustomerAddress, OrderItem } from '../types';
import { createOrderWithTransactionInFirestore, saveOrderToFirestore } from '../lib/firestoreSync';

export const CheckoutModal: React.FC = () => {
  const { 
    language, 
    cart, 
    cartSubtotal, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    clearCart, 
    refreshOrders,
    openWhatsAppAlert,
    openInvoiceModal,
    showToast
  } = useApp();

  const isMr = language === 'mr';

  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Address form
  const [address, setAddress] = useState<CustomerAddress>({
    fullName: 'सागर रामचंद्र गायकवाड (Sagar Gaikwad)',
    phone: '+91 98234 56789',
    email: 'sagar.gaikwad@example.com',
    addressLine1: 'फ्लॅट ४०२, स्वामिनी हाइट्स, बाणेर रोड',
    addressLine2: 'डी मार्ट जवळ',
    landmark: 'गणपती मंदिराशेजारी',
    talukaDistrict: 'पुणे (Pune)',
    pincode: '411045',
    state: 'Maharashtra',
    deliveryNotes: 'कृपया गेटवर घंटी वाजवा'
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay_cards' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const deliveryFee = cartSubtotal > 499 ? 0 : 40;
  const discount = 50; // default coupon simulation
  const totalAmount = Math.max(0, cartSubtotal - discount + deliveryFee);

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.pincode) {
      showToast(isMr ? 'कृपया सर्व आवश्यक पत्ता भरा!' : 'Please fill all required address fields!');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems: OrderItem[] = cart.map(item => ({
        id: item.cartItemId,
        isCustomRecipe: item.isCustomRecipe,
        titleMr: item.isCustomRecipe && item.customRecipe ? item.customRecipe.customName : item.product?.nameMr || 'Chutney',
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
        couponCode: 'GAVRAN50',
        totalAmount: totalAmount,
        paymentMethod: paymentMethod
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        setCreatedOrder(result.data);
        setStep('success');
        clearCart();
        refreshOrders();

        // Atomic Cloud Firestore Transaction synchronization:
        // Commits price, quantity, and product metadata atomically to Firestore /orders and /inventory
        await createOrderWithTransactionInFirestore(result.data);

        // Trigger celebratory confetti
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

        if (result.notification) {
          setTimeout(() => {
            openWhatsAppAlert(result.notification);
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Order placement failed:', err);
      showToast(isMr ? 'ऑर्डर नोंदवताना त्रुटी आली.' : 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#EFE4D8] my-8 relative"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#F5EDE4] flex items-center justify-between bg-[#FFFDFB]">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌶️</span>
              <h3 className="font-extrabold text-lg text-[#2D2424] font-brand">
                {step === 'address' && (isMr ? 'डिलिव्हरी पत्ता (Shipping Details)' : 'Delivery Address')}
                {step === 'payment' && (isMr ? 'पेमेंट पद्धत (Select Payment)' : 'Payment Method')}
                {step === 'success' && (isMr ? 'ऑर्डर निश्चित झाली! (Order Placed)' : 'Order Confirmed!')}
              </h3>
            </div>

            {step !== 'success' && (
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* STEP 1: Address Details */}
          {step === 'address' && (
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#2D2424] mb-1">
                    {isMr ? 'संपूर्ण नाव (Full Name)*:' : 'Full Name*:'}
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#EADFD5] rounded-xl focus:ring-2 focus:ring-[#C84B31] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D2424] mb-1">
                    {isMr ? 'मोबाईल नंबर (WhatsApp Number)*:' : 'Phone (WhatsApp)*:'}
                  </label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#EADFD5] rounded-xl focus:ring-2 focus:ring-[#C84B31] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#2D2424] mb-1">
                    {isMr ? 'घर क्र., इमारत / गल्ली (Address Line 1)*:' : 'House/Flat No, Building, Street*:'}
                  </label>
                  <input
                    type="text"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#EADFD5] rounded-xl focus:ring-2 focus:ring-[#C84B31] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D2424] mb-1">
                    {isMr ? 'जिल्हा / तालुका (District / City)*:' : 'District / City*:'}
                  </label>
                  <select
                    value={address.talukaDistrict}
                    onChange={(e) => setAddress({ ...address, talukaDistrict: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#EADFD5] rounded-xl focus:ring-2 focus:ring-[#C84B31] focus:outline-none"
                  >
                    <option value="पुणे (Pune)">पुणे (Pune)</option>
                    <option value="कोल्हापूर (Kolhapur)">कोल्हापूर (Kolhapur)</option>
                    <option value="सोलापूर (Solapur)">सोलापूर (Solapur)</option>
                    <option value="मुंबई / ठाणे (Mumbai / Thane)">मुंबई / ठाणे (Mumbai / Thane)</option>
                    <option value="सातारा (Satara)">सातारा (Satara)</option>
                    <option value="सांगली (Sangli)">सांगली (Sangli)</option>
                    <option value="नाशिक (Nashik)">नाशिक (Nashik)</option>
                    <option value="छत्रपती संभाजीनगर (Sambhaji Nagar)">छत्रपती संभाजीनगर</option>
                    <option value="नागपूर (Nagpur)">नागपूर (Nagpur)</option>
                    <option value="लातूर (Latur)">लातूर (Latur)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D2424] mb-1">
                    {isMr ? 'पिनकोड (Pincode)*:' : 'Pincode*:'}
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#EADFD5] rounded-xl focus:ring-2 focus:ring-[#C84B31] focus:outline-none"
                  />
                </div>
              </div>

              {/* Order Summary Preview */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFE4D8] text-xs flex justify-between items-center">
                <div>
                  <span className="text-gray-500">{isMr ? 'एकूण आयटम्स:' : 'Items:'} {cart.length}</span>
                  <span className="font-extrabold text-[#C84B31] text-sm block">₹{totalAmount}</span>
                </div>
                <button
                  onClick={() => setStep('payment')}
                  className="px-5 py-2.5 bg-[#C84B31] hover:bg-[#A83B23] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isMr ? 'पेमेंटकडे जा' : 'Continue to Payment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Simulation (UPI, Cards, COD) */}
          {step === 'payment' && (
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="space-y-3">
                {/* 1. UPI Payment Option */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#C84B31] bg-[#FFF9F6] ring-2 ring-[#C84B31]/20'
                      : 'border-[#EFE4D8] bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-extrabold text-xs border border-green-200">
                        UPI
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-[#2D2424]">
                          {isMr ? 'झटपट UPI (GPay, PhonePe, Paytm, QR)' : 'Instant UPI Transfer'}
                        </div>
                        <div className="text-xs text-[#7A6E6E]">
                          {isMr ? 'शून्य ट्रॅन्झॅक्शन फी, त्वरित खात्री' : 'Zero transaction fees, instant confirmation'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 font-bold">
                      Instant
                    </span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pt-3 border-t border-[#F5EDE4] space-y-3">
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
                                ? 'border-[#C84B31] bg-white font-bold text-[#C84B31]'
                                : 'border-gray-200 bg-white/70 text-gray-600'
                            }`}
                          >
                            <span className="block text-sm">{app.icon}</span>
                            <span className="text-[10px] mt-0.5 block truncate">{app.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Mock UPI QR Preview */}
                      {selectedUpiApp === 'qr' && (
                        <div className="p-3 bg-white rounded-xl border border-gray-200 text-center max-w-[200px] mx-auto space-y-1">
                          <QrCode className="w-24 h-24 mx-auto text-[#2D2424]" />
                          <span className="text-[10px] font-mono font-bold text-gray-700 block">UPI: assalgavran@icici</span>
                          <span className="text-[9px] text-gray-500">Scan with any UPI App</span>
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
                      ? 'border-[#C84B31] bg-[#FFF9F6] ring-2 ring-[#C84B31]/20'
                      : 'border-[#EFE4D8] bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold text-xs border border-blue-200">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-[#2D2424]">
                        {isMr ? 'क्रेडिट / डेबिट कार्ड व नेट बँकिंग' : 'Credit / Debit Cards & Netbanking'}
                      </div>
                      <div className="text-xs text-[#7A6E6E]">
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
                      ? 'border-[#C84B31] bg-[#FFF9F6] ring-2 ring-[#C84B31]/20'
                      : 'border-[#EFE4D8] bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-extrabold text-xs border border-amber-200">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-[#2D2424]">
                        {isMr ? 'कॅश ऑन डिलिव्हरी (COD)' : 'Cash on Delivery (COD)'}
                      </div>
                      <div className="text-xs text-[#7A6E6E]">
                        {isMr ? 'जार हातात मिळाल्यावर पैसे द्या' : 'Pay in cash/UPI upon jar delivery'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#F5EDE4]">
                <button
                  onClick={() => setStep('address')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {isMr ? 'मागे जा' : 'Back'}
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-green-700/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (isMr ? 'प्रक्रिया सुरू आहे...' : 'Processing...')
                      : (isMr ? `ऑर्डर निश्चित करा (₹${totalAmount})` : `Place Order (₹${totalAmount})`)}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Placed Success */}
          {step === 'success' && createdOrder && (
            <div className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold uppercase tracking-wider">
                  {isMr ? 'ऑर्डर आयडी:' : 'Order ID:'} #{createdOrder.id}
                </span>
                <h3 className="text-2xl font-extrabold text-[#2D2424] font-brand mt-3">
                  {isMr ? 'धन्यवाद! तुमची ऑर्डर नोंदवली गेली आहे' : 'Thank You! Your Order has been placed'}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6E6E] mt-1 max-w-md mx-auto">
                  {isMr
                    ? 'तुमच्या आवडीनुसार खलबत्त्यात ताजी कुटून आम्ही जार तयार करत आहोत. व्हॉट्सॲपवर तुम्हाला तपशील पाठवले आहेत.'
                    : 'We are blending your artisanal chutney fresh in our workshop. WhatsApp confirmation receipt generated!'}
                </p>
              </div>

              {/* Delivery & OTP Card */}
              <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-[#F5C2B8] text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">{isMr ? 'डिलिव्हरी पार्टनर:' : 'Delivery Partner:'}</span>
                  <span className="font-bold text-[#2D2424]">{createdOrder.assignedDeliveryPerson?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">{isMr ? 'डिलिव्हरी सिक्युरिटी OTP:' : 'Delivery Verification OTP:'}</span>
                  <span className="text-sm font-mono font-extrabold text-[#C84B31] bg-white px-2 py-0.5 rounded border border-[#EADFD5]">
                    {createdOrder.deliveryOtp}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600">{isMr ? 'अपेक्षित वितरण:' : 'Est. Delivery:'}</span>
                  <span className="font-bold text-green-700">{createdOrder.estimatedDeliveryDate}</span>
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
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C84B31] to-[#A0331C] text-white text-xs font-extrabold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isMr ? '📄 कर बीजक (Tax Invoice) डाउनलोड करा' : '📄 Download Tax Invoice'}</span>
                </button>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
                >
                  {isMr ? 'खरेदी चालू ठेवा' : 'Continue Shopping'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
