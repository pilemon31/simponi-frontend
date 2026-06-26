import { Outlet } from 'react-router';

import { StoreProvider } from '@/context/store-provider';

export function StoreScopeLayout() {
  return (
    <StoreProvider>
      <Outlet />
    </StoreProvider>
  );
}
