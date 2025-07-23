import { RouteObject } from "react-router-dom"
import { AuthLayout } from "@/layouts"
import ResetPassword from "@/pages/auth/reset-password"
import { SignIn } from "@/pages"
import ConfirmPassword from "@/pages/auth/confirm-password"

const AuthRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <SignIn />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "confirm-password/:code",
        element: <ConfirmPassword />,
      },
    ],
  },
]

export default AuthRoutes
