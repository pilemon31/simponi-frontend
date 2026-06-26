import { useState } from "react";
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/shared/data-table";
import { reviewColumns as columns } from "./review-columns";
import { cn } from "@/lib/utils";
import { type Pagination } from "@/types/response.type";
import { type ProductReview } from "@/types/review.type";

type ReviewTableProps = {
  data: ProductReview[];
  meta?: Pagination;
  onPageChange?: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};

export function ReviewTable({
  data,
  meta,
  onPageChange,
  onPerPageChange,
}: ReviewTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={cn("flex flex-1 flex-col gap-4")}>
      <div className="overflow-hidden rounded-md border">
        <Table className="min-w-xl">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  className="h-24 text-center">
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
    </div>
  );
}
