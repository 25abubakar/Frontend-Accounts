import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userEmail: string | null;
  token: string | null;
  isAuthenticated: boolean;
  setLogin: (email: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userEmail: null,
      token: null,
      isAuthenticated: false,
      setLogin: (email, token) => set({ 
        userEmail: email, 
        token: token, 
        isAuthenticated: true 
      }),
      logout: () => set({ userEmail: null, token: null, isAuthenticated: false }),
    }),
    { name: 'lal-portal-auth' }
  )
);