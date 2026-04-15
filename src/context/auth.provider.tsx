import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getProfile } from '@/services/user.service';

interface AuthContextType {
  isHydrating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHydrating, setIsHydrating] = useState(true);
  const { auth } = useAuthStore();

  useEffect(() => {
    const hydrate = async () => {
      try {
        if (auth.accessToken && !auth.user) {
          const profile = await getProfile();
          if (profile?.status && profile.data) {
            auth.setUser(profile.data);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message?.includes('401')) {
          console.log(error);
        }
      } finally {
        setIsHydrating(false);
      }
    };

    hydrate();
  }, [auth, auth.accessToken]);

  return (
    <AuthContext.Provider value={{ isHydrating }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
