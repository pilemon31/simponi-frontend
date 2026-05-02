import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { Music, ShoppingCart, Image as ImageIcon } from "lucide-react";
import type { ExternalProductItem } from "@/types/external-product.type";
import { resolveImageUrl } from "@/lib/media";
import { DataTableRowActions } from "./data-table-row-actions";

export const externalProductColumns: ColumnDef<ExternalProductItem>[] = [
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
    accessorKey: "product_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    meta: {
      className: "ps-1 max-w-0 w-2/5",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => {
      const data = row.original;
      const imageUrl = data.image ? resolveImageUrl(data.image) : null;

      return (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={data.product_name}
                className="size-full object-cover"
              />
            ) : (
              <ImageIcon className="size-5" />
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="truncate font-medium text-foreground">
              {data.product_name || "-"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {data.store_platform_name || "Unknown Store"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "platform",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Platform" />
    ),
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => {
      const platform = row.getValue<string>("platform")?.toLowerCase();

      if (platform === "tiktok") {
        return (
          <div className="flex items-center gap-1.5 text-blue-500">
            <Music className="size-4" />
            <span className="text-sm font-medium capitalize">TikTok</span>
          </div>
        );
      }

      if (platform === "shopee") {
        return (
          <div className="flex items-center gap-1.5 text-orange-500">
            <ShoppingCart className="size-4" />
            <span className="text-sm font-medium capitalize">Shopee</span>
          </div>
        );
      }

      return <span className="text-sm capitalize">{platform || "-"}</span>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => {
      const price = row.getValue<number>("price");
      return (
        <span className="font-medium text-foreground">
          {price.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.getValue<string>("created_at")).toLocaleDateString(
          "id-ID",
          { day: "2-digit", month: "short", year: "numeric" },
        )}
      </span>
    ),
  },
  {
    id: "actions",
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
];
