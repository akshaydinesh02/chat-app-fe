import { createBrowserRouter } from "react-router-dom";
// import SignInPage from "../pages/auth/SignInPage.tsx";
// import SignUpPage from "../pages/auth/SignUpPage.tsx";
// import ProtectedPage from "../pages/ProtectedPage.tsx";
// import NotFoundPage from "../pages/404Page.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import Providers from "../../Providers.tsx";
import Dashboard from "../../components/home/Dashboard.tsx";
import HomePage from "../HomePage.tsx";
import SignInPage from "../auth/SignInPage.tsx";
import SignUpPage from "../auth/SignUpPage.tsx";

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    errorElement: <p>ERROR PAGE</p>,
    children: [
      // Public routes
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/auth/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/auth/sign-up",
        element: <SignUpPage />,
      },
      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <>
        <p>NOT FOUND PAGE</p>
      </>
    ),
  },
]);

export default router;
