import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { CopyComponent } from "@/components/tools/copy.component.tsx"
import { PiCopySimple, PiWhatsappLogoFill } from "react-icons/pi"
import { Button } from "@/components/ui/button"

const PiDirection = (
  <svg
    enableBackground="new 0 0 24 24"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    focusable="false"
    className="text-[#0062FF]"
  >
    <rect fill="none" height="24" width="24" />
    <path
      fill="currentColor"
      d="m21.41 10.59-7.99-8c-.78-.78-2.05-.78-2.83 0l-8.01 8c-.78.78-.78 2.05 0 2.83l8.01 8c.78.78 2.05.78 2.83 0l7.99-8c.79-.79.79-2.05 0-2.83zM13.5 14.5V12H10v3H8v-4c0-.55.45-1 1-1h4.5V7.5L17 11l-3.5 3.5z"
    />
  </svg>
)

export default function Destination({
  details,
}: {
  details: Array<{ label: string; value?: string | null }>
}) {
  const { toast } = useToast()
  const pdfRef = useRef<HTMLDivElement>(null)

  const [list, setList] = useState<
    Array<{ label: string; value?: string | null }>
  >([])

  useEffect(() => {
    try {
      setList(details)
    } catch (e) {
      console.error("Failed to parse details", e)
    }
  }, [details])

  // copy
  const copyToClipboard = async () => {
    const textToCopy = list
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n")
    try {
      await navigator.clipboard.writeText(textToCopy)

      toast({
        title: "Copied!",
        description: "All information has been copied to clipboard.",
        duration: 3000,
        variant: "default",
      })
    } catch (err) {
      console.error("Failed to copy:", err)

      toast({
        title: "Error",
        description: "Failed to copy data. Please try again.",
        variant: "destructive",
      })
    }
  }

  function spacerLine() {
    return (
      <div className="flex-1 h-0 border-dashed border-t-2 border-[#a5a7a6] w-full min-w-10" />
    )
  }

  return (
    <>
      <div ref={pdfRef}>
        <div className="border-2 border-dashed border-neutral-400 p-6 bg-[#22283108] rounded-md inline-flex flex-col justify-start items-start gap-4 w-full">
          <div className="self-stretch min-w-96 py-2 inline-flex justify-start items-center gap-3">
            <div className="text-neutral-600 bodyS font-semibold mr-auto">
              Instructions
            </div>
            <Button
              variant="outline"
              className="rounded-lg bg-transparent size-10 shrink-0"
              size="icon"
              onClick={copyToClipboard}
            >
              <PiCopySimple size={20} />
            </Button>
          </div>
          <div className="self-stretch inline-flex justify-center items-center gap-4">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
              {list.map((item, index) => (
                <div
                  key={index}
                  className="self-stretch inline-flex justify-start items-center gap-2"
                >
                  {item.label === "WhatsApp" && (
                    <PiWhatsappLogoFill size={24} className="text-[#25D366]" />
                  )}
                  <div className="justify-start text-neutral-600 bodyS max-w-[40%] capitalize">
                    {item.label}
                  </div>
                  {spacerLine()}
                  <div className="justify-end text-right text-neutral-600 bodyS max-w-[45%]">
                    {item.value || "N/A"}
                  </div>
                  {item.label === "Address" && !!item.value && (
                    <a
                      href={"https://maps.google.com/?q=" + item.value}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {PiDirection}
                    </a>
                  )}
                  <CopyComponent text={item.value || "N/A"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
