import { Header } from '@/layouts/header';
import { useAuthStore } from '@/stores/auth-store';
import { Search } from '@/components/shared/search';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Main } from '@/layouts/main';
import { Redo, Undo } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { inventoryLogs } from '@/components/inventory-log/data/inventory-logs';
import { InventoryLogsTable } from '@/components/inventory-log/inventory-logs-table';

const InventoryLogPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? 'john',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };
  return (
    <>
      <Header>
        <Search />
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
