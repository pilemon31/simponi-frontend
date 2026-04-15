import { useLayout } from '@/context/layout-provider';
import { useDirection } from '@/context/direction-provider';
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
import { LogoDisplay } from './logo-display';

export function AppSidebar() {
  const user = useAuthStore((state) => state.auth.user);
  const { dir } = useDirection();

  console.log(user);

  const userData = {
    name: user?.name ?? 'john',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };

  const { collapsible, variant } = useLayout();

  const side = dir === 'rtl' ? 'right' : 'left';

  return (
    <Sidebar collapsible={collapsible} variant={variant} side={side}>
      <SidebarHeader>
        <LogoDisplay></LogoDisplay>
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
