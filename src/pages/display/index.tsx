import { DisplayDialogs } from "@/components/inventory/display/display-dialog";
import { DisplayPrimaryButtons } from "@/components/inventory/display/display-primary-buttons";
import {
  DisplayProvider,
  useDisplayDialogs,
} from "@/components/inventory/display/display-provider";
import { DisplayTable } from "@/components/inventory/display/display-table";
import type { ExternalProduct } from "@/components/inventory/display/data/schema";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import {
  STORE_PLATFORM_OPTIONS,
  useDisplayManagement,
} from "@/hooks/use-display-management";
import { useExternalProduct } from "@/hooks/use-external-product";
import { useInventory } from "@/hooks/use-inventory";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import { useAuthStore } from "@/stores/auth-store";
import { useCallback } from "react";
import { DollarSign, Link2, Music, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DisplayPageContentProps = {
  onPrepareEdit: (item: ExternalProduct) => Promise<ExternalProduct>;
};

function DisplayPageContent({ onPrepareEdit }: DisplayPageContentProps) {
  const {
    data: externalProducts,
    isLoading,
    totalCount,
  } = useExternalProduct();
  const { setCurrentRow, setOpen } = useDisplayDialogs();

  const handleOpenEdit = useCallback(
    async (item: ExternalProduct) => {
      const hydratedRow = await onPrepareEdit(item);
      setCurrentRow(hydratedRow);
      setOpen("edit");
    },
    [onPrepareEdit, setCurrentRow, setOpen],
  );

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
          <h2 className="text-2xl font-bold tracking-tight">
            Display Products
          </h2>
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
        <DisplayTable
          data={externalProducts}
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
  const { data: inventoryData } = useInventory();
  const {
    isMutating,
    isDeleting,
    createDisplayProduct,
    updateDisplayProduct,
    deleteDisplayProduct,
    getDisplayForEdit,
  } = useDisplayManagement();

  const productOptions = inventoryData.map((product) => ({
    id: product.id,
    name: product.name,
  }));

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
        isMutating={isMutating}
        isDeleting={isDeleting}
        onCreate={createDisplayProduct}
        onEdit={updateDisplayProduct}
        onDelete={deleteDisplayProduct}
      />

      <Header>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>

      <DisplayPageContent onPrepareEdit={getDisplayForEdit} />
    </DisplayProvider>
  );
};

export default DisplayProductPage;
