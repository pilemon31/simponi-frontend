import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ConfigDrawer } from '@/components/shared/config-drawer';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Search } from '@/components/shared/search';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import { useAuthStore } from '@/stores/auth-store';
import { useVendor } from '@/hooks/use-vendor';
import { VendorProvider } from '@/components/vendor/vendor-provider';
import { VendorDialogs } from '@/components/vendor/vendor-dialogs';
import { VendorPrimaryButtons } from '@/components/vendor/vendor-primary-buttons';
import { VendorsTable } from '@/components/vendor/vendors-table';
import PermissionWrapper from '@/layouts/middlewares/permission-wrapper';
import { VENDOR_PERMISSIONS } from '@/constants/vendor-permissions';

const VendorPage = () => {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? 'john',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') ?? ''
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (!debouncedSearch) {
      params.delete('search');
    } else {
      params.set('search', debouncedSearch);
    }

    params.set('page', '1');

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, setSearchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const { data: vendorData } = useVendor(debouncedSearch);

  return (
    <VendorProvider>
      <VendorDialogs />

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
              Vendor Management
            </h2>
            <p className="text-muted-foreground">
              Manage your suppliers and vendor contacts
            </p>
          </div>

          <VendorPrimaryButtons />
        </div>

        <PermissionWrapper permissionId={VENDOR_PERMISSIONS.GET_ALL}>
          {/* ✅ table SELALU render (tidak hilang saat loading) */}
          <VendorsTable
            data={vendorData}
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
          />
        </PermissionWrapper>
      </Main>
    </VendorProvider>
  );
};

export default VendorPage;