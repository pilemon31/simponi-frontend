import type { DisplayExternalProduct } from "@/types/external-product.type";
import { DisplayDeleteDialog } from "./display-delete-dialog";
import { DisplayMutateDrawer } from "./display-mutate-drawer";
import { useDisplayDialogs } from "./display-provider";

type ProductOption = {
  id: string;
  name: string;
};

type StorePlatformOption = {
  id: string;
  label: string;
};

type DisplayDialogsProps = {
  productOptions?: ProductOption[];
  storePlatformOptions?: StorePlatformOption[];
  isMutating?: boolean;
  isDeleting?: boolean;
  onCreate?: (values: {
    productId: string;
    storePlatformId: string;
    price: number;
  }) => boolean | void | Promise<boolean | void>;
  onEdit?: (
    currentRow: DisplayExternalProduct,
    values: {
      productId: string;
      storePlatformId: string;
      price: number;
    },
  ) => boolean | void | Promise<boolean | void>;
  onDelete?: (currentRow: DisplayExternalProduct) => void | Promise<void>;
};

export function DisplayDialogs({
  productOptions,
  storePlatformOptions,
  isMutating,
  isDeleting,
  onCreate,
  onEdit,
  onDelete,
}: DisplayDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useDisplayDialogs();

  return (
    <>
      <DisplayMutateDrawer
        key="display-add"
        open={open === "add"}
        onOpenChange={(nextOpen: boolean) => setOpen(nextOpen ? "add" : null)}
        isPending={isMutating}
        productOptions={productOptions}
        storePlatformOptions={storePlatformOptions}
        onSubmitForm={async (values) => {
          return onCreate?.(values);
        }}
      />

      {currentRow && (
        <>
          <DisplayMutateDrawer
            key={`display-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={(nextOpen: boolean) => {
              setOpen(nextOpen ? "edit" : null);
              if (!nextOpen) {
                setTimeout(() => {
                  setCurrentRow(null);
                }, 300);
              }
            }}
            currentRow={currentRow}
            isPending={isMutating}
            productOptions={productOptions}
            storePlatformOptions={storePlatformOptions}
            onSubmitForm={async (values, row) => {
              if (!row) {
                return;
              }

              return onEdit?.(row, values);
            }}
          />

          <DisplayDeleteDialog
            key={`display-delete-${currentRow.id}`}
            open={open === "delete"}
            onOpenChange={(nextOpen: boolean) => {
              setOpen(nextOpen ? "delete" : null);
              if (!nextOpen) {
                setTimeout(() => {
                  setCurrentRow(null);
                }, 300);
              }
            }}
            currentRow={currentRow}
            isLoading={isDeleting}
            onConfirmDelete={async () => {
              await onDelete?.(currentRow);
            }}
          />
        </>
      )}
    </>
  );
}
