import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { stopImpersonate } from '@/services/auth.service';
import { getProfile } from '@/services/user.service';
import { useAuthStore } from '@/stores/auth-store';

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
};

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();
  const { auth } = useAuthStore();

  const stopImpersonateMutation = useMutation({
    mutationFn: stopImpersonate,
    onSuccess: async (result) => {
      if (!result.status) {
        toast.error(result.error || result.message || 'Gagal stop impersonate');
        return;
      }

      auth.resetImpersonateToken();
      auth.setUser(null);

      const profile = await getProfile();
      if (profile.status && profile.data) {
        auth.setUser(profile.data);
      }

      toast.success('Berhasil kembali ke akun awal');
      navigate('/', { replace: true });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      toast.error(message);
    },
  });

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          offset > 10 &&
            fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/20 after:backdrop-blur-lg',
        )}
      >
        <SidebarTrigger variant="outline" className="max-md:scale-125" />
        <Separator orientation="vertical" className="h-6" />
        {auth.impersonateToken && (
          <Button
            variant="outline"
            size="sm"
            className="border-border bg-muted/40 text-foreground hover:bg-muted"
            onClick={() => stopImpersonateMutation.mutate()}
            disabled={stopImpersonateMutation.isPending}
          >
            {stopImpersonateMutation.isPending
              ? 'Stopping...'
              : 'Stop Impersonate'}
          </Button>
        )}
        {children}
      </div>
    </header>
  );
}
