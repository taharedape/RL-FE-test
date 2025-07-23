import { ErrorBoundary } from "@/components"
import { MainLayout } from "@/layouts"
import { Transactions } from "@/pages"
import { RouteObject } from "react-router-dom"

const TransactionRoutes: RouteObject[] = [
  {
    path: "/transactions",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Transactions />,
      },
    ],
  },
]

export default TransactionRoutes
