import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Background from '../assets/background.jpg';
import { AuthContext } from '../context/AuthContext';

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleAuthProcessing, setGoogleAuthProcessing] = useState(false);

  useEffect(() => {
    // Clear any previous errors when component loads
    setErrors({});

    // Check for Google auth parameters from URL
    const query = new URLSearchParams(location.search);
    const googleAuthSuccess = query.get('google_auth') === 'success';
    const token = query.get('token');
    const userDataParam = query.get('userData');
    
    // Debug information about the query parameters
    console.log('Signin: Checking URL parameters:', { 
      googleAuthSuccess, 
      hasToken: !!token, 
      hasUserData: !!userDataParam 
    });
    
    // If we have all the needed parameters for Google Auth
    if (googleAuthSuccess && token && userDataParam) {
      setGoogleAuthProcessing(true);
      
      try {
        // Decode and parse the user data
        const parsedUser = JSON.parse(decodeURIComponent(userDataParam));
        
        console.log("Processing Google auth login for:", parsedUser.email);
        
        // Save to context and storage
        login({ 
          token: token, 
          user: parsedUser 
        }, formData.rememberMe);
        
        // Navigate to home page after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 100);
      } catch (error) {
        console.error('Error processing Google authentication data:', error);
        setErrors({ form: 'Error processing authentication data. Please try again.' });
        setGoogleAuthProcessing(false);
      }
    } 
    // Handle case where google_auth=success but missing data
    else if (googleAuthSuccess && (!token || !userDataParam)) {
      console.error('Google auth redirect is missing token or user data');
      console.error('Available parameters:', { ...Object.fromEntries(query.entries()) });
      setErrors({ 
        form: 'Authentication data incomplete. Please try signing in again.' 
      });
    }
    
    // Check for error messages
    const errorParam = query.get('error');
    const errorMessage = query.get('message');
    if (errorParam) {
      console.error('Auth error from callback:', errorParam, errorMessage);
      setErrors({ 
        form: errorMessage || 'Authentication failed. Please try again.' 
      });
    }
  }, [navigate, login, location.search]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.identifier) newErrors.identifier = 'Email or username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          // Successful login
          console.log('Login successful');
          
          // Use the AuthContext login function
          login({
            user: data.user,
            token: data.token
          }, formData.rememberMe);
          
          // Redirect to home page after successful login
          navigate('/home');
        } else {
          // Failed login
          console.error('Login failed:', data);
          setErrors({ form: data.message || 'Invalid email or password' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        setErrors({ form: 'Network error. Please check your connection and try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const handleGoogleSignIn = () => {
    console.log('Initiating Google sign-in');
    setErrors({});
    setGoogleAuthProcessing(true);
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  // Show loading indicator during Google auth processing
  if (googleAuthProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl mb-2">Completing Google Authentication</h2>
          <p className="text-gray-600">Please wait while we sign you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: `url(${Background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold" style={{ fontFamily: '"Inria Serif", serif' }}>Welcome Back</h1>
            <p className="text-gray-600 mt-2" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700 text-sm">{errors.form}</p>
              </div>
            )}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>Email or Username</label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}
                value={formData.identifier}
                onChange={handleChange}
                placeholder="email@example.com or @username"
              />
              {errors.identifier && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>{errors.identifier}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-gray-600" style={{ fontFamily: '"SF Pro", system-ui, sans-serif' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;