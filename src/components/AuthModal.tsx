import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Flame, X, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    signInWithGoogle,
    loginWithEmail,
    signupWithEmail,
    demoLogin,
    authError,
    clearAuthError
  } = useAuth();

  const { language, showToast } = useApp();
  const isMr = language === 'mr';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearAuthError();

    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
        showToast(isMr ? 'लॉगिन यशस्वी झाले! स्वागत आहे. 🙏' : 'Login successful! Welcome.');
      } else {
        await signupWithEmail(email, password, displayName || 'ग्राहक (Customer)', 'customer');
        showToast(isMr ? 'खाते यशस्वीरित्या तयार झाले! स्वागत आहे.' : 'Account created successfully! Welcome.');
      }
    } catch (err) {
      // Error managed in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      await signInWithGoogle();
      showToast(isMr ? 'गुगल लॉगिन यशस्वी झाले! 🌶️' : 'Google sign-in successful!');
    } catch (err) {
      // Error managed in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#F0EAE1] overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-[#2D2424] via-[#3C2A21] to-[#1E1717] p-6 text-white shrink-0">
          <button
            id="btn-close-auth-modal"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C84B31] flex items-center justify-center shadow-lg text-white">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {authMode === 'login' ? (isMr ? 'ग्राहक लॉगिन' : 'Customer Sign In') : (isMr ? 'नवीन खाते नोंदणी' : 'Create Account')}
                </span>
                <span className="text-xs text-white/60">• Firebase Auth</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white tracking-tight mt-0.5">
                {isMr ? 'एम एस मसाले' : 'MS Masale'}
              </h2>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#F0EAE1] bg-[#FDFBF7] p-1.5 shrink-0">
          <button
            id="tab-auth-login"
            onClick={() => {
              setAuthMode('login');
              clearAuthError();
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white text-[#C84B31] shadow-sm border border-[#F0EAE1]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {isMr ? '🔑 लॉगिन (Sign In)' : '🔑 Sign In'}
          </button>
          <button
            id="tab-auth-signup"
            onClick={() => {
              setAuthMode('signup');
              clearAuthError();
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              authMode === 'signup'
                ? 'bg-white text-[#C84B31] shadow-sm border border-[#F0EAE1]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {isMr ? '✨ नवीन नोंदणी (Sign Up)' : '✨ Create Account'}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Google Sign In Button */}
          <button
            id="btn-google-sign-in"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl border-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50 active:scale-[0.99] font-bold text-stone-700 flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isMr ? 'Google ने सुरक्षित लॉगिन करा' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px bg-stone-200 flex-1" />
            <span className="text-xs font-semibold uppercase text-stone-400">
              {isMr ? 'किंवा ईमेलने सुरू ठेवा' : 'or continue with email'}
            </span>
            <div className="h-px bg-stone-200 flex-1" />
          </div>

          {/* Error Banner */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2.5"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{authError}</span>
            </motion.div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isMr ? 'पूर्ण नाव (Full Name)' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder={isMr ? 'उदा. आनंद जोशी' : 'e.g. Anand Joshi'}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#C84B31] focus:ring-2 focus:ring-[#C84B31]/20 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {isMr ? 'ईमेल पत्ता (Email Address)' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#C84B31] focus:ring-2 focus:ring-[#C84B31]/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {isMr ? 'पासवर्ड (Password)' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#C84B31] focus:ring-2 focus:ring-[#C84B31]/20 outline-none"
                />
              </div>
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C84B31] to-[#A0331C] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authMode === 'login'
                      ? isMr
                        ? 'प्रवेश करा (Sign In)'
                        : 'Sign In'
                      : isMr
                      ? 'खाते तयार करा & खरेदी करा'
                      : 'Create Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Instant Role Logins for testing */}
          <div className="pt-2 border-t border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <span>⚡ {isMr ? '१-क्लिक झटपट स्टाफ लॉगिन' : '1-Click Instant Staff Access'}</span>
              <span className="text-[10px] text-stone-400">Direct Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  demoLogin('admin');
                  showToast(isMr ? '👑 ऋषिकेश (ॲडमिन) म्हणून लॉगिन केले' : 'Logged in as Rushikesh (Admin)');
                }}
                className="p-2.5 rounded-xl text-left bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
              >
                <span className="text-base">👑</span>
                <div className="min-w-0">
                  <div className="truncate">{isMr ? 'ऋषिकेश (ॲडमिन)' : 'Rushikesh (Admin)'}</div>
                  <div className="text-[9px] text-red-600 font-normal truncate">Founder & Owner HQ</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  demoLogin('manager');
                  showToast('Logged in as Workshop Manager');
                }}
                className="p-2.5 rounded-xl text-left bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
              >
                <span className="text-base">👨‍🍳</span>
                <div className="min-w-0">
                  <div className="truncate">Workshop Manager</div>
                  <div className="text-[9px] text-amber-600 font-normal truncate">Workshop & Production</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  demoLogin('delivery', 'mukund');
                  showToast(isMr ? '🛵 मुकुंद (रायडर) म्हणून लॉगिन केले' : 'Logged in as Mukund (Rider)');
                }}
                className="p-2.5 rounded-xl text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
              >
                <span className="text-base">🛵</span>
                <div className="min-w-0">
                  <div className="truncate">{isMr ? 'मुकुंद (रायडर १)' : 'Mukund (Rider 1)'}</div>
                  <div className="text-[9px] text-blue-600 font-normal truncate">Pune City Fleet</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  demoLogin('delivery', 'vishal');
                  showToast(isMr ? '🛵 विशाल (रायडर) म्हणून लॉगिन केले' : 'Logged in as Vishal (Rider)');
                }}
                className="p-2.5 rounded-xl text-left bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
              >
                <span className="text-base">🛵</span>
                <div className="min-w-0">
                  <div className="truncate">{isMr ? 'विशाल (रायडर २)' : 'Vishal (Rider 2)'}</div>
                  <div className="text-[9px] text-indigo-600 font-normal truncate">PCMC & Hinjewadi</div>
                </div>
              </button>
            </div>

            {/* Customer storefront demo button */}
            <button
              type="button"
              onClick={() => {
                demoLogin('customer');
                showToast(isMr ? '🛒 ग्राहक म्हणून लॉगिन केले' : 'Logged in as Customer');
              }}
              className="w-full p-2 rounded-xl text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all cursor-pointer flex items-center justify-between text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <span>🛒</span>
                <span>{isMr ? 'आनंदराव पाटील (ग्राहक डेमो)' : 'Anand Patil (Customer Demo)'}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Storefront Portal</span>
            </button>
          </div>

          {/* Guarantee Tag */}
          <div className="p-3 rounded-2xl bg-[#FDFBF7] border border-[#F0EAE1] text-xs text-stone-600 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-stone-500">
              {isMr
                ? 'तुमचा डेटा १००% सुरक्षित आणि गोपनीय आहे.'
                : 'Your data and delivery address are 100% encrypted & secure.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

