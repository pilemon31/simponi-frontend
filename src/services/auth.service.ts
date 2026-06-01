import axios, { type AxiosError } from 'axios';
import axiosConfig from '@/lib/axios';
import type { signInSchema, signUpSchema } from '@/schemas/auth.schema';
import type {
  ImpersonateResponse,
  SignInResponse,
  SignUpResponse,
} from '@/types/auth.type';
import { type ErrorResponse } from '@/types/response.type';
import { mapErrorResponse } from '@/lib/error-mapper';
import type z from 'zod';

export const signIn = async (
  data: z.infer<typeof signInSchema>,
): Promise<SignInResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.post('/auth/signin', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data as SignInResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const response = (error as AxiosError).response?.data;
      return mapErrorResponse(response as ErrorResponse);
    }

    return {
      status: false,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Unknown error',
    } as ErrorResponse;
  }
};

export const signUp = async (
  data: z.infer<typeof signUpSchema>,
): Promise<SignUpResponse | ErrorResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _confirmPassword, ...payload } = data;
    const response = await axiosConfig.post('/auth/signup', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data as SignUpResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const response = (error as AxiosError).response?.data;
      return mapErrorResponse(response as ErrorResponse);
    }

    return {
      status: false,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Unknown error',
    } as ErrorResponse;
  }
};

export const startImpersonate = async (
  userId: string,
): Promise<ImpersonateResponse | ErrorResponse> => {
  try {
    const response = await axiosConfig.post<
      ImpersonateResponse | ErrorResponse
    >(`/impersonate/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status) {
      return response.data as ImpersonateResponse;
    } else {
      return {
        status: false,
        message: 'No data returned from impersonate endpoint',
        timestamp: new Date().toISOString(),
        error: 'No data',
      } as ErrorResponse;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const response = (error as AxiosError).response?.data;
      return response as ErrorResponse;
    }

    return {
      status: false,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Unknown error',
    } as ErrorResponse;
  }
};

export const stopImpersonate = async (): Promise<
  ImpersonateResponse | ErrorResponse
> => {
  try {
    const response = await axiosConfig.post<
      ImpersonateResponse | ErrorResponse
    >(`/impersonate/stop`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status) {
      return response.data as ImpersonateResponse;
    } else {
      return {
        status: false,
        message: 'No data returned from stop impersonate endpoint',
        timestamp: new Date().toISOString(),
        error: 'No data',
      } as ErrorResponse;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const response = (error as AxiosError).response?.data;
      return response as ErrorResponse;
    }

    return {
      status: false,
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      error: 'Unknown error',
    } as ErrorResponse;
  }
};
