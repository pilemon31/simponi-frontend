import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { setActiveShopId } from '@/lib/shop';
import {
  createStore,
  deleteStore,
  getStore,
  getStores,
  updateStore,
} from '@/services/stores.service';
import type {
  CreateStoreRequest,
  Store,
  StoreApiError,
  UpdateStoreRequest,
} from '@/types/store.type';

export const STORES_QUERY_KEY = ['stores'] as const;
export const storeDetailQueryKey = (storeId: string) => [
  ...STORES_QUERY_KEY,
  'detail',
  storeId,
];

export class StoreRequestError extends Error {
  httpStatus?: number;

  constructor(response: StoreApiError) {
    super(response.error || response.message || 'Permintaan store gagal');
    this.name = 'StoreRequestError';
    this.httpStatus = response.httpStatus;
  }
}

const normalizeStore = (store: Store): Store => ({
  ...store,
  description: store.description ?? '',
  image_url: store.image_url ?? '',
  platforms: store.platforms ?? [],
});

export const useStoresQuery = () =>
  useQuery({
    queryKey: STORES_QUERY_KEY,
    queryFn: async () => {
      const response = await getStores();
      if (!response.status) throw new StoreRequestError(response);
      return (response.data ?? []).map(normalizeStore);
    },
    retry: false,
  });

export const useStoreDetail = (storeId: string | null) =>
  useQuery({
    queryKey: storeDetailQueryKey(storeId ?? ''),
    queryFn: async () => {
      if (!storeId) throw new Error('Store ID tidak ditemukan');
      const response = await getStore(storeId);
      if (!response.status) throw new StoreRequestError(response);
      if (!response.data) throw new Error('Data store tidak ditemukan');
      return normalizeStore(response.data);
    },
    enabled: Boolean(storeId),
    retry: false,
  });

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateStoreRequest) => {
      const response = await createStore(payload);
      if (!response.status) throw new StoreRequestError(response);
      if (!response.data) throw new Error('Data store baru tidak ditemukan');
      return normalizeStore(response.data);
    },
    onSuccess: async (store) => {
      await queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY });
      setActiveShopId(store.id);
      toast.success('Store berhasil dibuat');
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      storeId,
      payload,
    }: {
      storeId: string;
      payload: UpdateStoreRequest;
    }) => {
      const response = await updateStore(storeId, payload);
      if (!response.status) throw new StoreRequestError(response);
      if (!response.data) throw new Error('Data store tidak ditemukan');
      return normalizeStore(response.data);
    },
    onSuccess: async (store) => {
      queryClient.setQueryData(storeDetailQueryKey(store.id), store);
      await queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY });
      toast.success('Store berhasil diperbarui');
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (storeId: string) => {
      const response = await deleteStore(storeId);
      if (!response.status) throw new StoreRequestError(response);
      return storeId;
    },
    onSuccess: async (storeId) => {
      queryClient.removeQueries({
        predicate: (query) => query.queryKey.includes(storeId),
      });
      await queryClient.invalidateQueries({ queryKey: STORES_QUERY_KEY });
      toast.success('Store berhasil dihapus');
    },
  });
};
