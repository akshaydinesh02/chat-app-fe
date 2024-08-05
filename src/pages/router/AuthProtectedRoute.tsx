import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/Auth";

const AuthProtectedRoute = () => {
  const session = useAuth().session;
  console.log("Session", session);
  if (!session) {
    return <Navigate to="/auth/sign-in" />;
  }
  return <Outlet />;
};

export default AuthProtectedRoute;
