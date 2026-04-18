import { useQuery } from '@tanstack/react-query';
import { PermissionsApi } from '@/services/permissions.service';

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => PermissionsApi.getAll(),
  });
};
