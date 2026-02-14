import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleGoogleCallback } from '../../redux/services/authService';
import Loader from '../../components/common/Loader';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const userString = searchParams.get('user');
    const error = searchParams.get('error');

    console.log('Google Callback - Token:', token);
    console.log('Google Callback - User:', userString);

    if (error) {
      console.error('Google auth error:', error);
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        console.log('Parsed user data:', user);
        dispatch(handleGoogleCallback(token, user));
        
        // Small delay before redirect
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/login?error=invalid_callback');
      }
    } else {
      console.error('Missing credentials');
      navigate('/login?error=missing_credentials');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          Completing Google Sign In...
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Please wait a moment
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;