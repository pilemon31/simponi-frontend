// src/types/platform.type.ts

export interface ConnectedPlatformDetail {
  store_platform_id: string;
  platform_id: string;
  platform_name: string;
  external_name: string;    // nama toko di marketplace
  external_shop_id: string; // shop_id
  is_connected: boolean;
}

export interface MyStoreResponse {
  id: string;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  platforms: ConnectedPlatformDetail[];
}

// ── Request types ─────────────────────────────────────────────────────────────
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

// ── Derived state ─────────────────────────────────────────────────────────────
export type PlatformConnectionStatus =
  | 'none'      // belum ada store
  | 'partial'   // 1 platform terkoneksi
  | 'full';     // 2 platform terkoneksi

export interface PlatformStatus {
  status: PlatformConnectionStatus;
  store: MyStoreResponse | null;
  connectedPlatformIds: string[];
  isShopeeConnected: boolean;
  isTokopediaConnected: boolean;
}

// ── Platform master data (dari DB / seeds) ────────────────────────────────────
export interface PlatformItem {
  id: string;         
  name: string;
  platformDbId: string; 
}