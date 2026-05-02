import { type Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/shared/data-table";
import { useState } from "react";
import { ExternalProductMultiDeleteDialog } from "./display-multi-delete-dialog";

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData extends { id: string }>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <BulkActionsToolbar table={table} entityName="external-product">
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
              <span className="sr-only">Delete External Products</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete External Products</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
      <ExternalProductMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  );
}
