import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/stores/auth-store';

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore((state) => state.auth);

  if (!accessToken) {
    return <Navigate to='/signin' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
