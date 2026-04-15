/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { API_BASE_URL } from './env';

const axiosConfig = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
});

let isRefreshing = false;
type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error?: any, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: set Authorization header
axiosConfig.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: handle 401 & refresh token
axiosConfig.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig | undefined;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;

    if (status === 401) {
      const { setAccessToken, reset } = useAuthStore.getState().auth;

      // Get refreshToken from localStorage
      let refreshToken: string | null = null;
      refreshToken = localStorage.getItem('REFRESH_TOKEN');

      // If this request already retried, avoid infinite loop
      if ((originalRequest as any)?._retry) {
        return Promise.reject(error);
      }

      if (!refreshToken) {
        reset();
        return Promise.reject(error);
      }

      // Queue requests if refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (!originalRequest.headers) originalRequest.headers = {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosConfig(originalRequest));
            },
            reject,
          });
        });
      }

      // Start refresh token process
      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosConfig.post(
          `/auth/refresh-token`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const data = response.data;

        if (!data || !data.data?.access_token) {
          throw new Error('Failed to refresh token');
        }

        const newAccessToken = data.data.access_token;

        // Save new token to store
        setAccessToken(newAccessToken);

        // Process queued requests
        processQueue(null, newAccessToken);

        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosConfig(originalRequest);
      } catch (err) {
        processQueue(err, undefined);
        reset();
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosConfig;
