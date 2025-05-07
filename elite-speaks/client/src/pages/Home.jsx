import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../assets/background.jpg';
import { fetchWithAuth } from '../utils/api';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in with token
    const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));
    
    if (userData && userData.user && userData.token) {
      setUser(userData.user);
    } else {
      // Redirect to signin if not logged in
      navigate('/signin');
    }
  }, [navigate]);

  // Extract first name from username (assuming username might be full name)
  const getFirstName = () => {
    if (!user) return '';
    return user.username.split(' ')[0];
  };

  const handleSignOut = () => {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    navigate('/signin');
  };

  // If user is not loaded yet, show loading
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${Background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mt-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ fontFamily: '"Inria Serif", serif' }}>
              Welcome to Elite Speaks, {getFirstName()}!
            </h1>
            <p className="text-gray-600 mt-4" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>
              Your language learning journey continues here.
            </p>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: '"Inria Serif", serif' }}>
              Your Profile
            </h2>
            <div className="space-y-2">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;