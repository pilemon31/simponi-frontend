import { ProductDeleteDialog } from "./internal-delete-dialog";
import { ProductMutateDrawer } from "./internal-mutate-drawer";
import { useProductDialogs } from "./internal-provider";

export function ProductDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProductDialogs();
  return (
    <>
      <ProductMutateDrawer
        key="products-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <ProductMutateDrawer
            key={`products-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <ProductDeleteDialog
            key={`products-delete-${currentRow.id}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
