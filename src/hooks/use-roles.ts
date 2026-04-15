import { useQuery } from '@tanstack/react-query';
import { RolesApi } from '@/services/roles.service';

export const useRoles = (search = '') => {
  return useQuery({
    queryKey: ['roles', search],
    queryFn: () => RolesApi.getAll(search),
  });
};
