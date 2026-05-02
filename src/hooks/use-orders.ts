import { useQuery } from '@tanstack/react-query';
import { useActiveShopId } from '@/lib/shop';
import { OrdersApi } from '@/services/order.service';

export const useOrders = (search = '', page = 1, perPage = 10) => {
  const activeShopId = useActiveShopId();

  return useQuery({
    queryKey: ['orders', activeShopId, search, page, perPage],
    queryFn: () => OrdersApi.getAll(search, page, perPage),
  });
};

export const useOrderDetail = (id?: string | number) => {
  const activeShopId = useActiveShopId();

  return useQuery({
    queryKey: ['orders', 'detail', activeShopId, id],
    queryFn: () => OrdersApi.getDetail(id as string | number),
    enabled: id !== undefined && id !== null && id !== '',
  });
};
