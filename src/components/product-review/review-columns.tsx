import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import type { ProductReview } from "@/types/review.type";

const humanizeTag = (tag: string) => tag.replace(/_/g, " ");

export const reviewColumns: ColumnDef<ProductReview>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Produk" />
    ),
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">
          {row.original.product_name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.product_sku}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "review_text",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Review" />
    ),
    meta: {
      className: "ps-1 max-w-0 w-1/2",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => (
      <span className="block text-sm text-foreground">
        {row.getValue("review_text")}
      </span>
    ),
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    enableSorting: false,
    meta: {
      className: "ps-1",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => {
      const tags = row.original.tags ?? [];

      if (tags.length === 0) {
        return <span className="text-xs text-muted-foreground">—</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {humanizeTag(tag)}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal" />
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
];
