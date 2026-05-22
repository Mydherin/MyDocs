import { create } from 'zustand';
import type { User } from '../domain/model/User';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User, accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  setUser: (user, accessToken) => set({ user, accessToken, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  signOut: () => set({ user: null, accessToken: null }),
}));
