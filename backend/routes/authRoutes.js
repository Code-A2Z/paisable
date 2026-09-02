// const express = require('express');
// const router = express.Router();
// const { signup, login, getMe, completeSetup } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');
// const { validateRegistration } = require('../middleware/validationMiddleware');

// router.post('/signup', validateRegistration, signup);
// router.post('/login', login);
// router.get('/me', protect, getMe);
// router.put('/setup', protect, completeSetup);

// module.exports = router;


const express = require('express');

const router = express.Router();

const {
  signup,
  login,
  getMe,
  completeSetup,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const { validateRegistration } = require('../middleware/validationMiddleware');

// Register
router.post('/signup', validateRegistration, signup);

// Login
router.post('/login', login);

// Get current user
router.get('/me', protect, getMe);

// Complete setup
router.put('/setup', protect, completeSetup);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router;