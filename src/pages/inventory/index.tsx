import InventoryAlertsCard from "@/components/inventory/internal/internal-alerts";
import InventoryStatsCard from "@/components/inventory/internal/internal-cards";
import { InternalDialogs } from "@/components/inventory/internal/internal-dialog";
import {
  InventoryProvider,
  useInventoryDialogs,
} from "@/components/inventory/internal/internal-provider";
import { InternalPrimaryButtons } from "@/components/inventory/internal/internal-primary-buttons";
import { InventoriesTable } from "@/components/inventory/internal/internal-table";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { useInventory } from "@/hooks/use-inventory";
import { useUpload } from "@/hooks/use-upload";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import {
  createProduct,
  deleteProduct,
  getProductByID,
  updateProduct,
} from "@/services/product.service";
import { useAuthStore } from "@/stores/auth-store";
import type { ProductCategoryData } from "@/types/product.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveImageUrl } from "@/lib/media";

const INTERNAL_CATEGORIES: ProductCategoryData[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "Electronics",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-0001-4000-8000-000000000002",
    name: "Fashion",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-0001-4000-8000-000000000003",
    name: "Health & Beauty",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "a1b2c3d4-0001-4000-8000-000000000004",
    name: "Home & Living",
    created_at: "2024-01-01T00:00:00Z",
  },
];

function InternalPageContent() {
  const { data, isLoading } = useInventory();
  const { setCurrentRow, setOpen } = useInventoryDialogs();

  const handleOpenEdit = async (item: (typeof data)[number]) => {
    const productDetailResponse = await getProductByID(item.id);

    if (productDetailResponse.status !== true) {
      // Fallback to row data when detail fetch fails.
      setCurrentRow(item);
      setOpen("edit");
      return;
    }

    const detail = productDetailResponse.data;

    setCurrentRow({
      ...item,
      name: detail.name,
      sku: detail.sku,
      stock: detail.stock,
      description: detail.description ?? "",
      category: detail.category
        ? {
            id: detail.category.id,
            name: detail.category.name,
          }
        : null,
      imageUrl: resolveImageUrl(detail.images?.[0]?.image_url),
    });
    setOpen("edit");
  };

  return (
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Internal Products
          </h2>
          <p className="text-muted-foreground">
            Centralized inventory management and mapping status across platforms
          </p>
        </div>
        <InternalPrimaryButtons />
      </div>

      <InventoryStatsCard />
      <InventoryAlertsCard />

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
          Loading internal products...
        </div>
      ) : (
        <InventoriesTable
          data={data}
          onEdit={handleOpenEdit}
          onDelete={(item) => {
            setCurrentRow(item);
            setOpen("delete");
          }}
        />
      )}
    </Main>
  );
}

const InternalProductPage = () => {
  const user = useAuthStore((state) => state.auth.user);
  const queryClient = useQueryClient();
  const { data: inventoryData } = useInventory();
  const { uploadAsync, isPending: isUploading } = useUpload();

  const categoriesFromProducts = inventoryData
    .map((product) => product.category)
    .filter((category): category is NonNullable<typeof category> =>
      Boolean(category),
    )
    .map((category) => ({ id: category.id, name: category.name }));

  const categories = [
    ...categoriesFromProducts,
    ...INTERNAL_CATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
    })),
  ].filter(
    (category, index, list) =>
      index === list.findIndex((item) => item.id === category.id),
  );

  const mutateSuccess = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    await queryClient.invalidateQueries({ queryKey: ["product-stats"] });
    toast.success(message);
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) {
      return error.message;
    }

    return (error as ErrorResponse)?.error || fallback;
  };

  const createMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      sku: string;
      stock: number;
      imageId: string;
      categoryId?: string;
      description?: string;
    }) => {
      const response = await createProduct({
        name: payload.name,
        sku: payload.sku,
        stock: payload.stock,
        image_id: payload.imageId || "",
        category_id: payload.categoryId || null,
        description: payload.description || undefined,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to create product");
      }

      return response;
    },
    onSuccess: async () => {
      await mutateSuccess("Product created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create product"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      name: string;
      sku: string;
      stock: number;
      categoryId?: string;
      description?: string;
    }) => {
      const response = await updateProduct(payload.id, {
        name: payload.name,
        sku: payload.sku,
        stock: payload.stock,
        category_id: payload.categoryId || null,
        description: payload.description || undefined,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to update product");
      }

      return response;
    },
    onSuccess: async () => {
      await mutateSuccess("Product updated");
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
      await mutateSuccess("Product deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete product"));
    },
  });

  const userData = {
    name: user?.name ?? "john",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <InventoryProvider>
      <InternalDialogs
        categories={categories}
        isMutating={
          createMutation.isPending || updateMutation.isPending || isUploading
        }
        isDeleting={deleteMutation.isPending}
        onCreate={async (values) => {
          if (!values.imageFile) {
            toast.error("Product image is required for creating product");
            return false;
          }

          const uploadedImages = await uploadAsync([values.imageFile]);
          const firstImage = uploadedImages[0];

          if (!firstImage?.image_id) {
            toast.error("Upload succeeded but image ID is missing");
            return false;
          }

          await createMutation.mutateAsync({
            name: values.name,
            sku: values.sku,
            stock: values.stock,
            imageId: firstImage.image_id,
            categoryId: values.categoryId,
            description: values.description,
          });
          return true;
        }}
        onEdit={async (row, values) => {
          await updateMutation.mutateAsync({
            id: row.id,
            name: values.name,
            sku: values.sku,
            stock: values.stock,
            categoryId: values.categoryId,
            description: values.description,
          });

          return true;
        }}
        onDelete={async (row) => {
          await deleteMutation.mutateAsync(row.id);
        }}
      />
      <Header>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>
      <InternalPageContent />
    </InventoryProvider>
  );
};

export default InternalProductPage;
