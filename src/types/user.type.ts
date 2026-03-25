import type { SuccessResponse } from './response.type';

export type ProfileResponseData = {
  id: string;
  email: string;
  name: string;
};

export type ProfileResponse = SuccessResponse<ProfileResponseData>;
