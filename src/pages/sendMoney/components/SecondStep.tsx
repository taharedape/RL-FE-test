import { Utilities } from "@/lib/Utilities"
import PaymentMethod from "@/components/dynamics/paymentMethod"
import FormatNumberView from "@/components/common/FormatNumberView"
import Badge from "@/components/ui/badge"
import DetailsOfCharges from "./DetailsOfCharges"
import FadeIn from "react-fade-in"
import { IFormOptions, IFormValues } from "./CreatePayment"
import Select, { OptionItem } from "@/components/ui/select"
import {
  PiCardholder,
  PiCoins,
  PiGlobe,
  PiHandCoins,
  PiHash,
  PiUser,
  PiWarningCircle,
  PiWarningCircleLight,
} from "react-icons/pi"
import {
  BeneficiaryType,
  SendMoneyInfoCurrencies,
  SendMoneyInfoField,
  SendMoneyObjField,
  SendMoneyInfoPaymentMethod,
  SendMoneyInfoRespItem,
  TransferType,
  FeeType,
} from "@/types/sendmoney"
import { Input } from "@/components/ui/input"
import DynamicTextField from "@/components/dynamics/DynamicTextField"
import { DynamicFieldTypes } from "@/types/dynamicFields"
import DynamicNumberField from "@/components/dynamics/DynamicNumberField"
import { useEffect, useState } from "react"
import AccountSelect from "@/components/dynamics/AccountSelect"
import UploadFiles from "@/pages/dashboard/components/UploadFiles"
import { useUploadFileMutation } from "@/store/api/walletAPI"
import DynamicPhoneNumber from "@/components/dynamics/DynamicPhoneNumber"
import DynamicIBeneficiaryField from "@/components/dynamics/DynamicIBeneficiaryField"
import DisplayUploadFiles from "@/pages/dashboard/components/DisplayUploadFiles"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import VerificationField from "@/components/dynamics/VerificationField"
import WalletAddressField from "@/components/dynamics/WalletAddressField"

export default function SecondStep({
  visibility,
  formValues,
  parentOptions,
  transferType,
  dynamicFields,
  isDetails,
  beneficiaryIdFile,
  setBeneficiaryIdFile,
  setFormValues,
  setParentOptions,
  setIsContinueDisabled,
  checkIsContinueDisabled,
  setDynamicFields,
}: {
  visibility: boolean
  formValues: IFormValues
  parentOptions: IFormOptions
  transferType: { type: TransferType | null; mode: BeneficiaryType | null }
  dynamicFields: SendMoneyInfoField[]
  isDetails?: boolean
  beneficiaryIdFile?: File
  setBeneficiaryIdFile: (File) => void
  setFormValues: (IFormValues) => void
  setParentOptions: (IFormOptions) => void
  setIsContinueDisabled: (boolean) => void
  checkIsContinueDisabled: () => void
  setDynamicFields: (SendMoneyInfoField) => void
}) {
  const [options, setOptions] = useState<IFormOptions>(parentOptions)
  const [uploadFile, uploadFileStatus] = useUploadFileMutation()

  const isStableCoin = transferType.type === TransferType.STABLE_COIN
  const isCash = transferType.type === TransferType.CASH
  const isCorporate = transferType.mode === BeneficiaryType.CORPORATE
  const isQuickTransfer = formValues.isQuickTransfer

  async function handleSubmitUpload(file?: File, wallet?: string) {
    // setFormValues({
    //   ...formValues,
    //   selectedFile:
    //     "https://remitlanddev.s3.us-east-2.amazonaws.com/remitland/16010115/1751112323327-f7y6u4-BeneficiaryID-2.jpg",
    //     "https://remitlanddev.s3.us-east-2.amazonaws.com/remitland/16010115/1751380925353-m4wkzr-Screenshot 2025-07-01 163851.jpg",
    // }) // just for test
    if (!file) {
      setBeneficiaryIdFile(undefined)
      return setFormValues({
        ...formValues,
        selectedFile: null,
        wallet: undefined,
        isWalletValidated: false,
        errors: { ...formValues.errors, wallet: false, validationOption: true },
      })
    }
    if (file.size !== beneficiaryIdFile?.size) {
      try {
        setIsContinueDisabled(true)
        const resp = await uploadFile(file).unwrap()
        setFormValues({
          ...formValues,
          selectedFile: (resp as unknown as { path: string }).path,
          wallet: wallet || undefined,
          isWalletValidated: false,
          errors: { ...formValues.errors, wallet: false },
        })
        setBeneficiaryIdFile(file)
      } catch (e) {
        console.error("File upload failed:", e)
      }
    }
  }

  useEffect(() => {
    setOptions(parentOptions)
  }, [parentOptions])

  useEffect(() => {
    checkIsContinueDisabled()
    setOptions(parentOptions)
  }, [])

  useEffect(() => {
    if (!formValues.country?.label || isStableCoin) return
    setParentOptions({
      ...options,
      currencies: formValues.country.original!.Currencies.map((c) => ({
        value: c.CurrencyId,
        label: c.CurrencyCode,
        original: c,
      })),
      key: options.key + 1,
    })
  }, [formValues.country?.label])

  useEffect(() => {
    if (!formValues.currency?.value || isDetails) return
    setParentOptions({
      ...options,
      key: options.key + 1,
      balance: formValues.currency?.original?.userBalance,
      paymentMethodOptions: isStableCoin
        ? undefined
        : formValues.currency?.original!.PaymentMethods?.map((a) => ({
            value: a.Id,
            label: a.Name,
            original: a,
          })),
      networks: isStableCoin
        ? formValues.currency?.original?.Network?.map((n) => ({
            label: n.Name,
            value: n.CurrencyCode,
          })) || ""
        : [],
    })
    checkIsContinueDisabled()
  }, [formValues.currency, formValues.currency?.value])

  useEffect(() => {
    if (isStableCoin) return
    if ((formValues.isQuickTransfer || !formValues.isNew) && isCash) return
    if (!formValues?.paymentMethod?.value) return setDynamicFields([])

    setDynamicFields([
      ...formValues.paymentMethod.original!.Fields.filter(
        (df) => df.FieldName && df.FieldName !== "Files"
      ),
    ])
  }, [formValues.paymentMethod, formValues.paymentMethod?.value])

  useEffect(() => {
    if (isStableCoin) return
    setFormValues({
      ...formValues,
      dynamicFields: formValues.paymentMethod
        ?.original!.Fields.filter((df) => df.FieldName !== "Files")
        .reduce(
          (obj, item) =>
            Object.assign(obj, {
              [item.FieldName!]:
                formValues.dynamicFields?.[item.FieldName!] || item.value,
            }),
          {}
        ),
      key: formValues.key + 1,
    })
  }, [dynamicFields?.length])

  useEffect(() => {
    checkIsContinueDisabled()
  }, [
    formValues.dynamicFields,
    formValues.amount,
    formValues.validationOption,
    formValues.selectedFile,
    formValues.reasonForTransfer,
  ])

  function getDynamicField(df: SendMoneyInfoField) {
    function onChangeValue(
      val: string | number | undefined | SendMoneyObjField,
      hasError: boolean
    ) {
      const fieldName =
        df.FieldName === "BeneficiaryId" &&
        (val as SendMoneyObjField)?.type === "file"
          ? "BeneficiaryFile"
          : df.FieldName!
      const value =
        df.FieldName === "BeneficiaryId"
          ? (val as SendMoneyObjField)?.value
          : val
      const additional =
        fieldName === "BeneficiaryFile"
          ? { BeneficiaryId: undefined }
          : df.FieldName === "BeneficiaryId"
          ? { BeneficiaryFile: undefined }
          : {}

      const cleanDynamicFieldValues = dynamicFields
        .map((df) => ({
          [df.FieldName!]: formValues.dynamicFields[df.FieldName!]
            ? formValues.dynamicFields[df.FieldName!]
            : df.DefaultValue || undefined,
        }))
        .reduce((obj, item) => Object.assign(obj, item), {})

      setFormValues({
        ...formValues,
        dynamicFields: {
          ...cleanDynamicFieldValues,
          [fieldName]: value,
          ...additional,
        },
        errors: { ...formValues.errors, [fieldName]: hasError },
      })
      checkIsContinueDisabled()
    }

    const defaultValue =
      df.FieldName === "BeneficiaryId"
        ? formValues?.dynamicFields?.["BeneficiaryFile"]
          ? {
              type: "file",
              value: formValues?.dynamicFields?.["BeneficiaryFile"],
            }
          : {
              type: "number",
              value: formValues?.dynamicFields?.["BeneficiaryId"],
            }
        : formValues?.dynamicFields?.[df.FieldName!] || df.value
    const key =
      formValues.key +
      "-" +
      df.FieldName +
      "-" +
      (isCash ? "" : formValues.paymentMethod?.value)
    return df.Type?.toLowerCase() === DynamicFieldTypes.TEXT ? (
      df.FieldName === "PhoneNumber" ? (
        <DynamicPhoneNumber
          key={key}
          defaultValue={defaultValue as string | undefined}
          disabled={isQuickTransfer || !!formValues.corporate?.lastActionDate}
          selectedCountry={formValues.country?.value as string}
          options={df}
          onChange={onChangeValue}
        />
      ) : df.FieldName === "BeneficiaryId" ? (
        <DynamicIBeneficiaryField
          key={key}
          defaultValue={defaultValue as SendMoneyObjField}
          options={df}
          selectedFile={beneficiaryIdFile}
          onFileSelected={(f) => setBeneficiaryIdFile(f)}
          onChange={onChangeValue}
        />
      ) : (
        <DynamicTextField
          key={key}
          defaultValue={defaultValue as string | undefined}
          disabled={isQuickTransfer || !!formValues.corporate?.lastActionDate}
          options={df}
          onChange={onChangeValue}
        />
      )
    ) : df.Type?.toLowerCase() === DynamicFieldTypes.NUMBER ? (
      <DynamicNumberField
        key={key}
        defaultValue={defaultValue as number | undefined}
        disabled={isQuickTransfer || !!formValues.corporate?.lastActionDate}
        options={df}
        onChange={onChangeValue}
      />
    ) : undefined
    // `${df.DisplayOrder} - ${df.FieldName} - ${df.Type}`
  }

  function onTypeChange(type: FeeType, fee: number) {
    formValues.isNew || isCorporate
      ? setFormValues({
          ...formValues,
          paymentMethodType: type,
          paymentMethod: {
            ...formValues.paymentMethod,
            original: {
              ...formValues.paymentMethod?.original,
              Fees: { [transferType.mode!]: fee },
            },
          },
        })
      : setFormValues({
          ...formValues,
          paymentMethodType: type,
          account: {
            ...formValues.account,
            PaymentInformation: [
              {
                ...formValues.account?.PaymentInformation[0],
                Currencies: [
                  {
                    ...formValues.account?.PaymentInformation[0].Currencies[0],
                    PaymentMethods: [
                      {
                        ...formValues.account?.PaymentInformation[0]
                          .Currencies[0].PaymentMethods[0],
                        Fees: { [transferType.mode!]: fee },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        })
  }

  function amountField() {
    const pre =
      isCash || isCorporate || isStableCoin || formValues.isNew ? (
        <PiHandCoins size={20} />
      ) : (
        <Badge
          variant="outline"
          className="bg-[#2228310F] !p-0.5 !pr-1 rounded-full"
        >
          <FormatNumberView
            className="text-[#141414] captionS"
            withCountry
            currency={
              formValues.account?.PaymentInformation[0].Currencies[0]
                .CurrencyCode
            }
          />
        </Badge>
      )

    const isAmountValid =
      isStableCoin &&
      (options.balance?.type === "DR" ||
        (options.balance?.balance || 0) < Number(formValues.amount))
    return (
      <div className={cn("flex flex-col gap-1", isStableCoin ?? "col-span-2")}>
        <Input
          value={
            formValues.amount
              ? Utilities.formatNumber(formValues.amount, false, isCash)
              : ""
          }
          type="text"
          label="Transfer Amount *"
          placeholder="Transfer Amount *"
          pre={pre}
          onChange={(e) => {
            const val = Utilities.unFormatNumber(e.target.value)
            if (!isNaN(Number(val)))
              setFormValues({
                ...formValues,
                amount: val,
                errors: formValues.errors?.amount
                  ? {
                      ...formValues.errors,
                      amount: !(Number(val || "") > 0 && val?.toString()),
                    }
                  : formValues.errors,
              })
          }}
          onBlur={() => {
            setFormValues({
              ...formValues,
              errors: {
                ...formValues.errors,
                amount: !(
                  Number(formValues.amount || "") > 0 &&
                  formValues.amount?.toString()
                ),
              },
            })
            checkIsContinueDisabled()
          }}
        />
        {formValues?.errors?.amount ? (
          <span className="flex gap-1 items-center captionS ml-4 mt-0.5 text-red-600">
            <PiWarningCircle size={12} />
            Amount is required!
          </span>
        ) : isAmountValid ? (
          <span className="flex gap-1 items-center captionS ml-4 mt-0.5 text-red-600">
            <PiWarningCircle size={12} />
            You do not have enough balance. Available balance:{" "}
            {options.balance?.currency}{" "}
            {options.balance?.type === "DR" ? "-" : "+"}
            {options.balance?.balanceFormatted}
          </span>
        ) : options.balance?.balanceFormatted ? (
          <span
            className={cn(
              "captionS flex gap-1 pl-3",
              options.balance.type === "DR" ? "" : "text-blue-500"
            )}
          >
            <PiWarningCircleLight size={12} />
            Available Balance:{" "}
            <strong>
              {options.balance?.currency}{" "}
              {options.balance?.type === "DR" ? "-" : "+"}
              {options.balance?.balanceFormatted}
            </strong>
          </span>
        ) : (
          <span className="captionS flex gap-1 pl-3">
            <PiWarningCircleLight size={12} />
            You don&apos;t have any balance for{" "}
            <strong>{formValues.currency?.label}</strong>
          </span>
        )}
      </div>
    )
  }

  function additionalDefaultSection() {
    return (
      <>
        {!isCash ? (
          <FadeIn visible={visibility} delay={100} className="col-span-2">
            <div className="flex flex-col my-2">
              <div className="bodyLB text-[#4C4C4C]">
                Additional Information
              </div>
              <hr className="border-[#DEE0E0] my-4" />
            </div>
          </FadeIn>
        ) : (
          <div className="col-span-2 h-0 -mt-4" />
        )}
        <FadeIn visible={visibility} delay={100} className="flex flex-col">
          <Select
            key={options.key}
            value={formValues.reasonForTransfer}
            options={options.ReasonForTransfer}
            label="Reason for transfer *"
            placeholder="Reason for transfer *"
            pre={<PiWarningCircle size={20} />}
            onChange={(e) => {
              const val = e as OptionItem<null>
              setFormValues({
                ...formValues,
                reasonForTransfer: { value: val.value, label: val.label },
                errors: formValues.errors?.reasonForTransfer
                  ? {
                      ...formValues.errors,
                      reasonForTransfer: !(val.value as string),
                    }
                  : formValues.errors,
              })
            }}
            onBlur={() => {
              setFormValues({
                ...formValues,
                errors: {
                  ...formValues.errors,
                  reasonForTransfer: !(
                    formValues.reasonForTransfer?.value as string
                  )?.length,
                },
              })
              checkIsContinueDisabled()
            }}
          />
          {formValues?.errors?.reasonForTransfer && (
            <span className="flex gap-1 items-center captionS ml-4 mt-0.5 text-red-600">
              <PiWarningCircle size={12} />
              Reason for transfer is required!
            </span>
          )}
        </FadeIn>
        <FadeIn visible={visibility} delay={200}>
          <Input
            value={formValues.paymentReference}
            label="Payment Reference"
            placeholder="Payment Reference"
            className="w-full"
            pre={<PiHash size={20} />}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                paymentReference: e.target.value,
              })
            }
          />
        </FadeIn>
      </>
    )
  }

  return formValues.isNew || isCorporate || isStableCoin ? (
    <div className="grid grid-cols-2 gap-3 gap-y-4 p-1">
      {isStableCoin && (
        <FadeIn visible={visibility} delay={200} className="col-span-2 mt-2">
          <WalletAddressField
            formValues={formValues}
            currentFile={beneficiaryIdFile}
            validationError={
              formValues.errors?.wallet
                ? "Wallet Address is not valid!"
                : undefined
            }
            isLoading={uploadFileStatus.isLoading}
            setFormValues={setFormValues}
            handleSubmitUpload={handleSubmitUpload}
            checkIsContinueDisabled={checkIsContinueDisabled}
          />
        </FadeIn>
      )}
      {!isDetails && (
        <>
          {!isCash && !isStableCoin && (
            <FadeIn visible={visibility} delay={100} className="col-span-2">
              <div className="bodyLB text-[#4C4C4C]">Beneficiary</div>
              <hr className="border-[#DEE0E0] my-4" />
            </FadeIn>
          )}
          {!isCash && isCorporate && !isDetails && (
            <FadeIn
              visible={visibility}
              delay={500}
              className="col-span-2 mt-3"
            >
              {isQuickTransfer ? (
                <DisplayUploadFiles
                  urls={[formValues.selectedFile] as string[]}
                />
              ) : (
                <>
                  <div className="captionL text-[#4C4C4C] mb-3">
                    Please upload your receipt in the field below. Our AI
                    scanner will extract the information from your receipt and
                    fill it in for you.
                  </div>
                  <UploadFiles
                    value={beneficiaryIdFile}
                    isSingle
                    isLoading={uploadFileStatus.isLoading}
                    onFileSelected={(files) => {
                      handleSubmitUpload(files[0])
                    }}
                  />
                </>
              )}
            </FadeIn>
          )}
          {!isStableCoin && (
            <FadeIn visible={visibility} delay={200}>
              <Select
                key={formValues.key + "-" + options.key}
                value={formValues.country}
                options={options.countries}
                placeholder={isCash ? "Pickup Location *" : "Country *"}
                label={isCash ? "Pickup Location *" : "Country *"}
                pre={<PiGlobe size={20} />}
                onChange={(e) => {
                  setFormValues({
                    ...formValues,
                    country: e as OptionItem<SendMoneyInfoRespItem>,
                    currency: undefined,
                    paymentMethod: undefined,
                    dynamicFields: {},
                    key: formValues.key + 1,
                  })
                  setDynamicFields([])
                }}
              />
            </FadeIn>
          )}
          <FadeIn visible={visibility} delay={200}>
            <div key={formValues.key + "-" + options.key} className="pb-4">
              <Select
                key={formValues.key + "-" + options.key}
                value={formValues.currency}
                options={options.currencies}
                placeholder="Currency *"
                label="Currency *"
                pre={<PiCoins size={20} />}
                isDisabled={!formValues.country?.value && !isStableCoin}
                onChange={(e: OptionItem<SendMoneyInfoCurrencies>) => {
                  const paymentMethod = isCash
                    ? e?.original!.PaymentMethods[0]
                    : undefined
                  setFormValues({
                    ...formValues,
                    currency: e,
                    dynamicFields: {},
                    paymentMethod: isCash
                      ? {
                          value: paymentMethod!.Id,
                          label: paymentMethod!.Name,
                          original: paymentMethod,
                        }
                      : undefined,
                    network: undefined,
                    amount: undefined,
                    key: formValues.key + 1,
                  })
                  setDynamicFields([])
                }}
              />
            </div>
          </FadeIn>
          {isStableCoin && (
            <FadeIn visible={visibility} delay={200}>
              <div key={formValues.key + "-" + options.key} className="pb-4">
                <Select
                  key={formValues.key + "-" + options.key}
                  value={formValues.network}
                  options={options.networks}
                  placeholder="Network *"
                  label="Network *"
                  pre={<PiGlobe size={20} />}
                  isDisabled={!formValues.currency?.value}
                  onChange={(e: OptionItem<undefined>) =>
                    setFormValues({
                      ...formValues,
                      network: e,
                      amount: undefined,
                      key: formValues.key + 1,
                    })
                  }
                />
              </div>
            </FadeIn>
          )}
          {!isCash && !isStableCoin && (
            <FadeIn visible={visibility} delay={300}>
              <div
                key={formValues.key + "-" + options.key}
                className="col-span-2 flex flex-col"
              >
                <PaymentMethod
                  key={formValues.key + "-" + options.key}
                  value={formValues.paymentMethod}
                  options={options.paymentMethodOptions}
                  receiversType={transferType.mode as string}
                  placeholder="Transfer Method *"
                  label="Transfer Method *"
                  pre={<PiCardholder size={20} />}
                  isDisabled={!formValues.currency?.value}
                  onChange={(e) => {
                    setFormValues({
                      ...formValues,
                      dynamicFields: {},
                      paymentMethod:
                        e as OptionItem<SendMoneyInfoPaymentMethod>,
                      amount: undefined,
                      key: formValues.key + 1,
                    })
                    setDynamicFields([])
                  }}
                />
              </div>
            </FadeIn>
          )}
        </>
      )}
      <FadeIn
        visible={visibility}
        className={isStableCoin || isDetails ? "col-span-2" : ""}
        delay={400}
      >
        {amountField()}
      </FadeIn>
      {((!isCash && formValues.paymentMethod?.value) || isStableCoin) && (
        <FadeIn visible={visibility} delay={100} className="col-span-2">
          <DetailsOfCharges
            formValues={formValues}
            transferType={transferType}
            onTypeChange={onTypeChange}
          />
        </FadeIn>
      )}
      {(isCash || formValues.paymentMethod?.value) && (
        <>
          {!isCash && (!isCorporate || isDetails) && (
            <FadeIn visible={visibility} delay={200} className="col-span-2">
              <div className="flex flex-col my-2">
                <div className="bodyLB text-[#4C4C4C]">
                  {isDetails ? "Payment & Account Details" : "Account Details"}
                </div>
                <hr className="border-[#DEE0E0] my-4" />
              </div>
            </FadeIn>
          )}
          {(!isCorporate || isDetails) && (
            <>
              <div className="col-span-2 h-0 -mt-4" />
              {dynamicFields
                .filter((df) => df.FieldName !== "BeneficiaryFile")
                .sort((a, b) => a.DisplayOrder! - b.DisplayOrder!)
                .map((f, i) => (
                  <FadeIn
                    key={i}
                    visible={visibility}
                    delay={(i + 2) * 100}
                    className={
                      f.FieldName === "BeneficiaryId" ? "col-span-2" : ""
                    }
                  >
                    {getDynamicField(f)}
                  </FadeIn>
                ))}
            </>
          )}
          {(!isCorporate || isDetails) &&
            !!formValues.paymentMethod?.value &&
            additionalDefaultSection()}
          {!isCash && !isCorporate && (
            <VerificationField
              visibility={visibility}
              formValues={formValues}
              beneficiaryIdFile={beneficiaryIdFile}
              isDetails={isDetails}
              setFormValues={setFormValues}
              isLoading={uploadFileStatus.isLoading}
              handleSubmitUpload={(file?) => handleSubmitUpload(file)}
            />
          )}
          {isCash && !!formValues.paymentMethod?.value && (
            <FadeIn
              visible={visibility}
              delay={300}
              className="col-span-2 mt-3"
            >
              <div className="captionL text-[#4C4C4C]">
                Attention:{" "}
                <strong>
                  Beneficiaries must show valid ID and Unique Name to collect
                </strong>
              </div>
            </FadeIn>
          )}
          {isCorporate && !isDetails && (
            <FadeIn
              visible={visibility}
              delay={400}
              className="col-span-2 mt-3"
            >
              <Alert variant="primary">
                <AlertDescription>
                  <PiWarningCircle size={20} className="shrink-0" />
                  <span className="captionL">
                    Please note that there might be occasional errors during the
                    scanning process. In the next step, carefully review all the
                    information and make any necessary corrections before
                    proceeding.
                  </span>
                </AlertDescription>
              </Alert>
            </FadeIn>
          )}
        </>
      )}
      {isStableCoin && (
        <FadeIn visible={visibility} delay={200} className="col-span-2 mt-2">
          <Input
            value={formValues.paymentReference}
            label="Memo"
            placeholder="Memo"
            className="w-full"
            pre={<PiHash size={20} />}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                paymentReference: e.target.value,
              })
            }
          />
        </FadeIn>
      )}
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-3 gap-y-4 p-1">
      <FadeIn visible={visibility} delay={100} className="col-span-2">
        <div className="bodyLB text-[#4C4C4C]">Beneficiary</div>
        <hr className="border-[#DEE0E0] my-4" />
      </FadeIn>
      <FadeIn visible={visibility} delay={200} className="col-span-2">
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
          isDisabled
          pre={<PiUser size={20} />}
        />
      </FadeIn>
      <FadeIn visible={visibility} delay={300} className="col-span-2">
        {amountField()}
      </FadeIn>
      {!isCash && (
        <FadeIn visible={visibility} delay={400} className="col-span-2">
          <DetailsOfCharges
            formValues={formValues}
            transferType={transferType}
            onTypeChange={onTypeChange}
          />
        </FadeIn>
      )}
      {additionalDefaultSection()}
    </div>
  )
}
