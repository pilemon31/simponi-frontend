import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, Loader2, RefreshCw, Store } from 'lucide-react';

import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { PlatformCard } from '@/components/settings/connect-platform/platform-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { PLATFORM_PERMISSIONS } from '@/constants/platform-permissions';
import {
  PlatformRequestError,
  usePlatformStatus,
} from '@/hooks/use-platform-status';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import { useAuthStore } from '@/stores/auth-store';
import type { PlatformItem } from '@/types/platform.type';

interface ConnectPlatformPageProps {
  availablePlatforms: PlatformItem[];
}

const getRequestErrorMessage = (error: unknown) => {
  if (error instanceof PlatformRequestError) {
    if (error.httpStatus === 403) return 'Kamu tidak memiliki izin untuk aksi ini.';
    if (error.httpStatus === 404) return 'Store atau platform tidak ditemukan.';
    if (error.httpStatus === 500) return 'Server gagal memproses permintaan platform.';
  }

  return error instanceof Error ? error.message : 'Permintaan platform gagal.';
};

export default function ConnectPlatformPage({
  availablePlatforms,
}: ConnectPlatformPageProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.auth.user);
  const {
    store,
    hasActiveStore,
    isLoading,
    isError,
    error,
    refetch,
    connectAsync,
    isConnecting,
    disconnectAsync,
    isDisconnecting,
  } = usePlatformStatus();

  const [connectTarget, setConnectTarget] = useState<PlatformItem | null>(null);
  const [disconnectTarget, setDisconnectTarget] =
    useState<PlatformItem | null>(null);
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const permissions = user?.role.permissions.map((permission) => permission.id) ?? [];
  const canConnect = permissions.includes(PLATFORM_PERMISSIONS.CONNECT);
  const canDisconnect = permissions.includes(PLATFORM_PERMISSIONS.DISCONNECT);
  const configuredIds = new Set(
    store?.platforms.map((platform) => platform.id) ?? [],
  );
  const configuredCount = availablePlatforms.filter((platform) =>
    configuredIds.has(platform.platformDbId),
  ).length;

  const handleConnect = async () => {
    if (!connectTarget) return;
    setActionError(null);
    setOauthNotice(null);

    try {
      const response = await connectAsync(connectTarget.platformDbId);
      await refetch();

      if (response.data?.auth_url) {
        setOauthNotice(
          'Backend menyediakan inisiasi OAuth, tetapi penyelesaiannya diblokir karena callback backend memerlukan Bearer token. Tidak ada perubahan status yang dibuat oleh frontend.',
        );
      }
      setConnectTarget(null);
    } catch (requestError: unknown) {
      setActionError(getRequestErrorMessage(requestError));
    }
  };

  const handleDisconnect = async () => {
    if (!disconnectTarget) return;
    setActionError(null);

    try {
      await disconnectAsync(disconnectTarget.platformDbId);
      const refreshed = await refetch();
      const relationStillExists = refreshed.data?.platforms.some(
        (platform) => platform.id === disconnectTarget.platformDbId,
      );

      if (relationStillExists) {
        setActionError(
          'Backend masih mengembalikan relasi platform. Tampilan tetap dipertahankan sebagai Terdaftar.',
        );
        return;
      }

      setDisconnectTarget(null);
    } catch (requestError: unknown) {
      setActionError(getRequestErrorMessage(requestError));
    }
  };

  const userData = {
    name: user?.name ?? '',
    email: user?.email ?? '',
    avatar: '/avatars/shadcn.jpg',
  };

  return (
    <>
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>

      <Main>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Koneksi Platform
          </h1>
          <p className="text-muted-foreground">
            Kelola platform yang terdaftar pada store aktif.
          </p>
        </div>

        <Separator className="my-4 lg:my-6" />

        <div className="mx-auto max-w-3xl space-y-6">
          {oauthNotice ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>OAuth belum dapat diselesaikan</AlertTitle>
              <AlertDescription>{oauthNotice}</AlertDescription>
            </Alert>
          ) : null}

          {actionError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Aksi platform gagal</AlertTitle>
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          ) : null}

          {!hasActiveStore ? (
            <Alert>
              <Store className="h-4 w-4" />
              <AlertTitle>Store aktif belum dipilih</AlertTitle>
              <AlertDescription>
                Pilih store dari sidebar sebelum mengelola platform.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex min-h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Data platform tidak dapat dimuat</AlertTitle>
              <AlertDescription className="gap-3">
                <span>{getRequestErrorMessage(error)}</span>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Coba Lagi
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {store ? (
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {configuredCount} platform terdaftar
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              ) : null}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Status “Terdaftar” hanya menunjukkan adanya relasi platform.
                  Status OAuth, token, dan kredensial tidak tersedia dari API.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                {availablePlatforms.map((platform) => (
                  <PlatformCard
                    key={platform.id}
                    platform={platform}
                    isConfigured={configuredIds.has(platform.platformDbId)}
                    canConnect={canConnect}
                    canDisconnect={canDisconnect}
                    isBusy={isConnecting || isDisconnecting}
                    onConnect={() => {
                      setActionError(null);
                      setConnectTarget(platform);
                    }}
                    onDisconnect={() => {
                      setActionError(null);
                      setDisconnectTarget(platform);
                    }}
                  />
                ))}
              </div>

              {configuredCount > 0 ? (
                <Button className="w-full" onClick={() => navigate('/dashboard')}>
                  Buka Dashboard
                </Button>
              ) : null}
            </>
          )}
        </div>
      </Main>

      <Dialog
        open={Boolean(connectTarget)}
        onOpenChange={(open) => !open && setConnectTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mulai konfigurasi {connectTarget?.name}?</DialogTitle>
            <DialogDescription>
              Frontend akan memanggil endpoint backend yang terverifikasi.
              Respons OAuth tidak akan dibuka atau dianggap sebagai platform
              yang sudah terdaftar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isConnecting}
              onClick={() => setConnectTarget(null)}
            >
              Batal
            </Button>
            <Button disabled={isConnecting} onClick={handleConnect}>
              {isConnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(disconnectTarget)}
        onOpenChange={(open) => !open && setDisconnectTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus relasi {disconnectTarget?.name}?</DialogTitle>
            <DialogDescription>
              Tindakan ini menghapus relasi platform dari store. Platform
              mungkin tidak dapat didaftarkan kembali sampai callback OAuth
              backend atau mekanisme dummy connect diperbaiki.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Tindakan destruktif</AlertTitle>
            <AlertDescription>
              Jangan lanjutkan jika platform masih diperlukan untuk demo,
              sinkronisasi, atau data marketplace.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isDisconnecting}
              onClick={() => setDisconnectTarget(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={isDisconnecting}
              onClick={handleDisconnect}
            >
              {isDisconnecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Hapus Relasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
