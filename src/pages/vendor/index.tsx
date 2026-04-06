import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { VendorsTable } from "@/components/vendor/vendors-table";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import { useAuthStore } from "@/stores/auth-store";
import { useVendor } from "@/hooks/use-vendor";

const VendorPage = () => {
  const user = useAuthStore((state) => state.auth.user);
  const { data, isLoading } = useVendor();

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
              Vendor Management
            </h2>
            <p className="text-muted-foreground">
              Manage your suppliers and vendor contacts
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            Loading vendors...
          </div>
        ) : (
          <VendorsTable data={data} />
        )}
      </Main>
    </>
  );
};

export default VendorPage;