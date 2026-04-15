import { type ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { type Permissions, type Role } from './data/schema';
import { DataTableRowActions } from './data-table-row-actions';

export const rolesColumns: ColumnDef<Role>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    meta: {
      className: 'ps-1 max-w-0 w-2/3',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='truncate font-medium'>{row.getValue('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'permissions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Permissions' />
    ),
    meta: {
      className: 'ps-1 max-w-0 w-2/3',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const permissions: Permissions[] = row.getValue('permissions');
      const capitalizedPermissions = permissions
        .map(
          (permission) =>
            permission.module.charAt(0).toUpperCase() +
            permission.module.slice(1),
        )
        .join(', ');

      return (
        <div className='flex space-x-2'>
          <span className='truncate font-medium'>{capitalizedPermissions}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
];
