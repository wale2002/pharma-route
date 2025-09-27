// components/ProtectedRoute.tsx
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can show a loading spinner here while checking for auth status
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
}
