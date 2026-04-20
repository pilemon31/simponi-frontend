import InventoryAlertsCard from "@/components/inventory/internal/internal-alerts";
import InventoryStatsCard from "@/components/inventory/internal/internal-cards";
import { InternalDialogs } from "@/components/inventory/internal/internal-dialog";
import {
  InventoryProvider,
  useInventoryDialogs,
} from "@/components/inventory/internal/internal-provider";
import { InternalPrimaryButtons } from "@/components/inventory/internal/internal-primary-buttons";
import { InventoriesTable } from "@/components/inventory/internal/internal-table";
import type { Inventory } from "@/components/inventory/internal/data/schema";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { useInventory } from "@/hooks/use-inventory";
import { useInventoryManagement } from "@/hooks/use-inventory-management";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import { useAuthStore } from "@/stores/auth-store";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

function InventoryPageContent() {
  const { data: inventoryData, isLoading } = useInventory();
  const { setCurrentRow, setOpen } = useInventoryDialogs();
  const {
    categories,
    isMutating,
    isDeleting,
    createInventory,
    updateInventory,
    deleteInventory,
    getInventoryForEdit,
  } = useInventoryManagement(inventoryData);

  const handleOpenEdit = useCallback(
    async (item: Inventory) => {
      const hydratedRow = await getInventoryForEdit(item);
      setCurrentRow(hydratedRow);
      setOpen("edit");
    },
    [getInventoryForEdit, setCurrentRow, setOpen],
  );

  const handleOpenDelete = useCallback(
    (item: Inventory) => {
      setCurrentRow(item);
      setOpen("delete");
    },
    [setCurrentRow, setOpen],
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (!value) {
            params.delete("search");
          } else {
            params.set("search", value);
          }
          params.set("page", "1");
          return params;
        },

        { replace: true },
      );
    },
    [setSearchParams],
  );

  return (
    <>
      <InternalDialogs
        categories={categories}
        isMutating={isMutating}
        isDeleting={isDeleting}
        onCreate={createInventory}
        onEdit={updateInventory}
        onDelete={deleteInventory}
      />

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Internal Products
            </h2>
            <p className="text-muted-foreground">
              Centralized inventory management and mapping status across
              platforms
            </p>
          </div>
          <InternalPrimaryButtons />
        </div>

        <InventoryStatsCard />
        {/* <InventoryAlertsCard /> */}

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            Loading internal products...
          </div>
        ) : (
          <InventoriesTable
            data={inventoryData}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onSearchChange={handleSearchChange}
          />
        )}
      </Main>
    </>
  );
}

const InternalProductPage = () => {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? "john",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <InventoryProvider>
      <Header>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>

      <InventoryPageContent />
    </InventoryProvider>
  );
};

export default InternalProductPage;
