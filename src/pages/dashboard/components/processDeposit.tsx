import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useParams } from "react-router-dom"
import {
  useCancelAddMoneyMutation,
  useGetTransactionDetailQuery,
  useSetUploadPaidReceiptMutation,
  useUpdateAmountAddMoneyMutation,
  useUploadFileMutation,
} from "@/store/api/walletAPI.ts"
import { TransactionDetailResponse } from "@/interfaces/Iwallet.ts"
import { CopyComponent } from "@/components/tools/copy.component.tsx"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast.ts"
import { useNavigate } from "react-router"
import { Utilities } from "@/lib/Utilities.ts"
import {
  PiArrowLeft,
  PiBoxArrowUpDuotone,
  PiCheckCircleFill,
  PiChecksDuotone,
  PiClipboardTextDuotone,
  PiListChecksDuotone,
  PiMoneyWavy,
  PiNotePencil,
  PiWarningCircle,
} from "react-icons/pi"
import Badge from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Select, { OptionItem } from "@/components/ui/select"
import { TypeLabel } from "@/types/enums"
import { SingleValue } from "react-select"
import FormatNumberView from "@/components/common/FormatNumberView"
import { Input } from "@/components/ui/input.tsx"
import UploadFiles from "@/pages/dashboard/components/UploadFiles.tsx"
import DisplayUploadFiles from "@/pages/dashboard/components/DisplayUploadFiles.tsx"

export default function ProcessDeposit() {
  const { id } = useParams<{ id: string }>() // Get transaction ID from URL params
  const { data, error, isLoading, isSuccess } = useGetTransactionDetailQuery(
    id || ""
  )
  const { toast } = useToast()
  const [uploadFile, uploadFileStatus] = useUploadFileMutation()
  const [setUploadPaidReceipt, setUploadPaidReceiptStatus] =
    useSetUploadPaidReceiptMutation()

  const [cancelAddMoneyRequest, cancelAddMoneyRequestStatus] =
    useCancelAddMoneyMutation()

  const [updateAmountAddMoneyRequest, updateAmountAddMoneyRequestStatus] =
    useUpdateAmountAddMoneyMutation()

  const [fileSelected, setFileSelected] = useState<File[] | null>(null)
  const [cancelDescription, setCancelDescription] = useState(
    "Incorrect Recipient Information"
  )

  const handleCancelAddMoney = () => {
    const requestId = id
    cancelAddMoneyRequest({
      requestId: requestId as string,
      description: cancelDescription,
    })
      .unwrap()
      .then(() => {
        navigate(`/dashboard/deposit-process/${id}`)
      })
      .catch((error) => {
        toast({
          duration: 5000,
          variant: "destructive",
          title: `Cancel Add money`,
          description: error.data.message,
        })
      })

    setCancelDescription("")
  }

  const handleUpdateAmountAddMoney = () => {
    const requestId = id
    updateAmountAddMoneyRequest({
      requestId: requestId as string,
      amount: Number(updateAmount),
    })
      .unwrap()
      .then(() => {
        window.location.reload()
      })
      .catch((error) => {
        toast({
          duration: 10000,
          variant: "destructive",
          title: `Update Amount Add money`,
          description: error.data.message,
        })
      })

    setCancelDescription("")
  }

  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmitUpload() {
    if (fileSelected && fileSelected.length > 0) {
      const urls: string[] = []
      for (const file of fileSelected) {
        try {
          const response = await uploadFile(file).unwrap()
          urls.push((response as unknown as { path: string }).path)
        } catch (e) {
          console.error("File upload failed:", e)
        }
      }

      if (urls.length > 0) {
        setUploadPaidReceipt({
          requestId: id ?? "",
          uploadFilePaths: urls,
        })
          .unwrap()
          .then(() => {
            toast({
              duration: 60000,
              variant: "default",
              title: "File Upload",
              description:
                "File uploaded successfully. Your request is sent for approval.",
            })
            navigate(`/dashboard/deposit-process/${id}`)
          })
          .catch((err: string) => {
            setErrorMessage(err)
          })
      }
    }
  }

  const [result, setResult] = useState<TransactionDetailResponse | null>(null)
  const [infoRows, setInfoRows] = useState<
    Array<{ name: string; label: string; value: string }>
  >([])
  const [updateAmount, setUpdateAmount] = useState<string>("")

  useEffect(() => {
    if (data) {
      setResult(data)

      setInfoRows(data?.instructionShared?.destinationAccountInformation)
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (result?.paymentRequestCreated?.amount)
      setUpdateAmount(result?.paymentRequestCreated.amount)
  }, [result])

  if (error) return <p>Error loading deposit details</p>

  const getHeaderColorStyle = (type?: string) => {
    switch (type) {
      case "DEFAULT":
        return "bg-[#222831]/5"
      case "SUCCESS":
        return "bg-[#008767]/10"
      case "FAILED":
        return "bg-[#e23a4a]/10"
      case "PENDING":
        return "bg-[#222831]/5"
      default:
        return "bg-[#222831]/5"
    }
  }

  function cancelRequestModal() {
    const reasonOptions = [
      "Incorrect Recipient Information",
      "Change Of Plans",
      "Security Concerns",
      "Technical Issues",
      "Unexpected Fees or Funds",
      "Delay in Processing",
      "Recipient Unavailability",
      "Regulatory or Compliance Issues",
    ].map((reason) => ({ value: reason, label: reason }))
    return (
      <div className="flex justify-end mt-6">
        <Dialog>
          <DialogTrigger>
            <Button variant="danger">Cancel Deposit Request</Button>
          </DialogTrigger>
          <DialogContent id="cancel-description" className="sm:max-w-lg">
            <div className="text-center text-[#141414] h4">Cancel Deposit</div>
            <div className="text-center text-[#141414] bodyS">
              You’re about to cancel your deposit request. Are you sure you want
              to cancel your request?
            </div>
            <hr className="border-neutral-200 w-full" />
            <Select
              isOnModal
              isCreatable
              options={reasonOptions}
              label="Reason for your cancellation"
              placeholder="Reason for your cancellation"
              value={
                cancelDescription?.length
                  ? { value: cancelDescription, label: cancelDescription }
                  : null
              }
              onChange={(e: SingleValue<OptionItem<null>>) => {
                setCancelDescription(e?.value as string)
              }}
            />
            <DialogFooter>
              <div className="flex items-center gap-2 justify-between w-full">
                <DialogClose asChild>
                  <Button type="submit" variant="outline" className="w-full">
                    Close pop-up
                  </Button>
                </DialogClose>
                <Button
                  disabled={
                    cancelAddMoneyRequestStatus.isLoading ||
                    !cancelDescription.length
                  }
                  loading={cancelAddMoneyRequestStatus.isLoading}
                  variant="destructive"
                  onClick={() => handleCancelAddMoney()}
                  className="bg-[#e23a4a] disabled:bg-[#e23a4a]/5 text-white flex gap-1 items-center w-full"
                >
                  Cancel Deposit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  function updateAmountRequestModal() {
    return (
      <div className="flex justify-end mt-6">
        <Dialog>
          <DialogTrigger>
            <Button variant="outline">
              <PiNotePencil size={16} className="mr-2" />
              Edit Deposit Amount
            </Button>
          </DialogTrigger>
          <DialogContent id="cancel-description" className="sm:max-w-lg">
            <div className="text-center text-[#141414] h4 mb-4">
              Edit Amount?
            </div>
            <div className="text-center text-[#141414] bodyS mb-2">
              You’re about to edit the amount of your deposit request. Please
              share the new amount with us here.
            </div>
            <hr className="border-neutral-200 w-full mb-4" />
            <Input
              value={
                updateAmount
                  ? Utilities.formatNumber(
                      updateAmount,
                      false,
                      result?.instructionType?.includes("CASH")
                    )
                  : ""
              }
              placeholder="New deposit amount"
              pre={<PiMoneyWavy size={20} />}
              postfix={
                <FormatNumberView
                  className="bodyS w-full max-w-fit"
                  currency={result?.paymentRequestCreated.currency}
                  withCountry
                  transactionType={result?.instructionType || undefined}
                />
              }
              onChange={(e) => {
                const val = Utilities.unFormatNumber(e.target.value)
                if (!isNaN(Number(val))) setUpdateAmount(val)
              }}
            />
            <DialogFooter>
              <div className="flex items-center gap-2 justify-between w-full mt-4">
                <DialogClose asChild>
                  <Button type="submit" variant="outline" className="w-full">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  disabled={
                    updateAmountAddMoneyRequestStatus.isLoading ||
                    updateAmount.length === 0 ||
                    Number(updateAmount) < 1
                  }
                  loading={updateAmountAddMoneyRequestStatus.isLoading}
                  variant="primary"
                  onClick={() => handleUpdateAmountAddMoney()}
                  className="w-full"
                >
                  Update Amount
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  function paymentRequestAccordionItem() {
    return (
      <AccordionItem value="item-1">
        <AccordionTrigger
          className={`w-full mt-4 ${getHeaderColorStyle(
            result?.paymentRequestCreated.status
          )} `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <PiClipboardTextDuotone size={20} />
              <div className="bodyS">1. Payment request created</div>
              {result?.paymentRequestCreated.status === "PENDING" && (
                <Badge
                  variant="secondary"
                  className="captionS rounded-full px-2 py-1 bg-[#ffb82e]/10 text-[#564100]"
                >
                  Pending
                </Badge>
              )}
              {result?.paymentRequestCreated.status === "SUCCESS" && (
                <PiCheckCircleFill size={20} className="text-green-700" />
              )}
            </div>
            <div className="text-[#a5a7a6] captionL">
              {Utilities.convertDateFormat(result?.requestDate.toString())}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="bodyS">
            You’ve successfully created a payment request to pay{" "}
            <FormatNumberView
              className="bodySB"
              currency={result?.paymentRequestCreated.currency}
              value={result?.paymentRequestCreated.amount}
            />{" "}
            via{" "}
            <strong>
              {Utilities.getTypeLabel(
                result?.instructionType as keyof typeof TypeLabel
              )}
              .
            </strong>{" "}
            Please proceed with the next steps to complete the deposit process
            and ensure the money is added to your account.
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }
  function instructionsSharedAccordionItem() {
    return (
      <AccordionItem value="item-2">
        <AccordionTrigger
          className={`w-full mt-4 ${getHeaderColorStyle(
            result?.instructionShared.status
          )} `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <PiListChecksDuotone size={20} />
              <div className="bodyS">2. Instructions shared</div>
              {result?.instructionShared.status === "PENDING" && (
                <Badge
                  variant="secondary"
                  className="captionS rounded-full px-2 py-1 bg-[#ffb82e]/10 text-[#564100]"
                >
                  {result?.instructionType == "CASH_PICKUP"
                    ? "Pending"
                    : "Needs your action"}
                </Badge>
              )}
              {result?.instructionShared.status === "SUCCESS" && (
                <PiCheckCircleFill size={20} className="text-green-700" />
              )}
            </div>
            <div className="text-[#a5a7a6] captionL">
              {Utilities.convertDateFormat(result?.InstructionDate?.toString())}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="bodyS">
            {infoRows?.length > 0 && (
              <div className="grid grid-cols-2 gap-8 mb-5">
                <div className="w-full">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-[#a5a7a6] bodySB">
                      Destination account information
                    </div>
                    <hr className="w-full border-neutral-200 flex-1" />
                  </div>
                  {infoRows
                    .filter((dr) => dr.value?.length)
                    .map((row, index) => (
                      <div
                        key={index}
                        className="flex items-center w-full max-w-full text-wrap"
                      >
                        <div className="flex-shrink-0 flex items-center justify-between my-2 w-full text-wrap max-w-[95%]">
                          <div className="flex-shrink-0 mr-4 text-[#141414] bodyS">
                            {row.label}
                          </div>
                          <div
                            className="text-[#4c4c4c] bodyS text-right text-wrap max-w-[60%]"
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {row.value}
                          </div>
                        </div>
                        <CopyComponent text={row.value} />
                      </div>
                    ))}
                </div>
                {result?.instructionShared.depositDetails !== null && (
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="text-[#a5a7a6] bodySB">
                        Deposit details
                      </div>
                      <hr className="w-full border-neutral-200 flex-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodyS">
                        You requested to deposit
                      </div>
                      <FormatNumberView
                        className="text-[#4c4c4c] bodyS"
                        currency={result?.paymentRequestCreated.currency}
                        value={result?.paymentRequestCreated.amount}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodyS">Total fees</div>
                      <FormatNumberView
                        className="text-[#4c4c4c] bodyS"
                        currency={
                          result?.instructionShared.depositDetails.currency
                        }
                        value={
                          result?.instructionShared.depositDetails.totalFees
                        }
                      />
                    </div>
                    <div className="border-dashed border-t-2 border-[#dee0e0] w-full" />
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodySB">
                        You will receive
                      </div>
                      <FormatNumberView
                        className="text-[#4c4c4c] bodyS"
                        currency={
                          result?.instructionShared.depositDetails.currency
                        }
                        value={
                          result?.instructionShared.depositDetails
                            .youRequestedToDeposit
                        }
                      />
                    </div>
                    <div className="border-dashed border-t-2 border-[#dee0e0] w-full" />
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodyS">Request ID</div>
                      <div className="text-[#4c4c4c] bodyS">
                        {result?.instructionShared.depositDetails.reference}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {result?.instructionType == "CASH_DELIVERY" && (
              <div className="inline-flex flex-col gap-2">
                <div className="text-[#4c4c4c] bodySB">Attention</div>
                <div className="text-[#141414] bodyS">
                  The person collecting the cash must bring a valid
                  government-issued ID and the reference number provided in the
                  instructions. These are required for verification and
                  processing at our office.
                </div>
              </div>
            )}
            {result?.instructionType == "CASH_PICKUP" && (
              <>
                <div className="inline-flex flex-col gap-2 mb-6">
                  <div className="text-[#4c4c4c] bodySB">Attention</div>
                  <div className="text-[#141414] bodyS">
                    Please wait while we contact you via WhatsApp. If you don’t
                    hear from us soon, feel free to message us with the pickup
                    time and location. An agent will then be assigned. The
                    receiver must have a valid ID and the transaction number to
                    complete the process.
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      className="bg-[#25d366] text-[#141414] hover:bg-[#25d366]/80"
                    >
                      Contact Via WhatsApp
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }
  function paymentUploadAccordionItem() {
    return (
      <AccordionItem value="item-3">
        <AccordionTrigger
          className={`w-full mt-4 ${getHeaderColorStyle(
            result?.paymentUpload.status
          )} `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <PiBoxArrowUpDuotone size={20} />
              <div className="bodyS">
                {result?.instructionType == "CASH_DELIVERY" ? (
                  <span>3. Cash delivery payment</span>
                ) : (
                  <span>3. Payment upload</span>
                )}
              </div>
              {result?.paymentUpload.status === "PENDING" && (
                <Badge
                  variant="secondary"
                  className="captionS rounded-full px-2 py-1 bg-[#ffb82e]/10 text-[#564100]"
                >
                  Needs your action
                </Badge>
              )}
              {result?.paymentUpload.status === "SUCCESS" && (
                <PiCheckCircleFill size={20} className="text-green-700" />
              )}
              {result?.paymentUpload.status === "FAILED" && (
                <PiWarningCircle size={20} className="text-red-600" />
              )}
            </div>
            <div className="text-[#a5a7a6] captionL">
              {Utilities.convertDateFormat(
                result?.PaidOrRejectDate?.toString()
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {(result?.paymentUpload.status == "FAILED" ||
            (result?.instructionShared.status === "FAILED" &&
              result?.instructionShared.errorMessage)) && (
            <div className="flex items-center gap-4 border-dashed border-2 p-3 bg-red-50 border-red-400 mb-4 rounded-lg">
              <PiWarningCircle size={20} className="text-red-500" />
              <div className="text-red-500 captionL">
                {result?.paymentUpload.status == "FAILED"
                  ? `This deposit has been rejected due to "${result?.paymentUpload.errorMessage}".`
                  : result?.instructionShared.errorMessage}
              </div>
            </div>
          )}
          {result?.instructionShared.status === "FAILED" &&
            result?.instructionShared.errorMessage && (
              <div className="flex items-center gap-4 border-dashed border-2 p-3 bg-red-50 border-red-400 mb-4 rounded-lg">
                <PiWarningCircle size={20} className="text-red-500" />
                <div className="text-red-500 captionL">
                  {result?.instructionShared.errorMessage}
                </div>
              </div>
            )}
          <div className="bodyS">
            <div className="my-4 flex w-full items-center gap-4">
              <div className="w-full flex flex-col relative">
                {result?.instructionType === "CASH_DELIVERY" ? (
                  <div className="text-[#141414] bodyS">
                    {result.paymentApproval.status == "FAILED" ? (
                      <>
                        It looks like this deposit has been cancelled! Please
                        check the next step for more information.
                      </>
                    ) : result.paymentApproval.status == "SUCCESS" ? (
                      <>
                        It seems like you’ve already done the payment. Please
                        check the next step.
                      </>
                    ) : (
                      <>
                        Please proceed with the cash delivery payment as per the
                        instruction shared in the step 2.
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between w-full items-center gap-5">
                    <div className="flex flex-col gap-2 w-full relative">
                      {result?.paymentUpload?.uploadUrls?.length > 0 ? (
                        <>
                          <div className="text-[#141414] bodyS mb-4">
                            Receipts are uploaded! At this stage you can only
                            view the uploaded files.
                          </div>
                          <DisplayUploadFiles
                            urls={result?.paymentUpload?.uploadUrls as string[]}
                          />
                        </>
                      ) : (
                        <>
                          <div className="text-[#141414] bodyS mb-4">
                            Select and upload your receipts. Once submitted, it
                            will be locked for review only.
                          </div>
                          <UploadFiles
                            onFileSelected={(files) => {
                              setFileSelected(files)
                            }}
                          />
                        </>
                      )}

                      <div className="flex items-center justify-end w-full">
                        <Button
                          disabled={
                            uploadFileStatus.isLoading ||
                            setUploadPaidReceiptStatus.isLoading ||
                            result?.paymentApproval.status === "FAILED" ||
                            result?.paymentUpload.status === "SUCCESS" ||
                            result?.paymentUpload.status === "DEFAULT" ||
                            !fileSelected ||
                            fileSelected.length == 0
                          }
                          loading={
                            uploadFileStatus.isLoading ||
                            setUploadPaidReceiptStatus.isLoading
                          }
                          variant="primary"
                          className="flex-shrink-0"
                          onClick={handleSubmitUpload}
                        >
                          Submit File
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="text-red-500 captionL">{errorMessage}</div>
          )}
        </AccordionContent>
      </AccordionItem>
    )
  }
  function paymentVerifiedAccordionItem() {
    return (
      <AccordionItem value="item-4">
        <AccordionTrigger
          className={`w-full mt-4 ${getHeaderColorStyle(
            result?.paymentApproval.status
          )} `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <PiChecksDuotone size={20} />
              <div className="bodyS">
                4. Payment verified & credited to account
              </div>
              {result?.paymentRequestCreated.status === "SUCCESS" &&
                result?.instructionShared.status === "SUCCESS" &&
                result?.paymentUpload.status === "SUCCESS" &&
                result?.paymentApproval.status === "PENDING" && (
                  <Badge
                    variant="secondary"
                    className="captionS rounded-full px-2 py-1 bg-[#ffb82e]/10 text-[#564100]"
                  >
                    Pending
                  </Badge>
                )}
              {result?.paymentApproval.status === "SUCCESS" && (
                <PiCheckCircleFill size={20} className="text-green-700" />
              )}
            </div>
            <div className="text-[#a5a7a6] captionL">
              {Utilities.convertDateFormat(
                result?.ApproveOrCancelDate?.toString()
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div
            className="bodyS"
            style={{
              opacity: result?.paymentUpload.status === "FAILED" ? 0.25 : 1,
            }}
          >
            <div className="flex flex-col">
              {result?.paymentApproval.errorMessage && (
                <div className="flex items-center gap-4 border-dashed border-2 p-3 bg-red-50 border-red-400 mb-4 rounded-lg">
                  <PiWarningCircle size={20} className="text-red-500" />
                  <div className="text-red-500 captionL">
                    {result?.paymentApproval.status == "FAILED"
                      ? result?.paymentApproval.errorMessage
                      : result?.paymentApproval.errorMessage}
                  </div>
                </div>
              )}

              {result?.paymentApproval.status != "SUCCESS" && (
                <div
                  className={`text-[#141414] bodyS ${
                    result?.paymentApproval.status == "FAILED"
                      ? "opacity-20 "
                      : ""
                  }`}
                >
                  Once your payment is sighted and verified, It usually takes
                  about 24 hours for payment approval and processing. You will
                  receive a notification and your balance will be updated
                  accordingly. If you have any questions or need any support,
                  feel free to reach out to us!
                </div>
              )}

              {result?.paymentApproval.status === "SUCCESS" && (
                <div className="text-[#141414] bodyS">
                  Your request with the transaction number{" "}
                  <strong>{result?.requestId}</strong> is approved &{" "}
                  <FormatNumberView
                    className="bodySB"
                    currency={result?.paymentRequestCreated.currency}
                    value={result?.paymentRequestCreated.amount}
                  />{" "}
                  is added to your balance successfully!
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }

  function closeAndUpdate() {
    return isLoading ? (
      ""
    ) : result?.paymentApproval.status !== "SUCCESS" ||
      result?.paymentUpload.status !== "SUCCESS" ? (
      <Button variant="link" onClick={() => navigate("/dashboard")}>
        {result?.paymentUpload.status === "SUCCESS" ||
        result?.paymentApproval.status === "FAILED"
          ? "Close"
          : "Close & Update Later"}
      </Button>
    ) : (
      ""
    )
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <PiArrowLeft size={32} />
              </Button>
              <div className="flex items-center gap-4">
                <div className="text-Content-black h4">Deposit Process</div>
                {result?.instructionType && (
                  <Badge
                    variant="secondary"
                    className="captionL rounded-full px-2 py-1"
                  >
                    {Utilities.getTypeLabel(
                      result.instructionType as keyof typeof TypeLabel
                    )}
                  </Badge>
                )}
              </div>
            </div>
            {!isLoading && result?.crmUrls?.[0]?.length ? (
              <a
                href={result.crmUrls?.[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">Download </Button>
              </a>
            ) : (
              closeAndUpdate()
            )}
          </div>

          <div className="text-Content-black bodyS">
            Follow these steps carefully to complete your deposit.
          </div>
        </div>
        {!result || isLoading ? (
          <div className="flex flex-col">
            <Skeleton className="w-full h-10 mt-4" />
            <Skeleton className="w-full h-10 mt-4" />
            <Skeleton className="w-full h-10 mt-4" />
            <Skeleton className="w-full h-10 mt-4" />
          </div>
        ) : (
          <>
            {/* <div id="Payment-request"> */}
            <Accordion
              type="single"
              collapsible
              defaultValue={
                result?.paymentRequestCreated.status === "PENDING" ||
                result?.paymentRequestCreated.status === "FAILED"
                  ? "item-1"
                  : result?.instructionShared.status === "PENDING" ||
                    result?.instructionShared.status === "FAILED"
                  ? "item-2"
                  : result?.paymentUpload.status === "PENDING" ||
                    result?.paymentUpload.status === "FAILED"
                  ? "item-3"
                  : "item-4"
              }
            >
              {paymentRequestAccordionItem()}
              {instructionsSharedAccordionItem()}
              {paymentUploadAccordionItem()}
              {paymentVerifiedAccordionItem()}
            </Accordion>
            {(result?.instructionShared.status === "PENDING" ||
              result?.paymentUpload.status === "PENDING") &&
              result?.paymentApproval.status != "SUCCESS" &&
              result?.paymentApproval.status != "FAILED" && (
                <div className="flex items-center gap-2 justify-end">
                  {updateAmountRequestModal()}
                  {cancelRequestModal()}
                </div>
              )}
          </>
        )}
      </div>
    </>
  )
}
