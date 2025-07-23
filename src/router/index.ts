import { createBrowserRouter } from "react-router-dom"
import AuthRoutes from "@/router/auth"
import HomeRoutes from "@/router/home"
import ErrorRoutes from "@/router/errors"
import DashboardRoutes from "@/router/dashboard"
import SettingRoutes from "@/router/settings"
import TransactionRoutes from "./transaction"
import ReceiverRoutes from "./receivers"
import ExchangeRoutes from "./exchange"
import WalletRoutes from "./wallet"
import UserRoutes from "./users"
import NotificationsRoutes from "./notifications"
import SendMoneyRoutes from "./sendMoney"

export default createBrowserRouter([
  ...AuthRoutes,
  ...HomeRoutes,
  ...DashboardRoutes,
  ...TransactionRoutes,
  ...ExchangeRoutes,
  ...WalletRoutes,
  ...ReceiverRoutes,
  ...SendMoneyRoutes,
  ...UserRoutes,
  ...SettingRoutes,
  ...NotificationsRoutes,
  ...ErrorRoutes,
])
