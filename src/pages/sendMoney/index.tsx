import { useEffect, useState } from "react"
import {
  useGetQuickTransferMutation,
  useGetTransferTypeQuery,
} from "@/store/api/sendMoney.ts"
import { PiArrowRight, PiBriefcase, PiCaretRight, PiUser } from "react-icons/pi"
import { Skeleton } from "@/components/ui/skeleton"
import ReactCountryFlag from "react-country-flag"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import CreatePayment from "./components/CreatePayment"
import {
  BeneficiariesAccount,
  BeneficiaryType,
  IGetBeneficiaries,
  ITransferType,
  TransferType,
} from "@/types/sendmoney"
import FadeIn from "react-fade-in"
import StepViewer from "@/components/common/stepViewer"
import { cn } from "@/lib/utils"
import FormatNumberView from "@/components/common/FormatNumberView"
import { Utilities } from "@/lib/Utilities"
import { useNavigate } from "react-router"

export default function SendMoney() {
  const navigate = useNavigate()
  const { isLoading, data: transferData } = useGetTransferTypeQuery({})
  const [getQuickTransferRequest, getQuickTransferRequestStatus] =
    useGetQuickTransferMutation()

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<{
    type: TransferType | null
    mode: BeneficiaryType | null
  }>({ type: null, mode: null })
  const [quickTransferList, setQuickTransferList] =
    useState<IGetBeneficiaries | null>(null)
  const [selectedQuickTransfer, setSelectedQuickTransfer] =
    useState<IGetBeneficiaries | null>(null)

  useEffect(() => {
    if (selected.type === TransferType.CASH || (selected.type && selected.mode))
      getQuickTransfer()
    else setQuickTransferList(null)
  }, [selected])

  useEffect(() => {
    navigate(step === 0 ? "/send-money" : "/send-money?createSendMoney")
    if (step === 0) {
      if (!selectedQuickTransfer?.Beneficiaries?.length)
        setSelected({ type: null, mode: null })
      setSelectedQuickTransfer(null)
    }
  }, [step])

  function getQuickTransfer() {
    if (
      selected.mode === BeneficiaryType.CORPORATE ||
      selected.type === TransferType.STABLE_COIN
    )
      return setQuickTransferList(null)
    getQuickTransferRequest(selected)
      .unwrap()
      .then((resp) => {
        setQuickTransferList(resp)
      })
      .catch(() => {
        setQuickTransferList(null)
      })
  }

  function card(item: ITransferType) {
    const bgColor =
      selected.type === item.Name
        ? "bg-[#fbebcd]  border-[#faa500] text-[#faa500]"
        : ""
    const transferCardImages = {
      [TransferType.INTERNATIONAL]: "/images/international.png",
      [TransferType.DOMESTIC]: "/images/domestic.png",
      [TransferType.CASH]: "/images/cash.png",
      [TransferType.STABLE_COIN]: "/images/stableCoin.png",
    }
    const subItemIcons = {
      [BeneficiaryType.INDIVIDUAL]: <PiUser size={16} className="mr-2" />,
      [BeneficiaryType.CORPORATE]: <PiBriefcase size={16} className="mr-2" />,
    }

    return (
      <div className="flex flex-col overflow-hidden">
        <div
          className={`flex items-center justify-between w-full rounded-2xl border p-4 cursor-pointer relative
      ${bgColor}
      `}
          onClick={() => setSelected({ type: item.Name, mode: null })}
        >
          <div className="flex items-center gap-6">
            <img src={transferCardImages[item.Name]} className="w-14 h-14" />
            <div className="flex flex-col space-y-3">
              <div className="text-[#141414] bodyL">{item.Title}</div>
              <div className="text-muted-foreground bodyS">
                {item.Description}
              </div>
            </div>
          </div>
          {selected.type === item.Name && (
            <PiCaretRight size={24} className={`ml-auto ${bgColor}`} />
          )}
        </div>
        {(item.BeneficiaryType?.length || 0) > 0 &&
          item.BeneficiaryType?.map((b) => (
            <div
              key={b.name}
              className={cn(
                "overflow-hidden border rounded-xl rounded-ss-none transition-all duration-700 bodyS font-semibold flex items-center px-3 cursor-pointer",
                selected.type == item.Name ? "h-12 mt-3" : "border-0 h-0",
                selected.mode === b.name ? "bg-[#FFB82E1F]" : "hover:bg-muted"
              )}
              onClick={() => setSelected({ type: item.Name, mode: b.name })}
            >
              {subItemIcons[b.name]}
              {b.label}
            </div>
          ))}
      </div>
    )
  }

  function transferCard(account: BeneficiariesAccount) {
    const nameSubString =
      account.FirstName?.substring(0, 1) + account.LastName?.substring(0, 1)
    return (
      <div
        className="bg-muted hover:bg-[#E4E5E6]/70 cursor-pointer rounded-xl px-4 py-3 flex items-center my-1"
        onClick={() => {
          setSelectedQuickTransfer({
            Beneficiaries: [account],
            PaymentInformation: quickTransferList!.PaymentInformation,
            ReasonForTransfer: quickTransferList!.ReasonForTransfer,
          })
          setStep(1)
        }}
      >
        <div className="flex items-end">
          <div className="h-10 w-10 rounded-full bg-[#E4E5E6] flex items-center justify-center cationL">
            {nameSubString?.toUpperCase() || "NA"}
          </div>
          <ReactCountryFlag
            countryCode={account.PaymentInformation[0].CountryCode}
            className="w-4 h-4 rounded-full -ml-3"
            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
            cdnSuffix="svg"
            svg
            style={{ width: "1rem", height: "1rem" }}
          />
        </div>
        <div className="flex flex-col w-full ml-4">
          <div className="flex w-full justify-between">
            <div className="bodyS">{account.FullName || "NA"}</div>
            <PiArrowRight size={16} className="text-[#A5A6A7]" />
          </div>
          <div className="captionL text-[#A5A6A7]">
            Your transferred{" "}
            <FormatNumberView
              currency={
                account.PaymentInformation[0].Currencies[0].CurrencyCode
              }
              value={account.PaymentInformation[0].Currencies[0].Amount}
              subClass="captionS"
            />{" "}
            on{" "}
            {Utilities.convertDateFormat(account.LastDate).replace(" at", "")}
          </div>
        </div>
      </div>
    )
  }

  function transferOnboarding() {
    return (
      <>
        <div className="mt-8 flex flex-col items-center gap-4">
          {isLoading ? (
            <>
              <Skeleton className="w-full h-24 rounded-2xl" />
              <Skeleton className="w-full h-24 rounded-2xl" />
              <Skeleton className="w-full h-24 rounded-2xl" />
            </>
          ) : (
            transferData?.map((td, i) => (
              <div key={i} className="w-full">
                {card(td)}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="primary"
            disabled={
              !(
                selected?.type?.length &&
                (selected.type === TransferType.CASH ||
                  selected.type === TransferType.STABLE_COIN ||
                  selected?.mode?.length)
              )
            }
            onClick={() => setStep(1)}
          >
            Select & Continue
          </Button>
        </div>
        {!(
          selected.mode === BeneficiaryType.CORPORATE ||
          selected.type === TransferType.STABLE_COIN
        ) && (
          <>
            <div className="flex justify-between w-full mt-12 mb-8 text-[#141414] h5">
              Quick Transfer
            </div>
            {isLoading || getQuickTransferRequestStatus.isLoading ? (
              <>
                <Skeleton className="h-16 rounded-xl my-1" />
                <Skeleton className="h-16 rounded-xl my-1" />
                <Skeleton className="h-16 rounded-xl my-1" />
              </>
            ) : quickTransferList?.Beneficiaries?.length ? (
              quickTransferList?.Beneficiaries.map((qt, i) => (
                <div key={i} className="w-full">
                  {transferCard(qt)}
                </div>
              ))
            ) : selected.type === TransferType.CASH ||
              selected.type === TransferType.STABLE_COIN ||
              (selected.type && selected.mode) ? (
              <div className="text-center mx-auto py-20 text-[#A5A7A6] bodySB max-w-80 flex flex-col gap-2">
                No Transfer Found!
                <span className="captionL">
                  You don&apos;t have any transfer at this type
                </span>
              </div>
            ) : (
              <div className="text-center mx-auto py-20 text-[#A5A7A6] bodySB max-w-80 flex flex-col gap-2">
                Please select a Transfer Type
                <span className="captionL">
                  Select a transfer type form the list above in order to update
                  the list accordingly.
                </span>
              </div>
            )}
          </>
        )}
      </>
    )
  }
  const steps =
    selected.type == TransferType.CASH ||
    selected.type === TransferType.STABLE_COIN
      ? ["Transfer Type", "Beneficiary Details", "Review & Transfer"]
      : ["Transfer Type", "Beneficiary", "Account Details", "Review & Transfer"]

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex items-end gap-3 mb-8">
          <h4 className="h4 text-[#141414]">Send Money</h4>
          {step > 0 && (
            <span className="bodyL text-[#A5A7A6]">
              ({Utilities.getTypeLabel(selected.type!)})
            </span>
          )}
        </div>
        <StepViewer
          steps={steps}
          currentStep={
            selected.type === TransferType.CASH ||
            selected.type === TransferType.STABLE_COIN
              ? step > 1
                ? step - 1
                : step
              : step
          }
        />
      </div>
      <div className="flex flex-col transform duration-700">
        <Carousel
          opts={{ watchDrag: false }}
          disableKeyCapture
          goto={step > 0 ? 1 : 0}
        >
          <CarouselContent>
            <CarouselItem>{transferOnboarding()}</CarouselItem>
            <CarouselItem>
              <FadeIn>
                <div className="mt-14">
                  {!!step && (
                    <CreatePayment
                      transferType={selected}
                      selectedQuickTransfer={selectedQuickTransfer}
                      back={() => setStep(0)}
                      setParentStep={(v) => setStep(v)}
                    />
                  )}
                </div>
              </FadeIn>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </>
  )
}
