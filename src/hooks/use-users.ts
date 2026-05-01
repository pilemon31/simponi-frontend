import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersApi } from '@/services/users.service';
import { toast } from 'sonner';
import type {
  CreateUserRequest,
  UpdateUserStatusRequest,
} from '@/types/user.type';

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
      data: UpdateUserStatusRequest;
    }) => {
      return UsersApi.updateStatus(id, data);
    },
    onSuccess: (response) => {
      if (response.status) {
        toast.success('Status user berhasil diperbarui');
      } else {
        toast.error(response.error || response.message || 'Gagal memperbarui user');
      }
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
    onSuccess: (response) => {
      if (response.status) {
        toast.success('User berhasil dihapus');
      } else {
        toast.error(response.error || response.message || 'Gagal menghapus user');
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
