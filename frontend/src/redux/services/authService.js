import axiosInstance from '../../api/axios';
import { setLoading, setUser, updateUser, logout, setError } from '../slices/authSlice';
import toast from 'react-hot-toast';

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post('/users/register', userData);
    
    if (response.data.success) {
      dispatch(setUser(response.data.data));
      toast.success(response.data.message);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    dispatch(setError(message));
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post('/users/login', credentials);
    
    if (response.data.success) {
      dispatch(setUser(response.data.data));
      toast.success(response.data.message);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    dispatch(setError(message));
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const getProfile = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.get('/users/profile');
    
    if (response.data.success) {
      dispatch(updateUser(response.data.data));
      return { success: true, data: response.data.data };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch profile';
    dispatch(setError(message));
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.put('/users/profile', userData);
    
    if (response.data.success) {
      dispatch(updateUser(response.data.data));
      toast.success(response.data.message);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const changePassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.put('/users/change-password', passwordData);
    
    if (response.data.success) {
      toast.success(response.data.message);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to change password';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};


export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post('/users/forgot-password', { email });
    
    if (response.data.success) {
      toast.success(response.data.message);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send reset email';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

// NEW: Reset Password
export const resetPassword = (token, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axiosInstance.post(`/users/reset-password/${token}`, { password });
    
    if (response.data.success) {
      toast.success(response.data.message);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to reset password';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  } finally {
    dispatch(setLoading(false));
  }
};

// NEW: Handle Google Auth Callback
export const handleGoogleCallback = (token, userData) => (dispatch) => {
  try {
    dispatch(setUser({ token, user: userData }));
    toast.success('Successfully logged in with Google!');
    return { success: true };
  } catch (error) {
    const message = 'Failed to authenticate with Google';
    dispatch(setError(message));
    toast.error(message);
    return { success: false, message };
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
  toast.success('Logged out successfully');
};