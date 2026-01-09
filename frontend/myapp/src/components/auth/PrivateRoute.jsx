import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Not logged in → redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
}
