import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_REACT_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register new user
  register: async (userData) => {
    return api.post('/api/auth/register', userData);
  },

  // Login user
  login: async (credentials) => {
    return api.post('/api/auth/login', credentials);
  },

  // Get user profile
  getProfile: async () => {
    return api.get('/api/auth/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return api.put('/api/auth/profile', profileData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return api.put('/api/auth/change-password', passwordData);
  },

  // Delete account
  deleteAccount: async (password) => {
    return api.delete('/api/auth/account', { data: { password } });
  },

  // Refresh token
  refreshToken: async () => {
    return api.post('/api/auth/refresh-token');
  },

  // Logout
  logout: async () => {
    return api.post('/api/auth/logout');
  },
}; 