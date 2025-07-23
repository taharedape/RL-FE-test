import { ErrorBoundary } from "@/components"
import { MainLayout } from "@/layouts"
import { Exchange } from "@/pages"
import { RouteObject } from "react-router-dom"

const ExchangeRoutes: RouteObject[] = [
  {
    path: "/exchange",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Exchange />,
      },
    ],
  },
]

export default ExchangeRoutes
