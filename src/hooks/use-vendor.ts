import { getVendors, createVendor, updateVendor, deleteVendor } from '@/services/vendor.service';
import type { VendorData } from '@/components/vendor/data/schema';
import type { CreateVendorRequest } from '@/types/vendor.type';
import type { ErrorResponse } from '@/types/response.type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

// helper extract pesan error dari response backend
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  const err = error as ErrorResponse;
  // backend kirim { message: "failed to create vendor", error: "vendor already exists: ..." }
  if (err?.error && typeof err.error === 'string') {
    // ambil bagian sebelum ': already exists' / wrap error
    const clean = err.error
      .replace(/:.*(already exists|not found).*/i, '')
      .trim();
    if (clean) return clean;
  }
  if (err?.message) return err.message;
  return fallback;
};

// ─── useVendor (list) ─────────────────────────────────────────────────────────

type UseVendorResult = {
  data: VendorData[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  maxPage: number;
  totalCount: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  refetch: () => void;
};

export const useVendor = (search?: string): UseVendorResult => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['vendors', page, perPage, search],
    queryFn: () => getVendors(page, perPage),
  });

  const isSuccess = data?.status === true;
  const responseData = isSuccess ? data.data : null;

  const vendors: VendorData[] = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : [];

  const pagination = isSuccess
    ? !Array.isArray(responseData)
      ? (responseData?.pagination ?? null)
      : null
    : null;

  return {
    data: vendors,
    isLoading,
    isError: isError || (data !== undefined && !isSuccess),
    page,
    perPage,
    maxPage: pagination?.max_page ?? 1,
    totalCount: pagination?.count ?? 0,
    setPage,
    setPerPage,
    refetch,
  };
};

// ─── useCreateVendor ──────────────────────────────────────────────────────────

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateVendorRequest) => {
      const response = await createVendor(req);
      if (response.status !== true) {
        throw response; // lempar seluruh error response
      }
      return response;
    },
    onSuccess: () => {
      toast.success('Vendor added successfully');
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to add vendor'));
    },
  });
};

// ─── useUpdateVendor ──────────────────────────────────────────────────────────

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CreateVendorRequest }) => {
      const response = await updateVendor(id, data);
      if (response.status !== true) {
        throw response;
      }
      return response;
    },
    onSuccess: () => {
      toast.success('Vendor updated successfully');
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to update vendor'));
    },
  });
};

// ─── useDeleteVendor ──────────────────────────────────────────────────────────

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteVendor(id);
      if (response.status !== true) {
        throw response;
      }
      return response;
    },
    onSuccess: () => {
      toast.success('Vendor deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to delete vendor'));
    },
  });
};