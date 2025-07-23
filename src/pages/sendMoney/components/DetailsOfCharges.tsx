import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BeneficiaryType, FeeType, TransferType } from "@/types/sendmoney"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useRef, useState } from "react"
import { useGetSendMoneyRecipientMutation } from "@/store/api/sendMoney"
import { IFormValues } from "./CreatePayment"
import { PiSpinner } from "react-icons/pi"
import FormatNumberView from "@/components/common/FormatNumberView"

interface props {
  formValues: IFormValues
  transferType: { type: TransferType | null; mode: BeneficiaryType | null }
  onTypeChange?: (type: FeeType | "", fee: number) => void
}

export const transferTypeOptionsTooltipContents = {
  BEN: {
    title: "BEN (Beneficiary Pays All Charges)",
    content:
      "The recipient bears all costs, including fees from the sender’s bank, intermediary banks, and their own bank. These charges are deducted from the transfer amount, and the recipient may receive significantly less.",
  },
  SHA: {
    title: "SHA (Shared Charges)",
    content:
      "Each party pays their own bank’s fees. The sender pays the fees charged by their own bank. The recipient may receive less if intermediary or receiving banks deduct charges.",
  },
  OUR: {
    title: "OUR (Sender Pays All Charges)",
    content:
      "The sender covers all fees, including those charged by intermediary and receiving banks. The Beneficiary receives the full transfer amount without any deductions.",
  },
}

export default function DetailsOfCharges({
  formValues,
  transferType,
  onTypeChange,
}: props) {
  const isCorporate = transferType.mode === BeneficiaryType.CORPORATE
  const isCash = transferType.type === TransferType.CASH
  const isStableCoin = transferType.type === TransferType.STABLE_COIN
  const PaymentMethod =
    formValues.isNew || isCorporate
      ? formValues.paymentMethod?.original
      : formValues.account?.PaymentInformation[0].Currencies[0]
          .PaymentMethods[0]
  const isSwift = (PaymentMethod?.Name || "").includes("SWIFT")

  const transferTypeOptions = isSwift
    ? PaymentMethod?.Extra?.Options.map((o) => ({
        ...o,
        tooltip: transferTypeOptionsTooltipContents[o.Label],
      }))
    : []
  const transferTypeDefaultOption =
    formValues.paymentMethodType || (PaymentMethod?.Extra?.Default as FeeType)
  const [Fee, setFee] = useState(
    isCash
      ? 0
      : Number(
          formValues.paymentMethodType ||
            PaymentMethod?.Fees?.[transferType.mode!] ||
            ""
        )
  )

  const [getSendMoneyRecipientRequest, getSendMoneyRecipientRequestStatus] =
    useGetSendMoneyRecipientMutation()

  useEffect(() => {
    if (
      isSwift &&
      !getSendMoneyRecipientRequestStatus.isLoading &&
      !formValues.paymentMethodType
    )
      setTimeout(() => {
        changeOption(transferTypeDefaultOption as FeeType)
      }, 100)
  }, [isSwift, transferTypeDefaultOption])

  useEffect(() => {
    if (!getSendMoneyRecipientRequestStatus.isLoading)
      setFee(
        isCash ? 0 : Number(PaymentMethod?.Fees?.[transferType.mode!] || "")
      )
  }, [getSendMoneyRecipientRequestStatus.isLoading])

  const callChangeOptionInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isStableCoin) return
    if (callChangeOptionInterval.current)
      clearTimeout(callChangeOptionInterval.current)

    callChangeOptionInterval.current = setTimeout(() => {
      changeOption()
    }, 800)
  }, [formValues.amount])

  async function changeOption(val?: FeeType) {
    if (
      getSendMoneyRecipientRequestStatus.isLoading ||
      (isStableCoin && !formValues.amount)
    )
      return

    const paymentMethodId = isStableCoin
      ? formValues.currency?.original?.PaymentMethods?.[0]?.Id
      : formValues.paymentMethod?.value

    getSendMoneyRecipientRequest({
      TransferType: transferType.type!,
      ReceiverType: transferType.mode! || "",
      TransferMethod: val || "",
      Amount: Number(formValues.amount!) || 100,
      CountryCode: formValues.currency?.label as string,
      PaymentMethodId: Number(paymentMethodId || "") as number,
    })
      .unwrap()
      .then((resp) =>
        onTypeChange?.(val || "", Number(resp?.Charge || "") || 0)
      )
  }

  return (
    <div className="p-4 rounded-lg bg-[#0062FF12] border border-[#0062FF]">
      <div className="flex flex-col gap-1 border-l-4 border-[#0062FF] px-4">
        <div className="button text-[#141414]">
          Details Of Charges{" "}
          {!isStableCoin && (
            <span className="captionL text-[#4C4C4C]">
              ({PaymentMethod?.Name})
            </span>
          )}
        </div>
        {isSwift && (
          <>
            <div className="captionS text-[#4C4C4C]">
              Choose how transfer fees are distributed
            </div>
            {transferTypeOptions?.length && (
              <div className="h-10 flex items-center -mt-2 group-hover:bg-[#DEE0E0]">
                <RadioGroup
                  className="flex gap-8"
                  defaultValue={transferTypeDefaultOption}
                  onValueChange={(e) => changeOption(e as FeeType)}
                >
                  {transferTypeOptions.map((so) => (
                    <Tooltip key={so.Value} delayDuration={400}>
                      <TooltipTrigger>
                        <RadioGroupItem
                          value={so.Value as string}
                          label={so.Label}
                        />
                      </TooltipTrigger>
                      {so.tooltip?.title?.length && (
                        <TooltipContent
                          className="sticky z-50 captionS flex flex-col max-w-60"
                          align="start"
                        >
                          <strong>{so.tooltip?.title}</strong>
                          {so.tooltip?.content}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </RadioGroup>
              </div>
            )}
          </>
        )}

        <div className="captionL text-[#4C4C4C] flex items-center gap-2">
          {isStableCoin ? "Network fee: " : "Transfer fee: "}
          {getSendMoneyRecipientRequestStatus.isLoading ? (
            <PiSpinner className="mr-2 h-4 w-4 animate-spin" />
          ) : isSwift && formValues.paymentMethodType === "BEN" ? (
            <span className="captionL font-bold">
              Fees will apply to the beneficiary.
            </span>
          ) : (
            <>
              <FormatNumberView
                className="text-[#4c4c4c] captionL font-bold"
                subClass="text-xs"
                currency={(formValues?.currency?.label as string) || ""}
                value={Fee || 0}
              />
              {isSwift && formValues.paymentMethodType === "SHA" && (
                <span className="captionS">
                  (Minor fees may apply to the beneficiary)
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
