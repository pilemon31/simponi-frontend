import { getVendors } from "@/services/vendor.service";
import type { VendorData } from "@/types/vendor.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

export const useVendor = (): UseVendorResult => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["vendors", page, perPage],
    queryFn: () => getVendors(page, perPage),
  });

  const isSuccess = data?.status === true;
  const vendors: VendorData[] = isSuccess ? (data.data.data as VendorData[]) : [];
  const pagination = isSuccess ? data.data.pagination : null;

  return {
    data: vendors,
    isLoading,
    isError: isError || !isSuccess,
    page,
    perPage,
    maxPage: pagination?.max_page ?? 1,
    totalCount: pagination?.count ?? 0,
    setPage,
    setPerPage,
    refetch,
  };
};