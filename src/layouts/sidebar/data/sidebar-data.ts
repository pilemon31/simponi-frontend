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
          url: '/order',
          icon: BadgeDollarSign,
        },
        {
          title: 'Vendor',
          url: '/vendor',
          icon: ShelvingUnit,
        },
        {
          title: 'Inventory',
          icon: BoxesIcon,
          items: [
            { title: 'Internal', url: '/inventory/internal' },
            { title: 'Display', url: '/inventory/display' },
          ],
        },
        {
          title: 'Activity',
          url: '/activity',
          icon: Cctv,
        },
      ],
    },

    {
      title: 'Tools',
      items: [
        {
          title: 'Roles & Permissions',
          url: '/roles',
          icon: UserRoundKey,
        },
        {
          title: 'Users Management',
          url: '/users',
          icon: UsersRound,
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
