const express = require('express');
const router = express.Router();
const { signup, login, getMe, completeSetup, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegistration } = require('../middleware/validationMiddleware');

router.post('/signup', validateRegistration, signup);
router.post('/login', login);
router.post('/forgot-password',forgotPassword);
// frontend posts the token in the request body, not the url — keep the route as POST /reset-password
router.post('/reset-password',resetPassword);
router.get('/me', protect, getMe);
router.put('/setup', protect, completeSetup);

module.exports = router;
