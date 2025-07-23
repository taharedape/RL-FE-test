import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"

export default function ConfirmFileModal({
  open,
  back,
  enterManual,
}: {
  open: boolean
  back: () => void
  enterManual: () => void
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-xl">
        <div className="text-center text-[#141414] h4">Enter Manually?</div>
        {
          <div className="text-center text-[#141414] bodyS max-w-sm">
            We couldn’t completely scan your data out of the receipt you
            uploaded. Please update your data manually.
          </div>
        }
        <DialogFooter>
          <div className="flex items-center gap-2 justify-between w-full">
            <Button variant="outline" className="w-full px-2" onClick={back}>
              Upload Another
            </Button>
            <Button
              variant="primary"
              className="w-full inline-flex px-2"
              onClick={enterManual}
            >
              Enter manually
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
