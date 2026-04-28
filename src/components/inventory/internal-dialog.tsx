import { InventoryDeleteDialog } from "@/components/inventory/internal-delete-dialog";
import { InventoryMutateDrawer } from "./internal-mutate-drawer";
import { useInventoryDialogs } from "./internal-provider";
import type { InternalInventory } from "@/types/product.type";

type InternalDialogsProps = {
  categories?: Array<{
    id: string;
    name: string;
  }>;
  isMutating?: boolean;
  isDeleting?: boolean;
  onCreate?: (values: {
    name: string;
    sku: string;
    stock: number;
    imageFile?: File | null;
    categoryId?: string;
    description?: string;
  }) => boolean | void | Promise<boolean | void>;
  onEdit?: (
    currentRow: InternalInventory,
    values: {
      name: string;
      sku: string;
      stock: number;
      imageFile?: File | null;
      categoryId?: string;
      description?: string;
    },
  ) => boolean | void | Promise<boolean | void>;
  onDelete?: (currentRow: InternalInventory) => void | Promise<void>;
};

export function InternalDialogs({
  categories,
  isMutating,
  isDeleting,
  onCreate,
  onEdit,
  onDelete,
}: InternalDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useInventoryDialogs();

  return (
    <>
      <InventoryMutateDrawer
        key="internal-add"
        open={open === "add"}
        onOpenChange={(nextOpen: boolean) => setOpen(nextOpen ? "add" : null)}
        isPending={isMutating}
        categories={categories}
        onSubmitForm={async (values) => {
          await onCreate?.(values);
        }}
      />

      {currentRow && (
        <>
          <InventoryMutateDrawer
            key={`internal-edit-${currentRow.id}`}
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
            categories={categories}
            onSubmitForm={async (values, row) => {
              if (!row) {
                return;
              }

              await onEdit?.(row, values);
            }}
          />

          <InventoryDeleteDialog
            key={`internal-delete-${currentRow.id}`}
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
