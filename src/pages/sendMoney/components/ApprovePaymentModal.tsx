import FormatNumberView from "@/components/common/FormatNumberView"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useApproveSendMoneyPaymentMutation } from "@/store/api/sendMoney"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function ApprovePaymentModal({
  requestId,
  currency,
  amount,
  accountName,
}: {
  requestId: string
  currency?: string
  amount: string | number
  accountName: string | null
}) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [approveSendMoneyPaymentRequest, approveSendMoneyPaymentRequestStatus] =
    useApproveSendMoneyPaymentMutation()

  const [isOpen, setIsOpen] = useState(false)

  async function Approve() {
    approveSendMoneyPaymentRequest(requestId)
      .unwrap()
      .then(() => {
        window.location.reload()
      })
      .catch((e) => {
        if (e?.data?.message)
          toast({
            duration: 60000,
            variant: "destructive",
            title: "Error",
            description: e?.data?.message,
          })
      })
      .finally(() => {
        setIsOpen(false)
      })
  }

  return (
    <Dialog open={isOpen}>
      <DialogTrigger>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
          Approve this payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <div className="text-center text-[#141414] h4">Approve Payment</div>
        <div className="text-center text-[#141414] bodyS max-w-sm">
          You’re about to send{" "}
          <FormatNumberView
            className="bodySB"
            currency={currency}
            value={amount}
          />{" "}
          to <strong>{accountName}</strong>. Are you sure you want to proceed?
        </div>
        <div className="captionL text-red-600">
          It seems like you still have insufficient balance.{" "}
          <strong
            className="LinkL cursor-pointer hover:underline"
            onClick={() => navigate("/dashboard/deposit")}
          >
            Deposit Money Now
          </strong>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2 justify-between w-full">
            <Button
              type="submit"
              variant="outline"
              disabled={approveSendMoneyPaymentRequestStatus.isLoading}
              className="w-full px-2"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              className="w-full inline-flex px-2"
              onClick={Approve}
              loading={approveSendMoneyPaymentRequestStatus.isLoading}
            >
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
