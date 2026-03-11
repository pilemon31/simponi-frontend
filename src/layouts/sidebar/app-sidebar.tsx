import { useLayout } from '@/context/layout-provider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { sidebarData } from './data/sidebar-data';
import { NavGroup } from './nav-group';
import { NavUser } from './nav-user';
import { useAuthStore } from '@/stores/auth-store';

export function AppSidebar() {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.accountNo ?? '001',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };

  const { collapsible, variant } = useLayout();
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <div className='w-full h-auto flex flex-row justify-center items-center py-4 px-2'></div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
