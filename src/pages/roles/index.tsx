import { RolesTable } from '@/components/roles/roles-table';
import { roles } from '@/components/roles/data/roles';
import { Header } from '@/layouts/header';
import { useAuthStore } from '@/stores/auth-store';
import { Search } from '@/components/shared/search';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Main } from '@/layouts/main';
import { RolesProvider } from '@/components/roles/roles-provider';
import { RolesPrimaryButtons } from '@/components/roles/roles-primary-buttons';
import { RolesDialogs } from '@/components/roles/roles-dialog';

const RolePage = () => {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? 'john',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };
  return (
    <>
      <RolesProvider>
        <RolesDialogs />
        <Header>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown user={userData} />
          </div>
        </Header>
        <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Roles and Permissions
              </h2>
              <p className='text-muted-foreground'>
                Here&apos;s a list of your system roles and permissions
              </p>
            </div>
            <RolesPrimaryButtons></RolesPrimaryButtons>
          </div>
          <RolesTable data={roles} />
        </Main>
      </RolesProvider>
    </>
  );
};

export default RolePage;
