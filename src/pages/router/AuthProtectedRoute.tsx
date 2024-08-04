import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/Auth";
import { useNavigate } from "react-router-dom";
import SignInPage from "../auth/SignInPage";

const AuthProtectedRoute = () => {
  const session = useAuth().session;
  const navigate = useNavigate();
  console.log("Session", session);
  if (!session) {
    return <Navigate to="/auth/sign-in" />;
  }
  return <Outlet />;
};

export default AuthProtectedRoute;
