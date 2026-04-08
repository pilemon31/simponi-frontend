import { Navigate, Outlet } from 'react-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getProfile } from '@/services/user.service';

const ProtectedRoute = () => {
  const { accessToken, user, setUser, reset } = useAuthStore(
    (state) => state.auth,
  );
  const [isHydratingUser, setIsHydratingUser] = useState(
    Boolean(accessToken && !user),
  );

  useEffect(() => {
    let isMounted = true;

    const hydrateUser = async () => {
      if (!accessToken || user) {
        if (isMounted) setIsHydratingUser(false);
        return;
      }

      const profile = await getProfile();

      if (!isMounted) return;

      if (profile.status) {
        setUser(profile.data);
      } else {
        reset();
      }

      setIsHydratingUser(false);
    };

    void hydrateUser();

    return () => {
      isMounted = false;
    };
  }, [accessToken, user, setUser, reset]);

  if (!accessToken) {
    return <Navigate to='/signin' replace />;
  }

  if (isHydratingUser) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
