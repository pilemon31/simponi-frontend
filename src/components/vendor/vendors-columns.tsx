import { type ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/shared/data-table';
import { type VendorData } from './data/schema';
import { DataTableRowActions } from './data-table-row-actions';

export const vendorColumns: ColumnDef<VendorData>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor Name" />
    ),
    cell: ({ row }) => {
      const { name } = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-muted text-sm font-semibold uppercase text-muted-foreground">
            {name.charAt(0)}
          </div>
          <span className="font-medium text-foreground">{name}</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.email || '-'}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.original.phone || '-'}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <span className="block max-w-[200px] truncate text-sm text-muted-foreground">
        {row.original.address || '-'}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <span className="block max-w-[200px] truncate text-sm text-muted-foreground">
        {row.original.description || '-'}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
];