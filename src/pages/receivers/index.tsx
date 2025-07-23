// import { useState } from "react"
import { DataTable } from "./table-receivers/data-table"
import { columns } from "./table-receivers/columns"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
// } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
// import { TrashIcon, PlusIcon } from "@radix-ui/react-icons"
import {
  // PiUser,
  // PiEnvelope,
  // PiPlus,
  // PiUserFocus,
  // PiUserPlus,
  PiMagnifyingGlass,
} from "react-icons/pi"
import { useGetReceiverAccountsQuery } from "@/store/api/authAPI/receivers"
// import { useEffect } from "react"
// import Select from "@/components/ui/select"

export default function Receivers() {
  const { isLoading, data } = useGetReceiverAccountsQuery({})
  // async function GetReceiversAccounts() {
  //     .unwrap()
  //     .then((resp) => {
  //       console.debug("rrrr", resp)
  //     })
  //     .catch((e) => {
  //       console.debug("eeee", e)
  //     })
  // }

  // useEffect(() => {
  //   GetReceiversAccounts()
  // }, [])

  // const data = [
  //   {
  //     id: "111",
  //     name: "Name",
  //     email: "some@mail.com",
  //     totalTransactionAmount: "1000",
  //     countries: ["US", "IR", "IT", "CA", "aa", "bb"],
  //     status: "PENDING",
  //   },
  //   {
  //     id: "222",
  //     name: "Name",
  //     email: "some@mail.com",
  //     totalTransactionAmount: "2000",
  //     countries: ["CA", "IR", "US"],
  //     status: "VERIFIED",
  //   },
  //   {
  //     id: "333",
  //     name: "Name",
  //     email: "some@mail.com",
  //     totalTransactionAmount: "3000",
  //     countries: null,
  //     status: "REJECTED",
  //   },
  // ]

  // const [isCreateReceiversOpen, setIsCreateReceiversOpen] = useState(false)
  // const [accountList, setAccountList] = useState([])

  // function addAccount() {
  //   setAccountList([...accountList, { bank: null }])
  // }

  // function removeAccount(index: number) {
  //   setAccountList(accountList.splice(index, 1))
  // }

  function header() {
    return (
      <div className="flex items-center justify-between">
        <h1 className="text-[#141414] text-4xl font-semibold">Receivers</h1>
        <div className="flex gap-4">
          {/* <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsCreateReceiversOpen(true)}
          >
            <PiUserPlus size={20} />
          </Button> */}
          <Input type="text" placeholder="Search a name or an email" pre={<PiMagnifyingGlass size={20} />} />
        </div>
      </div>
    )
  }

  // enum ReceiverType {
  //   PERSONAL = "Personal Receiver",
  //   BUSINESS = "Business Receiver",
  // }

  // function createNewReceiverDialog() {
  //   const ReceiversType = Object.entries(ReceiverType).map((rt) => {
  //     return { value: rt[0], label: rt[1] }
  //   })
  //   return (
  //     <Dialog open={isCreateReceiversOpen} modal>
  //       <DialogContent close={() => setIsCreateReceiversOpen(false)}>
  //         <DialogHeader>
  //           <div className="h4">Create a new receiver</div>
  //         </DialogHeader>
  //         <div className="bodyS">
  //           After filling out the form and submitting a request, there will be a
  //           KYC process and next we’ll get in touch with you right away!
  //         </div>
  //         <div className="mt-8 flex flex-col gap-4">
  //           <Select
  //             options={ReceiversType}
  //             label="Who are you paying"
  //             placeholder="Who are you paying?"
  //             pre={<PiUserFocus size={20} className="text-muted-foreground" />}
  //           />
  //           <div className="flex flex-row gap-4 w-full">
  //             <Input
  //               type="text"
  //               placeholder="Full Name"
  //               label="Full Name"
  //               pre={<PiUser size={20} className="text-muted-foreground" />}
  //               className="w-full"
  //             />
  //             <Input
  //               type="text"
  //               label="Email"
  //               placeholder="Email"
  //               pre={<PiEnvelope size={20} className="text-muted-foreground" />}
  //               className="w-full"
  //             />
  //           </div>
  //         </div>
  //         {!!accountList?.length &&
  //           accountList.map((account, i) => {
  //             return (
  //               <div className="flex flex-col">
  //                 <div className="flex items-center gap-4 w-full my-4">
  //                   <div
  //                     className="bodySB text-muted-foreground flex-shrink-0"
  //                   >
  //                     Account #{i + 1} Information
  //                   </div>
  //                   <div className="border-t border-[#141414) w-full" />
  //                   <TrashIcon
  //                     className="h-6 w-6 text-red-500"
  //                     onClick={() => removeAccount()}
  //                   />
  //                 </div>
  //                 <div className="flex flex-col gap-2">
  //                   <Select
  //                     options={[
  //                       { value: "USA", label: "USA" },
  //                       { value: "UK", label: "UK" },
  //                     ]}
  //                     label="Country"
  //                     placeholder="Country"
  //                   />
  //                 </div>
  //               </div>
  //             )
  //           })}
  //         <div className="flex items-center gap-4 w-full my-4">
  //           <div className="border-t border-[#141414) w-full" />
  //           <Button
  //             variant="outline"
  //             className="w-max"
  //             onClick={() => addAccount()}
  //           >
  //             <PlusIcon className="mr-2" />
  //             <div className="button">Add New Account</div>
  //           </Button>
  //           <div className="border-t border-[#141414) w-full" />
  //         </div>
  //         <DialogFooter>
  //           <Button variant="secondary" size="full">
  //             <div className="button">Submit customer creation</div>
  //           </Button>
  //         </DialogFooter>
  //       </DialogContent>
  //     </Dialog>
  //   )
  // }

  return isLoading ? (
    <>
      {header()}
      <div className="flex flex-col">
        <DataTable columns={columns} data={[]} isLoading />
      </div>
      {/* {createNewReceiverDialog()} */}
    </>
  ) : (
    <>
      {header()}
      <div className="flex flex-col">
        <DataTable columns={columns} data={data} />
      </div>
      {/* {createNewReceiverDialog()} */}
    </>
  )
}
