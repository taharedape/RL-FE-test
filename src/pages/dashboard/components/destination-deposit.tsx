import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { CopyComponent } from "@/components/tools/copy.component.tsx"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import QRCode from "react-qr-code"
import { IDeposit } from "@/components/common/input-pay"
import { PiCopySimple, PiDownloadSimple, PiQrCode } from "react-icons/pi"
import { Button } from "@/components/ui/button"
import CurrencyFlags from "@/components/common/CurrencyFlags"
import FormatNumberView from "@/components/common/FormatNumberView"

export default function DestinationDeposit({
  deposit,
  details,
  getPDF,
}: {
  deposit: IDeposit
  details: Array<{ name: string; label: string; value: string }>
  getPDF: () => void
}) {
  const { toast } = useToast()
  const pdfRef = useRef<HTMLDivElement>(null)

  const [list, setList] = useState<Array<{ name: string; label: string; value: string }>>([])
  const [walletAddress, setWalletAddress] = useState<string>("")

  useEffect(() => {
    try {
      setList(details)

      setWalletAddress((details?.find((dr) => dr.name == "WalletAddress")?.value as string) || "")
    } catch (e) {
      console.error("Failed to parse details", e)
    }
  }, [details])

  // copy
  const copyToClipboard = async () => {
    let textToCopy =
      list.map((item) => `${item.label}: ${item.value}`).join("\n") +
      `\nCurrency: ${deposit.currency}` +
      `\nAmount: ${deposit.amount}`
    if (deposit?.transactionType?.includes("CASH"))
      textToCopy += `\nAttention: The person collecting the cash must bring a valid government-issued ID and the reference number provided in the instructions. These are required for verification and processing at our office.`

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
    return <div className="flex-1 h-0 border-dashed border-t-2 border-[#a5a7a6] w-full min-w-10" />
  }

  return (
    <>
      <div ref={pdfRef}>
        <div className="self-stretch p-6 bg-[#22283108] rounded-3xl inline-flex flex-col justify-start items-start gap-4 w-full">
          <div className="self-stretch min-w-96 py-2 inline-flex justify-start items-center gap-3">
            <div className="text-neutral-900 bodyL mr-auto">Destination account information</div>
            {deposit.transactionType === "STABLE_COIN" && (
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-lg size-10 border border-[#FAA500] text-[#FAA500] hover:text-[#FAA500]/70"
                    >
                      <PiQrCode size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <div className="flex flex-col items-center">
                      <div className="text-center text-[#141414] bodyLB">Scan QR</div>
                      <div className="mt-4 text-center text-[#141414] bodyS">
                        You can also scan this qr code in order to get the destination account information.
                      </div>
                    </div>
                    <hr className="w-full border-[#dee0e0] mt-4 mb-6" />
                    <div className="flex flex-col gap-3 p-3 bg-[#222831]/5 rounded-lg">
                      <div className="flex justify-between">
                        <div className="text-[#141414] bodySB">Account Address ({deposit.currency})</div>
                        <CopyComponent text={walletAddress} />
                      </div>
                      <div className="text-[#4c4c4c] bodyS underline">{walletAddress}</div>
                    </div>
                    <div className="QR-CODE mt-6">
                      <div
                        style={{
                          height: "auto",
                          margin: "0 auto",
                          maxWidth: 160,
                          width: "100%",
                        }}
                      >
                        <QRCode
                          size={160}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                          fgColor="#564200"
                          value={walletAddress ?? ""}
                          viewBox={`0 0 160 160`}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose className="w-full mt-6">
                        <Button variant="outline" size="full">
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            <Button
              variant="outline"
              className="rounded-lg bg-transparent size-10"
              size="icon"
              onClick={copyToClipboard}
            >
              <PiCopySimple size={16} />
            </Button>
            <Button variant="ghost" className="rounded-lg bg-gray-800/5 size-10" size="icon" onClick={() => getPDF()}>
              <PiDownloadSimple size={16} />
            </Button>
          </div>
          {/* Destination  */}
          <div className="self-stretch p-4 inline-flex justify-center items-center gap-4">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
              {list
                .filter((dr) => dr.value != "" && dr.value != null)
                .map((item, index) => (
                  <div key={index} className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="justify-start text-neutral-600 bodyS max-w-[40%]">{item.label}</div>
                    {spacerLine()}
                    <div className="justify-end text-right text-neutral-600 bodyS max-w-[45%]">{item.value}</div>
                    <CopyComponent text={item.value} />
                  </div>
                ))}
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <div className="justify-start text-neutral-600 bodyS">Currency</div>
                {spacerLine()}
                <CurrencyFlags size={16} type={deposit.transactionType!} currency={deposit.currency!} />
                <div className="justify-start text-neutral-600 bodyS">{deposit.currency}</div>
                {deposit.currency && <CopyComponent text={deposit.currency} />}
              </div>
              <div className="self-stretch ] inline-flex justify-start items-center gap-2">
                <div className="justify-start text-neutral-600 bodyS">Amount</div>
                {spacerLine()}
                <FormatNumberView
                  className="justify-start text-neutral-600 bodyS"
                  value={deposit.amount}
                  currency={deposit.currency}
                />
                {deposit?.amount && <CopyComponent text={deposit?.amount?.toString()} />}
              </div>
            </div>
          </div>
          {deposit?.transactionType?.includes("CASH") && (
            <div>
              <div className="text-[#4c4c4c] bodySB">Attention</div>
              <div className="mt-2 bodyS">
                The person collecting the cash must bring a valid government-issued ID and the reference number provided
                in the instructions. These are required for verification and processing at our office.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
