import { useNavigate, useLocation } from 'react-router';
import { ChevronsUpDown, Plus, Store as StoreIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useStoreContext } from '@/context/store-context';
import { STORE_PERMISSIONS } from '@/constants/store-permissions';
import { resolveImageUrl } from '@/lib/media';
import { useAuthStore } from '@/stores/auth-store';

export function ShopSwitcher() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const { stores, activeStore, isError, selectStore } = useStoreContext();
  const canCreate = useAuthStore((state) =>
    state.auth.user?.role.permissions.some(
      (permission) => permission.id === STORE_PERMISSIONS.CREATE,
    ),
  );

  const handleSelectStore = (storeId: string) => {
    selectStore(storeId);

    const employeeMatch = location.pathname.match(
      /^\/stores\/[^/]+\/employees$/,
    );
    if (employeeMatch) {
      navigate(`/stores/${encodeURIComponent(storeId)}/employees`, {
        replace: true,
      });
    }
  };

  if (isError) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" onClick={() => navigate('/stores')}>
            <StoreIcon className="size-4" />
            <span>Store tidak dapat dimuat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeStore) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            onClick={() => navigate(canCreate ? '/stores?create=1' : '/stores')}
          >
            {canCreate ? <Plus className="size-4" /> : <StoreIcon className="size-4" />}
            <span>{canCreate ? 'Tambah Store' : 'Belum ada store'}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const imageUrl = resolveImageUrl(activeStore.image_url);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <StoreIcon className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{activeStore.name}</span>
                <span className="truncate text-xs">
                  {activeStore.is_active ? 'Aktif' : 'Tidak aktif'}
                </span>
              </div>
              <ChevronsUpDown className="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Stores
            </DropdownMenuLabel>
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => handleSelectStore(store.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <StoreIcon className="size-4 shrink-0" />
                </div>
                <span className="truncate">{store.name}</span>
              </DropdownMenuItem>
            ))}
            {canCreate ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={() => navigate('/stores?create=1')}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Tambah Store
                  </div>
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
