const express = require('express');
const router = express.Router();
const { signup, login, getMe, completeSetup } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegistration } = require('../middleware/validationMiddleware');

router.post('/signup', validateRegistration, signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/setup', protect, completeSetup);

module.exports = router;