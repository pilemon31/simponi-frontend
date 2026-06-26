import { Navigate, Outlet, useLocation } from 'react-router';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePlatformStatus } from '@/hooks/use-platform-status';

export function PlatformGuard() {
  const location = useLocation();
  const {
    status,
    isLoading,
    isError,
    error,
    isStoreListError,
    refetch,
    refetchStoreList,
  } = usePlatformStatus();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Status platform tidak dapat diverifikasi</AlertTitle>
          <AlertDescription className="gap-3">
            <span>
              {error instanceof Error
                ? error.message
                : 'Gagal mengambil relasi platform dari backend.'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isStoreListError ? refetchStoreList() : refetch()
              }
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Coba Lagi
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (status === 'no-store') {
    return <Navigate to="/stores" state={{ from: location }} replace />;
  }

  if (status === 'none') {
    return <Navigate to="/connect" state={{ from: location }} replace />;
  }

  // Relation presence is used only as a demo-compatibility gate. It does not
  // prove that OAuth tokens or marketplace credentials are valid.
  return <Outlet />;
}
