import React, { useEffect, useState } from "react"
import DestinationDeposit from "@/pages/dashboard/components/destination-deposit"
import InputPay, { IDeposit } from "@/components/common/input-pay"
import { Utilities } from "@/lib/Utilities.ts"
import { PiArrowLeft } from "react-icons/pi"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import Badge from "@/components/ui/badge"
import { useAddMoneyMutation, useGetExportInstructionMutation, useGetInstructionQuery } from "@/store/api/walletAPI"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import FormatNumberView from "@/components/common/FormatNumberView"

const Deposit: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [addMoney, addMoneyStatus] = useAddMoneyMutation()

  const [step, setStep] = useState(1)
  const [deposit, setDeposit] = useState<IDeposit>({})
  const isDisabled = !(Number(deposit.amount) > 0)

  const { data, isLoading } = useGetInstructionQuery(
    {
      Currency: deposit.currency as string,
      Type: deposit?.transactionType as string,
      Location: deposit?.location as string,
      Amount: deposit?.amount as number,
    },
    { skip: !deposit?.transactionType && isDisabled },
  )

  useEffect(() => {
    if (deposit?.transactionType === "CASH_PICKUP" && step === 2) setStep(1)
  }, [deposit, step])

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleAddMoney = async () => {
    try {
      const result = await addMoney({
        Currency: deposit.currency as string,
        Amount: Number(deposit.amount),
        Type: deposit.transactionType as string,
        InstructionId: data!.id,
        Country: deposit.location || "",
      }).unwrap()

      if (result) {
        toast({
          duration: 60000,
          variant: "default",
          title: "Successfully",
          description:
            "You have successfully created a deposit request. After completing the deposit process which you can view here, your account will be credited.",
        })
        navigate(`/dashboard/deposit-process/${result?.requestId}`)
      }
    } catch (err) {
      console.error("Failed to add money:", err)
    }
  }

  const [getExportInstructionRequest] = useGetExportInstructionMutation()

  async function getPDF() {
    getExportInstructionRequest({
      Currency: deposit.currency as string,
      Type: deposit?.transactionType as string,
      Location: deposit?.location as string,
      Amount: deposit?.amount as number,
    })
      .unwrap()
      .then((resp) => {
        const url = window.URL.createObjectURL(resp)
        const a = document.createElement("a")
        a.href = url
        a.download = "Download.pdf"
        a.click()
        window.URL.revokeObjectURL(url)
      })
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-11">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => (step === 1 ? navigate("/dashboard") : prevStep())}>
            <PiArrowLeft size={32} />
          </Button>
          <div className="text-Content-black h4">Deposit</div>
          {step === 2 && (
            <Badge variant="secondary" className="captionL rounded-full px-2 py-1">
              {Utilities.getTypeLabel(deposit.transactionType!)}
            </Badge>
          )}
        </div>
        <div className="text-Content-black bodyS">Create an add money request to increase your account balance.</div>
        <div className="mb-6 flex flex-col gap-4 mt-12">
          {/* Input */}
          <InputPay deposit={deposit} setDeposit={setDeposit} />
          {/* Fees */}
          <div className="flex items-center justify-between mt-5">
            <div className="text-neutral-400 captionL">Fees</div>
            <div className="text-neutral-400 captionL">0 $</div>
          </div>
          <hr className="border-neutral-200 my-4" />
          {/* Amount */}
          <div className="flex items-center justify-between mb-5">
            <div className="bodySB">Amount you will receive</div>
            {deposit.currency?.length > 0 && (
              <FormatNumberView className="text-black bodySB" currency={deposit.currency} value={deposit.amount || 0} />
            )}
          </div>
        </div>
      </div>
      {step === 1 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            disabled={addMoneyStatus.isLoading || isLoading || isDisabled}
            loading={addMoneyStatus.isLoading}
            onClick={() => (deposit?.transactionType == "CASH_PICKUP" ? handleAddMoney() : nextStep())}
          >
            Proceed & Pay
          </Button>
        </div>
      )}
      {step === 2 && (
        <>
          {isDisabled ? (
            <Skeleton className="w-full h-40 rounded-3xl" />
          ) : (
            <DestinationDeposit deposit={deposit} details={data?.details || []} getPDF={() => getPDF()} />
          )}
          <div className="flex justify-end gap-2 my-8">
            <Button
              disabled={addMoneyStatus.isLoading || isLoading || isDisabled}
              variant="primary"
              loading={addMoneyStatus.isLoading}
              onClick={handleAddMoney}
            >
              Create request
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default Deposit
