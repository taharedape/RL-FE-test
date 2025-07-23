import FormatNumberView from "@/components/common/FormatNumberView"
import Badge from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Utilities } from "@/lib/Utilities"
import {
  useCancelSendMoneyPaymentMutation,
  useGetExportSendMoneyDetailsMutation,
  useGetSendMoneyDetailsQuery,
} from "@/store/api/sendMoney"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  PiArrowLeft,
  PiCaretDown,
  PiCheckCircleFill,
  PiChecksDuotone,
  PiClipboardTextDuotone,
  PiCopySimple,
  PiListChecksDuotone,
  PiMapPinAreaDuotone,
  PiSealCheckDuotone,
  PiShareNetwork,
  PiWarningCircle,
} from "react-icons/pi"
import { useNavigate, useParams } from "react-router"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CopyComponent } from "@/components/tools/copy.component"
import UploadFiles from "../dashboard/components/UploadFiles"
import DisplayUploadFiles from "../dashboard/components/DisplayUploadFiles"
import Destination from "./components/Destination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { BeneficiaryType, TransferType } from "@/types/sendmoney"
import { JsonService } from "@/lib/JsonService"
import ApprovePaymentModal from "./components/ApprovePaymentModal"
import CancelTransferModal from "./components/CancelTransferModal"
import { useState } from "react"
import PaymentNotReceivedModal from "./components/PaymentNotReceivedModal"
import AmendModal from "./components/AmendModal"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { OptionItem } from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { transferTypeOptionsTooltipContents } from "./components/DetailsOfCharges"

export default function SendMoneyProcess() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isNotReceivedModalOpen, setNotReceivedModalOpen] = useState(false)
  const [isAmendModalOpen, setAmendModalOpen] = useState(false)

  const { data, isLoading } = useGetSendMoneyDetailsQuery(id || "")
  const [cancelSendMoneyPaymentRequest, cancelSendMoneyPaymentRequestStatus] =
    useCancelSendMoneyPaymentMutation()
  const [
    getExportSendMoneyDetailsRequest,
    getExportSendMoneyDetailsRequestStatus,
  ] = useGetExportSendMoneyDetailsMutation()

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

  function getDynamicFieldsData() {
    return (
      data?.PaymentSummery?.DestinationAccountInformation?.Fields?.filter(
        (a) => a.value
      ).map((f) => {
        const value =
          (f.FieldName === "BeneficiaryId"
            ? f.value
              ? f.value
              : data?.PaymentSummery?.DestinationAccountInformation?.Fields.find(
                  (df) => df.FieldName === "BeneficiaryFile"
                )?.value || ""
              ? null
              : (JsonService.parser(f.value).value as string)
            : f.value) || ""

        return { label: f.FieldLabel, value: value }
      }) || []
    )
  }

  const isCash = data?.PaymentRequestCreated.TransferType === TransferType.CASH
  const isStableCoin =
    data?.PaymentRequestCreated.TransferType === TransferType.STABLE_COIN
  const isCorporate =
    data?.PaymentRequestCreated.BeneficiaryType === BeneficiaryType.CORPORATE
  const isSwift =
    data?.PaymentRequestCreated.TransferType === TransferType.INTERNATIONAL &&
    !!data?.PaymentSummery?.DestinationAccountInformation?.Fields.findLast(
      (f) => f.FieldName === "SWIFT"
    )?.value

  const paymentMethodType = data?.PaymentSummery?.TransferDetails?.FeeType
  const infoRows = [
    {
      label: "Country",
      value: data?.PaymentSummery?.DestinationAccountInformation?.Country,
    },
    {
      label: "Currency",
      value: data?.PaymentSummery?.DestinationAccountInformation?.Currency,
    },
    {
      label: "Network",
      value: data?.PaymentSummery?.DestinationAccountInformation?.Network,
    },
    ...getDynamicFieldsData(),
  ]

  async function cancelRequest() {
    cancelSendMoneyPaymentRequest(id!)
      .unwrap()
      .then(() => {
        window.location.reload()
      })
      .catch((e) =>
        toast({
          duration: 10000,
          variant: "destructive",
          description: e?.data?.message || "Something went wrong",
        })
      )
  }

  async function downloadReceipt() {
    return getExportSendMoneyDetailsRequest(id!)
      .unwrap()
      .then((resp) => {
        const url = window.URL.createObjectURL(resp)
        const a = document.createElement("a")
        a.href = url
        a.download = "Download.pdf"
        a.click()
        window.URL.revokeObjectURL(url)
      })
      .catch((e) =>
        toast({
          duration: 10000,
          variant: "destructive",
          description: e?.data?.message || "Something went wrong",
        })
      )
  }

  function getViewPhoneNumber(val: string) {
    const phoneNumber = Utilities.getFormatPhoneNumber(val)
    return phoneNumber
      ? phoneNumber?.isValid()
        ? `+${phoneNumber?.countryCallingCode}-${phoneNumber?.nationalNumber}`
        : val
      : "Not Set"
  }

  function PaymentRequestCreatedAccordionItem() {
    return (
      <AccordionItem value="item-1">
        <AccordionTrigger
          className={`w-full mt-4 ${getHeaderColorStyle(
            data?.PaymentRequestCreated.Status
          )} `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <PiClipboardTextDuotone size={20} />
              <div className="bodyS">1. Payment request created</div>
              {data?.PaymentRequestCreated.Status === "PENDING" && (
                <Badge
                  variant="secondary"
                  className="captionS rounded-full px-2 py-1 bg-[#ffb82e]/10 text-[#564100]"
                >
                  In Progress
                </Badge>
              )}
              {data?.PaymentRequestCreated.Status === "SUCCESS" && (
                <PiCheckCircleFill size={20} className="text-green-700" />
              )}
            </div>
            <div className="text-[#a5a7a6] captionL">
              {Utilities.convertDateFormat(
                data?.PaymentRequestCreated.DateTime?.toString()
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="bodyS">
            You’re about to send{" "}
            <FormatNumberView
              className="bodySB"
              currency={data?.PaymentRequestCreated.Currency}
              value={data?.PaymentRequestCreated.Amount}
            />{" "}
            to{" "}
            <strong className="capitalize">
              {data?.PaymentRequestCreated.FullName}
            </strong>
            . Review the details carefully. You can track the transaction status
            anytime in the{" "}
            {isStableCoin ? `"Payment Summery"` : `"View Process"`} section
            under Transactions.
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  }
  function PaymentApprovalAccordionItem() {
    return (
      <AccordionItem value="item-2">
        <AccordionTrigger
          className={`w-full mt-4 ${getHeaderColorStyle(
            data?.PaymentApproval.Status
          )} `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <PiListChecksDuotone size={20} />
              <div className="bodyS">2. Payment approval</div>
              {data?.PaymentApproval.Status === "SUCCESS" ? (
                <PiCheckCircleFill size={20} className="text-green-700" />
              ) : (
                data?.PaymentApproval.Status === "PENDING" && (
                  <Badge
                    variant="secondary"
                    className="captionS rounded-full px-2 py-1 bg-[#ffb82e]/10 text-[#564100]"
                  >
                    Needs Your Action
                  </Badge>
                )
              )}
            </div>
            <div className="text-[#a5a7a6] captionL">
              {Utilities.convertDateFormat(
                data?.PaymentApproval?.DateTime?.toString()
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {data?.PaymentApproval.Status === "SUCCESS" && (
            <span className="bodyS text-[#141414]">
              The payment has been approved by you and, now that you have
              sufficient balance, it has been processed by us.{" "}
              <strong>Please proceed with Step 3.</strong>
            </span>
          )}
          {data?.PaymentApproval.Status === "PENDING" && (
            <Alert variant="warning">
              <AlertDescription>
                <PiWarningCircle size={20} />
                <span className="captionL shrink-0">
                  Your transaction has not been processed yet due to
                  insufficient funds.
                  <br />
                  <strong
                    className="LinkL cursor-pointer hover:underline"
                    onClick={() => navigate("/dashboard/deposit")}
                  >
                    Deposit Money Now
                  </strong>
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="danger"
                    size="sm"
                    loading={cancelSendMoneyPaymentRequestStatus.isLoading}
                    onClick={cancelRequest}
                  >
                    Cancel This Payment
                  </Button>
                  <ApprovePaymentModal
                    requestId={id!}
                    accountName={
                      data?.PaymentRequestCreated?.FullName as string
                    }
                    currency={data?.PaymentRequestCreated.Currency}
                    amount={data?.PaymentRequestCreated?.Amount as number}
                  />
                </div>
              </AlertDescription>
            </Alert>
          )}
          {data?.PaymentApproval.Status === "FAILED" && (
            <Alert variant="danger" className="mb-6">
              <AlertDescription>
                <div className="flex items-center w-full gap-2">
                  <PiWarningCircle size={20} />
                  <span className="captionL shrink-0">
                    This request has been marked as cancelled. Please check step
                    4.
                  </span>
                  <span className="ml-auto captionL">
                    {Utilities.convertDateFormat(
                      data?.PaymentSummery?.DateTime?.toString()
                    )}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </AccordionContent>
      </AccordionItem>
    )
  }
  function KYCVerificationAccordionItem() {
    const itemData = isCash
      ? data?.PickupLocationDetails
      : data?.KYCVerification
    return (
      <AccordionItem value="item-3">
        <AccordionTrigger
          className={`w-full mt-4 ${getHeaderColorStyle(itemData?.Status)} `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {isCash ? (
                <PiMapPinAreaDuotone size={20} />
              ) : (
                <PiSealCheckDuotone size={20} />
              )}
              <div className="bodyS">
                3. {isCash ? "Pickup location details" : "KYC Verification"}
              </div>
              {itemData?.Status === "SUCCESS" ? (
                <PiCheckCircleFill size={20} className="text-green-700" />
              ) : itemData?.Status === "PENDING" ? (
                <Badge
                  variant="secondary"
                  className="captionS rounded-full px-2 py-1 bg-[#ffb82e]/10 text-[#564100]"
                >
                  Pending
                </Badge>
              ) : (
                itemData?.Status === "FAILED" && (
                  <Badge
                    variant="destructive"
                    className="captionS rounded-full px-2 py-1"
                  >
                    KYC Failure
                  </Badge>
                )
              )}
            </div>
            <div className="text-[#a5a7a6] captionL">
              {Utilities.convertDateFormat(
                data?.KYCVerification?.DateTime?.toString()
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {!isCash && itemData?.Status === "FAILED" && (
            <Alert variant="danger">
              <AlertDescription>
                <PiWarningCircle size={20} />
                <span className="captionL shrink-0">
                  {isCorporate
                    ? `Your transfer couldn’t be completed due to a failed KYC verification. Fore more information you can contact us via Whatsapp.`
                    : `Your transfer couldn’t be completed due to a failed KYC verification.`}
                  <br />
                </span>
              </AlertDescription>
            </Alert>
          )}
          {isCash ? (
            <>
              <div className="bodySB mb-3 text-neutral-600">
                Please ask your beneficiary to visit our office as instructed in
                the guidelines shared below and collect the cash.
              </div>
              <Destination
                details={(data?.PickupLocationDetails?.PickupDetailItems || [])
                  ?.filter((i) =>
                    [
                      "Address",
                      "Attention",
                      "PaymentCode",
                      "PhoneNumber",
                      "Whatsapp",
                    ].includes(i.name)
                  )
                  .map((i) => ({
                    label: i.label,
                    value: ["PhoneNumber", "Whatsapp"].includes(i.name)
                      ? getViewPhoneNumber(i.value as string)
                      : i.value,
                  }))}
              />
              <div className="flex mt-3 captionL text-neutral-700 py-2 px-4">
                Attention:
                <strong className="ml-2">
                  Beneficiaries must show valid ID and Payment Unique Name to
                  collect
                </strong>
              </div>
            </>
          ) : isCorporate ? (
            data?.KYCVerification?.Status === "PENDING" ? (
              // * ------------ KYC Link share --------- *//
              <>
                <div className="bg-[#22283108] rounded-lg p-4 flex items-center justify-between my-6">
                  <span className="bodyS underline text-[#141414]">LINK</span>
                  <div className="ml-4 flex items-center gap-2 text-[#4C4C4C]">
                    <PiShareNetwork size={20} />
                    <CopyComponent text={"LINK"} />
                  </div>
                </div>
                <span className="bodyS text-[#141414] ">
                  Please share the verification link with the Beneficiary to
                  complete the KYC process. Once KYC is verified, the transfer
                  will be completed within 1–3 business days.
                </span>
              </>
            ) : (
              // * ------------ KYC Link Approved --------- */
              <>
                <div className="bg-[#22283108] rounded-lg p-4 flex items-center justify-between my-6 opacity-40">
                  <span className="bodyS underline text-[#141414]">LINK</span>
                  <div className="ml-4 flex items-center gap-2 text-[#4C4C4C]">
                    <PiShareNetwork size={20} />
                    <PiCopySimple size={20} />
                  </div>
                </div>
                <span className="bodyS text-[#141414] ">
                  Beneficiary’s verification has been successfully done!
                </span>
              </>
            )
          ) : data?.KYCVerification?.Status === "PENDING" ? (
            // * ------------ file Upload --------- */
            <div className="flex flex-col gap-2 w-full">
              <UploadFiles
                isSingle
                onFileSelected={(files) => {
                  console.debug("fff", files)
                  // setFileSelected(files)
                }}
              />
              <div className="flex items-center justify-end gap-4 w-full">
                <Button
                  disabled={
                    true
                    // uploadFileStatus.isLoading ||
                    // setUploadPaidReceiptStatus.isLoading ||
                    // result?.paymentApproval.status === "FAILED" ||
                    // result?.paymentUpload.status === "SUCCESS" ||
                    // result?.paymentUpload.status === "DEFAULT" ||
                    // !fileSelected ||
                    // fileSelected.length == 0
                  }
                  // loading={
                  //   uploadFileStatus.isLoading ||
                  //   setUploadPaidReceiptStatus.isLoading
                  // }
                  variant="primary"
                  className="flex-shrink-0"
                  // onClick={handleSubmitUpload}
                >
                  Submit File
                </Button>
              </div>
              <span className="bodyS text-[#141414] mt-6">
                We’re verifying the Beneficiary’s document. Once KYC is
                verified, the transfer will be completed within 1–3 business
                days.
              </span>
            </div>
          ) : (
            // * ------------ file Approved --------- */
            <>
              <div className="flex flex-col gap-2 w-full">
                <DisplayUploadFiles urls={["FileUrlLink.pdf"] as string[]} />
                <span className="bodyS text-[#141414] mt-6">
                  Beneficiary’s verification has been successfully done!
                </span>
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    )
  }
  function PaymentSummeryAccordionItem() {
    return (
      <AccordionItem value="item-4">
        <AccordionTrigger
          className={`w-full mt-4 ${getHeaderColorStyle(
            data?.PaymentSummery.Status
          )} `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <PiChecksDuotone size={20} />
              <div className="bodyS">
                {isStableCoin ? "2. " : "4. "}
                {isCash ? "Payment Collection" : "Payment Summery"}
              </div>
              {data?.PaymentSummery.Status === "SUCCESS" ? (
                <PiCheckCircleFill size={20} className="text-green-700" />
              ) : (
                data?.PaymentSummery.Status === "PENDING" && (
                  <Badge
                    variant="secondary"
                    className="captionS rounded-full px-2 py-1 bg-[#ffb82e]/10 text-[#564100]"
                  >
                    In Progress
                  </Badge>
                )
              )}
            </div>
            <div className="text-[#a5a7a6] captionL">
              {Utilities.convertDateFormat(
                data?.PaymentSummery?.DateTime?.toString()
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {isCash && data?.PaymentSummery.Status === "SUCCESS" ? (
            <div>
              You’re beneficiary has collected the money from our office at{" "}
              <strong>Tuesday, April 13th 2024, 15:21</strong>.
            </div>
          ) : (
            infoRows?.length > 0 && (
              <div className="grid grid-cols-2 gap-8 mb-5">
                <div className="w-full">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-[#a5a7a6] bodySB">
                      Destination Account Information
                    </div>
                    <hr className="w-full border-neutral-200 flex-1" />
                  </div>
                  {infoRows
                    .filter((dr) => dr.value?.length && dr.label !== "Files")
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
                            {row.label === "Phone Number"
                              ? getViewPhoneNumber(row.value || "")
                              : row.value}
                          </div>
                        </div>
                        <CopyComponent text={row.value!} />
                      </div>
                    ))}
                </div>
                {data?.PaymentSummery?.TransferDetails !== null && (
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <div className="text-[#a5a7a6] bodySB">
                        Transfer Details
                      </div>
                      <hr className="w-full border-neutral-200 flex-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodyS">
                        You Requested To Transfer
                      </div>
                      <FormatNumberView
                        className="text-[#4c4c4c] bodyS"
                        currency={data?.PaymentRequestCreated?.Currency}
                        value={data?.PaymentRequestCreated?.Amount}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodyS">
                        Transfer Fees{" "}
                        {isSwift && paymentMethodType && (
                          <Tooltip delayDuration={400}>
                            <TooltipTrigger>
                              <span className="captionL">
                                ({paymentMethodType})
                              </span>
                            </TooltipTrigger>
                            {transferTypeOptionsTooltipContents[
                              paymentMethodType
                            ]?.title.length > 0 && (
                              <TooltipContent
                                className="sticky z-50 captionS flex flex-col max-w-60"
                                align="start"
                              >
                                <strong>
                                  {
                                    transferTypeOptionsTooltipContents[
                                      paymentMethodType
                                    ]?.title
                                  }
                                </strong>
                                {
                                  transferTypeOptionsTooltipContents[
                                    paymentMethodType
                                  ]?.content
                                }
                              </TooltipContent>
                            )}
                          </Tooltip>
                        )}
                      </div>
                      {paymentMethodType === "BEN" ? (
                        <span className="max-w-40 text-right bodyS text-[#4c4c4c]">
                          Fees will apply to the beneficiary
                        </span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <FormatNumberView
                            className="text-[#4c4c4c] bodyS pr-1"
                            currency={data?.PaymentRequestCreated?.Currency}
                            value={
                              data?.PaymentSummery.TransferDetails.TotalFees
                            }
                          />
                          {paymentMethodType === "SHA" && (
                            <span className="max-w-32 text-right captionL text-[#A5A7A6]">
                              + Fees may apply to the beneficiary
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="border-dashed border-t-2 border-[#dee0e0] w-full" />
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodySB">
                        Beneficiary Will Get{" "}
                        {isSwift && paymentMethodType !== "OUR" && (
                          <span className="captionL text-[#4c4c4c]">
                            (Estimated)
                          </span>
                        )}
                      </div>
                      <div className="text-[#4c4c4c] bodySB">
                        <FormatNumberView
                          currency={data?.PaymentRequestCreated?.Currency}
                          value={data?.PaymentSummery.TransferDetails?.WillGet}
                        />
                      </div>
                    </div>
                    <div className="border-dashed border-t-2 border-[#dee0e0] w-full" />
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodyS">
                        {isStableCoin ? "Memo" : "Reference"}
                      </div>
                      <div className="text-[#4c4c4c] bodyS">
                        {data?.PaymentSummery.TransferDetails
                          .PaymentReference || "Not Set"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodyS">Request Id</div>
                      <div className="text-[#4c4c4c] bodyS">
                        {data?.PaymentSummery.TransferDetails.RequestId}
                      </div>
                    </div>
                    <div className="border-dashed border-t-2 border-[#dee0e0] w-full" />
                    <div className="flex items-center justify-between">
                      <div className="text-[#141414] bodyS">Payment Status</div>
                      <div className="text-[#4c4c4c] bodyS">
                        {data?.PaymentSummery.Status === "DEFAULT" ||
                        data?.PaymentSummery.Status === "PENDING" ||
                        data?.PaymentSummery.Status === "REJECTED" ? (
                          <Badge
                            variant="active"
                            className="rounded-full p-2 captionL gap-1 font-medium"
                          >
                            <PiWarningCircle size={16} />
                            {data?.PaymentSummery.Status === "REJECTED"
                              ? "Rejected"
                              : "Waiting Payment"}
                          </Badge>
                        ) : data?.PaymentSummery.Status === "FAILED" ? (
                          <Badge
                            variant="default"
                            className="text-[#E23A4A] bg-[#E23A4A14] rounded-full p-2 captionL gap-1 font-medium"
                          >
                            <PiCheckCircleFill size={16} />
                            Cancelled
                          </Badge>
                        ) : (
                          <Badge
                            variant="success"
                            className="rounded-full p-2 captionL gap-1 font-medium"
                          >
                            <PiCheckCircleFill size={16} />
                            Success
                            {data?.Amendment?.Requests?.some(
                              (r) => r.Status === "APPROVE"
                            ) && " - Amended"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {data?.PaymentSummery?.TransferDetails
                      ?.BankReceiptUrls?.[0] && (
                      <div className="flex items-center justify-between">
                        <div className="text-[#141414] bodyS">Bank Receipt</div>
                        <div className="text-[#4c4c4c] bodyS">
                          <a
                            href={
                              data?.PaymentSummery?.TransferDetails
                                ?.BankReceiptUrls?.[0]
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              Download Bank Receipt
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                    {isStableCoin &&
                      data?.PaymentSummery.Status === "SUCCESS" && (
                        <div className="flex items-center justify-between">
                          <div className="text-[#141414] bodyS">Hash ID</div>
                          <div className="text-[#4c4c4c] bodyS">
                            <a
                              href={
                                data?.PaymentSummery
                                  ?.DestinationAccountInformation
                                  .TrackingCode || "-"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </a>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )
          )}
          {/* ---------------- Amendment ---------------- */}
          {(data?.Amendment?.Requests || [])?.length > 0 &&
            data?.Amendment.Requests.map((a) => (
              <Alert
                key={a.Id}
                variant={
                  a.Status === "APPROVE"
                    ? "success"
                    : a.Status === "PENDING"
                    ? "warning"
                    : "danger"
                }
                className="mb-6"
              >
                <AlertDescription>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="linkS no-underline">
                        {a.Status === "APPROVE"
                          ? "New Amendment Request Applied"
                          : a.Status === "PENDING"
                          ? "New Amendment Request"
                          : "New Amendment Request Rejected"}
                      </span>
                      <span className="captionL">
                        {Utilities.convertDateFormat(a.RequestDate?.toString())}
                      </span>
                    </div>
                    <ol
                      type="1"
                      className="captionL list-decimal list-outside ml-3 capitalize"
                    >
                      {(
                        JsonService.parser(
                          a.Details || "[]"
                        ) as unknown as Array<OptionItem<undefined>>
                      )?.map((i) => (
                        <li
                          key={i.label as string}
                        >{`${i.label}: ${i.value}`}</li>
                      ))}
                    </ol>

                    {a.Status === "REJECT" && (
                      <span className="captionL mt-2 flex items-center gap-1">
                        <PiWarningCircle size={16} />
                        {`Your Amend request rejected due to "${a.Description}".`}
                      </span>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          {/* ---------------- Cancel/Reject ------------ */}
          {(!!data?.Cancelled?.CRMCancelReason?.length ||
            !!data?.Cancelled?.Requests?.length ||
            !!data?.Disputed?.Requests?.length ||
            !!data?.Rejected?.Requests?.filter((a) => a.Status !== "APPROVE")
              ?.length) && (
            <Alert
              variant={
                !!data?.Cancelled?.CRMCancelReason?.length ||
                data?.Cancelled?.Requests?.[0]?.Status === "APPROVE" ||
                data?.Cancelled?.Requests?.[0]?.Status === "REJECT"
                  ? "danger"
                  : "warning"
              }
              className="mb-6"
            >
              <AlertDescription>
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center w-full gap-2">
                    <PiWarningCircle size={20} />
                    <span className="captionL shrink-0">
                      {data?.Cancelled?.CRMCancelReason?.length
                        ? `This deposit has been cancelled due to "${data?.Cancelled?.CRMCancelReason}".`
                        : data?.Disputed?.Requests?.[0]?.ChangeType ===
                          "DISPUTE"
                        ? // NotReceived
                          `Your "Payment not received" inquiry is received. A member
                        of our team member will get back to you in 1-2 days.`
                        : data?.Cancelled?.Requests?.[0]?.ChangeType
                        ? // Cancel
                          data?.Cancelled?.Requests?.[0]?.Status === "APPROVE"
                          ? `This deposit has been cancelled at your request due to "${data?.Cancelled?.Requests?.[0]?.Reason}".`
                          : data?.Cancelled?.Requests?.[0]?.Status === "PENDING"
                          ? `Your cancellation request due to "${data?.Cancelled?.Requests?.[0]?.Reason}"
                         has been sent. Once approved, the request will be marked as cancelled.`
                          : `Your cancellation request has been rejected due to "${data?.Cancelled?.Requests?.[0]?.Description}"`
                        : // Reject
                          `This deposit has been rejected due to "${data?.Rejected?.Requests?.[0]?.Reason}". Contact
                    us if you need more information.`}
                    </span>
                    <span className="ml-auto captionL">
                      {Utilities.convertDateFormat(
                        data?.Cancelled?.Requests?.[0]?.RequestDate ||
                          data?.Rejected?.Requests?.[0]?.RequestDate ||
                          data?.Disputed?.Requests?.[0]?.RequestDate ||
                          data?.PaymentSummery?.DateTime?.toString()
                      )}
                    </span>
                  </div>
                  {!!data?.Rejected?.Requests?.filter(
                    (a) => a.Status !== "APPROVE"
                  )?.length && (
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto mt-2"
                    >
                      <Button variant="primary" size="sm" className="ml-auto">
                        Contact via Whatsapp
                      </Button>
                    </a>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </AccordionContent>
      </AccordionItem>
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
                <div className="text-Content-black h4">Send Money</div>
              </div>
            </div>
            {(!isStableCoin ||
              (isStableCoin && data?.PaymentSummery.Status === "SUCCESS")) && (
              <Button
                variant="outline"
                loading={getExportSendMoneyDetailsRequestStatus.isLoading}
                onClick={downloadReceipt}
              >
                Download File
              </Button>
            )}
          </div>
        </div>
        {!data || isLoading ? (
          <div className="flex flex-col">
            <Skeleton className="w-full h-10 mt-4" />
            <Skeleton className="w-full h-10 mt-4" />
            <Skeleton className="w-full h-10 mt-4" />
            <Skeleton className="w-full h-10 mt-4" />
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            defaultValue={
              isStableCoin
                ? "item-4"
                : ["PENDING", "FAILED"].includes(
                    data?.PaymentRequestCreated?.Status
                  )
                ? "item-1"
                : ["PENDING", "FAILED"].includes(data?.PaymentApproval?.Status)
                ? "item-2"
                : ["PENDING", "FAILED"].includes(
                    data?.KYCVerification?.Status
                  ) ||
                  (isCash &&
                    data?.PaymentSummery?.Status !== "SUCCESS" &&
                    !(
                      data?.Cancelled?.Requests?.length ||
                      data?.Disputed?.Requests?.length ||
                      data?.Rejected?.Requests?.length
                    ))
                ? "item-3"
                : "item-4"
            }
          >
            {PaymentRequestCreatedAccordionItem()}
            {!isStableCoin && PaymentApprovalAccordionItem()}
            {!isStableCoin && KYCVerificationAccordionItem()}
            {PaymentSummeryAccordionItem()}
          </Accordion>
        )}
        {!isLoading && data?.DisplayButtons?.isActionButton && (
          <div className="flex justify-end mt-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <Button variant="danger">
                  {isSwift && data?.IsSendMoneyNew
                    ? "Cancel/Amend"
                    : "Cancel request"}
                  <PiCaretDown size={20} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[13rem] z-[2500]">
                <DropdownMenuGroup className="captionL border-2 border-red-200 bg-white rounded-2xl my-2">
                  {data?.DisplayButtons.isAmend && (
                    <DropdownMenuItem
                      className="px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer z-[1000] rounded-t-2xl"
                      onClick={() => setAmendModalOpen(true)}
                    >
                      Amend Transfer
                    </DropdownMenuItem>
                  )}
                  {data?.DisplayButtons.isCancel && (
                    <DropdownMenuItem
                      className={cn(
                        "px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer z-[1000]",
                        !data?.DisplayButtons.isAmend && "rounded-t-2xl",
                        !data?.DisplayButtons.isDispute && "rounded-b-2xl"
                      )}
                      onClick={() => setIsCancelModalOpen(true)}
                    >
                      Cancel Transfer Request
                    </DropdownMenuItem>
                  )}
                  {data?.DisplayButtons.isDispute && (
                    <DropdownMenuItem
                      className="px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer z-[1000] rounded-b-2xl"
                      onClick={() => setNotReceivedModalOpen(true)}
                    >
                      Payment Not Received
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <CancelTransferModal
          isOpen={isCancelModalOpen}
          requestId={id!}
          setIsOpen={(val) => setIsCancelModalOpen(val)}
        />
        <PaymentNotReceivedModal
          isOpen={isNotReceivedModalOpen}
          requestId={id!}
          setIsOpen={(val) => setNotReceivedModalOpen(val)}
        />
        <AmendModal
          isOpen={isAmendModalOpen}
          requestId={id!}
          formValues={{
            AccountName: data?.PaymentRequestCreated?.FullName || "",
            AccountNumber:
              data?.PaymentSummery?.DestinationAccountInformation?.Fields?.findLast(
                (f) => f.FieldName === "AccountNumber"
              )?.value || "",
            RoutingNumber:
              data?.PaymentSummery?.DestinationAccountInformation?.Fields?.findLast(
                (f) => f.FieldName === "RoutingNumber"
              )?.value || "",
          }}
          setIsOpen={(val) => setAmendModalOpen(val)}
        />
      </div>
    </>
  )
}
