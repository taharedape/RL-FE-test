import InputCash from "@/components/common/input-cash"
import { useEffect, useState } from "react"
import { useGetCurrenciesQuery } from "@/store/api/walletAPI.ts"
import { PiArrowsLeftRight } from "react-icons/pi"
import { Utilities } from "@/lib/Utilities"

export default function QuickExchange() {
  const { data: currencies, isSuccess } = useGetCurrenciesQuery()

  const [currencyType1, setCurrencyType1] = useState<string>()
  const [transactionType1, setTransactionType1] = useState<string>()
  const [amount1, setAmount1] = useState<number>(0)

  const [currencyType2, setCurrencyType2] = useState<string>()
  const [transactionType2, setTransactionType2] = useState<string>()
  const [amount2, setAmount2] = useState<number>(0)

  const [result1, setResult1] = useState<string>()
  const [result2, setResult2] = useState<string>()

  const getRate = (currency: string) => {
    const currencyData = (currencies as unknown as Array<{ currency: string; amount: number }>)?.find(
      (c) => c.currency === currency,
    )
    return currencyData ? currencyData.amount : 1 // Default to 1 for USD
  }

  useEffect(() => {
    if (!currencies || !isSuccess) return

    const rate1 = getRate(currencyType1 ?? "USD") // Get conversion rate for currency1
    const rate2 = getRate(currencyType2 ?? "USD") // Get conversion rate for currency2

    const amountInUSD = (amount1 ?? 1) / (rate1 ?? 1) // Convert to USD
    const convertedAmount = (amountInUSD ?? 1) * (rate2 ?? 1) // Convert to target currency

    setAmount2(convertedAmount)
    setResult1(`${rate1 ?? 1} ${currencyType1 ?? "USD"}`)
    setResult2(`${rate2 ?? 1} ${currencyType2 ?? "USD"}`)
  }, [currencies, isSuccess, amount1, currencyType1, currencyType2])

  return (
    <div className="flex flex-col items-center p-6 rounded-3xl lg:border border-neutral-200">
      <div className="bodyLB self-start text-black mb-8">Quick Exchange</div>
      <InputCash
        currencyTypeValue={currencyType1}
        transactionTypeValue={transactionType1}
        amount={amount1}
        onChange={(amount, transactionType, currencyType) => {
          setCurrencyType1(currencyType)
          setTransactionType1(transactionType)
          setAmount1(amount)
        }}
      />
      <PiArrowsLeftRight size={18} className="flex items-center justify-center my-2" />
      <InputCash
        disableChangeAmount={true}
        currencyTypeValue={currencyType2}
        transactionTypeValue={transactionType2}
        amount={amount2}
        onChange={(amount, transactionType, currencyType) => {
          setCurrencyType2(currencyType)
          setTransactionType2(transactionType)
          setAmount2(amount)
        }}
      />
      <hr className="border border-[#dee0e0] w-full my-6" />
      <div className="flex flex-col items-center my-2 gap-4 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="captionL text-[#4c4c4c]">Rate</div>
          <div className="captionL text-[#4c4c4c]">
            {Utilities.getRoundBalanceCurrency(result1) || 0} = {Utilities.getRoundBalanceCurrency(result2) || 0}
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="captionL text-[#4c4c4c]">Fee</div>
          <div className="captionL text-[#4c4c4c]">0 $</div>
        </div>
      </div>

      {/*<div className="h-12 px-7 py-3.5 rounded-[100px] border border-[#dee0e0] justify-center items-center inline-flex">*/}
      {/*  <div className="text-[#00261d] text-base font-semibold capitalize">*/}
      {/*    Proceed*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}
