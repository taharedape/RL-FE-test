import { ErrorBoundary } from "@/components"
import { MainLayout } from "@/layouts"
import { Dashboard } from "@/pages"
import Deposit from "@/pages/dashboard/components/deposit"
import ProcessDeposit from "@/pages/dashboard/components/processDeposit"
import { RouteObject } from "react-router-dom"

const DashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "deposit",
        element: <Deposit />,
      },
      {
        path: "deposit-process/:id",
        element: <ProcessDeposit />,
      },
    ],
  },
]

export default DashboardRoutes
