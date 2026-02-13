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
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        dispatch(handleGoogleCallback(token, user));
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/login?error=invalid_callback');
      }
    } else {
      navigate('/login?error=missing_credentials');
    }
  }, [searchParams, navigate, dispatch]);

  return <Loader fullScreen />;
};

export default GoogleCallback;