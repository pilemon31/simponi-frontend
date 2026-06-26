import { useEffect, useMemo, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/context/auth.provider';
import { useStoresQuery } from '@/hooks/use-stores';
import { StoreContext } from '@/context/store-context';
import { isSuperadminRole } from '@/lib/roles';
import {
  clearActiveShopId,
  getActiveShopId,
  setActiveShopId,
  useActiveShopId,
} from '@/lib/shop';
import { useAuthStore } from '@/stores/auth-store';

export function StoreProvider({ children }: { children: ReactNode }) {
  const { isHydrating } = useAuth();
  const user = useAuthStore((state) => state.auth.user);
  const query = useStoresQuery();
  const activeStoreId = useActiveShopId('');
  const stores = useMemo(() => query.data ?? [], [query.data]);
  const isSuperadmin = isSuperadminRole(user?.role.name);
  const shouldEnforceStoreScope = !isHydrating && !isSuperadmin;
  const ids = stores.map((store) => store.id);
  const needsReconciliation =
    shouldEnforceStoreScope &&
    query.isSuccess &&
    ((stores.length === 0 && Boolean(activeStoreId)) ||
      (stores.length > 0 && !ids.includes(activeStoreId)));

  useEffect(() => {
    if (!shouldEnforceStoreScope || !query.isSuccess) return;

    const currentStoreId = getActiveShopId('');
    if (stores.length === 0) {
      if (currentStoreId) clearActiveShopId();
      return;
    }

    const firstStore = stores[0];
    if (
      firstStore &&
      !stores.some((store) => store.id === currentStoreId)
    ) {
      setActiveShopId(firstStore.id);
    }
  }, [query.isSuccess, shouldEnforceStoreScope, stores]);

  if ((isHydrating && !user) || (shouldEnforceStoreScope && query.isPending) || needsReconciliation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectStore = (storeId: string) => {
    if (stores.some((store) => store.id === storeId)) {
      setActiveShopId(storeId);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        activeStoreId,
        activeStore:
          stores.find((store) => store.id === activeStoreId) ?? null,
        isLoading: query.isPending,
        isError: query.isError,
        error: query.error,
        selectStore,
        refetch: query.refetch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
