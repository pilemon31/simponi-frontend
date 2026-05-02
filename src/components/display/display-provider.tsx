import React, { useState } from "react";
import type { ExternalProductItem } from "@/types/external-product.type";
import useDialogState from "@/hooks/use-dialog-state";

type ExternalProductDialogType = "add" | "edit" | "delete";

type ExternalProductContextType = {
  open: ExternalProductDialogType | null;
  setOpen: (str: ExternalProductDialogType | null) => void;
  currentRow: ExternalProductItem | null;
  setCurrentRow: React.Dispatch<
    React.SetStateAction<ExternalProductItem | null>
  >;
};

const ExternalProductContext =
  React.createContext<ExternalProductContextType | null>(null);

export function ExternalProductProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useDialogState<ExternalProductDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ExternalProductItem | null>(
    null,
  );

  return (
    <ExternalProductContext
      value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ExternalProductContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useExternalProductDialogs = () => {
  const externalProductContext = React.useContext(ExternalProductContext);

  if (!externalProductContext) {
    throw new Error(
      "useExternalProductDialogs has to be used within <ExternalProductProvider>",
    );
  }

  return externalProductContext;
};
