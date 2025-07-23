import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import Select, { OptionItem } from "@/components/ui/select"
import { SingleValue } from "react-select"
import { useSendMoneyCancelRequestMutation } from "@/store/api/sendMoney"
import { useToast } from "@/components/ui/use-toast"

export default function CancelTransferModal({
  isOpen,
  requestId,
  setIsOpen,
}: {
  isOpen: boolean
  requestId: string
  setIsOpen: (boolean) => void
}) {
  const { toast } = useToast()
  const [sendMoneyCancelRequestRequest, sendMoneyCancelRequestRequestStatus] =
    useSendMoneyCancelRequestMutation()

  const [cancelDescription, setCancelDescription] = useState("")
  const reasonOptions = [
    "Incorrect Recipient Information",
    "Change Of Plans",
    "Security Concerns",
    "Technical Issues",
    "Unexpected Fees or Funds",
    "Delay in Processing",
    "Recipient Unavailability",
    "Regulatory or Compliance Issues",
  ].map((reason) => ({ value: reason, label: reason }))

  async function Cancel() {
    sendMoneyCancelRequestRequest({
      RequestId: requestId,
      Reason: cancelDescription,
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
        <div className="text-center text-[#141414] h4">Cancel Transfer</div>
        <div className="text-center text-[#141414] bodyS max-w-sm">
          You’re about to cancel your transfer request. Are you sure you want to
          cancel your request?
        </div>
        <Select
          isOnModal
          isCreatable
          options={reasonOptions}
          label="Reason for your cancellation"
          placeholder="Reason for your cancellation"
          value={
            cancelDescription?.length
              ? { value: cancelDescription, label: cancelDescription }
              : null
          }
          onChange={(e: SingleValue<OptionItem<null>>) => {
            setCancelDescription(e?.value as string)
          }}
        />
        <DialogFooter>
          <div className="flex items-center gap-2 justify-between w-full">
            <Button
              type="submit"
              variant="outline"
              className="w-full px-2"
              disabled={sendMoneyCancelRequestRequestStatus.isLoading}
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              className="w-full inline-flex px-2"
              disabled={!cancelDescription?.length}
              loading={sendMoneyCancelRequestRequestStatus.isLoading}
              onClick={Cancel}
            >
              Cancel Transfer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
