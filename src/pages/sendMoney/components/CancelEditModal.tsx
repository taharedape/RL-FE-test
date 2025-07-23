import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CancelEditModal({ discard }: { discard: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen}>
      <DialogTrigger>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <div className="text-center text-[#141414] h4">Cancel Editing?</div>
        {
          <div className="text-center text-[#141414] bodyS max-w-sm">
            You’re about to cancel the changes. Are you sure you want to
            proceed?
          </div>
        }
        <DialogFooter>
          <div className="flex items-center gap-2 justify-between w-full">
            <Button
              type="submit"
              variant="outline"
              className="w-full px-2"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              className="w-full inline-flex px-2"
              onClick={() => {
                discard()
                setIsOpen(false)
              }}
            >
              Discard Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
