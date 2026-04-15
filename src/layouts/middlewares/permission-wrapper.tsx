import { useAuthStore } from '@/stores/auth-store';
import React from 'react';

interface PermissionWrapperProps {
  children: React.ReactNode;
  permissionId: string;
}

const PermissionWrapper = ({
  children,
  permissionId,
}: PermissionWrapperProps) => {
  const auth = useAuthStore((state) => state.auth.user);

  const authorized = auth?.role.permissions.some((p) => p.id === permissionId);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
};

export default PermissionWrapper;
