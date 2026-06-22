import {
  LayoutDashboard,
  BadgeDollarSign,
  Cctv,
  BoxesIcon,
  ShelvingUnit,
  Settings,
  UserCog,
  Palette,
  HelpCircle,
  UserRoundKey,
  UsersRound,
  PlugZap,
  Store,
} from "lucide-react";

export const sidebarData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/Dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Order",
          url: "/orders",
          icon: BadgeDollarSign,
          permission_id: "abcdef01-0ea2-426c-89e7-e25e71c0b88f",
        },
        {
          title: "Vendor",
          url: "/vendors",
          icon: ShelvingUnit,
          permission_id: "40077ea2-351c-46b9-a78f-1da15c23138e",
        },
        {
          title: "Inventory",
          icon: BoxesIcon,
          items: [
            {
              title: "Internal",
              url: "/inventory/internal",
              permission_id: "aaaaaaaa-0ea2-426c-89e7-e25e71c0b88f",
            },
            {
              title: "Display",
              url: "/inventory/display",
              permission_id: "ab000001-0ea2-426c-89e7-e25e71c0b88f",
            },
          ],
        },
        {
          title: "Roles & Permissions",
          url: "/roles",
          icon: UserRoundKey,
          permission_id: "2e93d440-bc56-46b2-afd7-a7acaa6f9275",
        },
        {
          title: "Users Management",
          url: "/users",
          icon: UsersRound,
          permission_id: "090331cb-5d7e-4ca2-84c7-d420bc8c2c0d",
        },
        {
          title: "Store Management",
          url: "/stores",
          icon: Store,
          permission_id: "b2e3d4f5-8c23-4b7f-9d32-2f8b6c3d4e56",
        },
        {
          title: "Employee Management",
          url: "/employees",
          icon: UsersRound,
          permission_id: "fa192ecf-56dc-4999-a9c2-9c5e4d21d0be",
          storeScoped: true,
        },
        {
          title: "Activity",
          icon: Cctv,
          items: [
            {
              title: "Logging",
              url: "/activity",
            },
            {
              title: "Inventory Log",
              url: "/inventory-log",
              permission_id: "0ea2426c-89e7-426c-b88f-222222222222",
            },
          ],
          permission_id: "55555555-0ea2-426c-89e7-e25e71c0b88f",
        },
      ],
    },

    {
      title: "Others",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Account",
              url: "/settings",
              icon: UserCog,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: Palette,
            },
            {
              title: "Platform Connection",
              url: "/connect",
              icon: PlugZap,
            },
          ],
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
