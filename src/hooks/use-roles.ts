import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RolesApi } from '@/services/roles.service';
import type { RoleResponse } from '@/types/role.type';
import type { ErrorResponse } from '@/types/response.type';
import type {
  UpdateRolePayloadValues,
  CreateRolePayloadValues,
} from '@/schemas/roles.schema';
import { toast } from 'sonner';

export const useRoles = (search = '') => {
  return useQuery({
    queryKey: ['roles', search],
    queryFn: () => RolesApi.getAll(search),
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<RoleResponse, ErrorResponse, CreateRolePayloadValues>({
    mutationFn: async (payload: CreateRolePayloadValues) => {
      const response = await RolesApi.create(payload);

      if (!response.status) {
        throw response;
      }

      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(response.message);
    },
    onError: (response) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.error(response.error);
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<RoleResponse, ErrorResponse, UpdateRolePayloadValues>({
    mutationFn: async (payload: UpdateRolePayloadValues) => {
      const response = await RolesApi.update(payload);

      if (!response.status) {
        throw response;
      }

      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(response.message);
    },
    onError: (response) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.error(response.error);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation<RoleResponse, ErrorResponse, string>({
    mutationFn: async (id: string) => {
      const response = await RolesApi.delete(id);

      if (!response.status) {
        throw response;
      }

      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(response.message);
    },
    onError: (response) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.error(response.error);
    },
  });
};
