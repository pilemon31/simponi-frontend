import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";

import { Header } from "@/layouts/header";
import { MainDashboard } from "@/components/dashboard/main-dashboard";

// import { TopNav } from "@/layouts/top-nav";

import { useAuthStore } from "@/stores/auth-store";

export function Dashboard() {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? "Admin",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <>
      <Header>
        {/* <TopNav links={topNav} /> */}
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>

      <MainDashboard />
    </>
  );
}

// const topNav = [
//   {
//     title: "Overview",
//     href: "dashboard/overview",
//     isActive: true,
//     disabled: false,
//   },
//   {
//     title: "Customers",
//     href: "dashboard/customers",
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: "Products",
//     href: "dashboard/products",
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: "Settings",
//     href: "dashboard/settings",
//     isActive: false,
//     disabled: true,
//   },
// ];
