import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { usePaymentNotReceivedMutation } from "@/store/api/sendMoney"

export default function PaymentNotReceivedModal({
  isOpen,
  requestId,
  setIsOpen,
}: {
  isOpen: boolean
  requestId: string
  setIsOpen: (boolean) => void
}) {
  const { toast } = useToast()
  const [usePaymentNotReceivedRequest, usePaymentNotReceivedRequestStatus] =
    usePaymentNotReceivedMutation()

  async function Report() {
    usePaymentNotReceivedRequest(requestId)
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
        <div className="text-center text-[#141414] h4">
          Payment Not Received
        </div>
        <div className="text-center text-[#141414] bodyS max-w-sm">
          You’re reporting the payment is not received. Are you sure you want to
          proceed?
        </div>
        <DialogFooter>
          <div className="flex items-center gap-2 justify-between w-full">
            <Button
              type="submit"
              variant="outline"
              className="w-full px-2"
              disabled={usePaymentNotReceivedRequestStatus.isLoading}
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              className="w-full inline-flex px-2"
              loading={usePaymentNotReceivedRequestStatus.isLoading}
              onClick={Report}
            >
              Report
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
