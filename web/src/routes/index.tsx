// Importing Hooks👇🏼
import { Navigate, useRoutes } from "react-router-dom";

// Importing pages using lazy render 👇🏼
import HomePage from "@/pages/client/home/page";
import MainLayout from "@/pages/client/layouts/main-layout";
import NotFoundPage from "@/pages/client/not-found";
import { useAppSelector } from "@/store/hooks";
import AboutPage from "@/pages/client/about/page";
import AuthLayout from "@/pages/client/layouts/auth-layout";
import PropertiesPage from "@/pages/client/properties/page";
import SingleProperty from "@/pages/client/properties/id/page";
import SingleRoomPage from "@/pages/client/rooms/id/page";
import SignupPage from "@/pages/client/auth/signup/page";
import LoginPage from "@/pages/client/auth/login/page";
import ForgotPasswordPage from "@/pages/client/auth/forgot-password/page";
import BookingsPage from "@/pages/client/account/bookings/page";
import AccountSettingPage from "@/pages/client/account/setting/page";
import AccountPage from "@/pages/client/account/page";
import BookingDetailPage from "@/pages/client/account/bookings/id/page";
import NearbyPage from "@/pages/client/nearby/page";
import RegisterPage from "@/pages/client/register/page";

// Config for all routes👇🏼
const Routes = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useRoutes([
    {
      element: <MainLayout />,
      path: "/",
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/nearby",
          element: <NearbyPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/properties",
          element: <PropertiesPage />,
        },
        {
          path: "/properties/:id",
          element: <SingleProperty />,
        },
        {
          path: "/rooms/:id",
          element: <SingleRoomPage />,
        },
        {
          path: "/account",
          element: isAuthenticated ? (
            <AccountPage />
          ) : (
            <Navigate to={"/auth/signin"} />
          ),
        },
        {
          path: "/account/setting",
          element: <AccountSettingPage />,
        },
        {
          path: "/account/bookings",
          element: isAuthenticated ? (
            <BookingsPage />
          ) : (
            <Navigate to={"/auth/signin"} />
          ),
        },
        {
          path: "/account/bookings/:id",
          element: isAuthenticated ? (
            <BookingDetailPage />
          ) : (
            <Navigate to={"/auth/signin"} />
          ),
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
    {
      element: !isAuthenticated ? <AuthLayout /> : <Navigate to={"/"} />,
      children: [
        {
          path: "/auth/signin",
          element: !isAuthenticated ? <LoginPage /> : <Navigate to={"/"} />,
        },
        {
          path: "/auth/register",
          element: !isAuthenticated ? <SignupPage /> : <Navigate to={"/"} />,
        },
        {
          path: "/auth/forgot-password",
          element: <ForgotPasswordPage />,
        },
      ],
    },
  ]);
};

export default Routes;
