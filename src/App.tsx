import { RouterProvider } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import router from "@/router"
import { TooltipProvider } from "@radix-ui/react-tooltip"

export default function App() {
  return (
    <>
      <TooltipProvider>
        <RouterProvider router={router}></RouterProvider>
      </TooltipProvider>
      <Toaster />
    </>
  )
}
