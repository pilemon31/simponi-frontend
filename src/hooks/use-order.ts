import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/order.service";

export const useOrder = (search='', page=1, perPage=10) => {

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["orders", search, page, perPage],
    queryFn: () => getOrders(search, page, perPage),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};