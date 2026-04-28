import { useQuery } from '@tanstack/react-query';
import { OrdersApi } from '@/services/order.service';

export const useOrders = (search = '', page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['orders', search, page, perPage],
    queryFn: () => OrdersApi.getAll(search, page, perPage),
  });
};

export const useOrderDetail = (id?: string | number) => {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: () => OrdersApi.getDetail(id as string | number),
    enabled: id !== undefined && id !== null && id !== '',
  });
};
