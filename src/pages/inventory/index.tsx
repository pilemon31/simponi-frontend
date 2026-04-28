import InventoryStatsCard from "@/components/inventory/internal-cards";
import { InternalDialogs } from "@/components/inventory/internal-dialog";
import {
  InventoryProvider,
  useInventoryDialogs,
} from "@/components/inventory/internal-provider";
import { InternalPrimaryButtons } from "@/components/inventory/internal-primary-buttons";
import { InventoriesTable } from "@/components/inventory/internal-table";
import type { InternalInventory } from "@/types/product.type";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { useInventory } from "@/hooks/use-inventory";
import { useInventoryManagement } from "@/hooks/use-inventory-management";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import { useAuthStore } from "@/stores/auth-store";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router";

function InventoryPageContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("per_page")) || 10;
  const [searchInput, setSearchInput] = useState(search);

  const { data: inventoryData, meta } = useInventory(
    searchInput,
    page,
    perPage,
  );

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
    async (item: InternalInventory) => {
      const hydratedRow = await getInventoryForEdit(item);
      setCurrentRow(hydratedRow);
      setOpen("edit");
    },
    [getInventoryForEdit, setCurrentRow, setOpen],
  );

  const handleOpenDelete = useCallback(
    (item: InternalInventory) => {
      setCurrentRow(item);
      setOpen("delete");
    },
    [setCurrentRow, setOpen],
  );

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleQueryParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);

          if (!value || value === "all") {
            params.delete(key);
          } else {
            params.set(key, value);
          }

          if (key !== "page") {
            params.set("page", "1");
          }

          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams(
      () => {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("per_page", String(perPage));
        return params;
      },
      { replace: true },
    );
  };

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchInput(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        handleQueryParam("search", value);
      }, 500);
    },
    [handleQueryParam],
  );

  const handlePageChange = (nextPage: number) => {
    handleQueryParam("page", String(nextPage));
  };

  const handlePerPageChange = (nextPerPage: number) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("per_page", String(nextPerPage));
        params.set("page", "1");
        return params;
      },
      { replace: true },
    );
  };

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

        <InventoriesTable
          data={inventoryData}
          meta={meta}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSetQueryParam={handleQueryParam}
          onClearFilters={handleClearFilters}
        />
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
