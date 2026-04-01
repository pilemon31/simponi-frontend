import { adaptProductToInventory } from "@/components/inventory/data/adapter";
import type { Inventory } from "@/components/inventory/data/schema";
import { getProducts, getProductStats } from "@/services/product.service";
import type { ProductStatsData } from "@/types/product.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type UseInventoryResult = {
  data: Inventory[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  maxPage: number;
  totalCount: number;
  setPage: (page: number) => void;
  setPerPage: (page: number) => void;
  refetch: () => void;
};

export const useInventory = (): UseInventoryResult => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", page, perPage],
    queryFn: () => getProducts(page, perPage),
  });

  const isSuccess = data?.status === true;
  const products = isSuccess ? data.data.data.map(adaptProductToInventory) : [];
  const pagination = isSuccess ? data.data.pagination : null;

  return {
    data: products,
    isLoading,
    isError: isError || isSuccess,
    page,
    perPage,
    maxPage: pagination?.max_page ?? 1,
    totalCount: pagination?.count ?? 0,
    setPage,
    setPerPage,
    refetch,
  };
};

export function useProductStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-stats"],
    queryFn: getProductStats,
  });

  const stats: ProductStatsData = data?.status
    ? data.data
    : {
        total_products: 0,
        total_skus: 0,
        stock_units: 0,
        low_stock: 0,
        out_of_stock: 0,
        unsynced: 0,
      };

  return { stats, isLoading, isError };
}
