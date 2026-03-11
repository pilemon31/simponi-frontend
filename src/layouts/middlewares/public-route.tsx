import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/stores/auth-store';

const PublicRoute = () => {
  const { accessToken } = useAuthStore((state) => state.auth);

  if (accessToken) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
