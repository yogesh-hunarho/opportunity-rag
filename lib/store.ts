import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  name: string;
  email: string;
  isLoggedIn: boolean;
  setAuth: (name: string, email: string,) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      name: '',
      email: '',
      isLoggedIn: false,
      setAuth: (name, email) =>
        set({ name, email, isLoggedIn: true }),
      logout: () =>
        set({ name: '', email: '', isLoggedIn: false }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
