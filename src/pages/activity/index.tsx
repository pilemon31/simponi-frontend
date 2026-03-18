import { ActivitiesTable } from '@/components/activity/activities-table';
import { activities } from '@/components/activity/data/activites';
import { Header } from '@/layouts/header';
import { useAuthStore } from '@/stores/auth-store';
import { Search } from '@/components/shared/search';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Main } from '@/layouts/main';

const ActivityPage = () => {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.accountNo ?? '001',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };
  return (
    <>
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
            <h2 className='text-2xl font-bold tracking-tight'>Activity Log</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your system activities for this month!
            </p>
          </div>
        </div>
        <ActivitiesTable data={activities} />
      </Main>
    </>
  );
};

export default ActivityPage;
