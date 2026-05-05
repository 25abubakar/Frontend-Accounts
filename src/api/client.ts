// src/api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Vite looks for the variable, but falls back to localhost just in case
const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// THE INTERCEPTOR (Your security guard)
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);