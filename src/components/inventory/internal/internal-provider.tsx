import React, { useState } from 'react';
import { type Inventory } from './data/schema';
import useDialogState from '@/hooks/use-dialog-state';

type InventoryDialogType = 'add' | 'edit' | 'delete';

type InventoryContextType = {
  open: InventoryDialogType | null;
  setOpen: (str: InventoryDialogType | null) => void;
  currentRow: Inventory | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Inventory | null>>;
};

const InventoryContext = React.createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<InventoryDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Inventory | null>(null);

  return (
    <InventoryContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </InventoryContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInventoryDialogs = () => {
  const inventoryContext = React.useContext(InventoryContext);

  if (!inventoryContext) {
    throw new Error(
      'useInventoryDialogs has to be used within <InventoryProvider>',
    );
  }

  return inventoryContext;
};
