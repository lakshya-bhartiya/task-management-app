import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const taskValidationSchema = Yup.object({
  title: Yup.string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(1000, 'Description must not exceed 1000 characters'),
  status: Yup.string()
    .oneOf(['todo', 'in-progress', 'completed'], 'Invalid status'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority'),
  category: Yup.string()
    .max(50, 'Category must not exceed 50 characters'),
  tags: Yup.array()
    .of(Yup.string().max(30, 'Tag must not exceed 30 characters')),
  dueDate: Yup.date()
    .nullable(),
});

export const profileValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),
  avatar: Yup.string()
    .url('Invalid URL')
    .nullable(),
});

export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

// NEW: Forgot password schema
export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

// NEW: Reset password schema
export const resetPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});