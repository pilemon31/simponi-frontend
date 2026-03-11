import { StrictMode } from 'react';
import './styles/globals.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import UseQueryContext from './context/use-query.context';
import { ThemeProvider } from './context/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from 'sonner';
import AuthPage from './pages/auth';
import ProtectedRoute from './layouts/middlewares/protected-route';
import PublicRoute from './layouts/middlewares/public-route';
import DashboardLayout from './layouts/sidebar/dashboard-layout';

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
            element: (
              <div className='flex flex-col w-full h-full items-center justify-center'></div>
            ),
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
      <ThemeProvider defaultTheme='light'>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </ThemeProvider>
    </UseQueryContext>
  </StrictMode>,
);
