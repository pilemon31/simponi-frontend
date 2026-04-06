import { useState } from "react";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import { DataTablePagination, DataTableToolbar } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CreateVendorRequest, VendorData } from "@/types/vendor.type";
import { createVendor, updateVendor, deleteVendor } from "@/services/vendor.service";
import { getVendorColumns } from "./vendors-columns";
import { VendorFormDialog, VendorDeleteDialog } from "./vendor-dialogs";

type VendorsTableProps = {
  data: VendorData[];
};

export function VendorsTable({ data }: VendorsTableProps) {
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["vendors"] });

  const createMutation = useMutation({
    mutationFn: (req: CreateVendorRequest) => createVendor(req),
    onSuccess: () => {
      toast.success("Vendor added successfully");
      setAddOpen(false);
      invalidate();
    },
    onError: () => toast.error("Failed to add vendor"),
  });

  const updateMutation = useMutation({
    mutationFn: (req: CreateVendorRequest) =>
      updateVendor(selectedVendor!.id, req),
    onSuccess: () => {
      toast.success("Vendor updated successfully");
      setEditOpen(false);
      invalidate();
    },
    onError: () => toast.error("Failed to update vendor"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteVendor(selectedVendor!.id),
    onSuccess: () => {
      toast.success("Vendor deleted successfully");
      setDeleteOpen(false);
      setSelectedVendor(null);
      invalidate();
    },
    onError: () => toast.error("Failed to delete vendor"),
  });

  const columns = getVendorColumns({
    onEdit: (vendor) => {
      setSelectedVendor(vendor);
      setEditOpen(true);
    },
    onDelete: (vendor) => {
      setSelectedVendor(vendor);
      setDeleteOpen(true);
    },
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _colId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      const { name, email, phone } = row.original;
      return (
        name.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search) ||
        phone.toLowerCase().includes(search)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={cn("flex flex-1 flex-col gap-4")}>
      <div className="flex items-center justify-between gap-2">
        <DataTableToolbar
          table={table}
          searchPlaceholder="Search by name, email, or phone..."
        />
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table className="min-w-xl">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
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
                  className="h-24 text-center"
                >
                  No vendors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} className="mt-auto" />

      {/* Add Dialog */}
      <VendorFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        mode="add"
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <VendorFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        defaultValues={selectedVendor ?? undefined}
        onSubmit={(data) => updateMutation.mutate(data)}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Dialog */}
      <VendorDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        vendorName={selectedVendor?.name}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}