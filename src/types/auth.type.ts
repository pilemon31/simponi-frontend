import type { SuccessResponse } from './response.type';

export type SignInResponseData = {
  access_token: string;
  refresh_token: string;
};

export type ImpersonateData = {
  access_token: string;
};

export type SignUpResponse = SuccessResponse;
export type SignInResponse = SuccessResponse<SignInResponseData>;
export type ImpersonateResponse = SuccessResponse<ImpersonateData>;
