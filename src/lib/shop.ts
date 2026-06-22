import { getCookie, removeCookie, setCookie } from '@/lib/cookies';
import { useSyncExternalStore } from 'react';

export const SHOP_ID_COOKIE = 'SHOP_ID';
export const SHOP_ID_HEADER = 'X-Shop-Id';
const SHOP_ID_CHANGE_EVENT = 'shop-id-change';

export function getActiveShopId(fallback = ''): string {
  return getCookie(SHOP_ID_COOKIE) ?? fallback;
}

export function clearActiveShopId(): void {
  const currentShopId = getCookie(SHOP_ID_COOKIE);
  removeCookie(SHOP_ID_COOKIE);

  if (typeof window !== 'undefined' && currentShopId) {
    window.dispatchEvent(new CustomEvent(SHOP_ID_CHANGE_EVENT, { detail: '' }));
  }
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

export function buildStorePath(path: string, fallback = ''): string {
  const activeShopId = getActiveShopId(fallback);
  if (!activeShopId) {
    throw new Error('Store aktif belum dipilih');
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `/stores/${encodeURIComponent(activeShopId)}/${normalizedPath}`;
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

export function useActiveShopId(fallback = ''): string {
  return useSyncExternalStore(
    subscribeToActiveShopId,
    () => getActiveShopId(fallback),
    () => fallback,
  );
}
