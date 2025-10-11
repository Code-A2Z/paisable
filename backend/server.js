const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const axios = require('axios');
const cron = require('node-cron');
require('./cron');

const { sanitizeMiddleware } = require("./middleware/sanitizeMiddleware");
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Allowed CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://paisable.netlify.app",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// sanitizeMiddleware
app.use(sanitizeMiddleware());

// -------------------- RATE LIMITERS -------------------- //
// Sensitive routes limiter (e.g., auth)
const sensitiveLimiter = new RateLimiterMemory({
  points: 5,       // 5 requests
  duration: 10,    // per 10 seconds
});

// Public routes limiter (e.g., transactions, receipts)
const publicLimiter = new RateLimiterMemory({
  points: 20,      // 20 requests
  duration: 10,    // per 10 seconds
});

// Middleware wrapper
const rateLimitMiddleware = (limiter) => async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ message: 'Too Many Requests. Slow down!' });
  }
};
// ------------------------------------------------------- //

// Routes with rate limiting
app.use('/api/auth', rateLimitMiddleware(sensitiveLimiter), require('./routes/authRoutes'));
app.use('/api/transactions', rateLimitMiddleware(publicLimiter), require('./routes/transactionRoutes'));
app.use('/api/receipts', rateLimitMiddleware(publicLimiter), require('./routes/receiptRoutes'));
app.use('/api/users', rateLimitMiddleware(publicLimiter), require('./routes/userRoutes'));
app.use('/api/budgets', rateLimitMiddleware(publicLimiter), require('./routes/budgetRoutes'));
app.use('/api/recurring', rateLimitMiddleware(publicLimiter), require('./routes/recurringTransactionRoutes'));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API is Running');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Keep-alive cron job every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  const keepAliveUrl = process.env.KEEP_ALIVE_URL;
  if (!keepAliveUrl) {
    console.error("KEEP_ALIVE_URL environment variable is not set. Skipping keep-alive ping.");
    return;
  }

  try {
    await axios.get(keepAliveUrl);
    console.log("Keep-alive ping sent!");
  } catch (error) {
    console.error("Keep-alive FAILED!", error.message);
  }
});

module.exports = { app, server };
