import { ErrorBoundary } from "@/components"
import { MainLayout } from "@/layouts"
import { Wallet } from "@/pages"
import { RouteObject } from "react-router-dom"

const WalletRoutes: RouteObject[] = [
  {
    path: "/wallet",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Wallet />,
      },
    ],
  },
]

export default WalletRoutes
