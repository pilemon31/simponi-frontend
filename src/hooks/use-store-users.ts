import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createStoreEmployees,
  deleteStoreEmployee,
  getStoreEmployees,
} from '@/services/store-users.service';
import type { CreateStoreEmployeesRequest } from '@/types/store-user.type';

export const STORE_EMPLOYEES_QUERY_KEY = ['store-employees'] as const;

const storeEmployeesQueryKey = (storeId: string | undefined) => [
  ...STORE_EMPLOYEES_QUERY_KEY,
  storeId,
];

export function useStoreEmployees(
  storeId: string | undefined,
  page: number,
  perPage: number,
  search: string,
) {
  return useQuery({
    queryKey: [...storeEmployeesQueryKey(storeId), page, perPage, search],
    queryFn: async () => {
      if (!storeId) return null;

      const res = await getStoreEmployees(storeId, page, perPage, search);

      if (!res.status) {
        throw new Error(res.error || res.message || 'Failed to get employees');
      }

      return res;
    },
    enabled: Boolean(storeId),
  });
}

export function useCreateStoreEmployees(storeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStoreEmployeesRequest) => {
      if (!storeId) {
        throw new Error('Store ID tidak ditemukan');
      }

      const res = await createStoreEmployees(storeId, payload);

      if (!res.status) {
        throw new Error(res.error || res.message || 'Gagal menambahkan employee');
      }

      return res;
    },
    onSuccess: () => {
      toast.success('Employee berhasil ditambahkan');
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menambahkan employee');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: storeEmployeesQueryKey(storeId),
      });
    },
  });
}

export function useDeleteStoreEmployee(storeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!storeId) {
        throw new Error('Store ID tidak ditemukan');
      }

      const res = await deleteStoreEmployee(storeId, userId);

      if (!res.status) {
        throw new Error(res.error || res.message || 'Gagal menghapus employee');
      }

      return res;
    },
    onSuccess: () => {
      toast.success('Employee berhasil dihapus dari toko');
      queryClient.invalidateQueries({
        queryKey: storeEmployeesQueryKey(storeId),
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Gagal menghapus employee');
    },
  });
}
