import { ErrorBoundary } from "@/components"
import { MainLayout } from "@/layouts"
import { Receivers } from "@/pages"
import { RouteObject } from "react-router-dom"

const ReceiverRoutes: RouteObject[] = [
  {
    path: "/receivers",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [{ path: "", element: <Receivers /> }],
  },
]

export default ReceiverRoutes
