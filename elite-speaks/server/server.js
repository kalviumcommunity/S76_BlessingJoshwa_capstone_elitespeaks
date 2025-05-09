const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database');
const dotenv = require('dotenv');
const passport = require('./config/Passport');
const session = require('express-session');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent across domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session middleware for passport
app.use(session({
  secret: process.env.JWT_SECRET || 'elite-speaks-secret',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());

// Connect to Database
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'EliteSpeaks API is running' });
});

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/topics', topicRoutes);
// app.use('/api/progress', progressRoutes);

// Start server
app.listen(port, () => {
    console.log(`EliteSpeaks server running on port http://localhost:${port}`);
});