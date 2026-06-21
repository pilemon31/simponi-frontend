import type { ErrorResponse } from './response.type';

export interface StorePlatformApiRelation {
  id: string;
  name: string;
}

export interface StorePlatformApiStore {
  id: string;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  platforms: StorePlatformApiRelation[];
}

export interface StorePlatformRelation extends StorePlatformApiRelation {
  platform_id: string;
  platform_name: string;
  // Store detail does not expose the store-platform relation ID.
  store_platform_id: string;
}

export interface StorePlatformStore
  extends Omit<StorePlatformApiStore, 'platforms'> {
  platforms: StorePlatformRelation[];
}

export interface PlatformItem {
  id: string;
  name: string;
  platformDbId: string;
  connectSupported: boolean;
}

export interface ConnectPlatformResponseData {
  auth_url?: string;
}

export type PlatformApiSuccess<T> = {
  status: true;
  message: string;
  data?: T;
};

export type PlatformApiError = ErrorResponse & {
  httpStatus?: number;
};

export type PlatformApiResult<T> = PlatformApiSuccess<T> | PlatformApiError;

export type PlatformConfigurationStatus =
  | 'no-store'
  | 'none'
  | 'partial'
  | 'full';

export interface PlatformStatus {
  status: PlatformConfigurationStatus;
  store: StorePlatformStore | null;
  configuredPlatformIds: string[];
  isShopeeConfigured: boolean;
  isTikTokConfigured: boolean;
}

// Kept for the currently unused legacy form components. The verified connect
// endpoint does not consume this payload.
export interface ConnectFirstPlatformRequest {
  platform_id: string;
  external_name: string;
  external_shop_id: string;
  store_name: string;
  store_description?: string;
  store_image_url?: string;
}

export interface ConnectSecondPlatformRequest {
  platform_id: string;
  external_name: string;
  external_shop_id: string;
  store_name: '';
}

export type ConnectPlatformRequest =
  | ConnectFirstPlatformRequest
  | ConnectSecondPlatformRequest;
