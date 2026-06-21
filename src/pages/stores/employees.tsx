import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Loader2, Plus, Search, Trash2, Users } from 'lucide-react';

import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { STORE_USER_PERMISSIONS } from '@/constants/store-user-permissions';
import {
  useCreateStoreEmployees,
  useDeleteStoreEmployee,
  useStoreEmployees,
} from '@/hooks/use-store-users';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import PermissionWrapper from '@/layouts/middlewares/permission-wrapper';
import { useAuthStore } from '@/stores/auth-store';
import type { StoreEmployee } from '@/types/store-user.type';

const PER_PAGE = 10;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function StoreEmployeesPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const user = useAuthStore((state) => state.auth.user);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [userIdsText, setUserIdsText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] =
    useState<StoreEmployee | null>(null);

  const employeesQuery = useStoreEmployees(storeId, page, PER_PAGE, search);
  const createEmployees = useCreateStoreEmployees(storeId);
  const deleteEmployee = useDeleteStoreEmployee(storeId);

  const employees = employeesQuery.data?.data ?? [];
  const meta = employeesQuery.data?.meta;

  const parsedUserIds = useMemo(
    () =>
      Array.from(
        new Set(
          userIdsText
            .split(/[\s,]+/)
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      ),
    [userIdsText],
  );

  if (!storeId) {
    return <Navigate to="/stores" replace />;
  }

  const closeAddDialog = () => {
    setIsAddOpen(false);
    setUserIdsText('');
    setValidationError(null);
    createEmployees.reset();
  };

  const handleAddEmployees = () => {
    setValidationError(null);

    if (parsedUserIds.length === 0) {
      setValidationError('Masukkan minimal satu User ID.');
      return;
    }

    const invalidUserIds = parsedUserIds.filter(
      (userId) => !UUID_PATTERN.test(userId),
    );
    if (invalidUserIds.length > 0) {
      setValidationError(
        `Format User ID tidak valid: ${invalidUserIds.slice(0, 3).join(', ')}`,
      );
      return;
    }

    createEmployees.mutate(
      { user_ids: parsedUserIds },
      { onSuccess: closeAddDialog },
    );
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;

    deleteEmployee.mutate(selectedEmployee.id, {
      onSuccess: () => setSelectedEmployee(null),
    });
  };

  const addError =
    validationError ??
    (createEmployees.isError ? createEmployees.error.message : null);

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
              Employee Management
            </h1>
            <p className="text-muted-foreground">
              Kelola employee yang memiliki akses ke toko ini.
            </p>
          </div>

          <PermissionWrapper permissionId={STORE_USER_PERMISSIONS.CREATE}>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Employee
            </Button>
          </PermissionWrapper>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Employee</CardTitle>
            <CardDescription>
              Employee yang terhubung ke store ID: {storeId}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama atau email employee..."
                className="pl-9"
              />
            </div>

            {employeesQuery.isPending ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : employeesQuery.isError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  {employeesQuery.error.message ||
                    'Gagal mengambil data employee.'}
                </AlertDescription>
              </Alert>
            ) : employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-14 text-center">
                <Users className="mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="text-sm font-medium">Belum ada employee</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tambahkan user yang sudah terdaftar sebagai employee toko.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Nama</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="w-[120px] px-4 py-3 text-right font-medium">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="border-t">
                        <td className="px-4 py-3">
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {employee.id}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {employee.email}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <PermissionWrapper
                            permissionId={STORE_USER_PERMISSIONS.DELETE}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Hapus ${employee.name}`}
                              onClick={() => setSelectedEmployee(employee)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </PermissionWrapper>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {meta && meta.max_page > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {meta.page} dari {meta.max_page} · {meta.count} data
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((previous) => previous - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.max_page}
                    onClick={() => setPage((previous) => previous + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Main>

      {/* TODO: Replace manual IDs when a store-scoped eligible employee endpoint exists. */}
      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => {
          if (open) setIsAddOpen(true);
          else closeAddDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Employee</DialogTitle>
            <DialogDescription>
              Masukkan User ID dari akun employee yang sudah terdaftar.
              Pisahkan beberapa ID dengan koma, spasi, atau baris baru.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="employee-user-ids" className="text-sm font-medium">
              User ID
            </label>
            <Textarea
              id="employee-user-ids"
              value={userIdsText}
              onChange={(event) => {
                setUserIdsText(event.target.value);
                setValidationError(null);
                if (createEmployees.isError) createEmployees.reset();
              }}
              placeholder="Contoh: 9b6f1b48-fc88-43f0-b28e-56718efcf139"
              className="min-h-28"
              aria-invalid={Boolean(addError)}
            />
            <p className="text-xs text-muted-foreground">
              Total User ID unik: {parsedUserIds.length}
            </p>
            {addError && (
              <Alert variant="destructive">
                <AlertDescription>{addError}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeAddDialog}
              disabled={createEmployees.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleAddEmployees}
              disabled={createEmployees.isPending}
            >
              {createEmployees.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Tambah
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedEmployee)}
        onOpenChange={(open) => {
          if (!open) setSelectedEmployee(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Employee?</DialogTitle>
            <DialogDescription>
              Employee ini akan kehilangan akses ke toko. Akun user tidak akan
              dihapus dari sistem.
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">{selectedEmployee.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedEmployee.email}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedEmployee(null)}
              disabled={deleteEmployee.isPending}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee}
              disabled={deleteEmployee.isPending}
            >
              {deleteEmployee.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
