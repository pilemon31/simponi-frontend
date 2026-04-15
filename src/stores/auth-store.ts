import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

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
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN);
  const initToken = cookieState ?? '';
  const cookieRefreshState = getCookie(REFRESH_TOKEN);
  const initRefreshToken = cookieRefreshState ?? '';
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      refreshToken: initRefreshToken,
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
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: '' } };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(REFRESH_TOKEN);
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
              refreshToken: '',
            },
          };
        }),
    },
  };
});
