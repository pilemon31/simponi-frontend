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

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleBulkExport = () => {
    toast.promise(sleep(2000), {
      loading: 'Exporting orders...',
      success: () => {
        table.resetRowSelection();
        return `Exported ${selectedRows.length} order${selectedRows.length > 1 ? 's' : ''} to CSV.`;
      },
      error: 'Error',
    });
    table.resetRowSelection();
  };

  return (
    <>
      <BulkActionsToolbar table={table} entityName='order'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkExport}
              className='size-8'
              aria-label='export orders'
              title='export orders'
            >
              <Download />
              <span className='sr-only'>Export Orders</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export orders</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
    </>
  );
}
