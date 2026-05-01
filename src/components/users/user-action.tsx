import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { startImpersonate } from '@/services/auth.service';
import { getProfile } from '@/services/user.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/auth-store';

type Props = {
  userId: string;
};

export function UserActions({ userId }: Props) {
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const getProfileMutation = useMutation({ mutationFn: getProfile });

  const impersonateMutation = useMutation({
    mutationFn: () => startImpersonate(userId),
    onSuccess: async (result) => {
      const toastId = toast.loading('Masuk ke akun...');
      let signedInUserName = 'user';

      if (result.status) {
        const accessToken = result.data?.access_token;

        if (!accessToken) {
          toast.error('Token tidak valid', { id: toastId });
          return;
        }

        auth.setImpersonateToken(auth.accessToken);
        auth.setAccessToken(accessToken);

        try {
          const profile = await getProfileMutation.mutateAsync();

          if (profile.status && profile.data) {
            auth.setUser(profile.data);
            signedInUserName = profile.data?.name ?? signedInUserName;
          } else {
            toast.error(profile.message || 'Gagal memuat profil impersonate', {
              id: toastId,
            });
            return;
          }
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : 'Gagal memuat profil impersonate';
          toast.error(message, { id: toastId });
          return;
        }

        navigate('/', { replace: true });

        toast.success(`Login sebagai ${signedInUserName}`, {
          id: toastId,
        });
      } else {
        toast.error(result.error || result.message || 'Gagal impersonate', {
          id: toastId,
        });
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      toast.error(message);
    },
  });

  return (
    <Button
      onClick={() => impersonateMutation.mutate()}
      variant="ghost"
      className="px-3 py-1 text-sm rounded-md bg-black text-white hover:border hover:bg-transparent hover:border-black transition-all"
      disabled={impersonateMutation.isPending || getProfileMutation.isPending}
    >
      {impersonateMutation.isPending || getProfileMutation.isPending
        ? 'Loading'
        : 'Login'}
    </Button>
  );
}
