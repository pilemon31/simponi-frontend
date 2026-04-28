import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { InternalInventory } from "@/types/product.type";

type InventoryDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: InternalInventory;
  onConfirmDelete?: (productId: string) => void;
  isLoading?: boolean;
};

export function InventoryDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onConfirmDelete,
  isLoading,
}: InventoryDeleteDialogProps) {
  const [value, setValue] = useState("");

  const isConfirmed = value.trim() === currentRow.name;

  const handleDelete = async () => {
    if (!isConfirmed) {
      return;
    }

    try {
      await onConfirmDelete?.(currentRow.id);
      onOpenChange(false);
    } catch {
      // Errors are surfaced by caller mutation handlers.
    }
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
          Delete Product
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.name}</span>?
            <br />
            This action will permanently remove this product and cannot be
            undone.
          </p>

          <Label className="my-2">
            Product Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
