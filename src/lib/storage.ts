import { APP_CONFIG } from './config';

export type StoredAuth = {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  rememberMe?: boolean;
};

export function getStoredAuth(): StoredAuth | null {
  try {
    const value = localStorage.getItem(APP_CONFIG.storageKey);
    return value ? (JSON.parse(value) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(value: StoredAuth) {
  localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(value));
}

export function clearStoredAuth() {
  localStorage.removeItem(APP_CONFIG.storageKey);
}
