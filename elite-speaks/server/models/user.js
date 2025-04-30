const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points:   { type: Number, default: 0 }, // Elite Speaks points
  streak:   { type: Number, default: 0 }, // Days streak
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
