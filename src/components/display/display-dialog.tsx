import { ExternalProductDeleteDialog } from "./display-delete-dialog";
import { ExternalProductMutateDrawer } from "./display-mutate-drawer";
import { useExternalProductDialogs } from "./display-provider";

export function ExternalProductDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useExternalProductDialogs();
  return (
    <>
      <ExternalProductMutateDrawer
        key="products-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          <ExternalProductMutateDrawer
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

          <ExternalProductDeleteDialog
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
