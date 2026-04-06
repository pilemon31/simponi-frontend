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
import AuthPage from './pages/auth';
import ProtectedRoute from './layouts/middlewares/protected-route';
import PublicRoute from './layouts/middlewares/public-route';
import { AuthenticatedLayout } from './layouts/sidebar/authenticated-layout';
import InventoryPage from './pages/inventory';
import ActivityPage from './pages/activity';
import { DirectionProvider } from './context/direction-provider';
import { FontProvider } from './context/font-provider';
import { Dashboard } from './pages/dashboard';
import { RootLayout } from './layouts/root-layout';
import VendorPage from './pages/vendor';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/signin',
            element: <AuthPage />,
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
                path: '/',
                element: <Dashboard />,
              },
              {
                path: '/vendor',
                element: <VendorPage />
              },
              {
                path: '/inventory',
                element: <InventoryPage />,
              },
              {
                path: '/activity',
                element: <ActivityPage />,
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
    <Toaster></Toaster>
    <UseQueryContext>
      <SearchProvider>
        <ThemeProvider defaultTheme='light'>
          <TooltipProvider>
            <DirectionProvider>
              <FontProvider>
                <RouterProvider router={router} />
              </FontProvider>
            </DirectionProvider>
          </TooltipProvider>
        </ThemeProvider>
      </SearchProvider>
    </UseQueryContext>
  </StrictMode>,
);
