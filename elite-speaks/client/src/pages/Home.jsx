import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Background from '../assets/background.jpg';
import { fetchWithAuth } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user: contextUser } = useContext(AuthContext);
  
  // Enhanced cookie getter with better error handling
  const getCookie = (name) => {
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    } catch (error) {
      console.error('Error parsing cookie:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check for Google auth parameters in URL
    const query = new URLSearchParams(location.search);
    const googleAuthSuccess = query.get('google_auth') === 'success';
    const token = query.get('token');
    const userDataParam = query.get('userData');
    
    // If we have Google auth data in the URL, process it
    if (googleAuthSuccess && token && userDataParam) {
      try {
        console.log("Found Google auth parameters in URL");
        // Decode and parse the user data
        const parsedUser = JSON.parse(decodeURIComponent(userDataParam));
        
        // Save to context and storage
        login({ 
          token: token, 
          user: parsedUser 
        }, true); // Store persistently
        
        // Set user in component state
        setUser(parsedUser);
        setIsLoading(false);
        
        // Clean the URL by removing the auth parameters
        window.history.replaceState({}, document.title, '/home');
        return;
      } catch (error) {
        console.error('Error processing Google auth data from URL:', error);
      }
    }

    // First check if the user is already in context
    if (contextUser) {
      console.log("User already in AuthContext:", contextUser.username);
      setUser(contextUser);
      setIsLoading(false);
      return;
    }
    
    // Then check local/session storage
    const userData = JSON.parse(localStorage.getItem('userData')) || 
                    JSON.parse(sessionStorage.getItem('userData'));
    
    if (userData && userData.user && userData.token) {
      console.log("Found user in storage:", userData.user.username);
      setUser(userData.user);
      setIsLoading(false);
      return;
    }

    // Finally check for cookies (for Google OAuth flow)
    console.log("Checking for auth cookies in Home...");
    const authToken = getCookie('auth_token');
    const userDataCookie = getCookie('user_data');
    
    console.log("Home page cookie check:", {
      authTokenExists: !!authToken,
      userDataExists: !!userDataCookie,
      fullCookies: document.cookie
    });

    if (authToken && userDataCookie) {
      try {
        const parsedUser = JSON.parse(userDataCookie);
        console.log("Found valid auth cookies, logging in user:", parsedUser);
        
        // Save to context & session storage
        login({ token: authToken, user: parsedUser }, false);
        
        // Set user state
        setUser(parsedUser);
        
        // Clear cookies after transferring to storage
        document.cookie = 'auth_token=; Max-Age=0; path=/;';
        document.cookie = 'user_data=; Max-Age=0; path=/;';
      } catch (error) {
        console.error('Error processing auth cookies in Home:', error);
        navigate('/signin');
      }
    } else if (!user && !contextUser) {
      console.log("No user authentication found, redirecting to signin");
      navigate('/signin');
    }
    
    setIsLoading(false);
  }, [navigate, login, contextUser, location.search]);

  // Extract first name from username
  const getFirstName = () => {
    if (!user) return '';
    return user.username.split(' ')[0];
  };

  const handleSignOut = () => {
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    navigate('/signin');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not loaded yet after loading completes, show error
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50 p-6">
        <div className="text-red-600 text-xl mb-4">Authentication Error</div>
        <p className="text-center mb-4">Unable to verify your login status. Please try signing in again.</p>
        <button 
          onClick={() => navigate('/signin')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Return to Sign In
        </button>
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