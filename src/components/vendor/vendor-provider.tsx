import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import type { VendorData } from './data/schema';

type VendorDialogType = 'add' | 'edit' | 'delete';

type VendorContextType = {
  open: VendorDialogType | null;
  setOpen: (str: VendorDialogType | null) => void;
  currentRow: VendorData | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<VendorData | null>>;
};

const VendorContext = React.createContext<VendorContextType | null>(null);

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<VendorDialogType>(null);
  const [currentRow, setCurrentRow] = useState<VendorData | null>(null);

  return (
    <VendorContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </VendorContext>
  );
}

export const useVendorContext = () => {
  const ctx = React.useContext(VendorContext);
  if (!ctx) throw new Error('useVendorContext must be used within <VendorProvider>');
  return ctx;
};