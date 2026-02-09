import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import Docs from './components/Docs';
import Documentation from './components/Documentation';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import Navbar from './components/Navbar';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#0B0F1A] text-black dark:text-white min-h-screen">
      {user && location.pathname !== '/map' && <Navbar user={user} />}
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/map" 
          element={user ? <MapView user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/docs" 
          element={<Docs />} 
        />
        <Route 
          path="/documentation" 
          element={<Documentation />} 
        />
        <Route 
          path="/terms" 
          element={<TermsOfUse />} 
        />
        <Route 
          path="/privacy" 
          element={<PrivacyPolicy />} 
        />
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
