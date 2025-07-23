import { useGetInstructionsQuery } from "@/store/api/walletAPI.ts"
import { useEffect, useState } from "react"
import { IInstructionResponses } from "@/interfaces/Iwallet.ts"
import { Utilities } from "@/lib/Utilities.ts"
import { TypeLabel } from "@/types/enums"
import { Input } from "../ui/input"
import Select from "../ui/select"
import { Skeleton } from "../ui/skeleton"
import FadeIn from "react-fade-in"

interface IMethodOption extends IInstructionResponses {
  value: string
}

export interface IDeposit {
  transactionType?: keyof typeof TypeLabel | null
  location?: string | null
  currency?: string | null
  amount?: number | string | null
}

export default function InputPay({ deposit, setDeposit }: { deposit: IDeposit; setDeposit: (val: IDeposit) => void }) {
  const getInstructions = useGetInstructionsQuery()

  const [showLocation, setShowLocation] = useState(false)
  const [showCurrency, setShowCurrency] = useState(false)
  const [showAmount, setShowAmount] = useState(false)

  const [data, setData] = useState<IDeposit>(deposit)
  const [select, setSelect] = useState<IMethodOption | null>(null)
  const [location, setLocation] = useState<{
    value: string
    label: string
  } | null>(null)
  const [currency, setCurrency] = useState<{
    value: string
    label: string
  } | null>(null)

  useEffect(() => {
    setData(deposit)
    if (select) {
      setShowLocation(false)
      setShowCurrency(false)
      setShowAmount(false)

      setShowLocation(!!data.transactionType?.length && data.transactionType !== "STABLE_COIN")
      setShowCurrency(
        (!data.transactionType?.includes("CASH") && !!data.location) || data.transactionType == "STABLE_COIN",
      )
    }

    if (data.currency) setShowAmount(true)
    if (data.location) setShowCurrency(true)
  }, [deposit, data, select])

  return getInstructions.data ? (
    <div className="flex flex-col gap-4 mb-4">
      <FadeIn delay={100}>
        <Select
          options={
            getInstructions.data.map((item) => {
              return { value: item.name, ...item }
            }) as unknown as string
          }
          label="Choose your payment method"
          placeholder="Choose your payment method"
          value={select}
          onChange={(e) => {
            setSelect(e)
            setLocation(null)
            setCurrency(null)
            setDeposit({ transactionType: e.value })
          }}
        />
      </FadeIn>

      {showLocation && (
        <FadeIn delay={100}>
          <Select
            options={
              select?.locations?.map((c) => {
                return { value: c.code, ...c }
              }) as unknown as string
            }
            label="Sending from"
            placeholder="Sending from"
            value={location}
            onChange={(e) => {
              setLocation(e)
              setCurrency(null)
              setDeposit({ ...data, location: e.value })
            }}
          />
        </FadeIn>
      )}

      {showCurrency && (
        <FadeIn delay={100}>
          <Select
            options={
              (deposit?.transactionType?.includes("CASH")
                ? select?.currencies.filter((dr) => dr.locationCode == data.location)
                : select?.currencies
              )?.map((c) => {
                return { value: c.name, ...c }
              }) as unknown as string
            }
            label="Currency"
            placeholder="Currency"
            value={currency}
            onChange={(e) => {
              setCurrency(e)
              setDeposit({ ...data, currency: e.value })
            }}
          />
        </FadeIn>
      )}

      {showAmount && (
        <FadeIn delay={100}>
          <Input
            type="text"
            placeholder="Amount"
            className="w-full"
            label={data.amount ? "Amount" : null}
            value={
              data.amount ? Utilities.formatNumber(data.amount, false, deposit?.transactionType?.includes("CASH")) : ""
            }
            onChange={(e) => {
              const val = Utilities.unFormatNumber(e.target.value)
              if (!isNaN(Number(val))) setDeposit({ ...data, amount: val })
            }}
          />
        </FadeIn>
      )}
    </div>
  ) : (
    <div className="flex flex-col">
      <Skeleton className="w-full h-12 rounded-full" />
    </div>
  )
}
