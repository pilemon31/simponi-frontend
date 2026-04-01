import { inventories } from "@/components/inventory/data/inventories";
import { InventoriesTable } from "@/components/inventory/inventories-table";
import InventoryStatsCard from "@/components/inventory/inventories-cards";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import { useAuthStore } from "@/stores/auth-store";
import InventoryAlertsCard from "@/components/inventory/inventories-alerts";
import { useInventory } from "@/hooks/use-inventory";

const InventoryPage = () => {
  const user = useAuthStore((state) => state.auth.user);
  const { data } = useInventory();
  const userData = {
    name: user?.name ?? "john",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
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
              Inventory Management
            </h2>
            <p className="text-muted-foreground">
              Monitor and manage product stock across all platforms
            </p>
          </div>
        </div>

        <InventoryStatsCard data={data} />
        <InventoryAlertsCard />
        <InventoriesTable data={inventories} />
      </Main>
    </>
  );
};

export default InventoryPage;
