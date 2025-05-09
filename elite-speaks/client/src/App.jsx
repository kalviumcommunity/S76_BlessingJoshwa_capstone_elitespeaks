import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Home from './pages/Home';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useEffect, useState, useContext } from 'react';

// Update the ProtectedRoute component:

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check URL parameters for Google auth data
    const query = new URLSearchParams(location.search);
    const googleAuthSuccess = query.get('google_auth') === 'success';
    const token = query.get('token');
    const userDataParam = query.get('userData');
    
    if (googleAuthSuccess && token && userDataParam) {
      try {
        console.log("Found Google auth parameters in URL in ProtectedRoute");
        const parsedUser = JSON.parse(decodeURIComponent(userDataParam));
        
        // Load into context and storage
        login({
          token: token,
          user: parsedUser
        }, true);
        
        // Clean URL by removing the auth parameters
        window.history.replaceState({}, document.title, '/home');
        
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error processing Google auth data from URL in ProtectedRoute:', error);
      }
    }
    
    // First check if user is already in context
    if (user) {
      console.log("User already in context, authenticating:", user.username);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    
    // Then check storage
    const userData = JSON.parse(localStorage.getItem('userData')) || 
                    JSON.parse(sessionStorage.getItem('userData'));
    
    if (userData && userData.token) {
      console.log("Found user in storage, authenticating:", userData.user.username);
      // Load user into context
      login(userData, true);
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    
    // Finally check for cookies (for Google OAuth flow)
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const authToken = getCookie('auth_token');
    const userDataCookie = getCookie('user_data');
    
    console.log("ProtectedRoute checking cookies:", {
      authTokenExists: !!authToken,
      userDataExists: !!userDataCookie,
      fullCookies: document.cookie
    });

    if (authToken && userDataCookie) {
      try {
        const parsedUser = JSON.parse(userDataCookie);
        console.log("Found valid auth cookies in ProtectedRoute, logging in:", parsedUser);
        
        // Load into context and session storage
        login({
          token: authToken,
          user: parsedUser
        }, false);
        
        // Clear cookies after transferring data
        document.cookie = 'auth_token=; Max-Age=0; path=/;';
        document.cookie = 'user_data=; Max-Age=0; path=/;';
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error processing auth cookies in ProtectedRoute', error);
        setIsAuthenticated(false);
      }
    } else {
      console.log("No auth cookies or storage found, not authenticated");
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, [navigate, login, user, location]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;