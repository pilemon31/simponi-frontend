import { LayoutDashboard } from 'lucide-react';

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
          icon: LayoutDashboard,
        },
        {
          title: 'Inventory',
          url: '/inventory',
          icon: LayoutDashboard,
        },
        {
          title: 'Activity',
          url: '/activity',
          icon: LayoutDashboard,
        },
      ],
    },
  ],
};
