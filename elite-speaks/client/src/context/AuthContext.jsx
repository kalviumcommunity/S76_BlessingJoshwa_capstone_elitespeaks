import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage or sessionStorage
    const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));
    
    if (userData) {
      setUser(userData.user);
    }
    setLoading(false);
  }, []);

  // Handle successful authentication (from any method)
  const login = (userData, remember = false) => {
    // Store in appropriate storage based on "Remember Me"
    if (remember) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }
    setUser(userData.user);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};