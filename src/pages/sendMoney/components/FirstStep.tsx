import AccountSelect from "@/components/dynamics/AccountSelect"
import FadeIn from "react-fade-in"
import { IFormOptions, IFormValues } from "./CreatePayment"
import { BeneficiaryType, TransferType } from "@/types/sendmoney"
import { useGetBeneficiariesMutation } from "@/store/api/sendMoney"
import { PiUser } from "react-icons/pi"
import { useEffect } from "react"

export default function FirstStep({
  visibility,
  formValues,
  options,
  transferType,
  setFormValues,
  setOptions,
  setIsContinueDisabled,
  onAddNew,
}: {
  visibility: boolean
  formValues: IFormValues
  options: IFormOptions
  transferType: { type: TransferType | null; mode: BeneficiaryType | null }
  setFormValues: (IFormValues) => void
  setOptions: (IFormOptions) => void
  setIsContinueDisabled: (boolean) => void
  onAddNew: () => void
}) {
  const [sendGetBeneficiariesRequest] = useGetBeneficiariesMutation()

  const isCash = transferType.type === TransferType.CASH

  useEffect(() => {
    setIsContinueDisabled(!formValues.account?.Id)
  })

  return (
    <div className="grid grid-cols-1 gap-3 gap-y-4 p-1">
      <FadeIn visible={visibility} delay={700}>
        <div key={formValues.key} className="flex flex-col">
          <span className="bodyS text-muted-foreground mb-6">
            Who are you sending money to?
          </span>
          <AccountSelect
            value={
              formValues.account?.Id
                ? {
                    value: formValues.account?.Id,
                    label: "",
                    original: formValues.account,
                  }
                : undefined
            }
            transferType={transferType}
            placeholder="Account name"
            label="Account name"
            pre={<PiUser size={20} />}
            getMemoOptions={(inputValue: string) =>
              sendGetBeneficiariesRequest({
                ...transferType,
                name: inputValue,
              }).unwrap()
            }
            onSelectChange={(newVal, resp) => {
              setFormValues({
                ...formValues,
                account: newVal?.original || undefined,
                reasonForTransfer: undefined,
                paymentReference: undefined,
                key: formValues.key + 1,
                isNew: false,
              })
              setOptions({
                ...options,
                ReasonForTransfer: resp?.ReasonForTransfer || [],
                countries: isCash
                  ? resp?.PaymentInformation.map((s) => ({
                      value: s.CountryCode,
                      label: s.CountryName,
                      original: s,
                    }))
                  : [],
                currencies: isCash
                  ? resp?.PaymentInformation?.[0]?.Currencies.map((c) => ({
                      value: c.CurrencyId,
                      label: c.CurrencyCode,
                      original: c,
                    }))
                  : [],
              })

              setIsContinueDisabled(!newVal?.value)
            }}
            onAddNew={() => {
              setFormValues({
                ...formValues,
                account: undefined,
                reasonForTransfer: undefined,
                paymentReference: undefined,
                key: formValues.key + 1,
                isNew: true,
              })
              onAddNew()
            }}
          />
        </div>
      </FadeIn>
    </div>
  )
}
