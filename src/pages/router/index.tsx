import { createBrowserRouter } from "react-router-dom";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import Providers from "../../Providers.tsx";
import DashboardPage from "../dashboard/index.tsx";
import HomePage from "../home/index.tsx";
import SignInPage from "../auth/SignInPage.tsx";
import SignUpPage from "../auth/SignUpPage.tsx";
import NavigateToHomeRoute from "./NavigateToHomeRoute.tsx";
import AboutPage from "../about/index.tsx";
import DocsPage from "../docs/index.tsx";
import ErrorPage from "../error/index.tsx";
import NotFoundPage from "../error/NotFoundPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/docs",
        element: <DocsPage />,
      },
      {
        path: "/",
        element: <NavigateToHomeRoute />,
        children: [
          {
            path: "/auth/sign-in",
            element: <SignInPage />,
          },
        ],
      },
      {
        path: "/",
        element: <NavigateToHomeRoute />,
        children: [
          {
            path: "/auth/sign-up",
            element: <SignUpPage />,
          },
        ],
      },
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
        ],
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
