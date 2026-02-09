import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Map as MapIcon, Globe } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createUserDocument = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      createdAt: new Date().toISOString()
    }, { merge: true });
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserDocument(userCredential.user);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0" />
      <div className="absolute inset-0 opacity-20 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] filter contrast-120 brightness-100" />

      {/* Animated Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-600/30 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary-600/30 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="glass-card rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl bg-white/5">
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl mb-6 shadow-glow ring-1 ring-white/20 backdrop-blur-md">
              <MapIcon className="h-10 w-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join Mapify OS'}
            </h1>
            <p className="text-gray-400 font-light text-lg">
              {isLogin ? 'Enter your coordinates to continue' : 'Start your journey with open maps'}
            </p>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3.5 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/30 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg group"
          >
            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-[#0f1218] px-3 py-1 rounded-full text-xs text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in backdrop-blur-sm">
                <p className="text-sm text-red-400 flex items-center font-medium">
                  <span className="mr-2 text-lg">⚠️</span> {error}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 ml-1">Email address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative py-3.5 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-bold shadow-lg shadow-primary-500/25 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center relative z-10">
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-primary-400 hover:text-primary-300 focus:outline-none hover:underline transition-colors decoration-2 underline-offset-4"
              >
                {isLogin ? 'Sign up for free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

