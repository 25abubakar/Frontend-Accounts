// src/api/axios.ts
import axios from 'axios';

// This creates a master configuration for all your backend calls
const api = axios.create({
  baseURL: 'https://localhost:7014', // Your ASP.NET Core backend URL
  withCredentials: true,             // Required for Identity cookies
  headers: { 'Content-Type': 'application/json' },
});

export default api;