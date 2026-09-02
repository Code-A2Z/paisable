// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// // Function to generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// // @desc    Register a new user
// // @route   POST /api/auth/signup
// // @access  Public
// const signup = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Please enter all fields' });
//   }

//   try {
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       email,
//       password,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         email: user.email,
//         token: generateToken(user._id),
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// // @desc    Authenticate user & get token
// // @route   POST /api/auth/login
// // @access  Public
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.json({
//         _id: user._id,
//         email: user.email,
//         token: generateToken(user._id),
//         isSetupComplete: user.isSetupComplete,
//         defaultCurrency: user.defaultCurrency,
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// // @desc    Get user data
// // @route   GET /api/auth/me
// // @access  Private
// const getMe = async (req, res) => {
//   // The user is already available in req.user
//   res.status(200).json(req.user);
// };

// // @desc    Complete user setup
// // @route   PUT /api/auth/setup
// // @access  Private
// const completeSetup = async (req, res) => {
//   const { defaultCurrency } = req.body;

//   if (!defaultCurrency) {
//     return res.status(400).json({ message: 'Default currency is required' });
//   }

//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { 
//         defaultCurrency,
//         isSetupComplete: true 
//       },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       _id: user._id,
//       email: user.email,
//       defaultCurrency: user.defaultCurrency,
//       isSetupComplete: user.isSetupComplete,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// };

// module.exports = {
//   signup,
//   login,
//   getMe,
//   completeSetup,
// };

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ============================================================
// Generate JWT
// ============================================================

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ============================================================
// Register a new user
// POST /api/auth/signup
// Public
// ============================================================

const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Please enter all fields',
    });
  }

  try {
    const userExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        isSetupComplete: user.isSetupComplete,
        defaultCurrency: user.defaultCurrency,
      });
    } else {
      res.status(400).json({
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    console.error('Signup error:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ============================================================
// Authenticate user
// POST /api/auth/login
// Public
// ============================================================

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        isSetupComplete: user.isSetupComplete,
        defaultCurrency: user.defaultCurrency,
      });
    } else {
      res.status(401).json({
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ============================================================
// Get user data
// GET /api/auth/me
// Private
// ============================================================

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// ============================================================
// Complete user setup
// PUT /api/auth/setup
// Private
// ============================================================

const completeSetup = async (req, res) => {
  const { defaultCurrency } = req.body;

  if (!defaultCurrency) {
    return res.status(400).json({
      message: 'Default currency is required',
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        defaultCurrency,
        isSetupComplete: true,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      defaultCurrency: user.defaultCurrency,
      isSetupComplete: user.isSetupComplete,
    });
  } catch (error) {
    console.error('Setup error:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ============================================================
// Forgot Password
// POST /api/auth/forgot-password
// Public
// ============================================================

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email is required',
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Don't reveal whether the email exists
    if (!user) {
      return res.status(200).json({
        message:
          'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing it
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;

    // Token expires after 15 minutes
    user.resetPasswordExpire = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // Temporary reset URL for local development
    const resetUrl =
      `http://localhost:5173/reset-password?token=${resetToken}`;

    // Show reset link in backend terminal for now
    console.log('');
    console.log('==========================================');
    console.log('PASSWORD RESET LINK');
    console.log('==========================================');
    console.log(resetUrl);
    console.log('==========================================');
    console.log('');

    res.status(200).json({
      message:
        'If an account exists with this email, a password reset link has been generated.',
      resetUrl,
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ============================================================
// Reset Password
// POST /api/auth/reset-password
// Public
// ============================================================

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      message: 'Token and new password are required',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long',
    });
  }

  try {
    // Hash the token received from the frontend
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid, non-expired reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Password reset token is invalid or has expired',
      });
    }

    // Set new password.
    // User.js pre-save middleware will automatically hash it.
    user.password = password;

    // Delete reset token so it cannot be reused
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
      message: 'Password reset successful. You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);

    res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

// ============================================================
// Export Controllers
// ============================================================

module.exports = {
  signup,
  login,
  getMe,
  completeSetup,
  forgotPassword,
  resetPassword,
};