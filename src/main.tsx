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
import DashboardLayout from './layouts/sidebar/dashboard-layout';
import InventoryPage from './pages/inventory';
import ActivityPage from './pages/activity';

const router = createBrowserRouter([
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
        element: <DashboardLayout />,
        children: [
          {
            path: '/',
            element: <div>Hai</div>,
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
]);

const root = document.getElementById('root');

ReactDOM.createRoot(root!).render(
  <StrictMode>
    <Toaster></Toaster>
    <UseQueryContext>
      <SearchProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
        </ThemeProvider>
      </SearchProvider>
    </UseQueryContext>
  </StrictMode>,
);
