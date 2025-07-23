import { ErrorBoundary } from "@/components"
import { MainLayout } from "@/layouts"
import { Notifications } from "@/pages"
import { RouteObject } from "react-router-dom"

const NotificationsRoutes: RouteObject[] = [
  {
    path: "/notifications",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        id: "notifications",
        element: <Notifications />,
      },
    ],
  },
]

export default NotificationsRoutes
