import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Logo } from '@/assets/logo';

export function LogoDisplay() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
            <Logo className='size-5' />
          </div>
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='truncate font-semibold'>SIMPONI</span>
            <span className='truncate text-xs'>OMNICHANNEL</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
