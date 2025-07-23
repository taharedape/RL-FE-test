import { ErrorBoundary } from "@/components"
import { MainLayout } from "@/layouts"
import { SendMoney } from "@/pages"
import SendMoneyProcess from "@/pages/sendMoney/SendMoneyProcess"
import { RouteObject } from "react-router-dom"

const SendMoneyRoutes: RouteObject[] = [
  {
    path: "/send-money",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "", element: <SendMoney /> },
      {
        path: "process/:id",
        element: <SendMoneyProcess />,
      },
    ],
  },
]

export default SendMoneyRoutes
