import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useStoreContext } from '@/context/store-context';
import {
  connectPlatform,
  disconnectPlatform,
  getStorePlatformStatus,
} from '@/services/platform.service';
import type {
  PlatformApiError,
  PlatformStatus,
  StorePlatformStore,
} from '@/types/platform.type';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SHOPEE_NAMES = ['shopee'];
const TIKTOK_NAMES = ['tiktok', 'tik tok'];

export class PlatformRequestError extends Error {
  httpStatus?: number;

  constructor(response: PlatformApiError) {
    super(response.error || response.message || 'Permintaan platform gagal');
    this.name = 'PlatformRequestError';
    this.httpStatus = response.httpStatus;
  }
}

export const platformStatusQueryKey = (storeId: string) => [
  'platform-status',
  storeId,
];

const matchesPlatform = (name: string, candidates: string[]) =>
  candidates.some((candidate) => name.toLowerCase().includes(candidate));

const deriveStatus = (
  store: StorePlatformStore | null,
  hasActiveStore: boolean,
): PlatformStatus => {
  if (!hasActiveStore) {
    return {
      status: 'no-store',
      store: null,
      configuredPlatformIds: [],
      isShopeeConfigured: false,
      isTikTokConfigured: false,
    };
  }

  const platforms = store?.platforms ?? [];
  const isShopeeConfigured = platforms.some((platform) =>
    matchesPlatform(platform.name, SHOPEE_NAMES),
  );
  const isTikTokConfigured = platforms.some((platform) =>
    matchesPlatform(platform.name, TIKTOK_NAMES),
  );
  const configuredCount = Number(isShopeeConfigured) + Number(isTikTokConfigured);

  return {
    status:
      configuredCount === 0
        ? 'none'
        : configuredCount >= 2
          ? 'full'
          : 'partial',
    store,
    configuredPlatformIds: platforms.map((platform) => platform.id),
    isShopeeConfigured,
    isTikTokConfigured,
  };
};

export const usePlatformStatus = () => {
  const queryClient = useQueryClient();
  const {
    activeStore,
    activeStoreId,
    isError: isStoreListError,
    error: storeListError,
    refetch: refetchStoreList,
  } = useStoreContext();
  const hasActiveStore =
    Boolean(activeStore) && UUID_PATTERN.test(activeStoreId);
  const queryKey = platformStatusQueryKey(activeStoreId);

  const storeQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getStorePlatformStatus(activeStoreId);
      if (!response.status) throw new PlatformRequestError(response);
      if (!response.data) return null;

      const platforms = response.data.platforms ?? [];

      return {
        ...response.data,
        platforms: platforms.map((platform) => ({
          ...platform,
          platform_id: platform.id,
          platform_name: platform.name,
          store_platform_id: '',
        })),
      } satisfies StorePlatformStore;
    },
    enabled: hasActiveStore,
    staleTime: 30_000,
    retry: false,
  });

  const connectMutation = useMutation({
    mutationFn: async (platformId: string) => {
      if (!hasActiveStore) throw new Error('Store aktif tidak ditemukan');
      const response = await connectPlatform(activeStoreId, platformId);
      if (!response.status) throw new PlatformRequestError(response);
      return response;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (platformId: string) => {
      if (!hasActiveStore) throw new Error('Store aktif tidak ditemukan');
      const response = await disconnectPlatform(activeStoreId, platformId);
      if (!response.status) throw new PlatformRequestError(response);
      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success('Relasi platform berhasil dihapus dari toko');
    },
  });

  return {
    ...deriveStatus(storeQuery.data ?? null, hasActiveStore),
    activeStoreId,
    hasActiveStore,
    isLoading: storeQuery.isPending && hasActiveStore,
    isError: isStoreListError || storeQuery.isError,
    error: storeListError ?? storeQuery.error,
    isStoreListError,
    refetch: storeQuery.refetch,
    refetchStoreList,
    connectAsync: connectMutation.mutateAsync,
    isConnecting: connectMutation.isPending,
    connectError: connectMutation.error,
    disconnectAsync: disconnectMutation.mutateAsync,
    isDisconnecting: disconnectMutation.isPending,
    disconnectError: disconnectMutation.error,
  };
};
