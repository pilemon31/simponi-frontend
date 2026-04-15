import { Header } from '@/layouts/header';
import { useAuthStore } from '@/stores/auth-store';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Main } from '@/layouts/main';
import { Redo, Undo } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { InventoryLogsTable } from '@/components/inventory-log/inventory-logs-table';
import { Input } from '@/components/ui/input';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInventoryLogs } from '@/hooks/use-inventory-log';
import { type InventoryLog } from '@/components/inventory-log/data/schema';

const InventoryLogPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? 'john',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const search = searchParams.get('search') ?? '';
  const [searchInput, setSearchInput] = useState(search);

  const { data: inventoryLogsData } = useInventoryLogs(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const setQueryParams = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (!value || value === 'all') {
            params.delete(key);
          } else {
            params.set(key, value);
          }
          if (key !== 'page') {
            params.set('page', '1');
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setQueryParams('search', value);
    }, 500);
  };

  const inventoryLogs: InventoryLog[] =
    inventoryLogsData?.data?.map((item) => ({
      id: item.id,
      product: item.product.name,
      source: item.source,
      change: item.change,
      note: item.note,
      timestamp: new Date(item.created_at),
    })) ?? [];

  return (
    <>
      <Header>
        <Input
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search inventory logs..."
          className="h-8 w-full flex-1 rounded-md bg-muted/25 text-sm shadow-none sm:w-40 md:flex-none lg:w-52 xl:w-64"
        />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="flex gap-1">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Inventory Log
                <span>
                  <Redo size={12} className="translate-y-1" />
                  <Undo className="transform scale-y-[-1]" size={12} />
                </span>
              </h2>
              <Button
                variant={'ghost'}
                onClick={() => navigate('/activity')}
                className="text-xs px-1 hover:bg-transparent hover:underline"
              >
                Activity Log
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Here&apos;s a list of your inventory activities for this month!
          </p>
        </div>
        <InventoryLogsTable data={inventoryLogs} />
      </Main>
    </>
  );
};

export default InventoryLogPage;
