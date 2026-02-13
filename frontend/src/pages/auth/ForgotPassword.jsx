import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { forgotPasswordValidationSchema } from '../../utils/validators';
import { forgotPassword } from '../../redux/services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { IoMail, IoCheckboxOutline, IoArrowBack } from 'react-icons/io5';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [emailSent, setEmailSent] = useState(false);

  const initialValues = {
    email: '',
  };

  const handleSubmit = async (values) => {
    const result = await dispatch(forgotPassword(values.email));
    if (result.success) {
      setEmailSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <IoCheckboxOutline className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {emailSent 
              ? "Check your email for reset instructions"
              : "No worries, we'll send you reset instructions"}
          </p>
        </div>

        {/* Form or Success Message */}
        <div className="card">
          {emailSent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoMail className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Email Sent!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent password reset instructions to your email address.
                Please check your inbox and spam folder.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setEmailSent(false)}
                >
                  Resend Email
                </Button>
                <Link to="/login">
                  <Button variant="secondary" fullWidth icon={<IoArrowBack />}>
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Formik
                initialValues={initialValues}
                validationSchema={forgotPasswordValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur }) => (
                  <Form>
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.email}
                      touched={touched.email}
                      icon={<IoMail />}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      loading={loading}
                      className="mt-6"
                    >
                      Send Reset Link
                    </Button>
                  </Form>
                )}
              </Formik>

              {/* Footer */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  <IoArrowBack />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;