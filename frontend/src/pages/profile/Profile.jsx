import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  updateProfile,
  changePassword,
} from '../../redux/services/authService';
import {
  profileValidationSchema,
  changePasswordValidationSchema,
} from '../../utils/validators';
import {
  IoPersonOutline,
  IoMailOutline,
  IoKeyOutline,
  IoImageOutline,
  IoCalendarOutline,
} from 'react-icons/io5';
import { getInitials, formatDateTime } from '../../utils/helpers';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const handleUpdateProfile = async (values) => {
    await dispatch(updateProfile(values));
  };

  const handleChangePassword = async (values) => {
    const result = await dispatch(changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    }));
    if (result.success) {
      setIsChangePasswordModalOpen(false);
    }
  };

  return (
    <Layout>
      <div className="animate-fadeIn max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              {/* Avatar */}
              <div className="mb-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-100 dark:border-primary-900"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto bg-primary-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-primary-100 dark:border-primary-900">
                    {getInitials(user?.name)}
                  </div>
                )}
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {user?.email}
              </p>

              {/* Member Since */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <IoCalendarOutline />
                  <span>Member since {formatDateTime(user?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Profile Information
              </h3>
              <Formik
                initialValues={{
                  name: user?.name || '',
                  avatar: user?.avatar || '',
                }}
                validationSchema={profileValidationSchema}
                onSubmit={handleUpdateProfile}
                enableReinitialize
              >
                {({ values, errors, touched, handleChange, handleBlur }) => (
                  <Form>
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.name}
                      touched={touched.name}
                      icon={<IoPersonOutline />}
                      required
                    />

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={user?.email}
                      disabled
                      icon={<IoMailOutline />}
                      className="opacity-60"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-4">
                      Email cannot be changed
                    </p>

                    <Input
                      label="Avatar URL"
                      name="avatar"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={values.avatar}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.avatar}
                      touched={touched.avatar}
                      icon={<IoImageOutline />}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                    >
                      Update Profile
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>

            {/* Security Settings */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Security Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Keep your account secure by updating your password regularly
              </p>
              <Button
                variant="outline"
                icon={<IoKeyOutline />}
                onClick={() => setIsChangePasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>

            {/* Account Information */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Account ID</span>
                  <span className="text-gray-900 dark:text-white font-mono text-sm">
                    {user?._id || user?.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Account Created</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDateTime(user?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDateTime(user?.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          title="Change Password"
          size="md"
        >
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={changePasswordValidationSchema}
            onSubmit={handleChangePassword}
          >
            {({ values, errors, touched, handleChange, handleBlur, resetForm }) => (
              <Form>
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={values.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.currentPassword}
                  touched={touched.currentPassword}
                  icon={<IoKeyOutline />}
                  required
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.newPassword}
                  touched={touched.newPassword}
                  icon={<IoKeyOutline />}
                  required
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  icon={<IoKeyOutline />}
                  required
                />

                <div className="flex gap-3 mt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                  >
                    Change Password
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsChangePasswordModalOpen(false);
                      resetForm();
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    </Layout>
  );
};

export default Profile;