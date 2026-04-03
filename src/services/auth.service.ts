import axios, { type AxiosError } from 'axios';
import axiosConfig from '@/lib/axios';
import type { signInSchema } from '@/schemas/auth.schema';
import type { SignInResponse } from '@/types/auth.type';
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
