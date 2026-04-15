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
import InternalProductPage from './pages/inventory';
import DisplayProductPage from './pages/display';
import RolePage from './pages/roles';

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
                path: '/roles',
                element: <RolePage />,
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
