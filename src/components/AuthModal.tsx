import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Flame, X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    signInWithGoogle,
    loginWithEmail,
    signupWithEmail,
    authError,
    clearAuthError
  } = useAuth();

  const { showToast } = useApp();

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
        showToast('Login successful! Welcome to MS Masale.');
      } else {
        await signupWithEmail(email, password, displayName || 'Customer');
        showToast('Account created successfully! Welcome to MS Masale.');
      }
    } catch {
      // Error message is caught and set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      await signInWithGoogle();
      showToast('Google sign-in successful! Welcome to MS Masale.');
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setAuthMode('login');
    setEmail('anand.joshi@gmail.com');
    setPassword('password123');
    clearAuthError();
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden max-h-[94vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-stone-900 via-[#3C2A21] to-[#251814] p-5 sm:p-6 text-white shrink-0">
          <button
            id="btn-close-auth-modal"
            onClick={() => {
              setIsAuthModalOpen(false);
              clearAuthError();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg text-white shrink-0">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  {authMode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white tracking-tight mt-0.5">
                MS Masale
              </h2>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-amber-100 bg-[#FFFDF9] p-1.5 shrink-0">
          <button
            id="tab-auth-login"
            onClick={() => {
              setAuthMode('login');
              clearAuthError();
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-stone-900 shadow-xs border border-amber-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-auth-signup"
            onClick={() => {
              setAuthMode('signup');
              clearAuthError();
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Quick Demo Credentials helper */}
          {authMode === 'login' && (
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-2 text-xs">
              <span className="text-amber-900 font-medium truncate">
                Existing user test: <span className="font-mono font-bold">anand.joshi@gmail.com</span>
              </span>
              <button
                type="button"
                onClick={fillDemoAccount}
                className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            id="btn-google-sign-in"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-2xl border border-stone-300 hover:border-stone-400 hover:bg-stone-50 active:scale-[0.99] font-bold text-stone-800 flex items-center justify-center gap-3 transition-all shadow-2xs cursor-pointer text-xs sm:text-sm"
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
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px bg-stone-200 flex-1" />
            <span className="text-[11px] font-semibold uppercase text-stone-400">
              or continue with email
            </span>
            <div className="h-px bg-stone-200 flex-1" />
          </div>

          {/* Error Banner */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium flex items-start gap-2.5"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
              <div className="flex-1">
                <p>{authError}</p>
                {authError.includes('Create Account') && authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      clearAuthError();
                    }}
                    className="mt-1.5 text-xs font-bold text-red-900 underline block cursor-pointer"
                  >
                    Click here to create a new account
                  </button>
                )}
                {authError.includes('Sign In') && authMode === 'signup' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      clearAuthError();
                    }}
                    className="mt-1.5 text-xs font-bold text-red-900 underline block cursor-pointer"
                  >
                    Click here to sign in with your password
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Joshi"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Password
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 outline-none transition-all"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {authMode === 'signup' ? 'Password must be at least 6 characters' : ''}
              </p>
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authMode === 'login'
                      ? 'Sign In to Account'
                      : 'Create Account & Continue'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick toggle link */}
          <div className="text-center pt-2">
            {authMode === 'login' ? (
              <p className="text-xs text-stone-600">
                New customer at MS Masale?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    clearAuthError();
                  }}
                  className="font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    clearAuthError();
                  }}
                  className="font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Security Guarantee Tag */}
          <div className="p-3 rounded-2xl bg-[#FFFDF9] border border-amber-200/60 text-xs text-stone-600 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[11px] text-stone-600">
              Your profile, addresses, and order details are 100% secure and private.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
