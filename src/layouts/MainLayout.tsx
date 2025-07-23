import { Outlet } from "react-router-dom"
import { AuthGuard, SideBar } from "@/components"
import { useSelector } from "react-redux"
import WhatsUpFloatBtn from "./components/WhatsUpFloatBtn"

export default function MainLayout() {
  const isSideBarOpen = useSelector((state: any) => state.app.isSideBarOpen)
  return (
    <AuthGuard>
      <div className="flex max-w-[90rem] min-h-screen mx-auto relative bg-[#FAFAFA]">
        <div className="hidden lg:block relative z-[50]">
          <SideBar />
        </div>
        <main className={"w-full lg:my-10 lg:px-10 relative z-1 " + (isSideBarOpen ? "lg:ms-64" : "lg:ms-18")}>
          {/* <TopHeader /> */}
          <div className="max-w-[90rem] mx-auto">
            <Outlet />
          </div>
        </main>
        <WhatsUpFloatBtn />
      </div>
    </AuthGuard>
  )
}
