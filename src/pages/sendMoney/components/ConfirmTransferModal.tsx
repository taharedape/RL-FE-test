import FormatNumberView from "@/components/common/FormatNumberView"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function ConfirmTransferModal({
  currency,
  amount,
  accountName,
  wallet,
  isLoading,
  handleApprove,
}: {
  currency?: string
  amount: number | string
  accountName?: string | null
  wallet?: string
  isLoading?: boolean
  handleApprove: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen}>
      <DialogTrigger>
        <Button
          variant="primary"
          loading={isLoading}
          onClick={() => setIsOpen(true)}
        >
          Confirm & Create Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <div className="text-center text-[#141414] h4">Confirm Transfer</div>
        {
          <div className="text-center text-[#141414] bodyS max-w-sm">
            You’re about to send{" "}
            <FormatNumberView
              className="bodySB"
              currency={currency}
              value={amount}
            />
            {" to "}
            <strong className="capitalize">
              {wallet ? wallet : accountName}
            </strong>
            {wallet ? ". " : "’s account. "}
            Are you sure you want to proceed?
          </div>
        }
        <DialogFooter>
          <div className="flex items-center gap-2 justify-between w-full">
            <DialogClose asChild>
              <Button
                type="submit"
                variant="outline"
                className="w-full px-2"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              variant="primary"
              className="w-full inline-flex px-2"
              onClick={() => {
                handleApprove()
                setIsOpen(false)
              }}
            >
              Transfer Money
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
