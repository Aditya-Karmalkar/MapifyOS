import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'glass border-b border-white/20 dark:border-gray-800/50'
        : 'bg-transparent dark:bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                <img
                  src="/Logo_transparent.png"
                  alt="Mapify OS Logo"
                  className="h-10 w-auto relative transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">
                Mapify OS
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive('/dashboard')
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                >
                  Dashboard
                  {isActive('/dashboard') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-fade-in"></span>
                  )}
                </Link>
                <Link
                  to="/map"
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive('/map')
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                >
                  Map
                  {isActive('/map') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-fade-in"></span>
                  )}
                </Link>
                <Link
                  to="/docs"
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive('/docs')
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                >
                  Docs
                  {isActive('/docs') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-fade-in"></span>
                  )}
                </Link>
              </>
            )}

            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-full">
                      <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-lg">
          {user && (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/map"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Map
              </Link>
              <Link
                to="/docs"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Documentation
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-3 py-2">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {user.displayName || user.email?.split('@')[0]}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="mt-3 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
