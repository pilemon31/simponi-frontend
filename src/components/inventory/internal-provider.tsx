import React, { useState } from "react";
import { type ProductListItem } from "@/types/product.type";
import useDialogState from "@/hooks/use-dialog-state";

type ProductDialogType = "add" | "edit" | "delete";

type ProductContextType = {
  open: ProductDialogType | null;
  setOpen: (str: ProductDialogType | null) => void;
  currentRow: ProductListItem | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<ProductListItem | null>>;
};

const ProductContext = React.createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProductDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ProductListItem | null>(null);

  return (
    <ProductContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProductDialogs = () => {
  const productContext = React.useContext(ProductContext);

  if (!productContext) {
    throw new Error(
      "useProductDialogs has to be used within <ProductProvider>",
    );
  }

  return productContext;
};
