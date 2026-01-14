import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import useUserRole from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth"


type ProtectedRouteProps = {
  role: "public" | "execom" | "treasurer" | "faculty";
  children: ReactNode;
};

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const userRole = useUserRole();

  // Auth loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Role still loading
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary">
        Checking permissions...
      </div>
    );
  }

  // Faculty override (ADMIN)
  if (userRole !== role && userRole !== "faculty") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
