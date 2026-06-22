import { createContext, useContext } from 'react';

import type { useStoresQuery } from '@/hooks/use-stores';
import type { Store } from '@/types/store.type';

export interface StoreContextValue {
  stores: Store[];
  activeStoreId: string;
  activeStore: Store | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  selectStore: (storeId: string) => void;
  refetch: ReturnType<typeof useStoresQuery>['refetch'];
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used inside StoreProvider');
  }
  return context;
}
