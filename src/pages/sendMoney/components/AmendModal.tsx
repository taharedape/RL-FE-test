import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { useSendMoneyAmendRequestMutation } from "@/store/api/sendMoney"
import { Input } from "@/components/ui/input"
import { PiCheck } from "react-icons/pi"
import DynamicFieldsIconProvider from "@/components/dynamics/DynamicFieldsIconProvider"
import { useToast } from "@/components/ui/use-toast"

interface AmendValues {
  AccountName: string
  AccountNumber: string
  RoutingNumber: string
}

export default function AmendModal({
  isOpen,
  requestId,
  formValues,
  setIsOpen,
}: {
  isOpen: boolean
  requestId: string
  formValues: AmendValues
  setIsOpen: (boolean) => void
}) {
  const { toast } = useToast()
  const [sendMoneyAmendRequestRequest, sendMoneyAmendRequestRequestStatus] =
    useSendMoneyAmendRequestMutation()

  const [enableAmend, setEnableAmend] = useState(false)
  const [newValues, setNewValues] = useState<AmendValues>({
    AccountName: "",
    AccountNumber: "",
    RoutingNumber: "",
  })
  const [isEditable, setIsEditable] = useState({
    AccountName: false,
    AccountNumber: false,
    RoutingNumber: false,
  })

  useEffect(() => {
    if (isOpen) setNewValues(formValues)
  }, [isOpen])

  useEffect(() => {
    setEnableAmend(
      newValues.AccountName?.trim() !== formValues.AccountName?.trim() ||
        newValues.AccountNumber?.trim() !== formValues.AccountNumber?.trim() ||
        newValues.RoutingNumber?.trim() !== formValues.RoutingNumber?.trim()
    )
  }, [newValues])

  async function Cancel() {
    const changes = {
      ...(newValues.AccountName?.trim() !== formValues.AccountName?.trim()
        ? { AccountName: newValues.AccountName }
        : {}),
      ...(newValues.AccountNumber?.trim() !== formValues.AccountNumber?.trim()
        ? { AccountNumber: newValues.AccountNumber }
        : {}),
      ...(newValues.RoutingNumber?.trim() !== formValues.RoutingNumber?.trim()
        ? { RoutingNumber: newValues.RoutingNumber }
        : {}),
    }
    sendMoneyAmendRequestRequest({
      ...changes,
      RequestId: requestId,
    })
      .unwrap()
      .then(() => {
        window.location.reload()
      })
      .catch((e) =>
        toast({
          duration: 10000,
          variant: "destructive",
          description: e?.data?.message || "Something went wrong",
        })
      )
      .finally(() => {
        setIsOpen(false)
      })
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-xl">
        <div className="text-center text-[#141414] h4">Amend Transfer</div>
        <div className="text-center text-[#141414] bodyS max-w-sm">
          You’re requesting to amend a previously submitted payment.
        </div>
        <div className="text-center text-[#A5A7A6] captionL max-w-sm">
          This may delay processing, so please review your changes carefully
          before proceeding.
        </div>
        <hr className="my-3 border-muted-foreground" />
        <Input
          value={newValues.AccountName}
          label="New account name"
          disabled={!isEditable.AccountName}
          pre={<DynamicFieldsIconProvider fieldName="BeneficiaryName" />}
          postfix={
            <Button
              variant="link"
              className="px-1"
              onClick={() =>
                setIsEditable({
                  ...isEditable,
                  AccountName: !isEditable.AccountName,
                })
              }
            >
              {isEditable.AccountName ? <PiCheck size={20} /> : "Edit"}
            </Button>
          }
          placeholder="New account name"
          onChange={(e) =>
            setNewValues({ ...newValues, AccountName: e.target.value })
          }
        />
        <Input
          value={newValues.AccountNumber}
          label="New account number"
          placeholder="New account number"
          disabled={!isEditable.AccountNumber}
          pre={<DynamicFieldsIconProvider fieldName="AccountNumber" />}
          postfix={
            <Button
              variant="link"
              className="px-1"
              onClick={() =>
                setIsEditable({
                  ...isEditable,
                  AccountNumber: !isEditable.AccountNumber,
                })
              }
            >
              {isEditable.AccountNumber ? <PiCheck size={20} /> : "Edit"}
            </Button>
          }
          onChange={(e) =>
            setNewValues({
              ...newValues,
              AccountNumber: isNaN(Number(e.target.value))
                ? newValues.AccountNumber
                : Number(e.target.value).toString(),
            })
          }
        />
        <Input
          value={newValues.RoutingNumber}
          label="New routing number"
          placeholder="New routing number"
          disabled={!isEditable.RoutingNumber}
          pre={<DynamicFieldsIconProvider fieldName="RoutingNumber" />}
          postfix={
            <Button
              variant="link"
              className="px-1"
              onClick={() =>
                setIsEditable({
                  ...isEditable,
                  RoutingNumber: !isEditable.RoutingNumber,
                })
              }
            >
              {isEditable.RoutingNumber ? <PiCheck size={20} /> : "Edit"}
            </Button>
          }
          onChange={(e) =>
            setNewValues({ ...newValues, RoutingNumber: e.target.value })
          }
        />
        <div className="text-center text-[#A5A7A6] captionL max-w-sm mb-2">
          If applicable, a fee will be deducted from your balance.
        </div>
        <DialogFooter>
          <div className="flex items-center gap-2 justify-between w-full">
            <Button
              type="submit"
              variant="outline"
              className="w-full px-2"
              disabled={sendMoneyAmendRequestRequestStatus.isLoading}
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              className="w-full inline-flex px-2"
              disabled={!enableAmend}
              loading={sendMoneyAmendRequestRequestStatus.isLoading}
              onClick={Cancel}
            >
              Amend Transfer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
