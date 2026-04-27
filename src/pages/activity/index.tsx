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
          <div className="flex flex-wrap items-end justify-between gap-1">
            <div className="flex gap-1">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Activity Log
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground">
            Here&apos;s a list of your system activities for this month!
          </p>
        </div>
        <ActivitiesTable data={activities} />
      </Main>
    </>
  );
};

export default ActivityPage;
