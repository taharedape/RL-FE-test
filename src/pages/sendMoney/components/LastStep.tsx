import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react"
import FadeIn from "react-fade-in"
import { transferTypeOptionsTooltipContents } from "./DetailsOfCharges"
import Badge from "@/components/ui/badge"
import FormatNumberView from "@/components/common/FormatNumberView"
import { IFormValues } from "./CreatePayment"
import {
  BeneficiaryType,
  SendMoneyInfoField,
  SendMoneyObjField,
  TransferType,
} from "@/types/sendmoney"
import { PiCheckCircleFill, PiWarningCircle } from "react-icons/pi"
import { Button } from "@/components/ui/button"
import { Utilities } from "@/lib/Utilities"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CountryCodeLabel } from "@/components/dynamics/DynamicPhoneNumber"

export function LastStep({
  visibility,
  formValues,
  transferType,
  dynamicFields,
  goToEdit,
}: {
  visibility: boolean
  formValues: IFormValues
  transferType: { type: TransferType | null; mode: BeneficiaryType | null }
  dynamicFields: SendMoneyInfoField[]
  goToEdit: () => void
}) {
  function item(
    field?: string | SendMoneyInfoField,
    value?: ReactNode | SendMoneyObjField | string | number | null
  ) {
    let content: ReactNode | string | number | null = null
    if ((field as SendMoneyInfoField)?.FieldName === "BeneficiaryId") {
      const beneficiaryId: string =
        (value as string) ||
        (formValues.dynamicFields?.["BeneficiaryFile"] as string) ||
        "-"

      content = beneficiaryId?.includes("http") ? (
        <a
          href={beneficiaryId}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          {Utilities.getFileNameFromFileUrl(beneficiaryId)}
        </a>
      ) : (
        beneficiaryId
      )
    } else if ((field as SendMoneyInfoField)?.FieldName === "PhoneNumber") {
      const phoneNumber = Utilities.getFormatPhoneNumber(value as string)
      content = phoneNumber ? (
        <div className="flex items-center gap-2">
          {CountryCodeLabel(
            phoneNumber?.countryCallingCode,
            phoneNumber?.country
          )}
          {phoneNumber?.nationalNumber}
        </div>
      ) : (
        "-"
      )
    } else
      content =
        value || value?.toString()
          ? (value as ReactNode | string | number)
          : "-"
    return (
      <FadeIn
        visible={visibility}
        delay={200}
        className={field === "Verification (Link Shared)" ? "col-span-2" : ""}
      >
        <div className="flex flex-col gap-1">
          <span className="captionL text-[#A5A7A6]">
            {(field as SendMoneyInfoField)?.FieldLabel || (field as string)}
          </span>
          <span className="bodyS font-semibold text-[#141414]">{content}</span>
        </div>
      </FadeIn>
    )
  }

  const isCorporate = transferType.mode === BeneficiaryType.CORPORATE
  const isStableCoin = transferType.type === TransferType.STABLE_COIN
  const isCash = transferType.type === TransferType.CASH
  const isDomestic = transferType.type === TransferType.DOMESTIC

  const accountName =
    formValues.isNew || isCorporate
      ? (formValues.dynamicFields.BeneficiaryName as string)
      : (formValues.account?.PaymentInformation[0].Currencies[0].PaymentMethods[0].Fields.find(
          (f) => f.FieldName === "BeneficiaryName"
        )?.value as string)

  const country =
    formValues.isNew || isCorporate
      ? formValues.country?.label
      : formValues.account?.PaymentInformation[0].CountryName

  const paymentMethod =
    formValues.isNew || isCorporate
      ? formValues.paymentMethod?.original
      : formValues.account?.PaymentInformation[0].Currencies[0]
          .PaymentMethods[0]
  const paymentMethodView = isCash ? (
    paymentMethod?.Name
  ) : (
    <>
      {paymentMethod?.Name}
      {" | "}
      <span className="buttonS">Arrives In {paymentMethod?.Arrival}</span>
    </>
  )

  const isSwift = (paymentMethod?.Name || "").includes("SWIFT")

  const paymentMethodType = isSwift ? formValues.paymentMethodType : ""

  const detailsOfChanges =
    isCash || isDomestic ? (
      formValues.currency?.label + " 0"
    ) : (
      <>
        {paymentMethodType === "BEN" ? (
          <span className="pr-1">Fees will apply to the beneficiary</span>
        ) : (
          <FormatNumberView
            className="pr-1"
            currency={(formValues?.currency?.label as string) || ""}
            value={paymentMethod?.Fees?.[transferType.mode!] || 0}
          />
        )}
        <Tooltip delayDuration={400}>
          <TooltipTrigger>
            <span className="buttonS">({paymentMethodType})</span>
          </TooltipTrigger>
          {transferTypeOptionsTooltipContents[paymentMethodType]?.title.length >
            0 && (
            <TooltipContent
              className="sticky z-50 captionS flex flex-col max-w-60"
              align="start"
            >
              <strong>
                {transferTypeOptionsTooltipContents[paymentMethodType]?.title}
              </strong>
              {transferTypeOptionsTooltipContents[paymentMethodType]?.content}
            </TooltipContent>
          )}
        </Tooltip>
      </>
    )

  const ValidationId = isCash ? null : formValues.validationOption ===
    "upload" ? (
    <a
      href={formValues.selectedFile!}
      target="_blank"
      rel="noreferrer"
      className="hover:underline"
    >
      {Utilities.getFileNameFromFileUrl(formValues.selectedFile || "")}
    </a>
  ) : (
    <div className="bg-[#FFB82E1F] rounded-lg p-4 bodyS text-[#755A00]">
      Once your request is submitted, a unique link will be generated for you to
      share with your beneficiary. They must use this link to complete their
      verification process.
    </div>
  )

  function checkCorporateInfo() {
    return formValues.corporate?.lastActionDate ? (
      <Alert variant="success">
        <AlertDescription>
          <PiWarningCircle size={20} className="shrink-0" />
          <span className="captionL">
            We found a match! You sent money to{" "}
            <strong className="capitalize">
              {(formValues.dynamicFields?.["BeneficiaryName"] as string) || "-"}
            </strong>
            . on{" "}
            <strong>
              {Utilities.convertDateFormat(
                formValues.corporate?.lastActionDate
              )}
            </strong>
            . Please review the scanned details and tap “Edit” if anything looks
            off.
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-black ml-auto shrink-0"
            onClick={goToEdit}
          >
            Edit Manual
          </Button>
        </AlertDescription>
      </Alert>
    ) : (
      <Alert variant="warning">
        <AlertDescription>
          <PiWarningCircle size={20} className="shrink-0" />
          <span className="captionL">
            Looks like you’re sending money to{" "}
            <strong className="capitalize">
              {(formValues.dynamicFields?.["BeneficiaryName"] as string) || "-"}
            </strong>
            . for the first time. Our AI may have made a mistake — please
            double-check the details. If you proceed, a new beneficiary will be
            created. Use “Edit” to make any corrections.
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-black ml-auto shrink-0"
            onClick={goToEdit}
          >
            Edit Manual
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 gap-y-4 p-1">
      {isCorporate && (
        <FadeIn visible={visibility} delay={100} className="col-span-2">
          {checkCorporateInfo()}
        </FadeIn>
      )}
      <FadeIn visible={visibility} delay={100} className="col-span-2">
        <div className="flex flex-col my-2">
          <div className="bodyL text-[#4C4C4C] flex gap-2">
            Payment Details
            {!(isCash || isStableCoin) &&
              (isCorporate ? (
                <Badge variant="active" className="!rounded-full">
                  <span className="captionL">Business</span>
                </Badge>
              ) : (
                <Badge className="bg-[#0062FF12] text-[#0062FF] !rounded-full">
                  <span className="captionL">Individual</span>
                </Badge>
              ))}
          </div>
          <hr className="border-[#DEE0E0] mt-2" />
        </div>
      </FadeIn>
      <FadeIn visible={visibility} delay={200} className="col-span-2">
        <div className="flex flex-col gap-1">
          <span className="bodyS text-[#4C4C4C]">Amount you send</span>
          <FormatNumberView
            className="bodyLB text-[#141414]"
            currency={formValues.currency?.label as string}
            transactionType={transferType.type}
            withCountry
            flagSize={20}
            value={formValues.amount}
          />
        </div>
      </FadeIn>
      {isStableCoin ? (
        <>
          <FadeIn visible={visibility} delay={200}>
            <div className="flex flex-col gap-1">
              <span className="captionL text-[#A5A7A6] flex items-center gap-2">
                Wallet address
                {formValues.selectedFile && (
                  <Badge variant="secondary" className="rounded-3xl">
                    <a
                      href={formValues.selectedFile}
                      target="_blank"
                      rel="noreferrer"
                      className="captionL hover:underline"
                    >
                      {Utilities.getFileNameFromFileUrl(
                        formValues.selectedFile
                      )}
                    </a>
                  </Badge>
                )}
              </span>
              <span className="flex gap-2 bodyS font-semibold text-[#141414] capitalize">
                {formValues.wallet}
              </span>
            </div>
          </FadeIn>
          {item("currency", formValues.currency?.label)}
          {item("network", formValues.network?.label)}
          {item("Memo", formValues.paymentReference)}
        </>
      ) : (
        <>
          <FadeIn visible={visibility} delay={200}>
            <div className="flex flex-col gap-1">
              <span className="captionL text-[#A5A7A6]">
                {isCash ? "Beneficiary name" : "Account name"}
              </span>
              <span className="flex gap-2 bodyS font-semibold text-[#141414] capitalize">
                {accountName || "-"}
                {isCash && !formValues.isNew && (
                  <Badge variant="success" className="!rounded-full py-1">
                    <PiCheckCircleFill size={16} className="mr-1" />
                    <span className="captionL">Verified</span>
                  </Badge>
                )}
              </span>
            </div>
          </FadeIn>
          {item(isCash ? "Pickup location" : "Country", country)}
          {item("Payment Method", paymentMethodView)}
          {!isCash && item("Details of charges", detailsOfChanges)}
          {!isCash &&
            !!Object.entries(formValues.dynamicFields).filter(
              (df) => df[0] !== "BeneficiaryFile"
            ).length && (
              <FadeIn
                visible={visibility}
                delay={100}
                className="col-span-2 mt-10"
              >
                <div className="flex flex-col my-2">
                  <div className="bodyL text-[#4C4C4C]">
                    Bank Account Details
                  </div>
                  <hr className="border-[#DEE0E0] mt-2" />
                </div>
              </FadeIn>
            )}
          {!!Object.entries(formValues.dynamicFields).filter(
            (df) => df[0] !== "BeneficiaryFile"
          ).length &&
            Object.entries(formValues.dynamicFields)
              .filter((df) => df[0] !== "BeneficiaryFile")
              .map((v) => (
                <div key={v[0]}>
                  {item(
                    dynamicFields.find((df) => df.FieldName == v[0])!,
                    v[1]
                  )}{" "}
                </div>
              ))}
          <FadeIn visible={visibility} delay={100} className="col-span-2 mt-10">
            <div className="flex flex-col my-2">
              <div className="bodyL text-[#4C4C4C]">Additional Information</div>
              <hr className="border-[#DEE0E0] mt-2" />
            </div>
          </FadeIn>
          {item("Reason for transfer", formValues.reasonForTransfer?.label)}
          {item("Payment Reference", formValues.paymentReference)}
          {isCorporate &&
            item(
              "Invoice upload",
              <a
                href={formValues.selectedFile!}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {Utilities.getFileNameFromFileUrl(formValues.selectedFile!)}
              </a>
            )}
          {isCash &&
            item(
              "Attention",
              "Beneficiaries must show valid ID and Unique Name to collect"
            )}
          {!isCash &&
            formValues.isNew &&
            item(
              formValues.validationOption === "upload"
                ? "Verification (ID uploaded)"
                : "Verification (Link Shared)",
              ValidationId
            )}
          {isCash && (
            <FadeIn
              visible={visibility}
              delay={200}
              className="col-span-2 mt-10"
            >
              <Alert variant="primary">
                <AlertDescription>
                  <PiWarningCircle size={20} className="shrink-0" />
                  <span className="captionL">
                    For this type of payment, you will create a transfer request
                    & we will provide you with the pickup address & additional
                    information.
                  </span>
                </AlertDescription>
              </Alert>
            </FadeIn>
          )}
        </>
      )}
    </div>
  )
}
