import { Palette, UserCog } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ConfigDrawer } from '@/components/shared/config-drawer';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Search } from '@/components/shared/search';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { SidebarNav } from '@/components/settings/sidebar-nav';
import { useAuthStore } from '@/stores/auth-store';
import { SettingsAppearance } from '@/components/settings/appearance';

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/settings/account',
    icon: <UserCog size={18} />,
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: <Palette size={18} />,
  },
];

export function AppearancePage() {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? 'john',
    email: user?.email ?? 'email@admin.com',
    avatar: '/avatars/shadcn.jpg',
  };
  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown user={userData} />
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set email preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            <SettingsAppearance />
          </div>
        </div>
      </Main>
    </>
  );
}
