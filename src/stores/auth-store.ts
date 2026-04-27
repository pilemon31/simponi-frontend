import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const IMPERSONATE_TOKEN = 'IMPERSONATE_TOKEN';

interface AuthPermission {
  id: string;
  name: string;
  endpoint: string;
  method: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  image_url: string;
  role: {
    id: string;
    name: string;
    permissions: AuthPermission[];
  };
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    refreshToken: string;
    impersonateToken: string;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    setImpersonateToken: (token: string) => void;
    resetAccessToken: () => void;
    resetImpersonateToken: () => void;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN);
  const cookieImpersonateState = getCookie(IMPERSONATE_TOKEN);
  const initToken = cookieState ?? cookieImpersonateState ?? '';
  const cookieRefreshState = getCookie(REFRESH_TOKEN);
  const initRefreshToken = cookieRefreshState ?? '';
  const initImpersonateToken = cookieImpersonateState ?? '';
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      refreshToken: initRefreshToken,
      impersonateToken: initImpersonateToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, accessToken);
          return { ...state, auth: { ...state.auth, accessToken } };
        }),
      setRefreshToken: (refreshToken) =>
        set((state) => {
          setCookie(REFRESH_TOKEN, refreshToken);
          return { ...state, auth: { ...state.auth, refreshToken } };
        }),
      setImpersonateToken: (token) =>
        set((state) => {
          if (!token || state.auth.impersonateToken) {
            return state;
          }

          setCookie(IMPERSONATE_TOKEN, token);
          return {
            ...state,
            auth: {
              ...state.auth,
              impersonateToken: token,
            },
          };
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(IMPERSONATE_TOKEN);
          return {
            ...state,
            auth: { ...state.auth, accessToken: '', impersonateToken: '' },
          };
        }),
      resetImpersonateToken: () =>
        set((state) => {
          const restoredAccessToken = state.auth.impersonateToken;
          removeCookie(IMPERSONATE_TOKEN);

          if (restoredAccessToken) {
            setCookie(ACCESS_TOKEN, restoredAccessToken);
          } else {
            removeCookie(ACCESS_TOKEN);
          }

          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken: restoredAccessToken ?? '',
              impersonateToken: '',
            },
          };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(REFRESH_TOKEN);
          removeCookie(IMPERSONATE_TOKEN);
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: '',
              impersonateToken: '',
            },
          };
        }),
    },
  };
});
