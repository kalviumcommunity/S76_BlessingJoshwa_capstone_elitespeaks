const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT || 5000}/api/auth/google/callback`,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google auth callback received profile:', {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value
      });
      
      // Check if email exists in the profile
      if (!profile.emails || !profile.emails[0]?.value) {
        return done(new Error('Email not provided from Google account'), null);
      }

      const email = profile.emails[0].value;
      
      // Check if user already exists by email
      let user = await User.findOne({ email });
      
      if (user) {
        console.log('Existing user found by email:', user.username);
        
        // Update googleId if not already set
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
          console.log('Updated existing user with Google ID');
        }
        
        // Return user
        return done(null, user);
      } else {
        // Create new user with Google profile info
        console.log('Creating new user for Google profile');
        
        // Generate a username from email or display name
        let username = email.split('@')[0] || 
                       profile.displayName?.replace(/\s+/g, '_').toLowerCase() ||
                       `user_${profile.id.substring(0, 8)}`;
        
        // Make sure username is unique
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          username = `${username}_${Math.floor(Math.random() * 1000)}`;
        }
        
        const newUser = new User({
          username,
          name: profile.displayName || 'Google User',
          email,
          googleId: profile.id,
        });
        
        await newUser.save();
        console.log('New user created:', newUser.username);
        return done(null, newUser);
      }
    } catch (error) {
      console.error('Error in Google authentication:', error);
      return done(error, null);
    }
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;