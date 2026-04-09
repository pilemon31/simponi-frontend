import type { ExternalProduct } from "@/components/inventory/display/data/schema";
import { adaptExternalProductToInventory } from "@/components/inventory/display/data/adapter";
import type { Pagination } from "@/types/response.type";
import { getExternalProducts } from "@/services/external-product.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ExternalProductItem } from "@/types/external-product.type";

type UseExternalProductResult = {
  data: ExternalProduct[];
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

export const useExternalProduct = (): UseExternalProductResult => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["external-products", page, perPage],
    queryFn: () => getExternalProducts(page, perPage),
  });

  const isSuccess = data?.status === true;
  const responseData = isSuccess ? data.data : null;

  const externalProductItems: ExternalProductItem[] = Array.isArray(
    responseData,
  )
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : [];

  const pagination: Pagination | null = isSuccess
    ? !Array.isArray(responseData)
      ? (responseData?.pagination ?? data.meta ?? null)
      : (data.meta ?? null)
    : null;

  const normalizedExternalProducts = externalProductItems.map(
    adaptExternalProductToInventory,
  );
  const hasResponse = data !== undefined;

  return {
    data: normalizedExternalProducts,
    isLoading,
    isError: isError || (hasResponse && !isSuccess),
    page,
    perPage,
    maxPage: pagination?.max_page ?? 1,
    totalCount: pagination?.count ?? 0,
    setPage,
    setPerPage,
    refetch,
  };
};
