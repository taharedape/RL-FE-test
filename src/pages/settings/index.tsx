import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Account from "./components/tabs/account"
import ChangePassword from "./components/tabs/change-password"

export default function Settings() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account" className="lg:w-36 w-full">
          Account
        </TabsTrigger>
        <TabsTrigger value="change-password" className="lg:w-36 w-full">
          Change Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="mt-4">
        <Account />
      </TabsContent>
      <TabsContent value="change-password" className="mt-4">
        <ChangePassword />
      </TabsContent>
    </Tabs>
  )
}
