const User = require('./model.user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail, getPasswordResetEmailTemplate } = require('../../helper/emailService');

class UserService {
  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = new User({
      ...userData,
      authProvider: 'local'
    });
    await user.save();

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      },
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is Google user
    if (user.authProvider === 'google' && !user.password) {
      throw new Error('Please login with Google');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      },
      token
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is Google user
    if (user.authProvider === 'google' && !user.password) {
      throw new Error('Google users cannot change password. Please use Google account settings.');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  // Forgot Password
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('No user found with this email');
    }

    // Check if user is Google user
    if (user.authProvider === 'google' && !user.password) {
      throw new Error('Google users cannot reset password. Please use Google to login.');
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    const emailHtml = getPasswordResetEmailTemplate(resetUrl, user.name);
    
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - TaskManager',
      html: emailHtml,
    });

    if (!emailResult.success) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      throw new Error('Email could not be sent');
    }

    return { message: 'Password reset email sent successfully' };
  }

  // Reset Password
  async resetPassword(resetToken, newPassword) {
    // Hash token to compare with stored token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }

  // Google OAuth Login/Register
  async googleAuth(profile) {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Check if email already exists
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.authProvider = 'google';
        if (profile.photos && profile.photos.length > 0) {
          user.avatar = profile.photos[0].value;
        }
        await user.save();
      } else {
        // Create new user
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          authProvider: 'google',
        });
        await user.save();
      }
    }

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      },
      token
    };
  }

  generateToken(userId) {
    return jwt.sign(
      { userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }
}

module.exports = new UserService();