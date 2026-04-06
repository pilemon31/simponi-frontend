import { InventoriesTable } from "@/components/inventory/inventories-table";
import InventoryStatsCard from "@/components/inventory/inventories-cards";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
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
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import type { Inventory } from "@/components/inventory/data/schema";
import { useAuthStore } from "@/stores/auth-store";
import InventoryAlertsCard from "@/components/inventory/inventories-alerts";
import { useInventory } from "@/hooks/use-inventory";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/product.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CreateFormState = {
  name: string;
  sku: string;
  stock: string;
  imageId: string;
  categoryId: string;
  description: string;
};

type EditFormState = {
  id: string;
  name: string;
  sku: string;
  stock: string;
  categoryId: string;
  description: string;
};

const initialCreateForm: CreateFormState = {
  name: "",
  sku: "",
  stock: "0",
  imageId: "",
  categoryId: "",
  description: "",
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const InternalProductPage = () => {
  const user = useAuthStore((state) => state.auth.user);
  const { data, isLoading } = useInventory();
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Inventory | null>(null);
  const [createForm, setCreateForm] =
    useState<CreateFormState>(initialCreateForm);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);

  const userData = {
    name: user?.name ?? "john",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  const createMutation = useMutation({
    mutationFn: async (payload: CreateFormState) => {
      const response = await createProduct({
        name: payload.name,
        sku: payload.sku,
        stock: Number(payload.stock),
        image_id: payload.imageId,
        description: payload.description || undefined,
        category_id: payload.categoryId || null,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to create product");
      }

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product-stats"] });
      toast.success("Product created");
      setCreateOpen(false);
      setCreateForm(initialCreateForm);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create product"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: EditFormState) => {
      const response = await updateProduct(payload.id, {
        name: payload.name,
        sku: payload.sku,
        stock: Number(payload.stock),
        description: payload.description || undefined,
        category_id: payload.categoryId || null,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to update product");
      }

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product-stats"] });
      toast.success("Product updated");
      setEditOpen(false);
      setEditForm(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update product"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await deleteProduct(productId);
      if (response.status !== true) {
        throw new Error(response.message || "Failed to delete product");
      }
      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product-stats"] });
      toast.success("Product deleted");
      setDeleteTarget(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete product"));
    },
  });

  const handleOpenEdit = (item: Inventory) => {
    setEditForm({
      id: item.id,
      name: item.name,
      sku: item.sku,
      stock: String(item.stock),
      categoryId: item.category?.id ?? "",
      description: item.description ?? "",
    });
    setEditOpen(true);
  };

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
              Internal Products
            </h2>
            <p className="text-muted-foreground">
              Manage your internal product catalog and central stock
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Add Product
          </Button>
        </div>

        <InventoryStatsCard />
        <InventoryAlertsCard />
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
            Loading products...
          </div>
        ) : (
          <InventoriesTable
            data={data}
            onEdit={handleOpenEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </Main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
            <DialogDescription>
              Fill product data. Use image ID from upload response.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="create-name">Name</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-sku">SKU</Label>
              <Input
                id="create-sku"
                value={createForm.sku}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, sku: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-stock">Stock</Label>
              <Input
                id="create-stock"
                type="number"
                min={0}
                value={createForm.stock}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, stock: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-image-id">Image ID</Label>
              <Input
                id="create-image-id"
                value={createForm.imageId}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    imageId: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-category-id">Category ID (optional)</Label>
              <Input
                id="create-category-id"
                value={createForm.categoryId}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-description">Description (optional)</Label>
              <Input
                id="create-description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
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
                !createForm.name ||
                !createForm.sku ||
                !createForm.imageId
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
            <DialogTitle>Update Product</DialogTitle>
            <DialogDescription>
              Update selected internal product data.
            </DialogDescription>
          </DialogHeader>

          {editForm ? (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  value={editForm.sku}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, sku: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min={0}
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, stock: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category-id">Category ID (optional)</Label>
                <Input
                  id="edit-category-id"
                  value={editForm.categoryId}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, categoryId: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description (optional)</Label>
                <Input
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, description: e.target.value } : prev,
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
        title="Delete Product"
        desc={`Delete ${deleteTarget?.name ?? "this product"}? This action cannot be undone.`}
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

export default InternalProductPage;
