import axios from 'axios';

// 1. AXIOS CONFIG (The Engine)
const BASE_URL = 'https://localhost:7014/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// 2. THE CONTRACTS (Exported Types)
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
  email: string;
}

// NEW: Added the Register Contract mapping to Swagger
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

// 3. THE MESSENGER (Auth Logic)
export const AuthAPI = {
  
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Exact path: /api/Auth/login
    const response = await apiClient.post<LoginResponse>('/Auth/login', data);
    return response.data;
  },
  
  // NEW: Added the Register Logic
  register: async (data: RegisterRequest): Promise<any> => {
    // Exact path: /api/Auth/register
    const response = await apiClient.post('/Auth/register', data);
    return response.data;
  }
  
};