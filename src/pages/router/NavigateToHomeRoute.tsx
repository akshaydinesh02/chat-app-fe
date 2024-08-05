import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../hooks/Auth";

const NavigateToHomeRoute = () => {
  const user = useAuth().user;
  if (user) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default NavigateToHomeRoute;
