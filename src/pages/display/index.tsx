import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import { useAuthStore } from "@/stores/auth-store";
import { useExternalProduct } from "@/hooks/use-external-product";
import { DiplayTable } from "@/components/inventory/display/display-table";
import type { ExternalProductItem } from "@/types/external-product.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createExternalProduct,
  deleteExternalProduct,
  updateExternalProduct,
} from "@/services/external-product.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Music, Link2, DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CreateExternalFormState = {
  productId: string;
  storePlatformId: string;
  price: string;
};

type EditExternalFormState = {
  id: string;
  price: string;
  productName: string;
};

const initialCreateForm: CreateExternalFormState = {
  productId: "",
  storePlatformId: "",
  price: "0",
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const DisplayProductPage = () => {
  const user = useAuthStore((state) => state.auth.user);
  const { data, isLoading, totalCount } = useExternalProduct();
  const queryClient = useQueryClient();
  const externalProducts = Array.isArray(data) ? data : [];

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExternalProductItem | null>(
    null,
  );
  const [createForm, setCreateForm] =
    useState<CreateExternalFormState>(initialCreateForm);
  const [editForm, setEditForm] = useState<EditExternalFormState | null>(null);

  const userData = {
    name: user?.name ?? "john",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  const shopeeCount = externalProducts.filter((ep) =>
    ep.platform.toLowerCase().includes("shopee"),
  ).length;

  const tiktokCount = externalProducts.filter((ep) =>
    ep.platform.toLowerCase().includes("tiktok"),
  ).length;

  const createMutation = useMutation({
    mutationFn: async (payload: CreateExternalFormState) => {
      const response = await createExternalProduct({
        product_id: payload.productId,
        store_platform_id: payload.storePlatformId,
        price: Number(payload.price),
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to create listing");
      }

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["external-products"] });
      toast.success("Listing created");
      setCreateOpen(false);
      setCreateForm(initialCreateForm);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create listing"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: EditExternalFormState) => {
      const response = await updateExternalProduct(payload.id, {
        price: Number(payload.price),
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to update listing");
      }

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["external-products"] });
      toast.success("Listing updated");
      setEditOpen(false);
      setEditForm(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update listing"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (externalProductId: string) => {
      const response = await deleteExternalProduct(externalProductId);
      if (response.status !== true) {
        throw new Error(response.message || "Failed to delete listing");
      }
      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["external-products"] });
      toast.success("Listing deleted");
      setDeleteTarget(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete listing"));
    },
  });

  const handleOpenEdit = (item: ExternalProductItem) => {
    setEditForm({
      id: item.id,
      productName: item.product_name,
      price: String(item.price),
    });
    setEditOpen(true);
  };

  const statsItems = [
    {
      label: "Total Listings",
      value: totalCount,
      icon: <Link2 className="h-4 w-4 text-muted-foreground" />,
      color: "",
    },
    {
      label: "Shopee",
      value: shopeeCount,
      icon: <ShoppingCart className="h-4 w-4 text-orange-500" />,
      color: "text-orange-500",
    },
    {
      label: "TikTok",
      value: tiktokCount,
      icon: <Music className="h-4 w-4 text-blue-500" />,
      color: "text-blue-500",
    },
    {
      label: "Avg. Price",
      value:
        externalProducts.length > 0
          ? Math.round(
              externalProducts.reduce((acc, ep) => acc + ep.price, 0) /
                externalProducts.length,
            ).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })
          : "Rp0",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      color: "",
    },
  ];

  return (
    <>
      <Header>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Display Products
            </h2>
            <p className="text-muted-foreground">
              Manage product listings across Shopee and TikTok platforms
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Add Listing
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsItems.map((item) => (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.label}
                </CardTitle>
                {item.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${item.color}`}>
                  {isLoading ? (
                    <span className="text-muted-foreground text-base">...</span>
                  ) : (
                    item.value
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
            Loading display products...
          </div>
        ) : (
          <DiplayTable
            data={data}
            onEdit={handleOpenEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </Main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create External Listing</DialogTitle>
            <DialogDescription>
              Link internal product and platform listing by ID.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="create-external-product-id">Product ID</Label>
              <Input
                id="create-external-product-id"
                value={createForm.productId}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    productId: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-external-store-id">
                Store Platform ID
              </Label>
              <Input
                id="create-external-store-id"
                value={createForm.storePlatformId}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    storePlatformId: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-external-price">Price</Label>
              <Input
                id="create-external-price"
                type="number"
                min={0}
                value={createForm.price}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                createMutation.isPending ||
                !createForm.productId ||
                !createForm.storePlatformId
              }
              onClick={() => createMutation.mutate(createForm)}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editOpen && !!editForm}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) {
            setEditForm(null);
          }
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Listing Price</DialogTitle>
            <DialogDescription>
              Update listing price for selected external product.
            </DialogDescription>
          </DialogHeader>

          {editForm ? (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Product</Label>
                <Input value={editForm.productName} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-external-price">Price</Label>
                <Input
                  id="edit-external-price"
                  type="number"
                  min={0}
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, price: e.target.value } : prev,
                    )
                  }
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={updateMutation.isPending || !editForm}
              onClick={() => {
                if (editForm) {
                  updateMutation.mutate(editForm);
                }
              }}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title="Delete Listing"
        desc={`Delete listing for ${deleteTarget?.product_name ?? "this product"}? This action cannot be undone.`}
        confirmText={deleteMutation.isPending ? "Deleting..." : "Delete"}
        destructive
        isLoading={deleteMutation.isPending}
        handleConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
      />
    </>
  );
};

export default DisplayProductPage;
