import type { ColumnDef } from "@tanstack/react-table";
import type { VendorData } from "@/types/vendor.type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

type VendorColumnsProps = {
  onEdit: (vendor: VendorData) => void;
  onDelete: (vendor: VendorData) => void;
};

export const getVendorColumns = ({
  onEdit,
  onDelete,
}: VendorColumnsProps): ColumnDef<VendorData>[] => [
  {
    accessorKey: "name",
    header: "Vendor Name",
    cell: ({ row }) => {
      const { name, image_url } = row.original;
      return (
        <div className="flex items-center gap-3">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-muted-foreground">
              {name.charAt(0)}
            </div>
          )}
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email || "-"}</span>
    ),
  },
  {
    accessorKey: "phone",    // sesuai json:"phone" di VendorResponse
    header: "Phone",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="block max-w-[180px] truncate text-muted-foreground">
        {row.original.address || "-"}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="block max-w-[200px] truncate text-muted-foreground">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(vendor)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(vendor)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];