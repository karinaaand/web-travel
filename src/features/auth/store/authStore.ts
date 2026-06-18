import { create } from 'zustand';
import { api, setAuthToken } from '../../../lib/api';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../../../lib/storage';
import type { AuthResponse, AuthUser } from '../../../lib/types';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
  loading: boolean;
  error: string | null;
  bootstrap: () => Promise<void>;
  login: (payload: { identifier: string; password: string; rememberMe?: boolean }) => Promise<boolean>;
  register: (payload: { username: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
};

const stored = typeof window !== 'undefined' ? getStoredAuth() : null;
if (stored?.token) setAuthToken(stored.token);

export const useAuthStore = create<AuthState>((set) => ({
  token: stored?.token ?? null,
  user: stored?.user ?? null,
  ready: false,
  loading: false,
  error: null,
  async bootstrap() {
    const current = getStoredAuth();

    if (!current?.token) {
      set({ ready: true, token: null, user: null });
      clearStoredAuth();
      setAuthToken(null);
      return;
    }

    try {
      setAuthToken(current.token);
      const { data } = await api.get<AuthUser>('/users/me');
      setStoredAuth({ token: current.token, user: data, rememberMe: current.rememberMe });
      set({ token: current.token, user: data, ready: true });
    } catch {
      clearStoredAuth();
      setAuthToken(null);
      set({ token: null, user: null, ready: true });
    }
  },
  async login(payload) {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post<AuthResponse>('/auth/local', {
        identifier: payload.identifier,
        password: payload.password,
      });
      setAuthToken(data.jwt);

      const { data: meData } = await api.get<AuthUser>('/users/me');
      setStoredAuth({ token: data.jwt, user: meData, rememberMe: payload.rememberMe ?? true });
      set({ token: data.jwt, user: meData, loading: false, ready: true });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Login failed', loading: false });
      return false;
    }
  },
  async register(payload) {
    set({ loading: true, error: null });
    try {
      await api.post<AuthResponse>('/auth/local/register', payload);
      set({ loading: false, ready: true });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Register failed', loading: false });
      return false;
    }
  },
  logout() {
    clearStoredAuth();
    setAuthToken(null);
    set({ token: null, user: null, error: null, loading: false, ready: true });
  },
  clearError() {
    set({ error: null });
  },
}));
