import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LayoutDashboard, Map, LogOut, User, FileText } from 'lucide-react';
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ user }) => {
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-[#0B0F1A] 
                    shadow-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/Logo_transparent.png" 
                alt="Mapify OS Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Mapify OS
              </span>
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4">

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary-100 dark:bg-blue-900 text-primary-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            {/* Map */}
            <Link
              to="/map"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/map')
                  ? 'bg-primary-100 dark:bg-blue-900 text-primary-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Map className="h-4 w-4" />
              <span>Map</span>
            </Link>

            {/* Docs */}
            <Link
              to="/docs"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/docs')
                  ? 'bg-primary-100 dark:bg-blue-900 text-primary-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Docs</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4">

              {/* User */}
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
                           text-gray-600 dark:text-gray-300 
                           hover:text-gray-900 dark:hover:text-white 
                           hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>

              {/* Theme Toggle */}
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
