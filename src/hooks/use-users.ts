import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersApi } from '@/services/users.service';
import type { CreateUserRequest } from '@/types/user.type';

export const useUsers = (search = '', page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ['users', search, page, perPage],
    queryFn: () => UsersApi.getAll(search, page, perPage),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateUserRequest) => {
      return UsersApi.create(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateUserRequest;
    }) => {
      return UsersApi.updateStatus(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return UsersApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
