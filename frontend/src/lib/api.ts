import axios from 'axios';
import Cookies from 'js-cookie';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('finagen_access_token'),
  setAccessToken: (token: string) => localStorage.setItem('finagen_access_token', token),
  removeAccessToken: () => localStorage.removeItem('finagen_access_token'),
  
  getRefreshToken: () => Cookies.get('finagen_refresh_token'),
  setRefreshToken: (token: string) => {
    Cookies.set('finagen_refresh_token', token, { 
      httpOnly: false, // Can't be httpOnly in client-side
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      expires: 7 // 7 days
    });
  },
  removeRefreshToken: () => Cookies.remove('finagen_refresh_token'),
  
  clearAll: () => {
    tokenManager.removeAccessToken();
    tokenManager.removeRefreshToken();
  }
};

// Request interceptor - Add auth header
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 and refresh tokens
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((refreshError) => {
          return Promise.reject(refreshError);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        tokenManager.clearAll();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken
        });

        const newToken = response.data.access;
        tokenManager.setAccessToken(newToken);
        
        processQueue(null, newToken);
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenManager.clearAll();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/api/auth/token/', credentials),
  
  refresh: (refreshToken: string) =>
    api.post('/api/auth/token/refresh/', { refresh: refreshToken }),
};

export const coreAPI = {
  getHomePage: () => api.get('/api/core/pages/home/'),
  getExplorePage: () => api.get('/api/core/pages/explore/'),
  getUsageGuidePage: () => api.get('/api/core/pages/usage-guide/'),
  getContactPage: () => api.get('/api/core/pages/contact/'),
  getDocsPage: () => api.get('/api/core/pages/docs/'),
  getGuides: () => api.get('/api/core/guides/'),
  getGuide: (slug: string) => api.get(`/api/core/guides/${slug}/`),
};

export const productsAPI = {
  getProducts: (params?: { search?: string; ordering?: string; is_active?: boolean }) =>
    api.get('/api/products/items/', { params }),
  
  getProduct: (slug: string) => api.get(`/api/products/items/${slug}/`),
  
  getPricingPlans: (params?: { product?: string; is_active?: boolean }) =>
    api.get('/api/products/plans/', { params }),
};

export const accountsAPI = {
  getProfile: () => api.get('/api/accounts/me/profile/'),
  updateProfile: (data: any) => api.patch('/api/accounts/me/profile/', data),
  getSubscriptions: () => api.get('/api/accounts/me/subscriptions/'),
  subscribe: (planId: string) => api.post('/api/accounts/me/subscribe/', { plan: planId }),
  getDashboard: () => api.get('/api/accounts/me/dashboard/'),
};

export const apiKeysAPI = {
  getKeys: () => api.get('/api/keys/mine/'),
  createKey: (data: any) => api.post('/api/keys/mine/', data),
  updateKey: (id: string, data: any) => api.patch(`/api/keys/mine/${id}/`, data),
  deleteKey: (id: string) => api.delete(`/api/keys/mine/${id}/`),
  revokeKey: (id: string) => api.post(`/api/keys/mine/${id}/revoke/`),
};

export const usageAPI = {
  getEvents: (params?: { product?: string; api_key_prefix?: string; page?: number }) =>
    api.get('/api/usage/events/', { params }),
};

export const billingAPI = {
  getInvoices: () => api.get('/api/billing/invoices/'),
  getPaymentMethods: () => api.get('/api/billing/payment-methods/'),
  createPaymentMethod: (data: any) => api.post('/api/billing/payment-methods/', data),
  updatePaymentMethod: (id: string, data: any) => api.patch(`/api/billing/payment-methods/${id}/`, data),
  deletePaymentMethod: (id: string) => api.delete(`/api/billing/payment-methods/${id}/`),
};

export const supportAPI = {
  getTickets: () => api.get('/api/support/tickets/'),
  createTicket: (data: any) => api.post('/api/support/tickets/', data),
  updateTicket: (id: string, data: any) => api.patch(`/api/support/tickets/${id}/`, data),
  deleteTicket: (id: string) => api.delete(`/api/support/tickets/${id}/`),
};

export default api;