import {
  PiArrowsLeftRight,
  // PiCoins,
  PiHouse,
  PiUsersThree,
  PiWallet,
} from "react-icons/pi"

interface MenuItem {
  title: string
  link?: string
  icon?: JSX.Element
  children?: MenuItem[]
  isOpen?: boolean // New property to track open/closed state
}

const menus: MenuItem[] = [
  {
    icon: <PiHouse size={20} className="m-1" />,
    title: "Dashboard",
    link: "/dashboard",
    isOpen: false,
  },
  {
    icon: <PiArrowsLeftRight size={20} className="m-1" />,
    title: "Exchange",
    link: "/exchange",
    isOpen: false,
  },
  {
    icon: <PiWallet size={20} className="m-1" />,
    title: "Wallet",
    link: "/wallet",
    isOpen: false,
  },
  // {
  //   icon: <PiCoins size={20} className="m-1" />,
  //   title: "Transactions",
  //   link: "/transactions",
  //   isOpen: false,
  // },
  {
    icon: <PiUsersThree size={20} className="m-1" />,
    title: "Beneficiaries",
    link: "/receivers",
    isOpen: false,
  },
  // {
  //   icon: <Category2 size={18} strokeWidth={2} />,
  //   title: "Sendmoney",
  //   link: "/categories",
  //   isOpen: false,
  // },
  // {
  //   icon: <InfoCircle size={20} strokeWidth={2} />,
  //   title: "Error Pages",
  //   children: [
  //     {
  //       title: "404 Not Found",
  //       link: "/404",
  //       icon: <Error404 size={18} strokeWidth={2} />,
  //     },
  //     {
  //       title: "General Error",
  //       link: "/error",
  //       icon: <ServerOff size={18} strokeWidth={2} />,
  //     },
  //     {
  //       title: "Lose Connection",
  //       link: "/network-error",
  //       icon: <WifiOff size={18} strokeWidth={2} />,
  //     },
  //   ],
  //   isOpen: false,
  // },

  // {
  //   icon: <ZoomMoney size={18} strokeWidth={2} />,
  //   title: "Transactions",
  //   link: "/transactions",
  //   isOpen: false,
  // },
  // {
  //   icon: <Settings2 size={18} strokeWidth={2} />,
  //   title: "Settings",
  //   link: "/settings",
  //   isOpen: false,
  // },
]

export default menus
