import { create } from 'zustand';
import type { User } from '../domain/model/User';

const STORAGE_KEY_TOKEN = 'auth_access_token';
const STORAGE_KEY_EXPIRES_AT = 'auth_expires_at';
const STORAGE_KEY_USER = 'auth_user';

function loadFromStorage(): { user: User | null; accessToken: string | null; expiresAt: number | null } {
  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const expiresAt = Number(localStorage.getItem(STORAGE_KEY_EXPIRES_AT));
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY_USER) ?? 'null') as User | null;
    if (token && expiresAt && Date.now() < expiresAt && user) {
      return { user, accessToken: token, expiresAt };
    }
  } catch {
    // ignore
  }
  return { user: null, accessToken: null, expiresAt: null };
}

function saveToStorage(user: User, accessToken: string, expiresAt: number) {
  localStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEY_EXPIRES_AT, String(expiresAt));
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_EXPIRES_AT);
  localStorage.removeItem(STORAGE_KEY_USER);
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User, accessToken: string, expiresIn: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
}

const initial = loadFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  accessToken: initial.accessToken,
  expiresAt: initial.expiresAt,
  isLoading: false,
  error: null,
  setUser: (user, accessToken, expiresIn) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    saveToStorage(user, accessToken, expiresAt);
    set({ user, accessToken, expiresAt, isLoading: false, error: null });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  signOut: () => {
    clearStorage();
    set({ user: null, accessToken: null, expiresAt: null });
  },
}));
