import { Outlet } from "react-router";
import { usePlatformStatus } from "@/hooks/use-platform-status";

export function PlatformGuard() {
  const { isLoading } = usePlatformStatus();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // if (status === 'none') {
  //   return <Navigate to="/connect" state={{ from: location }} replace />;
  // }

  return <Outlet />;
}
