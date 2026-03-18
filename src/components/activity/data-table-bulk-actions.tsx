import { type Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { sleep } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/shared/data-table';
import { type Activity } from './data/schema';

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleBulkExport = () => {
    const selectedActivities = selectedRows.map(
      (row) => row.original as Activity,
    );
    toast.promise(sleep(2000), {
      loading: 'Exporting activities...',
      success: () => {
        table.resetRowSelection();
        return `Exported ${selectedActivities.length} activites${selectedActivities.length > 1 ? 's' : ''} to CSV.`;
      },
      error: 'Error',
    });
    table.resetRowSelection();
  };

  return (
    <>
      <BulkActionsToolbar table={table} entityName='task'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export activities'
              title='Export activites'
            >
              <Download />
              <span className='sr-only'>Export activity</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export activity</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
    </>
  );
}
