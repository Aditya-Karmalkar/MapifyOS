import React, { useState, useEffect, useRef } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, CheckCircle, RefreshCw, LogOut } from 'lucide-react';

const EmailVerification = ({ user, onVerificationCheck }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const emailSentRef = useRef(false); // Use ref to prevent double sending

  // Send verification email on component mount if not already sent
  useEffect(() => {
    const sendInitialEmail = async () => {
      // Check ref to prevent double execution
      if (emailSentRef.current) {
        console.log('📧 Email already sent, skipping...');
        return;
      }
      
      const currentUser = auth.currentUser;
      if (!currentUser || currentUser.emailVerified) return;
      
      // Check if this is a Google user (skip verification)
      const isGoogleUser = currentUser.providerData && 
        currentUser.providerData.some(provider => provider.providerId === 'google.com');
      if (isGoogleUser) return;
      
      // Mark as sent immediately to prevent race condition
      emailSentRef.current = true;
      
      console.log('📧 EmailVerification mounted, sending initial verification email...');
      
      try {
        const actionCodeSettings = {
          url: window.location.origin + '/login',
          handleCodeInApp: false,
        };
        
        await sendEmailVerification(currentUser, actionCodeSettings);
        console.log('✓ Initial verification email sent on component mount!');
      } catch (error) {
        console.error('⚠️ Failed to send initial verification email:', error.code, error.message);
        // Reset ref if sending failed so user can try resend button
        emailSentRef.current = false;
      }
    };
    
    sendInitialEmail();
  }, []); // Empty dependency array - only run once on mount

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      // Use auth.currentUser to get the latest user instance
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('No user logged in. Please try logging in again.');
        setLoading(false);
        return;
      }
      
      console.log('Resending verification email to:', currentUser.email);
      
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      };
      
      await sendEmailVerification(currentUser, actionCodeSettings);
      console.log('✓ Resend successful!');
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('✗ Resend failed:', error.code, error.message);
      if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError('Failed to send verification email. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      // Use auth.currentUser to get the latest user instance
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('No user logged in. Please try logging in again.');
        setLoading(false);
        return;
      }
      
      console.log('🔍 Checking verification status for:', currentUser.email);
      // Reload user to get the latest emailVerified status
      await currentUser.reload();
      
      if (auth.currentUser.emailVerified) {
        console.log('✓ Email verified!');
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => {
          onVerificationCheck();
        }, 1000);
      } else {
        console.log('✗ Email not verified yet');
        setError('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      console.error('Check verification error:', error);
      setError('Failed to check verification status. Please try again.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Mail className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a verification link to
          </p>
          <p className="text-primary-600 font-medium mt-1">
            {user?.email}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Please check your inbox and click the verification link to activate your account. 
            After verifying, click the "I've Verified My Email" button below.
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCheckVerification}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {loading ? 'Checking...' : "I've Verified My Email"}
          </button>

          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Resend Verification Email
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or click resend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

