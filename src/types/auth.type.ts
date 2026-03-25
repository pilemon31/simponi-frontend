import type { SuccessResponse } from './response.type';

export type SignInResponseData = {
  access_token: string;
  refresh_token: string;
};

export type SignInResponse = SuccessResponse<SignInResponseData>;
