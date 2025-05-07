const getToken = () => {
    const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));
    return userData?.token;
  };
  
  export const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('userData');
      sessionStorage.removeItem('userData');
      window.location.href = '/signin';
      throw new Error('Authentication token expired');
    }
    
    return response;
  };