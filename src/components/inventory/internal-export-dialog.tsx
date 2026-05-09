"use client";

import { useEffect, useMemo, useState } from "react";
import { type Table } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalProductApi } from "@/services/external-product.service";
import { usePlatformStatus } from "@/hooks/use-platform-status";
import type { ProductListItem } from "@/types/product.type";

const matchesPlatform = (value: string, candidates: string[]) =>
  candidates.some((candidate) => value.toLowerCase().includes(candidate));

const SHOPEE_NAMES = ["shopee"];
const TIKTOK_NAMES = ["tiktok"];

type PriceDraft = {
  shopee: string;
  tiktok: string;
};

type ProductExportDialogProps<TData> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  table: Table<TData>;
};

export function ProductExportDialog<TData extends ProductListItem>({
  open,
  onOpenChange,
  table,
}: ProductExportDialogProps<TData>) {
  const queryClient = useQueryClient();
  const { store } = usePlatformStatus();
  const selectedRows = table.getFilteredSelectedRowModel().rows as Array<{
    original: ProductListItem;
  }>;

  const platformIds = useMemo(() => {
    const platformList = store?.platforms ?? [];
    const shopeePlatform = platformList.find((platform) =>
      matchesPlatform(platform.platform_name, SHOPEE_NAMES),
    );
    const tiktokPlatform = platformList.find((platform) =>
      matchesPlatform(platform.platform_name, TIKTOK_NAMES),
    );

    return {
      shopee: shopeePlatform?.store_platform_id ?? "",
      tiktok: tiktokPlatform?.store_platform_id ?? "",
    };
  }, [store]);

  const selectedIds = useMemo(
    () => selectedRows.map((row) => row.original.id).join("|"),
    [selectedRows],
  );

  const [priceDrafts, setPriceDrafts] = useState<Record<string, PriceDraft>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const nextDrafts: Record<string, PriceDraft> = {};
    selectedRows.forEach((row) => {
      nextDrafts[row.original.id] = {
        shopee: "",
        tiktok: "",
      };
    });

    setPriceDrafts(nextDrafts);
  }, [open, selectedIds]);

  const handleChange = (
    productId: string,
    platform: "shopee" | "tiktok",
    value: string,
  ) => {
    setPriceDrafts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [platform]: value,
      },
    }));
  };

  const parsePrice = (value: string) => {
    if (!value.trim()) return null;
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) return null;
    return parsed;
  };

  const handleSubmit = async () => {
    const tasks: Array<{
      productId: string;
      platformLabel: string;
      platformId: string;
      price: number;
    }> = [];

    const invalidEntries: string[] = [];

    selectedRows.forEach((row) => {
      const draft = priceDrafts[row.original.id];
      if (!draft) return;

      const shopeeMapped =
        row.original.external_products?.some(
          (external) => external.platform === "shopee",
        ) ?? false;
      const tiktokMapped =
        row.original.external_products?.some(
          (external) => external.platform === "tiktok",
        ) ?? false;

      if (!shopeeMapped && platformIds.shopee) {
        const shopeePrice = parsePrice(draft.shopee);
        if (draft.shopee.trim() && shopeePrice === null) {
          invalidEntries.push(`${row.original.name} (Shopee)`);
        }
        if (shopeePrice !== null) {
          tasks.push({
            productId: row.original.id,
            platformLabel: "Shopee",
            platformId: platformIds.shopee,
            price: shopeePrice,
          });
        }
      }

      if (!tiktokMapped && platformIds.tiktok) {
        const tiktokPrice = parsePrice(draft.tiktok);
        if (draft.tiktok.trim() && tiktokPrice === null) {
          invalidEntries.push(`${row.original.name} (TikTok)`);
        }
        if (tiktokPrice !== null) {
          tasks.push({
            productId: row.original.id,
            platformLabel: "TikTok",
            platformId: platformIds.tiktok,
            price: tiktokPrice,
          });
        }
      }
    });

    if (invalidEntries.length > 0) {
      toast.error("Periksa kembali harga yang tidak valid.");
      return;
    }

    if (!platformIds.shopee && !platformIds.tiktok) {
      toast.error("Platform belum terhubung ke toko ini.");
      return;
    }

    if (tasks.length === 0) {
      toast.error("Masukkan harga untuk minimal satu platform.");
      return;
    }

    try {
      setIsSubmitting(true);

      const results = await Promise.all(
        tasks.map((task) =>
          ExternalProductApi.create({
            product_id: task.productId,
            platform_id: task.platformId,
            price: task.price,
          }),
        ),
      );

      const failed = results.filter((result) => !result.status);
      const successCount = results.length - failed.length;

      if (successCount > 0) {
        queryClient.invalidateQueries({ queryKey: ["external-products"] });
      }

      if (failed.length > 0) {
        toast.error(
          `${failed.length} dari ${results.length} export gagal. Cek kembali platform atau harga.`,
        );
        return;
      }

      toast.success("External products berhasil dibuat.");
      table.resetRowSelection();
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal membuat external product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setPriceDrafts({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export ke External Product</DialogTitle>
          <DialogDescription>
            Tentukan harga per platform untuk setiap produk yang dipilih.
            Kosongkan jika tidak ingin membuat listing di platform tersebut.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-3 overflow-y-auto">
          {selectedRows.map((row) => {
            const draft = priceDrafts[row.original.id] || {
              shopee: "",
              tiktok: "",
            };
            const shopeeMapped =
              row.original.external_products?.some(
                (external) => external.platform === "shopee",
              ) ?? false;
            const tiktokMapped =
              row.original.external_products?.some(
                (external) => external.platform === "tiktok",
              ) ?? false;
            const shopeeDisconnected = !platformIds.shopee;
            const tiktokDisconnected = !platformIds.tiktok;

            return (
              <div key={row.original.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">
                    {row.original.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    SKU: {row.original.sku}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Shopee Price</Label>
                    <Input
                      type="number"
                      min={0}
                      value={draft.shopee}
                      disabled={shopeeMapped || shopeeDisconnected}
                      placeholder={
                        shopeeMapped
                          ? "Sudah terhubung"
                          : shopeeDisconnected
                            ? "Platform belum terhubung"
                            : "Masukkan harga"
                      }
                      onChange={(event) =>
                        handleChange(
                          row.original.id,
                          "shopee",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok Price</Label>
                    <Input
                      type="number"
                      min={0}
                      value={draft.tiktok}
                      disabled={tiktokMapped || tiktokDisconnected}
                      placeholder={
                        tiktokMapped
                          ? "Sudah terhubung"
                          : tiktokDisconnected
                            ? "Platform belum terhubung"
                            : "Masukkan harga"
                      }
                      onChange={(event) =>
                        handleChange(
                          row.original.id,
                          "tiktok",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Create External Products"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
