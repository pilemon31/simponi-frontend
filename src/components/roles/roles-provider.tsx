import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { type Role } from './data/schema';

type RolesDialogType = 'add' | 'edit' | 'delete';

type RolesContextType = {
  open: RolesDialogType | null;
  setOpen: (str: RolesDialogType | null) => void;
  currentRow: Role | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Role | null>>;
};

const RolesContext = React.createContext<RolesContextType | null>(null);

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RolesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Role | null>(null);

  return (
    <RolesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RolesContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRoles = () => {
  const usersContext = React.useContext(RolesContext);

  if (!usersContext) {
    throw new Error('useRoles has to be used within <RolesContext>');
  }

  return usersContext;
};
