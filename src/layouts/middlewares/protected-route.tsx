import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/stores/auth-store';
import { useAuth } from '@/context/auth.provider';

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore((state) => state.auth);
  const { isHydrating } = useAuth();

  if (!accessToken) {
    return <Navigate to='/signin' replace />;
  }

  if (isHydrating) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
