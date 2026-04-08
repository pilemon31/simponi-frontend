import type { SuccessResponse } from './response.type';

type ProfilePermissions = {
  id: string;
  name: string;
  endpoint: string;
  method: string;
};

export type ProfileResponseData = {
  id: string;
  email: string;
  name: string;
  image_url: string;
  role: {
    id: string;
    name: string;
    permissions: ProfilePermissions[];
  };
};

export type ProfileResponse = SuccessResponse<ProfileResponseData>;
