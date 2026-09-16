import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SavedAddress, SavedPaymentMethod } from '../types';
import { 
  X, 
  User, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  LogOut, 
  Plus, 
  Check, 
  Trash2, 
  Edit2, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  FileText,
  Truck,
  ShieldCheck,
  Building,
  Home
} from 'lucide-react';

export const AccountModal: React.FC = () => {
  const {
    currentUser,
    userProfile,
    isAccountModalOpen,
    setIsAccountModalOpen,
    logout,
    updateProfileDetails,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    savePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  } = useAuth();

  const { 
    language, 
    showToast, 
    orders, 
    openInvoiceModal,
    setIsCartOpen
  } = useApp();

  const isMr = language === 'mr';

  const [activeTab, setActiveTab] = useState<'addresses' | 'payments' | 'orders' | 'profile'>('addresses');

  // Address form states
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Payment form states
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'upi' | 'cod'>('upi');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [paymentLabel, setPaymentLabel] = useState('My Google Pay / UPI');
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  // Profile edit states
  const [profileName, setProfileName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [profilePhone, setProfilePhone] = useState(userProfile?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  if (!isAccountModalOpen || !currentUser) return null;

  // Filter orders matching current user
  const userOrders = orders.filter(o => 
    (o.customer.email && currentUser.email && o.customer.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (userProfile?.phone && o.customer.phone === userProfile.phone)
  );

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddrFullName(userProfile?.displayName || currentUser?.displayName || '');
    setAddrPhone(userProfile?.phone || '');
    setAddrLine1('');
    setAddrLandmark('');
    setAddrCity('Pune');
    setAddrPincode('411038');
    setAddrLabel('Home');
    setAddrIsDefault(false);
    setIsAddingAddress(false);
  };

  const handleOpenAddAddress = () => {
    resetAddressForm();
    setIsAddingAddress(true);
  };

  const handleOpenEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrLine1(addr.addressLine1);
    setAddrLandmark(addr.landmark || '');
    setAddrCity(addr.talukaDistrict);
    setAddrPincode(addr.pincode);
    setAddrLabel((addr.label as any) || 'Home');
    setAddrIsDefault(!!addr.isDefault);
    setIsAddingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName.trim() || !addrPhone.trim() || !addrLine1.trim() || !addrPincode.trim()) {
      showToast('Please fill all required address fields');
      return;
    }

    setIsSavingAddress(true);
    try {
      if (editingAddressId) {
        await updateSavedAddress({
          id: editingAddressId,
          fullName: addrFullName.trim(),
          phone: addrPhone.trim(),
          addressLine1: addrLine1.trim(),
          landmark: addrLandmark.trim(),
          talukaDistrict: addrCity.trim() || 'Pune',
          pincode: addrPincode.trim(),
          state: 'Maharashtra',
          label: addrLabel,
          isDefault: addrIsDefault
        });
        showToast('Address updated successfully!');
      } else {
        await addSavedAddress({
          fullName: addrFullName.trim(),
          phone: addrPhone.trim(),
          addressLine1: addrLine1.trim(),
          landmark: addrLandmark.trim(),
          talukaDistrict: addrCity.trim() || 'Pune',
          pincode: addrPincode.trim(),
          state: 'Maharashtra',
          label: addrLabel,
          isDefault: addrIsDefault
        });
        showToast('New address saved!');
      }
      resetAddressForm();
    } catch (e: any) {
      showToast(e.message || 'Failed to save address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentType === 'upi' && !upiIdInput.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g. 9822000000@paytm or name@oksbi)');
      return;
    }

    setIsSavingPayment(true);
    try {
      await savePaymentMethod({
        type: paymentType,
        upiId: paymentType === 'upi' ? upiIdInput.trim() : undefined,
        label: paymentLabel.trim() || (paymentType === 'upi' ? 'UPI / GPay' : 'Cash on Delivery'),
        isDefault: true
      });
      showToast('Payment preference saved!');
      setIsAddingPayment(false);
      setUpiIdInput('');
    } catch (e: any) {
      showToast(e.message || 'Failed to save payment preference');
    } finally {
      setIsSavingPayment(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Name cannot be empty');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfileDetails(profileName, profilePhone);
      showToast('Profile updated successfully!');
    } catch (e: any) {
      showToast(e.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const savedAddresses = userProfile?.addresses || [];
  const savedPaymentMethods = userProfile?.paymentMethods || [];

  return (
    <div id="account-modal-overlay" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden h-[92vh] sm:h-auto sm:max-h-[88vh] flex flex-col"
      >
        {/* Header with User Info */}
        <div className="bg-gradient-to-r from-stone-900 via-[#35251D] to-[#241713] p-5 sm:p-6 text-white shrink-0 relative">
          <button
            id="btn-close-account-modal"
            onClick={() => setIsAccountModalOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Account"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl font-bold shadow-lg border border-amber-300/40 shrink-0">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span>{(userProfile?.displayName || currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 pr-8">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-white truncate">
                  {userProfile?.displayName || currentUser.displayName || 'Customer Account'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                  Customer
                </span>
              </div>
              <p className="text-xs text-stone-300 font-mono truncate mt-0.5">
                {currentUser.email}
              </p>
              {userProfile?.phone && (
                <p className="text-xs text-amber-300/90 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{userProfile.phone}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-200/70 bg-white px-3 sm:px-6 shrink-0 overflow-x-auto no-scrollbar">
          <button
            id="tab-account-addresses"
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Delivery Addresses ({savedAddresses.length})</span>
          </button>

          <button
            id="tab-account-payments"
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>Payment Methods</span>
          </button>

          <button
            id="tab-account-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>My Orders ({userOrders.length})</span>
          </button>

          <button
            id="tab-account-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4 text-amber-600" />
            <span>Profile Details</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-xs text-stone-500">
                    Your saved addresses are automatically used during 1-click checkout.
                  </p>
                </div>
                {!isAddingAddress && (
                  <button
                    id="btn-add-new-address"
                    onClick={handleOpenAddAddress}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Address Form */}
              {isAddingAddress && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleSaveAddress}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-300 shadow-sm space-y-3.5"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span>{editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={resetAddressForm}
                      className="text-stone-400 hover:text-stone-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Joshi"
                        value={addrFullName}
                        onChange={(e) => setAddrFullName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-amber-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Phone Number for Delivery *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-amber-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Flat / House No., Apartment & Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 304, Suryoday Heights, Paud Road"
                      value={addrLine1}
                      onChange={(e) => setAddrLine1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-amber-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="Near Temple / Garden"
                        value={addrLandmark}
                        onChange={(e) => setAddrLandmark(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-amber-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        City / Taluka *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Pune / Mumbai"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-amber-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="411038"
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-amber-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      {(['Home', 'Work', 'Other'] as const).map(lbl => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setAddrLabel(lbl)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            addrLabel === lbl
                              ? 'bg-amber-100 text-amber-900 border-amber-400'
                              : 'bg-stone-50 text-stone-600 border-stone-200'
                          }`}
                        >
                          {lbl === 'Home' && <Home className="w-3 h-3" />}
                          {lbl === 'Work' && <Building className="w-3 h-3" />}
                          <span>{lbl}</span>
                        </button>
                      ))}
                    </div>

                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addrIsDefault}
                        onChange={(e) => setAddrIsDefault(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Set as default address</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={resetAddressForm}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingAddress}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
                    >
                      {isSavingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Address List */}
              {savedAddresses.length === 0 && !isAddingAddress ? (
                <div className="p-8 text-center rounded-2xl bg-white border border-stone-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm">No Saved Addresses Yet</h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                      Add your home or office address to enable quick 1-click delivery for all your MS Masale orders.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer"
                  >
                    + Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-2xl bg-white border transition-all relative ${
                        addr.isDefault
                          ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                          : 'border-stone-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1">
                            {addr.label === 'Home' && <Home className="w-2.5 h-2.5" />}
                            {addr.label === 'Work' && <Building className="w-2.5 h-2.5" />}
                            <span>{addr.label}</span>
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Default</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSavedAddress(addr.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-stone-900">{addr.fullName}</p>
                        <p className="text-stone-600 leading-snug">{addr.addressLine1}</p>
                        {addr.landmark && (
                          <p className="text-stone-500 text-[11px]">Landmark: {addr.landmark}</p>
                        )}
                        <p className="text-stone-600 font-medium">
                          {addr.talukaDistrict}, {addr.state} - <span className="font-mono font-bold text-stone-900">{addr.pincode}</span>
                        </p>
                        <p className="text-stone-500 text-[11px] pt-1">
                          Phone: <span className="font-mono text-stone-800 font-semibold">{addr.phone}</span>
                        </p>
                      </div>

                      {!addr.isDefault && (
                        <div className="mt-3 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Set as default delivery address</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900">
                    Payment Methods & UPI
                  </h3>
                  <p className="text-xs text-stone-500">
                    Manage preferred UPI IDs and Cash on Delivery settings for instant ordering.
                  </p>
                </div>
                {!isAddingPayment && (
                  <button
                    onClick={() => setIsAddingPayment(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add UPI / Method</span>
                  </button>
                )}
              </div>

              {/* Add Payment Form */}
              {isAddingPayment && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleSavePayment}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-300 shadow-sm space-y-3.5"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span>Add Payment Preference</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingPayment(false)}
                      className="text-stone-400 hover:text-stone-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentType('upi')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        paymentType === 'upi'
                          ? 'bg-amber-50 text-amber-900 border-amber-400'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      UPI (Google Pay / PhonePe / Paytm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('cod')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        paymentType === 'cod'
                          ? 'bg-amber-50 text-amber-900 border-amber-400'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      Cash on Delivery (COD)
                    </button>
                  </div>

                  {paymentType === 'upi' && (
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Your UPI ID / VPA *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 9822000000@paytm or anand@oksbi"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-amber-600 outline-none font-mono"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">
                        Compatible with Google Pay, PhonePe, Paytm, BHIM, and all bank UPI apps.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      Label / Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anand's Primary PhonePe"
                      value={paymentLabel}
                      onChange={(e) => setPaymentLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:border-amber-600 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setIsAddingPayment(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingPayment}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-xs"
                    >
                      {isSavingPayment ? 'Saving...' : 'Save Method'}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Saved Payment Methods List */}
              <div className="space-y-3">
                {savedPaymentMethods.length === 0 && !isAddingPayment && (
                  <div className="p-6 text-center rounded-2xl bg-white border border-stone-200 space-y-2">
                    <CreditCard className="w-8 h-8 text-amber-600 mx-auto" />
                    <h4 className="font-bold text-stone-800 text-sm">No Saved UPI or Payment Preference</h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Save your UPI ID for frictionless checkout or pre-select Cash on Delivery as your default.
                    </p>
                    <button
                      onClick={() => setIsAddingPayment(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer mt-2"
                    >
                      + Add UPI / Payment Mode
                    </button>
                  </div>
                )}

                {savedPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-2xl bg-white border flex items-center justify-between gap-3 ${
                      method.isDefault
                        ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                        : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs">
                        {method.type === 'upi' ? 'UPI' : 'COD'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{method.label}</span>
                          {method.isDefault && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Preferred
                            </span>
                          )}
                        </div>
                        {method.upiId && (
                          <p className="text-xs font-mono text-stone-600 mt-0.5">{method.upiId}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <button
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                        >
                          Make Preferred
                        </button>
                      )}
                      <button
                        onClick={() => deletePaymentMethod(method.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Secure Payment Note */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <p className="text-[11px] leading-relaxed">
                    All transactions use RBI-approved 256-bit SSL encrypted UPI & Bank rails. We never store sensitive banking passwords.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900">
                    My Order History & GST Invoices
                  </h3>
                  <p className="text-xs text-stone-500">
                    Track live deliveries, review past batches, and download tax invoices.
                  </p>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white border border-stone-200 space-y-3">
                  <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
                  <h4 className="font-bold text-stone-800 text-sm">No Orders Found Yet</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Once you place an order, you will see real-time updates and invoices right here.
                  </p>
                  <button
                    onClick={() => {
                      setIsAccountModalOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer"
                  >
                    Shop MS Masale Storefront
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-amber-900">
                              #{order.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                              {order.orderStatus.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-stone-900">
                            ₹{order.totalAmount}
                          </span>
                          <p className="text-[10px] text-stone-500 uppercase font-semibold">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid via UPI'}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-stone-700">
                            <span>
                              {item.titleEn} ({item.size}) × {item.quantity}
                            </span>
                            <span className="font-mono font-medium text-stone-900">
                              ₹{item.totalPrice}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                        <button
                          onClick={() => openInvoiceModal(order)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-stone-600" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4 max-w-md">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  Profile & Contact Details
                </h3>
                <p className="text-xs text-stone-500">
                  Update your contact details for order notifications and OTPs.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Display / Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-amber-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Registered Email (Firebase Auth)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      disabled
                      value={currentUser.email || ''}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 text-xs sm:text-sm cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Primary Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 9822123456"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-amber-600 outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer mt-2"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer with Sign Out Button */}
        <div className="p-4 bg-stone-50 border-t border-amber-200/70 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 font-medium">
            Customer Helpline: <a href="tel:8591254237" className="font-bold text-amber-900 underline">8591254237</a>
          </div>

          <button
            id="btn-account-sign-out"
            onClick={() => {
              logout();
              showToast('Signed out successfully');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 border border-red-200 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
