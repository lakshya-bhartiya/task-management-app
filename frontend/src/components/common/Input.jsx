import React, { useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { classNames } from '../../utils/helpers';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  required = false,
  icon = null,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine if this is a password field
  const isPasswordField = type === 'password';
  
  // Actual input type (toggle between password and text)
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className={classNames('mb-4', className)}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={classNames(
            'input',
            icon && 'pl-10',
            isPasswordField && 'pr-10',
            error && touched && 'input-error'
          )}
          {...props}
        />

        {/* Password Toggle Button */}
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <IoEyeOffOutline className="text-xl" />
            ) : (
              <IoEyeOutline className="text-xl" />
            )}
          </button>
        )}
      </div>
      
      {error && touched && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;