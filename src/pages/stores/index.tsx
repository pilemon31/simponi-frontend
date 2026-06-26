import { useState } from 'react';
import {
  AlertCircle,
  Edit,
  Loader2,
  RefreshCw,
  Store as StoreIcon,
  Trash2,
} from 'lucide-react';

import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { StoreFormDialog } from '@/components/stores/store-form-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { STORE_PERMISSIONS } from '@/constants/store-permissions';
import { useStoreContext } from '@/context/store-context';
import { useDeleteStore, useStoreDetail } from '@/hooks/use-stores';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import { resolveImageUrl } from '@/lib/media';
import { clearActiveShopId, setActiveShopId } from '@/lib/shop';
import { useAuthStore } from '@/stores/auth-store';
import type { Store } from '@/types/store.type';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Permintaan store gagal.';

export default function StoresPage() {
  const user = useAuthStore((state) => state.auth.user);
  const { stores, activeStoreId, activeStore, isError, error, refetch } =
    useStoreContext();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Store | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const permissionIds =
    user?.role.permissions.map((permission) => permission.id) ?? [];
  const canViewDetail = permissionIds.includes(STORE_PERMISSIONS.GET_BY_ID);
  const canUpdate = permissionIds.includes(STORE_PERMISSIONS.UPDATE);
  const canDelete = permissionIds.includes(STORE_PERMISSIONS.DELETE);
  const canUpload = permissionIds.includes(STORE_PERMISSIONS.UPLOAD);
  const shouldFetchDetail = canViewDetail && Boolean(activeStore);

  const detailQuery = useStoreDetail(
    shouldFetchDetail ? activeStoreId : null,
  );
  const deleteMutation = useDeleteStore();
  const displayStore = detailQuery.data ?? activeStore;
  const isOwner = Boolean(displayStore && displayStore.owner.id === user?.id);
  const canEditActiveStore = Boolean(displayStore && isOwner && canUpdate);
  const canDeleteActiveStore = Boolean(displayStore && isOwner && canDelete);
  const imageUrl = resolveImageUrl(displayStore?.image_url ?? '');

  const handleRefetch = () => {
    refetch();
    if (shouldFetchDetail) {
      detailQuery.refetch();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteConfirmation !== deleteTarget.name) return;

    try {
      const deletedStoreId = deleteTarget.id;
      await deleteMutation.mutateAsync(deletedStoreId);
      const refreshed = await refetch();
      const remainingStores = (refreshed.data ?? []).filter(
        (store) => store.id !== deletedStoreId,
      );

      if (remainingStores[0]) {
        setActiveShopId(remainingStores[0].id);
      } else {
        clearActiveShopId();
      }

      setDeleteTarget(null);
      setDeleteConfirmation('');
    } catch {
      // Mutation error is displayed in the confirmation dialog.
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

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Store Management
            </h1>
            <p className="text-muted-foreground">
              Manajemen Toko hanya mengelola store yang sedang aktif dipilih.
            </p>
          </div>
          <Button variant="outline" onClick={handleRefetch}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data store tidak dapat dimuat</AlertTitle>
            <AlertDescription className="gap-3">
              <span>{getErrorMessage(error)}</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
              </Button>
            </AlertDescription>
          </Alert>
        ) : !activeStore ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <StoreIcon className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="font-semibold">Belum ada store aktif</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Buat atau pilih store dari store switcher di bagian atas sidebar.
              Halaman ini tidak menyediakan form tambah atau kontrol pindah
              store.
            </p>
            {stores.length > 0 && activeStoreId ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Store aktif tersimpan tidak valid atau tidak tersedia lagi.
              </p>
            ) : null}
          </div>
        ) : shouldFetchDetail && detailQuery.isPending ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : shouldFetchDetail && detailQuery.isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Detail store tidak dapat dimuat</AlertTitle>
            <AlertDescription className="gap-3">
              <span>{getErrorMessage(detailQuery.error)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => detailQuery.refetch()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
              </Button>
            </AlertDescription>
          </Alert>
        ) : displayStore ? (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <StoreIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {displayStore.name}
                    </CardTitle>
                    <CardDescription className="mt-1 max-w-2xl">
                      {displayStore.description || 'Tidak ada deskripsi'}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={displayStore.is_active ? 'outline' : 'secondary'}>
                  {displayStore.is_active ? 'Store aktif' : 'Store nonaktif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium">{displayStore.owner.name}</p>
                <p className="text-sm text-muted-foreground">
                  {displayStore.owner.email}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Platform relation
                </p>
                {displayStore.platforms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {displayStore.platforms.map((platform) => (
                      <Badge key={platform.id} variant="secondary">
                        {platform.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada platform terdaftar.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {canEditActiveStore ? (
                <Button onClick={() => setEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit active store
                </Button>
              ) : null}
              {canDeleteActiveStore ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDeleteTarget(displayStore);
                    setDeleteConfirmation('');
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete active store
                </Button>
              ) : null}
              {!canEditActiveStore && !canDeleteActiveStore ? (
                <p className="text-sm text-muted-foreground">
                  Kamu dapat melihat detail store, tetapi tidak memiliki akses
                  edit atau hapus untuk store ini.
                </p>
              ) : null}
            </CardFooter>
          </Card>
        ) : null}
      </Main>

      {displayStore ? (
        <StoreFormDialog
          key={displayStore.id}
          open={editOpen}
          store={displayStore}
          canUpload={canUpload}
          onOpenChange={setEditOpen}
        />
      ) : null}

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteConfirmation('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus active store?</DialogTitle>
            <DialogDescription>
              Tindakan ini menghapus store aktif dan dapat memengaruhi fitur
              yang bergantung pada store, termasuk produk, platform, order, dan
              data operasional lain. Ketik nama store untuk mengonfirmasi.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            placeholder={deleteTarget?.name}
          />
          {deleteMutation.isError ? (
            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage(deleteMutation.error)}
              </AlertDescription>
            </Alert>
          ) : null}
          <DialogFooter>
            <Button
              variant="outline"
              disabled={deleteMutation.isPending}
              onClick={() => {
                setDeleteTarget(null);
                setDeleteConfirmation('');
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={
                deleteMutation.isPending ||
                deleteConfirmation !== deleteTarget?.name
              }
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
