import axios, { type AxiosError } from 'axios';
import axiosConfig from '@/lib/axios';
import { type ProfileResponse } from '@/types/user.type';
import { type ErrorResponse } from '@/types/response.type';

export const getProfile = async (): Promise<
  ProfileResponse | ErrorResponse
> => {
  try {
    const response = await axiosConfig.get('/users/profile', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data as ProfileResponse;
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
