'use client';

import { RolesTable } from '@/components/roles/roles-table';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useRoles } from '@/hooks/use-roles';
import type { GetAllRoleResponse } from '@/types/role.type';
import type { ErrorResponse } from '@/types/response.type';

const isGetAllRoleSuccess = (
  response: GetAllRoleResponse | ErrorResponse | undefined,
): response is GetAllRoleResponse => response?.status === true;

const RolePage = () => {
  const user = useAuthStore((state) => state.auth.user);

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
        params.set('limit', String(perPage));
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

  const { data: rolesData } = useRoles(searchInput, page, perPage);
  const data = isGetAllRoleSuccess(rolesData) ? rolesData.data : [];
  const meta = isGetAllRoleSuccess(rolesData) ? rolesData.meta : undefined;

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
            <RolesPrimaryButtons />
          </div>
          <RolesTable
            data={data}
            meta={meta}
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            onSetQueryParam={HandleQueryParam}
            onClearFilters={HandleFilters}
          />
        </Main>
      </RolesProvider>
    </>
  );
};

export default RolePage;
