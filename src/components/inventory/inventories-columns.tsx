import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { type Inventory } from "./data/schema";
import {
  MoreVertical,
  Music,
  ShoppingCart,
  AlertTriangle,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const inventoryColumns: ColumnDef<Inventory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt={data.name}
                className="size-full object-cover"
              />
            ) : (
              <ImageIcon className="size-5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{data.name}</span>
            <span className="text-xs text-muted-foreground">
              {data.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Internal SKU" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.getValue("sku")}
      </span>
    ),
  },
  {
    id: "platformMappings",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Platform Mappings" />
    ),
    cell: ({ row }) => {
      const externals = row.original.externalProducts;
      const tiktok = externals.find((e) => e.platform === "tiktok");
      const shopee = externals.find((e) => e.platform === "shopee");

      if (externals.length === 0) {
        return (
          <div className="flex items-center gap-1.5 text-yellow-600">
            <AlertTriangle className="size-3.5" />
            <span className="text-xs">Unmapped</span>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-1 text-xs">
          {tiktok && (
            <div className="flex items-center gap-1.5 text-blue-500">
              <Music className="size-3.5" />
              <span className="font-mono">{tiktok.externalProductId}</span>
            </div>
          )}
          {shopee && (
            <div className="flex items-center gap-1.5 text-orange-500">
              <ShoppingCart className="size-3.5" />
              <span className="font-mono">{shopee.externalProductId}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Central Stock" />
    ),
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      const isCritical = stock < 10;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{stock}</span>
          {isCritical ? (
            <span className="text-xs text-red-500">Critical low</span>
          ) : (
            <span className="text-xs text-muted-foreground">In Stock</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const getBadgeStyles = (state: string) => {
        switch (state) {
          case "Mapped":
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
          case "Low Stock":
            return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
          case "Unmapped":
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
          default:
            return "bg-gray-100 text-gray-700";
        }
      };

      return (
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeStyles(status.state)}`}>
            {status.state}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {status.lastUpdated}
          </span>
        </div>
      );
    },
    filterFn: (row, _columnId, filterValue: string[]) => {
      if (!Array.isArray(filterValue) || filterValue.length === 0) {
        return true;
      }

      return filterValue.includes(row.original.status.state);
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row, table }) => {
      const rowData = row.original;
      const meta = table.options.meta as
        | {
            onEdit?: (item: Inventory) => void;
            onDelete?: (item: Inventory) => void;
          }
        | undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground">
              <MoreVertical className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => meta?.onEdit?.(rowData)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => meta?.onDelete?.(rowData)}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
