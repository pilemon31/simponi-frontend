import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import {
  Music,
  ShoppingCart,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import type { ProductListItem } from "@/types/product.type";
import { resolveImageUrl } from "@/lib/media";
import { DataTableRowActions } from "./data-table-row-actions";

export const productColumns: ColumnDef<ProductListItem>[] = [
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
    meta: {
      className: "ps-1 max-w-0 w-2/3",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => {
      const data = row.original;
      const imageUrl = data.images?.[0]?.image_url
        ? resolveImageUrl(data.images[0].image_url)
        : null;

      return (
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={data.name}
                className="size-full object-cover"
              />
            ) : (
              <ImageIcon className="size-5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="truncate font-medium text-foreground">
              {String(data.name)
                .split(" ")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")}
            </span>
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
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
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
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => {
      const externals = row.original.external_products || [];
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
              <span className="font-mono">{tiktok.id}</span>
            </div>
          )}
          {shopee && (
            <div className="flex items-center gap-1.5 text-orange-500">
              <ShoppingCart className="size-3.5" />
              <span className="font-mono">{shopee.id}</span>
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
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
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
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
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
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeStyles(status)}`}>
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
];
