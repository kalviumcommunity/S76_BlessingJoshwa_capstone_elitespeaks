const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user id to request
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

module.exports = auth;