import { useQuery} from '@tanstack/react-query';
import { OrdersApi } from '@/services/order.service';


export const useOrders = (search = '', page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['orders', search, page, perPage],
    queryFn: () => OrdersApi.getAll(search, page, perPage),
  });
};