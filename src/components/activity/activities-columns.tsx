import { type ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { Modules, Actions } from './data/data';
import { type Activity } from './data/schema';

export const activitiesColumns: ColumnDef<Activity>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-20'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'activity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Activity' />
    ),
    meta: {
      className: 'ps-1 max-w-0 w-2/3',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='truncate font-medium'>
            {row.getValue('activity')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    meta: {
      className: 'ps-1 max-w-0 w-2/3',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='truncate font-medium'>
            {row.getValue('description')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'module',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Module' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const module = Modules.find(
        (module) => module.value === row.getValue('module'),
      );

      if (!module) {
        return null;
      }

      return (
        <div className='flex w-25 items-center gap-2'>
          {module.icon && (
            <module.icon className='size-4 text-muted-foreground' />
          )}
          <span>{module.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Action' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const action = Actions.find(
        (action) => action.value === row.getValue('action'),
      );

      if (!action) {
        return null;
      }

      return (
        <div className='flex w-25 items-center gap-2'>
          {action.icon && (
            <action.icon className='size-4 text-muted-foreground' />
          )}
          <span>{action.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Timestamp' />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as Date;
      return (
        <div className='flex space-x-2'>
          <span className='truncate font-medium'>
            {timestamp.toLocaleString()}
          </span>
        </div>
      );
    },
  },
];
