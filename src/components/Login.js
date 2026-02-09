import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validate password match for sign up
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match. Please make sure both passwords are identical.');
      setLoading(false);
      return;
    }

    // Validate password length
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Left Side - Map Image with Enhanced Design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/50 to-purple-900/60"></div>
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/Map.png')`
          }}
        >
          <div className="relative z-10 flex flex-col justify-center h-full px-12 text-white">
            <div className="mb-6 animate-fade-in">
              <img 
                src="/Logo_transparent.png" 
                alt="Mapify OS Logo" 
                className="h-28 w-auto mb-4 drop-shadow-2xl"
              />
            </div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg animate-slide-up">
              Explore the World with 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 mt-2">
                Open Source Maps
              </span>
            </h1>
            <p className="text-xl text-gray-100 mb-10 leading-relaxed drop-shadow-md max-w-lg">
              The open, customizable alternative to Google Maps with built-in authentication and developer APIs.
            </p>
            <div className="space-y-5">
              <div className="flex items-center space-x-4 backdrop-blur-sm bg-white/10 p-3 rounded-lg transform transition-all hover:scale-105">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-white font-medium">Multiple map layers (Terrain, Satellite, Dark)</span>
              </div>
              <div className="flex items-center space-x-4 backdrop-blur-sm bg-white/10 p-3 rounded-lg transform transition-all hover:scale-105">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                <span className="text-white font-medium">Smart search for nearby locations</span>
              </div>
              <div className="flex items-center space-x-4 backdrop-blur-sm bg-white/10 p-3 rounded-lg transform transition-all hover:scale-105">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                <span className="text-white font-medium">Developer-friendly API access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-md w-full">
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-xl bg-white/80 shadow-2xl rounded-3xl p-8 lg:p-10 border border-white/20">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <img 
                src="/Logo_transparent.png" 
                alt="Mapify OS Logo" 
                className="h-16 w-auto mx-auto mb-2 drop-shadow-lg"
              />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-gray-600 text-base">
                {isLogin 
                  ? 'Login using one of the following providers:' 
                  : 'Create your account to start exploring:'
                }
              </p>
            </div>

            {/* Enhanced OAuth Button */}
            <div className="mb-6">
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field - Only shown during Sign Up */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder-gray-400"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <p className={`text-xs mt-2 font-medium ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                      {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg transform hover:scale-[1.02] active:scale-[0.98] hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait...
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                {isLogin ? "New to Mapify OS? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setConfirmPassword('');
                  }}
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:underline transition-all"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            <div className="text-center text-xs text-gray-500 mt-6">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Terms of Use</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
