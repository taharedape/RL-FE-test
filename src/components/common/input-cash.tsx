import { useEffect, useState } from "react"
import { useGetInstructionsQuery } from "@/store/api/walletAPI.ts"
import { Utilities } from "@/lib/Utilities"
import { Input } from "../ui/input"
import { PiCircleNotch } from "react-icons/pi"

type InputCashProps = {
  amount?: number
  transactionTypeValue?: string
  currencyTypeValue?: string
  disableChangeAmount?: boolean
  onChange: (amount: number, transactionType: string, currencyType: string) => void
}

export default function InputCash({
  amount,
  transactionTypeValue,
  currencyTypeValue,
  disableChangeAmount,
  onChange,
}: InputCashProps) {
  const getInstructions = useGetInstructionsQuery()

  const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>()
  const [transactionType, setTransactionType] = useState<string | undefined>()
  const [amountValue, setAmountValue] = useState<string>()

  const [currencyList, setCurrencyList] = useState<{ name: string; label: string; locationCode: string }[]>([])

  useEffect(() => {
    if (getInstructions.data && !transactionTypeValue) setTransactionType(getInstructions.data[0].name)
  }, [getInstructions.data])

  useEffect(() => {
    if (transactionType) {
      const currencies = getInstructions?.data?.find((dr) => dr.name == transactionType)?.currencies
      if (currencies) {
        setCurrencyList(currencies)

        if (!selectedCurrency) setSelectedCurrency(currencies[0].name)
      }
    }
  }, [transactionType])

  useEffect(() => {
    if (transactionType && selectedCurrency) onChange(amountValue ?? 0, transactionType, selectedCurrency)
  }, [transactionType, selectedCurrency, amountValue])

  useEffect(() => {
    if (amount != amountValue) setAmountValue(amount || 0)

    if (currencyTypeValue && currencyTypeValue != selectedCurrency) setSelectedCurrency(currencyTypeValue)

    if (transactionTypeValue && transactionTypeValue != transactionType) setTransactionType(transactionTypeValue)
  }, [amount, currencyTypeValue, transactionTypeValue])

  return getInstructions?.isLoading ? (
    <PiCircleNotch className="mr-2 h-4 w-4 animate-spin" />
  ) : (
    <Input
      type="text"
      placeholder="To Pay"
      disabled={disableChangeAmount ? true : false}
      pre={
        <div className="bg-muted rounded-full px-1 py-1 flex items-center gap-1 cursor-pointer">
          <select
            onChange={(e) => {
              setTransactionType(e.target.value)
            }}
            className="w-24 bg-transparent justify-between outline-0 flex items-center gap-1 captionS text-muted-foreground"
          >
            {getInstructions?.data?.map((item, index) => (
              <option key={index} value={item.name} className="captionL">
                {Utilities.getTypeLabel(item.name) || item.label}
              </option>
            ))}
          </select>
        </div>
      }
      postfix={
        <div className="flex items-center gap-1">
          <select
            onChange={(e) => {
              setSelectedCurrency(e.target.value)
            }}
            className="flex items-center gap-1 captionS text-[#222831] outline-none bg-[#FAFAFA]"
          >
            {currencyList.map((currency, index) => (
              <option key={index} onClick={() => setSelectedCurrency(currency.name)} className="CaptionL">
                {currency.label}
              </option>
            ))}
          </select>
        </div>
      }
      value={Utilities.formatNumber(amountValue)}
      onChange={(e) => {
        const val = Utilities.unFormatNumber(e.target.value)
        if (!isNaN(Number(val))) setAmountValue(val)
      }}
    />
  )
}
