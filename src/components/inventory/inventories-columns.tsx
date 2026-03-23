import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { ProductIcons } from "./data/data";
import { type Inventory } from "./data/schema";
import { MoreVertical, Music, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PRODUCT" />
    ),
    cell: ({ row }) => {
      const product = row.original.product;
      const Icon =
        ProductIcons[product.icon as keyof typeof ProductIcons] ||
        ProductIcons.Box;

      return (
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{product.name}</span>
            <span className="text-xs text-muted-foreground">
              {product.category}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "internalSku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="INTERNAL SKU" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        {row.getValue("internalSku")}
      </span>
    ),
  },
  {
    accessorKey: "platformSkus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PLATFORM SKUS" />
    ),
    cell: ({ row }) => {
      const skus = row.original.platformSkus;

      return (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-1.5 text-blue-500">
            <Music className="size-3.5" />
            <span className="font-mono">{skus.tiktok}</span>
          </div>

          {skus.shopee ? (
            <div className="flex items-center gap-1.5 text-orange-500">
              <ShoppingCart className="size-3.5" />
              <span className="font-mono">{skus.shopee}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-yellow-600">
              <AlertTriangle className="size-3.5" />
              <span>Not mapped</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "unifiedStock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UNIFIED STOCK" />
    ),
    cell: ({ row }) => {
      const stock = row.original.unifiedStock;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{stock.total}</span>
          {stock.isCriticalLow ? (
            <span className="text-xs text-red-500">Critical low</span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Available: {stock.available}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "tiktokStock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TIKTOK STOCK" />
    ),
    cell: ({ row }) => <span>{row.getValue("tiktokStock")}</span>,
  },
  {
    accessorKey: "shopeeStock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SHOPEE STOCK" />
    ),
    cell: ({ row }) => {
      const stock = row.getValue("shopeeStock") as number | null;
      return <span>{stock !== null ? stock : "-"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const getBadgeStyles = (state: string) => {
        switch (state) {
          case "Synced":
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
    filterFn: (row, value) => {
      return value.includes(row.original.status.state);
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ACTIONS" />
    ),
    cell: () => {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground">
          <MoreVertical className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      );
    },
  },
];
