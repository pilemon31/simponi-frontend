import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/auth-store';
import { ConfirmDialog } from './confirm-dialog';

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuthStore();

  const handleSignOut = () => {
    auth.reset();
    // Preserve current location for redirect after sign-in
    const currentPath = location.pathname;
    navigate(`/sign-in?redirect=${encodeURIComponent(currentPath)}`, {
      replace: true,
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Keluar'
      desc='Apakah anda yakin ingin keluar dari aplikasi?'
      confirmText='Keluar'
      destructive
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  );
}
