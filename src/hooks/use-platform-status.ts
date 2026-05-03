// src/hooks/use-platform-status.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getMyStore,
  connectPlatform,
  disconnectPlatform,
} from '@/services/platform.service';
import type {
  ConnectPlatformRequest,
  MyStoreResponse,
  PlatformStatus,
} from '@/types/platform.type';

export const PLATFORM_QUERY_KEY = ['platform', 'my-store'] as const;

const SHOPEE_NAMES = ['shopee'];
const TOKOPEDIA_NAMES = ['tokopedia', 'tokped'];

const matchPlatform = (name: string, candidates: string[]): boolean =>
  candidates.some((c) => name.toLowerCase().includes(c));

const deriveStatus = (store: MyStoreResponse | null): PlatformStatus => {
  if (!store || store.platforms.length === 0) {
    return {
      status: 'none',
      store: null,
      connectedPlatformIds: [],
      isShopeeConnected: false,
      isTokopediaConnected: false,
    };
  }

  return {
    status: store.platforms.length >= 2 ? 'full' : 'partial',
    store,
    connectedPlatformIds: store.platforms.map((p) => p.platform_id),
    isShopeeConnected: store.platforms.some((p) =>
      matchPlatform(p.platform_name, SHOPEE_NAMES),
    ),
    isTokopediaConnected: store.platforms.some((p) =>
      matchPlatform(p.platform_name, TOKOPEDIA_NAMES),
    ),
  };
};

export const usePlatformStatus = () => {
  const queryClient = useQueryClient();

  const { data: store, isLoading, isError, refetch } = useQuery({
    queryKey: PLATFORM_QUERY_KEY,
    queryFn: async () => {
      const res = await getMyStore();
      if (!res.status) return null;
      return (res as { status: true; data: MyStoreResponse | null }).data ?? null;
    },
    staleTime: 30_000,
    retry: false,
  });

  const platformStatus = deriveStatus(store ?? null);

  const connectMutation = useMutation({
    mutationFn: (req: ConnectPlatformRequest) => connectPlatform(req),
    onSuccess: (res) => {
      if (!res.status) {
        toast.error(res.message ?? 'Gagal menghubungkan platform');
        return;
      }
      toast.success('Platform berhasil dihubungkan');
      queryClient.invalidateQueries({ queryKey: PLATFORM_QUERY_KEY });
    },
    onError: () => {
      toast.error('Gagal menghubungkan platform. Silakan coba lagi.');
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (storePlatformId: string) => disconnectPlatform(storePlatformId),
    onSuccess: (res) => {
      if (!res.status) {
        toast.error(res.message ?? 'Gagal memutus platform');
        return;
      }
      toast.success('Platform berhasil diputus');
      queryClient.invalidateQueries({ queryKey: PLATFORM_QUERY_KEY });
    },
    onError: () => {
      toast.error('Gagal memutus platform. Silakan coba lagi.');
    },
  });

  return {
    ...platformStatus,
    isLoading,
    isError,
    connect: connectMutation.mutate,
    connectAsync: connectMutation.mutateAsync,
    isConnecting: connectMutation.isPending,
    disconnect: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
    refetch,
  };
};