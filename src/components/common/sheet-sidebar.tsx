import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { ChevronDown, ChevronUp, LetterI } from "tabler-icons-react"
import menusList from "@/services/data/menus"
import { useLocation } from "react-router"
import { useNavigate } from "react-router-dom"
import { MenuItemType } from "@/types"
import { useGetProfileQuery } from "@/store/api/userAPI"
import { Button } from "../ui/button"
import { PiDotsThreeVerticalBold, PiSignOut, PiUser } from "react-icons/pi"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"

const SheetSideBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data } = useGetProfileQuery()
  // const [menus, setMenus] = useState<MenuItemType[]>(menusList)
  const [menus] = useState<MenuItemType[]>(menusList)
  const { pathname } = useLocation()

  // const handleOpenDropDownSideBar = (index: number) => {
  //   const updatedMenus = [...menus]
  //   updatedMenus[index].isOpen = !updatedMenus[index].isOpen
  //   setMenus(updatedMenus)
  // }

  const handleNavigate = (menus: MenuItemType) => {
    navigate(`${menus.link}`)
  }

  // Disable Pointer Envent None
  useEffect(() => {
    // Function to check and remove pointer-events style if it's set to 'none'
    const checkAndRemovePointerEvents = () => {
      const bodyElement = document.body
      const bodyStyles = window.getComputedStyle(bodyElement)
      const currentPointerEvents = bodyStyles.pointerEvents

      // Check if pointer-events is set to 'none' and remove it
      if (currentPointerEvents === "none") {
        bodyElement.style.pointerEvents = ""
      }
    }

    // Check and remove pointer-events initially
    checkAndRemovePointerEvents()

    // Set up an interval to periodically check and remove pointer-events style
    const intervalId = setInterval(checkAndRemovePointerEvents, 1000) // You can adjust the interval time as needed

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])
  const clearCookies = () => {
    const cookies = document.cookie.split(";")

    // Iterate over each cookie and set the expiration date to a past date
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie

      // Set the expiration date to a date in the past
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
    }

    window?.location?.reload()
  }

  return (
    <Card className="w-64 min-w-64 !border-none !shadow-none fixed rounded-none overflow-y-auto">
      <CardContent className="m-0 p-0 focus-visible:outline-none">
        <div className="w-full h-screen overflow-y-auto bg-[#ededee] px-4 py-4 flex flex-col">
          <div className="w-full sticky mb-16">
            <img src="/images/logo.png" />
          </div>
          <div className="flex flex-col gap-2">
            {menus?.map((menu, index) => (
              <React.Fragment key={index}>
                {/* {menu.children ? (
                  <Collapsible className="flex flex-col items-start">
                    <CollapsibleTrigger
                      className="nav-link hover:nav-active w-full flex justify-between items-center focus-visible:outline-none"
                      onClick={() => handleOpenDropDownSideBar(index)}
                    >
                      <div className="flex gap-2 items-center">
                        {menu.icon && menu.icon}
                        {menu.title}
                      </div>

                      {menu.isOpen ? (
                        <ChevronUp size={18} strokeWidth={2} />
                      ) : (
                        <ChevronDown size={18} strokeWidth={2} />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="collapsibleDropdown" asChild>
                      <ul className="w-full ps-2">
                        {menu.children.map((child, childIndex) => (
                          <li
                            key={childIndex}
                            className="nav-link py-2 hover:nav-active "
                            onClick={() => handleNavigate(child)}
                          >
                            <LetterI size={18} strokeWidth={2} />
                            {child.icon && child.icon}
                            {child.title}
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ) : ( */}
                <div
                  className={
                    "nav-link hover:nav-active " +
                    (pathname == menu.link && "nav-active")
                  }
                  onClick={() => handleNavigate(menu)}
                >
                  {menu.icon && menu.icon}
                  {menu.title}
                </div>
                {/* )} */}
              </React.Fragment>
            ))}
            <Button
              variant="secondary"
              className="w-full py-2 my-4 text-center"
              onClick={() => {
                location.search.includes("createSendMoney")
                  ? window.location.reload()
                  : navigate("/send-money")
              }}
            >
              Send Money
            </Button>
          </div>
          <div className="text-[#4c4c4c] flex flex-col gap-2 mt-auto">
            <div className="flex items-center justify-between gap-4 mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full flex items-center justify-between rounded-xl py-4 px-2 hover:nav-active">
                  <div className="shrink-0 border border-[#C4C6C6] rounded-full size-10 flex items-center justify-center button font-bold">
                    {data?.fullName
                      ?.split(" ")
                      ?.slice(0, 2)
                      ?.map((n) => n[0]?.toUpperCase())
                      ?.join("")}
                  </div>
                  <div className="flex flex-col items-start gap-1 ml-2">
                    <h5 className="BodySB font-semibold">{data?.fullName}</h5>
                    <span className="captionL text-muted-foreground">
                      {data?.email}
                    </span>
                  </div>
                  <PiDotsThreeVerticalBold
                    size={20}
                    className="shrink-0 ml-auto"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="end"
                  className="bg-[#ededee] w-52 px-2 py-3 rounded-xl ml-5"
                >
                  <DropdownMenuItem className="border-none">
                    <div
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:nav-active border-none"
                      onClick={() => {
                        navigate("/settings")
                      }}
                    >
                      <PiUser size={20} className="m-1" />
                      <div>Profile Settings</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="border-none">
                    <div
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:nav-active text-red-500"
                      onClick={clearCookies}
                    >
                      <PiSignOut size={20} className="m-1" />
                      <div>Log Out</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SheetSideBar
