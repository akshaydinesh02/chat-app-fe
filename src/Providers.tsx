import { Outlet } from "react-router-dom";
import { AuthProvider } from "./hooks/Auth";
import Header from "./components/home/Header";

const Providers = () => {
  return (
    <AuthProvider>
      <Header />
      <Outlet />
    </AuthProvider>
  );
};

export default Providers;
