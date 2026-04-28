import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { DisplayExternalProduct } from "@/types/external-product.type";

type DisplayDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: DisplayExternalProduct;
  onConfirmDelete?: (id: string) => void | Promise<void>;
  isLoading?: boolean;
};

export function DisplayDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onConfirmDelete,
  isLoading,
}: DisplayDeleteDialogProps) {
  const [value, setValue] = useState("");

  const isConfirmed = value.trim() === currentRow.product_name;

  const handleDelete = async () => {
    if (!isConfirmed) {
      return;
    }

    await onConfirmDelete?.(currentRow.id);
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={!isConfirmed}
      isLoading={isLoading}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          Delete External Listing
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete listing for{" "}
            <span className="font-bold">{currentRow.product_name}</span>?
            <br />
            This action will permanently remove this listing and cannot be
            undone.
          </p>

          <Label className="my-2">
            Product Name:
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Type product name to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
