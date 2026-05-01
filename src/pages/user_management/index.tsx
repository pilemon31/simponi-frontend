import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Search } from '@/components/shared/search';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import { useAuthStore } from '@/stores/auth-store';
import { UsersTable } from '@/components/users/users-table';
import type { ProfileResponseData, UsersResponse } from '@/types/user.type';
import type { ErrorResponse } from '@/types/response.type';
import {
  UsersProvider,
  useUsers as useUsersDialogs,
} from '@/components/users/user-provider';
import { useSearchParams } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useUsers as useUsersQuery } from '@/hooks/use-users';
import { UserAddButton } from '@/components/users/user-add-button';
import { UserDialogs } from '@/components/users/user-dialog';

const isGetUsersSuccess = (
  response: UsersResponse | ErrorResponse | undefined,
): response is UsersResponse => response?.status === true;

const UserPage = () => {
  return (
    <UsersProvider>
      <UserPageContent />
    </UsersProvider>
  );
};

const UserPageContent = () => {
  const user = useAuthStore((state) => state.auth.user);
  const { setCurrentRow, setOpen } = useUsersDialogs();

  const userData = {
    name: user?.name ?? 'john',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('per_page')) || 10;
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const HandleQueryParam = useCallback(
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

  const HandleFilters = () => {
    setSearchInput('');
    setSearchParams(
      () => {
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('per_page', String(perPage));
        return params;
      },
      { replace: true },
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => HandleQueryParam('search', value),
      500,
    );
  };

  const handlePageChange = (newPage: number) => {
    HandleQueryParam('page', String(newPage));
  };

  const handlePerPageChange = (newLimit: number) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set('per_page', String(newLimit));
        params.set('page', '1');
        return params;
      },
      { replace: true },
    );
  };

  const { data: usersData } = useUsersQuery(searchInput, page, perPage);
  const data = isGetUsersSuccess(usersData) ? usersData.data : [];
  const meta = isGetUsersSuccess(usersData) ? usersData.meta : undefined;

  const handleViewDetail = (item: ProfileResponseData) => {
    setCurrentRow(item);
    setOpen('detail');
  };

  return (
    <>
      <UserDialogs />

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

          <UserAddButton />
        </div>

        <UsersTable
          data={data}
          meta={meta}
          onViewDetail={handleViewDetail}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSetQueryParam={HandleQueryParam}
          onClearFilters={HandleFilters}
        />
      </Main>
    </>
  );
};

export default UserPage;
