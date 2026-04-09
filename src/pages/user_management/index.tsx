import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Search } from '@/components/shared/search';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import UserCards from '@/components/users/user-cards';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import { getUsers } from '@/services/users.service';
import { useAuthStore } from '@/stores/auth-store';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import UserCardsSkeleton from '@/components/users/user-cards-skeleton';

const UserManagementPage = () => {
  const user = useAuthStore((state) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const {
    data: usersData,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['users', currentPage, perPage],
    queryFn: () => getUsers(currentPage, perPage),
  });

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
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              User Management
            </h2>
            <p className="text-muted-foreground">
              Manage your system users and their permissions here.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading || isFetching ? (
            <>
              <UserCardsSkeleton />
              <UserCardsSkeleton />
            </>
          ) : isError || !usersData?.status ? (
            <p className="text-center text-sm text-gray-700">
              Failed to load users. Please try again later.
            </p>
          ) : (
            usersData.data.map((user) => (
              <UserCards key={user.id} user={user} />
            ))
          )}
        </div>
      </Main>
    </>
  );
};

export default UserManagementPage;
