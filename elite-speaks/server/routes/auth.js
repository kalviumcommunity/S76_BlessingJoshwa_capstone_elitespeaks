const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Login Route
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    // Don't send password in response
    const userResponse = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    res.status(200).json({ 
      message: "Login successful", 
      user: userResponse,
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Signup Route
router.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  const { username, name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already in use" });
    
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already taken" });

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    // Don't send the password back in the response
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({ 
      message: "User created successfully", 
      user: userResponse,
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Don't forget to export the router
module.exports = router;