import { DisplayDialogs } from "@/components/inventory/display/display-dialog";
import { DisplayPrimaryButtons } from "@/components/inventory/display/display-primary-buttons";
import { DisplayProvider, useDisplayDialogs } from "@/components/inventory/display/display-provider";
import { DisplayTable } from "@/components/inventory/display/display-table";
import { adaptExternalProductToInventory } from "@/components/inventory/display/data/adapter";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { useExternalProduct } from "@/hooks/use-external-product";
import { useInventory } from "@/hooks/use-inventory";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import {
  createExternalProduct,
  deleteExternalProduct,
  getExternalProductByID,
  updateExternalProduct,
} from "@/services/external-product.service";
import { useAuthStore } from "@/stores/auth-store";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DollarSign, Link2, Music, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const STORE_PLATFORM_OPTIONS = [
  { id: "c1b2c3d4-0008-4000-8000-000000000001", label: "Shopee" },
  { id: "c1b2c3d4-0008-4000-8000-000000000002", label: "TikTok" },
];

function DisplayPageContent() {
  const { data, isLoading, totalCount } = useExternalProduct();
  const { setCurrentRow, setOpen } = useDisplayDialogs();

  const externalProducts = Array.isArray(data) ? data : [];

  const handleOpenEdit = async (item: (typeof data)[number]) => {
    const detailResponse = await getExternalProductByID(item.id);

    if (detailResponse.status !== true) {
      setCurrentRow(item);
      setOpen("edit");
      return;
    }

    setCurrentRow(adaptExternalProductToInventory(detailResponse.data));
    setOpen("edit");
  };

  const shopeeCount = externalProducts.filter((ep) =>
    ep.platform.toLowerCase().includes("shopee"),
  ).length;

  const tiktokCount = externalProducts.filter((ep) =>
    ep.platform.toLowerCase().includes("tiktok"),
  ).length;

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
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Display Products</h2>
          <p className="text-muted-foreground">
            Manage product listings across Shopee and TikTok platforms
          </p>
        </div>
        <DisplayPrimaryButtons />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsItems.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
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
        <DisplayTable
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

const DisplayProductPage = () => {
  const user = useAuthStore((state) => state.auth.user);
  const queryClient = useQueryClient();
  const { data: inventoryData } = useInventory();

  const productOptions = inventoryData.map((product) => ({
    id: product.id,
    name: product.name,
  }));

  const mutateSuccess = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["external-products"] });
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
      productId: string;
      storePlatformId: string;
      price: number;
    }) => {
      const response = await createExternalProduct({
        product_id: payload.productId,
        store_platform_id: payload.storePlatformId,
        price: payload.price,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to create listing");
      }

      return response;
    },
    onSuccess: async () => {
      await mutateSuccess("Listing created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create listing"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; price: number }) => {
      const response = await updateExternalProduct(payload.id, {
        price: payload.price,
      });

      if (response.status !== true) {
        throw new Error(response.message || "Failed to update listing");
      }

      return response;
    },
    onSuccess: async () => {
      await mutateSuccess("Listing updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update listing"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteExternalProduct(id);

      if (response.status !== true) {
        throw new Error(response.message || "Failed to delete listing");
      }

      return response;
    },
    onSuccess: async () => {
      await mutateSuccess("Listing deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete listing"));
    },
  });

  const userData = {
    name: user?.name ?? "john",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <DisplayProvider>
      <DisplayDialogs
        productOptions={productOptions}
        storePlatformOptions={STORE_PLATFORM_OPTIONS}
        isMutating={createMutation.isPending || updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        onCreate={async (values) => {
          await createMutation.mutateAsync(values);
          return true;
        }}
        onEdit={async (row, values) => {
          await updateMutation.mutateAsync({ id: row.id, price: values.price });
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

      <DisplayPageContent />
    </DisplayProvider>
  );
};

export default DisplayProductPage;
