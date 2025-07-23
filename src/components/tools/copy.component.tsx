import { useToast } from "@/components/ui/use-toast"
import { PiCopySimple } from "react-icons/pi"
import { Button } from "../ui/button"

export const CopyComponent = ({ text }: { text: string }) => {
  const { toast } = useToast()

  async function copyClick() {
    await navigator.clipboard.writeText(text)

    toast({
      duration: 5000,
      variant: "default",
      title: "Successfully",
      description: `Text "${text}" copied!`,
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-[#4C4C4C] hover:text-muted-foreground"
      onClick={copyClick}
    >
      <PiCopySimple size={20} />
    </Button>
  )
}
