import React, { useState } from "react";
import type { DisplayExternalProduct } from "@/types/external-product.type";
import useDialogState from "@/hooks/use-dialog-state";

type DisplayDialogType = "add" | "edit" | "delete";

type DisplayContextType = {
  open: DisplayDialogType | null;
  setOpen: (str: DisplayDialogType | null) => void;
  currentRow: DisplayExternalProduct | null;
  setCurrentRow: React.Dispatch<
    React.SetStateAction<DisplayExternalProduct | null>
  >;
};

const DisplayContext = React.createContext<DisplayContextType | null>(null);

export function DisplayProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DisplayDialogType>(null);
  const [currentRow, setCurrentRow] = useState<DisplayExternalProduct | null>(
    null,
  );

  return (
    <DisplayContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DisplayContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDisplayDialogs = () => {
  const displayContext = React.useContext(DisplayContext);

  if (!displayContext) {
    throw new Error(
      "useDisplayDialogs has to be used within <DisplayProvider>",
    );
  }

  return displayContext;
};
