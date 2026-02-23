export const environment = {
  production: true,
  apiUrl: 'https://school-management-system-swti.onrender.com/api'
};

// Dynamic API URL based on current domain
export const getApiUrl = () => {
  const currentHost = window.location.origin;
  
  if (currentHost.includes('school-management-system-theta-black-nahi.vercel.app')) {
    return 'https://school-management-system-swti.onrender.com/api';
  } else if (currentHost.includes('school-management-system-1-sm6u.onrender.com')) {
    return 'https://school-management-system-1-sm6u.onrender.com/api';
  } else if (currentHost.includes('school-management-system-swti.onrender.com')) {
    return 'https://school-management-system-swti.onrender.com/api';
  } else if (currentHost.includes('vercel.app')) {
    return 'https://school-management-system-swti.onrender.com/api';
  } else if (currentHost.includes('netlify.app')) {
    return 'https://school-management-system-swti.onrender.com/api';
  } else {
    return 'https://school-management-system-swti.onrender.com/api';
  }
};

// Fallback API URL for when dynamic detection fails
export const getFallbackApiUrl = () => {
  return 'https://school-management-system-swti.onrender.com/api';
};

// Force recompilation trigger
export const VERSION = '1.0.3';