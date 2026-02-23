export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};

// Dynamic API URL based on current domain
export const getApiUrl = () => {
  const currentHost = window.location.origin;
  
  if (currentHost.includes('school-management-system-1-sm6u.onrender.com')) {
    return 'https://school-management-system-1-sm6u.onrender.com/api';
  } else if (currentHost.includes('school-management-system-swti.onrender.com')) {
    return 'https://school-management-system-swti.onrender.com/api';
  } else {
    return 'http://localhost:5000/api';
  }
};

// Fallback API URL for when dynamic detection fails
export const getFallbackApiUrl = () => {
  return 'http://localhost:5000/api';
};
