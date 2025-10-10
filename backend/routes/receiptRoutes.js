const express = require('express');
const router = express.Router();
const { uploadReceipt, saveTransactionFromReceipt } = require('../controllers/receiptController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', protect, upload, uploadReceipt);
router.post('/save-transaction', protect, saveTransactionFromReceipt);

module.exports = router;