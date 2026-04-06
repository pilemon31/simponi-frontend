import type { ExternalProductItem } from "@/types/external-product.type";
import type { Pagination } from "@/types/response.type";
import { getExternalProducts } from "@/services/external-product.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type UseExternalProductResult = {
  data: ExternalProductItem[];
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

  const externalProducts: ExternalProductItem[] = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : [];

  const normalizedExternalProducts = externalProducts.map((item) => ({
    ...item,
    image_url: item.image_url ?? item.image ?? "",
  }));

  const pagination: Pagination | null = isSuccess
    ? (responseData?.pagination ?? data.meta ?? null)
    : null;

  return {
    data: normalizedExternalProducts,
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
