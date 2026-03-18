import { Outlet } from 'react-router';
import { NavigationProgress } from '@/components/shared/navigation-progress';

export function RootLayout() {
  return (
    <>
      <NavigationProgress />
      <Outlet />
    </>
  );
}
