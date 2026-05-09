import { type Table } from "@tanstack/react-table";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/shared/data-table";
import { useState } from "react";
import { ProductMultiDeleteDialog } from "./internal-multi-delete-dialog";
import { ProductExportDialog } from "./internal-export-dialog";
import type { ProductListItem } from "@/types/product.type";

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData extends ProductListItem>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <>
      <BulkActionsToolbar table={table} entityName="product">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowExportDialog(true)}
              className="size-8"
              aria-label="export products"
              title="export products">
              <ArrowUpRight />
              <span className="sr-only">Export Products</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export to External Products</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="delete products"
              title="delete products">
              <Trash2 />
              <span className="sr-only">Delete Products</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Products</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
      <ProductMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
      <ProductExportDialog
        table={table}
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
      />
    </>
  );
}
