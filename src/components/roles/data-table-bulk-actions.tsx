import { type Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/shared/data-table';
import { RolesMultiDeleteDialog } from './roles-multi-delete-dialog';
import { useState } from 'react';

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData extends { id: string }>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <BulkActionsToolbar table={table} entityName='role'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='delete roles'
              title='delete roles'
            >
              <Trash2 />
              <span className='sr-only'>Delete Roles</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Roles</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
      <RolesMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      ></RolesMultiDeleteDialog>
    </>
  );
}
