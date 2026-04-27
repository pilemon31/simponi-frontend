import {
  LayoutDashboard,
  BadgeDollarSign,
  Cctv,
  BoxesIcon,
  ShelvingUnit,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  HelpCircle,
  UserRoundKey,
  UsersRound,
} from 'lucide-react';

export const sidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Order',
          url: '/orders',
          icon: BadgeDollarSign,
        },
        {
          title: 'Vendor',
          url: '/vendors',
          icon: ShelvingUnit,
          permission_id: '40077ea2-351c-46b9-a78f-1da15c23138e',
        },
        {
          title: 'Inventory',
          icon: BoxesIcon,
          items: [
            {
              title: 'Internal',
              url: '/inventory/internal',
              permission_id: 'aaaaaaaa-0ea2-426c-89e7-e25e71c0b88f',
            },
            {
              title: 'Display',
              url: '/inventory/display',
              permission_id: 'ab000001-0ea2-426c-89e7-e25e71c0b88f',
            },
          ],
        },
        {
          title: 'Roles & Permissions',
          url: '/roles',
          icon: UserRoundKey,
          permission_id: '2e93d440-bc56-46b2-afd7-a7acaa6f9275',
        },
        {
          title: 'Users Management',
          url: '/users',
          icon: UsersRound,
          permission_id: '090331cb-5d7e-4ca2-84c7-d420bc8c2c0d',
        },
        {
          title: 'Activity',
          icon: Cctv,
          items: [
            {
              title: 'Logging',
              url: '/activity',
            },
            {
              title: 'Inventory Log',
              url: '/inventory-log',
            },
          ],
          permission_id: '55555555-0ea2-426c-89e7-e25e71c0b88f',
        },
      ],
    },

    {
      title: 'Others',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
};
