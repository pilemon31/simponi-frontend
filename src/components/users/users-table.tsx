import { useState } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DataTablePagination,
  DataTableToolbar,
} from '@/components/shared/data-table';
import { DataTableBulkActions } from './data-table-bulk-actions';
import { cn } from '@/lib/utils';
import { usersColumns as columns } from './users-columns';
import { Roles } from './data/data';
import type { ProfileResponseData } from '@/types/user.type';
import type { Pagination } from '@/types/response.type';

type DataTableProps = {
  data: ProfileResponseData[];
  meta?: Pagination;
  onViewDetail?: (item: ProfileResponseData) => void;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange?: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onSetQueryParam?: (key: string, value: string) => void;
  onClearFilters?: () => void;
};

export function UsersTable({
  data,
  meta,
  onViewDetail,
  searchValue,
  onSearchChange,
  onPageChange,
  onPerPageChange,
  onClearFilters,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter] = useState('');

  const typedColumns = columns as ColumnDef<ProfileResponseData, unknown>[];

  const table = useReactTable({
    data,
    columns: typedColumns,
    meta: {
      onViewDetail,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.getValue('id')).toLowerCase();
      const activity = String(row.getValue('activity')).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();

      return id.includes(searchValue) || activity.includes(searchValue);
    },
  });

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4',
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Filter by activity or ID..."
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onClearFilters={onClearFilters}
        filters={[
          {
            columnId: 'role_name',
            title: 'Role',
            options: Roles,
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <Table className="min-w-xl">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        className="mt-auto"
        meta={meta}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
      <DataTableBulkActions table={table} />
    </div>
  );
}
