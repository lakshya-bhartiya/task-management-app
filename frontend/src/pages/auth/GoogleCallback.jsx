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

    if (error) {
      console.error('Google auth error:', error);
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        console.log('Google auth success:', { token, user }); // Debug log
        dispatch(handleGoogleCallback(token, user));
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/login?error=invalid_callback');
      }
    } else {
      console.error('Missing token or user data');
      navigate('/login?error=missing_credentials');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <Loader size="xl" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Completing Google Sign In...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;