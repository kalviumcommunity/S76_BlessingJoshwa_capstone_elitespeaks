const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  }, // Instagram-like unique username
  name: { 
    type: String, 
    required: true 
  }, // Full name (keep existing field)
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String,
    // Only required if not using Google auth
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  }
  // Any other fields you have
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;