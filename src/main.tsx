import { StrictMode } from 'react';
import './styles/globals.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import UseQueryContext from './context/use-query.context';
import { SearchProvider } from './context/search-provider';
import { ThemeProvider } from './context/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/auth.provider';
import AuthPage from './pages/auth';
import ProtectedRoute from './layouts/middlewares/protected-route';
import PublicRoute from './layouts/middlewares/public-route';
import { AuthenticatedLayout } from './layouts/sidebar/authenticated-layout';
import ActivityPage from './pages/activity';
import { DirectionProvider } from './context/direction-provider';
import { FontProvider } from './context/font-provider';
import { Dashboard } from './pages/dashboard';
import { RootLayout } from './layouts/root-layout';
import DisplayProductPage from './pages/display';
import UserManagementPage from './pages/user_management';
import RolePage from './pages/roles';
import InventoryLogPage from './pages/inventory_log';
import InternalProductPage from './pages/inventory';
import OrderPage from './pages/orders';
import VendorPage from './pages/vendor';
import { AccountPage } from './pages/settings/account';
import { AppearancePage } from './pages/settings/appearance';
import { PlatformGuard } from '@/layouts/middlewares/platform-guard';
import ConnectPlatformPage from '@/pages/settings/connect-platform';
import LandingPage from './pages/landing';
import SignUpPage from './pages/signup';

const AVAILABLE_PLATFORMS = [
  {
    id: 'shopee',
    name: 'Shopee',
    platformDbId: 'f1b2c3d4-0006-4000-8000-000000000001',
  },
  {
    id: 'tokopedia',
    name: 'Tokopedia',
    platformDbId: 'f1b2c3d4-0006-4000-8000-000000000002',
  },
];

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/',
            element: <LandingPage />,
          },
          {
            path: '/signin',
            element: <AuthPage />,
          },
          {
            path: '/signup',
            element: <SignUpPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthenticatedLayout />,
            children: [
              {
                path: '/settings',
                element: <AccountPage />,
              },
              {
                path: '/settings/appearance',
                element: <AppearancePage />,
              },
              {
                path: '/connect',
                element: (
                  <ConnectPlatformPage
                    availablePlatforms={AVAILABLE_PLATFORMS}
                  />
                ),
              },
            ],
          },
          {
            element: <PlatformGuard />,
            children: [
              {
                element: <AuthenticatedLayout />,
                children: [
                  {
                    path: '/dashboard',
                    element: <Dashboard />,
                  },
                  {
                    path: '/orders',
                    element: <OrderPage />,
                  },
                  {
                    path: '/inventory/internal',
                    element: <InternalProductPage />,
                  },
                  {
                    path: '/inventory/display',
                    element: <DisplayProductPage />,
                  },
                  {
                    path: '/activity',
                    element: <ActivityPage />,
                  },
                  {
                    path: '/inventory-log',
                    element: <InventoryLogPage />,
                  },
                  {
                    path: '/users',
                    element: <UserManagementPage />,
                  },
                  {
                    path: '/roles',
                    element: <RolePage />,
                  },
                  {
                    path: '/vendors',
                    element: <VendorPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

const root = document.getElementById('root');

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <Toaster />
    <UseQueryContext>
      <SearchProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <DirectionProvider>
              <FontProvider>
                <AuthProvider>
                  <RouterProvider router={router} />
                </AuthProvider>
              </FontProvider>
            </DirectionProvider>
          </TooltipProvider>
        </ThemeProvider>
      </SearchProvider>
    </UseQueryContext>
  </StrictMode>,
);
