import { getCookie, setCookie } from '@/lib/cookies';
import { useSyncExternalStore } from 'react';

export const SHOP_ID_COOKIE = 'SHOP_ID';
export const SHOP_ID_HEADER = 'X-Shop-Id';
export const DEFAULT_SHOP_ID = 'fb03a935-3b35-4653-8ab9-8c97309012e8';
const SHOP_ID_CHANGE_EVENT = 'shop-id-change';

export function getActiveShopId(fallback = DEFAULT_SHOP_ID): string {
  return getCookie(SHOP_ID_COOKIE) ?? fallback;
}

export function setActiveShopId(shopId: string): void {
  const currentShopId = getCookie(SHOP_ID_COOKIE);
  setCookie(SHOP_ID_COOKIE, shopId);

  if (
    typeof window !== 'undefined' &&
    currentShopId !== shopId
  ) {
    window.dispatchEvent(new CustomEvent(SHOP_ID_CHANGE_EVENT, { detail: shopId }));
  }
}

export function buildStorePath(path: string, fallback = DEFAULT_SHOP_ID): string {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `/stores/${encodeURIComponent(getActiveShopId(fallback))}/${normalizedPath}`;
}

function subscribeToActiveShopId(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(SHOP_ID_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener(SHOP_ID_CHANGE_EVENT, onStoreChange);
  };
}

export function useActiveShopId(fallback = DEFAULT_SHOP_ID): string {
  return useSyncExternalStore(
    subscribeToActiveShopId,
    () => getActiveShopId(fallback),
    () => fallback,
  );
}
