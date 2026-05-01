import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import type { ProfileResponseData } from '@/types/user.type';

type UsersDialogType = 'add' | 'edit' | 'delete' | 'detail';

type UsersContextType = {
  open: UsersDialogType | null;
  setOpen: (str: UsersDialogType | null) => void;
  currentRow: ProfileResponseData | null;
  setCurrentRow: React.Dispatch<
    React.SetStateAction<ProfileResponseData | null>
  >;
};

const UsersContext = React.createContext<UsersContextType | null>(null);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ProfileResponseData | null>(
    null,
  );

  return (
    <UsersContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UsersContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext);

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersProvider>');
  }

  return usersContext;
};
