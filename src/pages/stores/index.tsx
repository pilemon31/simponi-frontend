import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import {
  AlertCircle,
  Edit,
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Store as StoreIcon,
  Trash2,
  Users,
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
import { STORE_USER_PERMISSIONS } from '@/constants/store-user-permissions';
import { useStoreContext } from '@/context/store-context';
import { useDeleteStore, useStoreDetail } from '@/hooks/use-stores';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import { resolveImageUrl } from '@/lib/media';
import { useAuthStore } from '@/stores/auth-store';
import type { Store } from '@/types/store.type';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Permintaan store gagal.';

export default function StoresPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.auth.user);
  const { stores, activeStoreId, isError, error, selectStore, refetch } =
    useStoreContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [formStore, setFormStore] = useState<Store | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailStoreId, setDetailStoreId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Store | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const detailQuery = useStoreDetail(detailStoreId);
  const deleteMutation = useDeleteStore();
  const permissionIds =
    user?.role.permissions.map((permission) => permission.id) ?? [];
  const canCreate = permissionIds.includes(STORE_PERMISSIONS.CREATE);
  const canViewDetail = permissionIds.includes(STORE_PERMISSIONS.GET_BY_ID);
  const canUpdate = permissionIds.includes(STORE_PERMISSIONS.UPDATE);
  const canDelete = permissionIds.includes(STORE_PERMISSIONS.DELETE);
  const canUpload = permissionIds.includes(STORE_PERMISSIONS.UPLOAD);
  const canManageEmployees = permissionIds.includes(
    STORE_USER_PERMISSIONS.GET_ALL,
  );

  const createRequested = searchParams.get('create') === '1' && canCreate;

  const filteredStores = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return stores;
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(normalizedSearch) ||
        store.description.toLowerCase().includes(normalizedSearch),
    );
  }, [search, stores]);

  const closeForm = () => {
    setFormOpen(false);
    setFormStore(null);
    if (searchParams.has('create')) {
      const next = new URLSearchParams(searchParams);
      next.delete('create');
      setSearchParams(next, { replace: true });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteConfirmation !== deleteTarget.name) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
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
              Kelola store dan pilih store aktif untuk seluruh fitur SIMPONI.
            </p>
          </div>
          {canCreate ? (
            <Button
              onClick={() => {
                setFormStore(null);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Store
            </Button>
          ) : null}
        </div>

        {isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Daftar store tidak dapat dimuat</AlertTitle>
            <AlertDescription className="gap-3">
              <span>{getErrorMessage(error)}</span>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Coba Lagi
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {stores.length > 0 ? (
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama atau deskripsi store..."
                  className="pl-9"
                />
              </div>
            ) : null}

            {stores.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                <StoreIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                <h2 className="font-semibold">Belum ada store</h2>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Buat store pertama untuk mengaktifkan pemilihan store dan
                  fitur yang bergantung pada store.
                </p>
                {canCreate ? (
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setFormStore(null);
                      setFormOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Store
                  </Button>
                ) : null}
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
                Tidak ada store yang cocok dengan pencarian.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredStores.map((store) => {
                  const imageUrl = resolveImageUrl(store.image_url);
                  const isOwner = store.owner.id === user?.id;
                  const isActive = store.id === activeStoreId;

                  return (
                    <Card
                      key={store.id}
                      className={isActive ? 'border-primary' : undefined}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <StoreIcon className="h-6 w-6" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-lg">
                              {store.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {store.description || 'Tidak ada deskripsi'}
                            </CardDescription>
                          </div>
                          {isActive ? <Badge>Aktif dipilih</Badge> : null}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          Owner: {store.owner.name}
                        </p>
                        <p className="text-muted-foreground">
                          Platform terdaftar: {store.platforms.length}
                        </p>
                        <Badge variant={store.is_active ? 'outline' : 'secondary'}>
                          {store.is_active ? 'Store aktif' : 'Store nonaktif'}
                        </Badge>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2">
                        {!isActive ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => selectStore(store.id)}
                          >
                            Pilih Store
                          </Button>
                        ) : null}
                        {canViewDetail ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDetailStoreId(store.id)}
                          >
                            <Eye className="mr-1 h-4 w-4" /> Detail
                          </Button>
                        ) : null}
                        {canManageEmployees ? (
                          <Button size="sm" variant="ghost" asChild>
                            <Link to={`/stores/${store.id}/employees`}>
                              <Users className="mr-1 h-4 w-4" /> Employee
                            </Link>
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            selectStore(store.id);
                            navigate('/connect');
                          }}
                        >
                          Platform
                        </Button>
                        {isOwner && canUpdate ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setFormStore(store);
                              setFormOpen(true);
                            }}
                          >
                            <Edit className="mr-1 h-4 w-4" /> Edit
                          </Button>
                        ) : null}
                        {isOwner && canDelete ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => {
                              setDeleteTarget(store);
                              setDeleteConfirmation('');
                            }}
                          >
                            <Trash2 className="mr-1 h-4 w-4" /> Hapus
                          </Button>
                        ) : null}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Main>

      <StoreFormDialog
        key={`${
          createRequested ? 'create-requested' : (formStore?.id ?? 'create')
        }-${String(formOpen || createRequested)}`}
        open={formOpen || createRequested}
        store={createRequested ? null : formStore}
        canUpload={canUpload}
        onOpenChange={(open) => {
          if (open) setFormOpen(true);
          else closeForm();
        }}
      />

      <Dialog
        open={Boolean(detailStoreId)}
        onOpenChange={(open) => !open && setDetailStoreId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Store</DialogTitle>
            <DialogDescription>
              Informasi terbaru dari backend.
            </DialogDescription>
          </DialogHeader>
          {detailQuery.isPending ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
          ) : detailQuery.isError ? (
            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage(detailQuery.error)}
              </AlertDescription>
            </Alert>
          ) : detailQuery.data ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Nama</p>
                <p className="font-medium">{detailQuery.data.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Deskripsi</p>
                <p>{detailQuery.data.description || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Owner</p>
                <p>
                  {detailQuery.data.owner.name} ({detailQuery.data.owner.email})
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Platform terdaftar</p>
                <p>
                  {detailQuery.data.platforms.length > 0
                    ? detailQuery.data.platforms
                        .map((platform) => platform.name)
                        .join(', ')
                    : 'Belum ada'}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Store?</DialogTitle>
            <DialogDescription>
              Tindakan ini menghapus store dan dapat menghapus data terkait.
              Ketik nama store untuk mengonfirmasi.
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
              onClick={() => setDeleteTarget(null)}
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
