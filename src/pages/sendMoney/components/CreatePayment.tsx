import { Button } from "@/components/ui/button"
import { OptionItem } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { PiCaretLeft, PiCircleNotch } from "react-icons/pi"
import {
  BeneficiariesAccount,
  BeneficiaryType,
  FeeType,
  SendMoneyInfoCurrencies,
  SendMoneyInfoField,
  SendMoneyObjField,
  SendMoneyInfoPaymentMethod,
  SendMoneyInfoRespItem,
  TransferType,
  IGetBeneficiaries,
  SendMoneyInfoUserBalance,
} from "@/types/sendmoney"
import {
  useBusinessReceiverAIValidatorMutation,
  useCreateSendMoneyMutation,
  useGetNewSendMoneySetupMutation,
  useValidateStableCoinAddressMutation,
} from "@/store/api/sendMoney.ts"
import ConfirmTransferModal from "./ConfirmTransferModal"
import ConfirmFileModal from "./ConfirmFileModal"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast.ts"
import { Skeleton } from "@/components/ui/skeleton"
import SecondStep from "./SecondStep"
import { LastStep } from "./LastStep"
import FirstStep from "./FirstStep"
import FadeIn from "react-fade-in"
import CancelEditModal from "./CancelEditModal"

export interface IFormValues {
  key: number
  country?: OptionItem<SendMoneyInfoRespItem>
  currency?: OptionItem<SendMoneyInfoCurrencies>
  amount?: number | string | null
  wallet?: string
  isWalletValidated?: boolean
  paymentMethod?: OptionItem<SendMoneyInfoPaymentMethod>
  paymentMethodType: string
  dynamicFields: {
    [key: string]: string | number | SendMoneyObjField | null | undefined
  }
  network?: OptionItem<undefined>
  errors?: { [key: string]: boolean }
  reasonForTransfer?: OptionItem<null>
  paymentReference?: string
  account?: BeneficiariesAccount
  isNew?: boolean
  isQuickTransfer?: boolean
  validationOption?: string
  selectedFile?: string | null
  corporate?: {
    isMatch: boolean
    id?: number
    beneficiaryId?: number
    lastActionDate?: string
  }
}
export interface IFormOptions {
  key: number
  ReasonForTransfer: Array<OptionItem<null>>
  countries: Array<OptionItem<SendMoneyInfoRespItem>>
  currencies: Array<OptionItem<SendMoneyInfoCurrencies>>
  networks: Array<OptionItem<undefined>>
  balance: SendMoneyInfoUserBalance | null
  paymentMethodOptions: Array<OptionItem<SendMoneyInfoPaymentMethod>>
  transferFee: string | null
  recipientGets: number | null
}

export default function CreatePayment({
  transferType,
  selectedQuickTransfer,
  back,
  setParentStep,
}: {
  transferType: { type: TransferType | null; mode: BeneficiaryType | null }
  selectedQuickTransfer?: IGetBeneficiaries | null
  back: () => void
  setParentStep: (val: number) => void
}) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [step, setStep] = useState(0)
  const [visibility, setVisibility] = useState(true)
  const [isContinueDisabled, setIsContinueDisabled] = useState(true)
  const [openConfirmFile, setOpenConfirmFile] = useState(false)
  const [dynamicFields, setDynamicFields] = useState<Array<SendMoneyInfoField>>(
    []
  )
  const [beneficiaryIdFile, setBeneficiaryIdFile] = useState<File | undefined>()
  const [formValuesImage, setFormValuesImage] = useState<string>()
  const [formValues, setFormValues] = useState<IFormValues>({
    key: 0,
    paymentMethodType: "",
    dynamicFields: {},
    isQuickTransfer: false,
  })
  const [options, setOptions] = useState<IFormOptions>({
    key: 0,
    ReasonForTransfer: [],
    countries: [],
    currencies: [],
    networks: [],
    balance: null,
    paymentMethodOptions: [],
    transferFee: null,
    recipientGets: null,
  })

  const isStableCoin = transferType.type === TransferType.STABLE_COIN
  const isCash = transferType.type === TransferType.CASH
  const isCorporate = transferType.mode === BeneficiaryType.CORPORATE
  const isDetails = step === 1 && isCorporate

  const [createSendMoneyRequest, createSendMoneyRequestStatus] =
    useCreateSendMoneyMutation()
  const [sendNewMoneySetupRequest, sendNewMoneySetupRequestStatus] =
    useGetNewSendMoneySetupMutation()
  const [
    businessReceiverAIValidatorRequest,
    businessReceiverAIValidatorRequestStatus,
  ] = useBusinessReceiverAIValidatorMutation()
  const [
    validateStableCoinAddressRequest,
    validateStableCoinAddressRequestStatus,
  ] = useValidateStableCoinAddressMutation()

  useEffect(() => {
    if (!selectedQuickTransfer?.Beneficiaries?.[0]?.Id) return
    setQuickTransfer()
  }, [selectedQuickTransfer])

  useEffect(() => {
    if (!isCorporate || selectedQuickTransfer?.Beneficiaries?.[0]?.Id) return
    setVisibility(false)
    getSendMoneyPaymentInfo()
  }, [isCorporate])

  useEffect(() => {
    if (isStableCoin) getSendMoneyPaymentInfo(true)
  }, [isStableCoin])

  useEffect(() => {
    if (formValues.account?.Id)
      setFormValuesForExistBeneficiary(
        formValues.account!.PaymentInformation[0],
        formValues.corporate
      )
  }, [formValues.account?.Id])

  async function setQuickTransfer() {
    if (!selectedQuickTransfer?.Beneficiaries[0]?.Id) return
    const Beneficiary = selectedQuickTransfer?.Beneficiaries[0]
    const PaymentInformation = Beneficiary?.PaymentInformation[0]
    const selectedFile = isCorporate
      ? PaymentInformation.Currencies[0].PaymentMethods[0].Fields.findLast(
          (df) => df.FieldName === "Files"
        )?.value
      : null

    setVisibility(false)

    await setFormValuesForExistBeneficiary(
      PaymentInformation,
      {
        isMatch: true,
        id: PaymentInformation.AccountId,
        beneficiaryId: Beneficiary.Id,
        lastActionDate: Beneficiary.LastDate,
      },
      Beneficiary.ReasonForTransferValue,
      {
        isQuickTransfer: true,
        account: Beneficiary,
        key: formValues.key + 1,
        selectedFile: selectedFile,
        paymentReference: Beneficiary.PaymentReference,
      } as IFormValues
    )
    setOptions({
      ...options,
      ReasonForTransfer: selectedQuickTransfer!.ReasonForTransfer!,
      countries: isCash
        ? selectedQuickTransfer?.PaymentInformation.map((s) => ({
            value: s.CountryCode,
            label: s.CountryName,
            original: s,
          }))
        : [],
      currencies: isCash
        ? selectedQuickTransfer?.PaymentInformation?.[0]?.Currencies.map(
            (c) => ({ value: c.CurrencyId, label: c.CurrencyCode, original: c })
          )
        : [],
      key: options.key + 1,
    })

    if (!isCorporate) changeStep(step + 1)
    else setVisibility(true)
  }

  useEffect(() => {
    checkDataValidation()
  }, [step])

  function checkDataValidation() {
    const requiredDynamicFieldValidation = dynamicFields
      .filter(
        (df) =>
          (df.IsRequired || df.FieldName === "BeneficiaryId") && df.FieldName
      )
      .map((df) => df.FieldName)
      .map((dfk) => {
        const field = formValues.dynamicFields?.[dfk!]
        return dfk === "BeneficiaryId"
          ? !!(field as string)?.length ||
              !!(formValues.dynamicFields?.["BeneficiaryFile"] as string)
                ?.length
          : typeof field === "string" || typeof field === "number"
          ? (!!(field as number) || !!(field as string)?.length) &&
            !formValues.errors?.[dfk!]
          : false
      })
      .every((a) => a)

    const defaultFields =
      !!formValues.country?.value &&
      !!formValues.currency?.value &&
      !!formValues.paymentMethod?.value &&
      Number(formValues?.amount || "") > 0

    const AIValidator =
      !isDetails ||
      (!!formValues.reasonForTransfer && requiredDynamicFieldValidation)

    const isValidationIdFieldValid =
      (formValues.validationOption?.length &&
        formValues.validationOption !== "upload") ||
      !!formValues.selectedFile

    const isAmountValid =
      !isStableCoin ||
      (options.balance?.type !== "DR" &&
        (options.balance?.balance || 0) >= Number(formValues.amount))

    const isValid = isCash
      ? defaultFields &&
        !!formValues.reasonForTransfer &&
        requiredDynamicFieldValidation
      : formValues.isNew
      ? isStableCoin
        ? !!formValues.currency?.value &&
          !!formValues.network?.value &&
          !!formValues.wallet &&
          Number(formValues?.amount || "") > 0 &&
          isAmountValid
        : defaultFields &&
          !!formValues.reasonForTransfer &&
          isValidationIdFieldValid &&
          requiredDynamicFieldValidation
      : isCorporate
      ? defaultFields && !!formValues.selectedFile && AIValidator
      : !!formValues.account?.Id &&
        Number(formValues?.amount || "") > 0 &&
        !!formValues.reasonForTransfer &&
        requiredDynamicFieldValidation

    setIsContinueDisabled(!isValid)

    return isValid
  }

  async function getSendMoneyPaymentInfo(isNew?: boolean) {
    sendNewMoneySetupRequest(transferType)
      .unwrap()
      .then((resp) => {
        if (resp) {
          const countries = isStableCoin
            ? []
            : resp.PaymentInformation.map((s) => ({
                value: s.CountryCode,
                label: s.CountryName,
                original: s,
              }))
          const currencies = isStableCoin
            ? resp.PaymentInformation?.[0]?.Currencies.map((c) => ({
                value: c.CurrencyId,
                label: c.CurrencyName,
                original: c,
              }))
            : []
          setOptions({
            ...options,
            key: options.key + 1,
            ReasonForTransfer: resp.ReasonForTransfer,
            countries: countries,
            currencies: currencies,
            networks: [],
          })
        }
        setFormValues({
          account: undefined,
          country: undefined,
          currency: undefined,
          amount: undefined,
          paymentMethod: undefined,
          paymentMethodType: "",
          reasonForTransfer: undefined,
          paymentReference: undefined,
          network: undefined,
          dynamicFields: {},
          key: 1,
          isNew: isNew || false,
        })
        setIsContinueDisabled(true)
      })
      .finally(() => {
        if (isNew) return
        setTimeout(() => {
          setVisibility(true)
        }, 1000)
      })
  }

  function setFormValuesForExistBeneficiary(
    PaymentInformation: SendMoneyInfoRespItem,
    corporate?: {
      isMatch: boolean
      id?: number
      beneficiaryId?: number
      lastActionDate?: string
    },
    reasonForTransfer?: string,
    additionalFormValues?: IFormValues
  ) {
    return new Promise((resolve) => {
      const PaymentMethod = PaymentInformation.Currencies[0].PaymentMethods[0]
      const ExistDynamicFields = PaymentMethod.Fields.filter(
        (df) => df.FieldName !== "Files"
      ).reduce(
        (obj, item) => Object.assign(obj, { [item.FieldName!]: item.value }),
        {}
      )
      setFormValues({
        ...formValues,
        ...(additionalFormValues ? additionalFormValues : {}),
        country: {
          value: PaymentInformation.CountryCode,
          label: PaymentInformation.CountryName,
          original: PaymentInformation,
        },
        currency: {
          value: PaymentInformation.Currencies[0].CurrencyId,
          label: PaymentInformation.Currencies[0].CurrencyCode,
          original: PaymentInformation.Currencies[0],
        },
        paymentMethod: {
          value: PaymentMethod.Id,
          label: PaymentMethod.Name,
          original: PaymentMethod,
        },
        paymentMethodType: PaymentMethod.Extra?.Default || "",
        dynamicFields: ExistDynamicFields,
        amount: isCorporate ? formValues.amount : undefined,
        reasonForTransfer: reasonForTransfer
          ? {
              label: reasonForTransfer,
              value: reasonForTransfer,
            }
          : formValues.reasonForTransfer,
        key: formValues.key + 1,
        isNew: false,
        corporate: corporate,
      })
      setDynamicFields(
        PaymentInformation.Currencies[0].PaymentMethods[0].Fields.filter(
          (df) => df.FieldName !== "Files"
        )
      )
      resolve(true)
    })
  }

  async function checkBusinessFile() {
    if (formValues.isQuickTransfer)
      return setTimeout(() => {
        setStep(2)
        setParentStep(3)
        setVisibility(true)
      }, 1000)

    businessReceiverAIValidatorRequest({
      Currency: (formValues.currency?.label as string) ?? "",
      CountryCode: (formValues.country?.value as string) ?? "",
      PaymentMethodId: formValues.paymentMethod?.value as number,
      Amount: Number(+(formValues?.amount ?? 0)),
      FeeType: (formValues.paymentMethodType as FeeType) || null,
      FileInvoiceURL: formValues.selectedFile!,
      TransferType: transferType.type!,
      BeneficiaryType: transferType.mode!,
    })
      .unwrap()
      .then(async (resp) => {
        if (resp?.PaymentInformation?.[0]?.TransferType) {
          setVisibility(false)
          await setFormValuesForExistBeneficiary(
            resp?.PaymentInformation?.[0],
            {
              isMatch: resp.isMatch,
              id: resp.PaymentInformation?.[0]?.AccountId,
              beneficiaryId: resp.Id,
              lastActionDate: resp.LastDate,
            },
            resp.ReasonForTransferValue,
            {
              paymentReference: resp.PaymentReference,
            } as IFormValues
          )

          if (resp.isMatch)
            setTimeout(() => {
              setStep(2)
              setParentStep(3)
              setVisibility(true)
            }, 1000)
          else setOpenConfirmFile(true)
        } else setOpenConfirmFile(true)
      })
      .catch(() => {
        setOpenConfirmFile(true)
      })
      .finally(() => {
        setVisibility(true)
      })
  }

  function handleSendMoneyCreateRequest() {
    const file =
      (isCorporate && !formValues.isQuickTransfer) ||
      (isStableCoin && formValues.selectedFile)
        ? [
            {
              AccountFieldId: 53, // "Files"
              FieldValue: formValues.selectedFile as string,
            },
          ]
        : []
    const AccountFields = isStableCoin
      ? [
          {
            AccountFieldId: formValues.currency?.original?.PaymentMethods?.[0]
              ?.Fields?.[0]?.Id as number,
            FieldValue: formValues.wallet as string,
          },
        ]
      : formValues?.paymentMethod?.original?.Fields?.flatMap((field) =>
          typeof field?.Id !== "number"
            ? []
            : [
                {
                  AccountFieldId: field.Id,
                  FieldValue:
                    formValues?.dynamicFields?.[
                      field?.FieldName ?? ""
                    ]?.toString() || "",
                },
              ]
        ) ?? []

    const PickupLocation = isCash
      ? {
          PickupLocationId:
            formValues.country?.original?.PickupLocation?.id?.toString(),
        }
      : {}
    createSendMoneyRequest({
      Amount: Number(+(formValues?.amount ?? 0)),
      FeeType: (formValues.paymentMethodType as FeeType) || null,
      Reason: (formValues.reasonForTransfer?.value as string) ?? "",
      Reference: formValues.paymentReference ?? "",
      Beneficiary: {
        Id:
          formValues.account?.Id || formValues.corporate?.beneficiaryId || null,
        FullName: isStableCoin
          ? (formValues.wallet as string)
          : ((formValues.dynamicFields.BeneficiaryName as string) ||
              formValues.account?.FirstName) ??
            null,
        ReceiverType: transferType.mode!,
      },
      Account: {
        Id:
          formValues.account?.PaymentInformation?.[0]?.AccountId ||
          formValues.corporate?.id ||
          null,
        Country: isStableCoin
          ? "DEFAULT"
          : (formValues.country?.value as string) ?? "",
        Currency: isStableCoin
          ? (formValues.network?.value as string)
          : (formValues.currency?.label as string) ?? "",
        TransferType: transferType.type!,
        PaymentMethodId: isStableCoin
          ? (formValues.currency?.original?.PaymentMethods?.[0]?.Id as number)
          : (formValues.paymentMethod?.value as number),
        AccountFields: [...AccountFields, ...file],
      },
      ...PickupLocation,
    })
      .unwrap()
      .then((res) => {
        toast({
          duration: 5000,
          variant: "default",
          title: `Send Money`,
          description: "Send Money successfully",
        })
        navigate(`/send-money/process/${res.code}`)
      })
      .catch((error) => {
        toast({
          duration: 5000,
          variant: `${"destructive"}`,
          title: `${"Error"}`,
          description: `${error?.data?.message || error?.data?.error}`,
        })
      })
  }

  async function checkWalletValidation() {
    validateStableCoinAddressRequest({
      address: formValues.wallet!,
      currency: formValues.currency?.label as string,
      network: formValues.network?.label as string,
    })
      .unwrap()
      .then((resp) => {
        if (resp.isValid) {
          setFormValues({
            ...formValues,
            isWalletValidated: true,
            errors: { ...formValues.errors, wallet: false },
          })
          changeStep(step + 1, false, true)
        } else
          setFormValues({
            ...formValues,
            errors: { ...formValues.errors, wallet: true },
          })
      })
      .catch(() => {
        setFormValues({
          ...formValues,
          errors: { ...formValues.errors, wallet: true },
        })
      })
  }

  async function changeStep(
    to: number,
    isNew?: boolean,
    isWalletValidated?: boolean
  ) {
    if (isStableCoin && !(formValues.isWalletValidated || isWalletValidated))
      return checkWalletValidation()
    if (isCorporate && to === 1 && !isNew) return checkBusinessFile()
    setVisibility(false)

    if (!isCorporate && isNew) await getSendMoneyPaymentInfo(true)

    setTimeout(() => {
      const goto = isStableCoin && to === 1 ? 2 : to
      setStep(goto)
      setParentStep(goto + 1)
      setVisibility(true)
    }, 1000)
  }

  function backTo(goTo?: string) {
    setVisibility(false)
    if (
      step === 0 ||
      (step == (isCorporate ? 2 : 1) && formValues.isQuickTransfer && !goTo)
    )
      return back()
    if (goTo === "edit") setFormValuesImage(JSON.stringify(formValues))
    if (goTo === "discard" && formValuesImage)
      setFormValues(JSON.parse(formValuesImage))

    setTimeout(() => {
      const to =
        goTo === "edit"
          ? 1
          : goTo === "discard"
          ? formValuesImage
            ? 2
            : 0
          : isCorporate
          ? step === 1
            ? 2
            : 0
          : isStableCoin && step === 2
          ? 0
          : step - 1
      setStep(to)
      setParentStep(to + 1)
      setVisibility(true)

      if (to === 0 && !isCorporate && !isStableCoin)
        setOptions({
          key: options.key + 1,
          ReasonForTransfer: [],
          countries: [],
          currencies: [],
          balance: null,
          networks: [],
          paymentMethodOptions: [],
          transferFee: null,
          recipientGets: null,
        })

      if (goTo === "edit" && !formValues.isQuickTransfer && !isCorporate)
        setFormValues({
          ...formValues,
          ...(to === 1
            ? {
                account: undefined,
                dynamicFields: {},
                country: undefined,
                currency: undefined,
                amount: undefined,
                selectedFile: undefined,
                reasonForTransfer: undefined,
              }
            : {}),
          corporate: {
            ...formValues.corporate,
            isMatch: !!formValues.corporate?.isMatch as boolean,
          },
        })
      if (goTo === "discard" && formValuesImage) setFormValuesImage("")
    }, 1000)
  }

  function stepLoader() {
    return step === 0 ? (
      isCorporate || isStableCoin ? (
        sendNewMoneySetupRequestStatus.isLoading ? (
          <Skeleton className="h-16 rounded-xl my-1" />
        ) : (
          <SecondStep
            visibility={visibility}
            formValues={formValues}
            parentOptions={options}
            transferType={transferType}
            isDetails={false}
            dynamicFields={dynamicFields}
            beneficiaryIdFile={beneficiaryIdFile}
            setBeneficiaryIdFile={setBeneficiaryIdFile}
            setDynamicFields={setDynamicFields}
            setFormValues={setFormValues}
            setParentOptions={setOptions}
            checkIsContinueDisabled={checkDataValidation}
            setIsContinueDisabled={setIsContinueDisabled}
          />
        )
      ) : (
        <FirstStep
          visibility={visibility}
          formValues={formValues}
          options={options}
          transferType={transferType}
          setFormValues={setFormValues}
          setOptions={setOptions}
          setIsContinueDisabled={setIsContinueDisabled}
          onAddNew={() => changeStep(step + 1, true)}
        />
      )
    ) : step === 1 ? (
      sendNewMoneySetupRequestStatus.isLoading ? (
        <Skeleton className="h-16 rounded-xl my-1" />
      ) : (
        <SecondStep
          visibility={visibility}
          formValues={formValues}
          parentOptions={options}
          transferType={transferType}
          dynamicFields={dynamicFields}
          isDetails={isCorporate}
          beneficiaryIdFile={beneficiaryIdFile}
          setBeneficiaryIdFile={setBeneficiaryIdFile}
          setDynamicFields={setDynamicFields}
          setFormValues={setFormValues}
          setParentOptions={setOptions}
          checkIsContinueDisabled={checkDataValidation}
          setIsContinueDisabled={setIsContinueDisabled}
        />
      )
    ) : (
      <LastStep
        visibility={visibility}
        formValues={formValues}
        transferType={transferType}
        dynamicFields={dynamicFields}
        goToEdit={() => backTo("edit")}
      />
    )
  }

  return (
    <>
      {businessReceiverAIValidatorRequestStatus.isLoading ||
      validateStableCoinAddressRequestStatus.isLoading ||
      openConfirmFile ? (
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh] text-[#4C4C4C]">
          <PiCircleNotch className="size-8 animate-spin mb-4" />
          <span className="bodyS  text-center max-w-80">
            Our AI is scanning the data from your uploaded invoice. Please wait
            a moment until the work is done!
          </span>
        </div>
      ) : (
        <>
          {stepLoader()}
          <FadeIn visible={visibility} delay={800} className="col-span-2">
            <div className="col-span-2 flex gap-4 justify-end mt-4">
              {isCorporate && step === 1 ? (
                <CancelEditModal discard={() => backTo("discard")} />
              ) : (
                <Button variant="outline" onClick={() => backTo()}>
                  <PiCaretLeft size={24} />
                  Back
                </Button>
              )}
              {step === 2 ? (
                <ConfirmTransferModal
                  isLoading={createSendMoneyRequestStatus.isLoading}
                  amount={formValues.amount?.toString() || ""}
                  currency={formValues.currency?.label as string}
                  accountName={
                    (formValues.dynamicFields.BeneficiaryName as string) || null
                  }
                  wallet={formValues.wallet}
                  handleApprove={() => {
                    handleSendMoneyCreateRequest()
                  }}
                />
              ) : (
                <Button
                  variant="primary"
                  disabled={isContinueDisabled}
                  loading={businessReceiverAIValidatorRequestStatus.isLoading}
                  onClick={() => changeStep(step + 1)}
                >
                  {isCorporate && step == 1 ? "Done & Continue" : "Continue"}
                </Button>
              )}
            </div>
          </FadeIn>
        </>
      )}
      <ConfirmFileModal
        open={openConfirmFile}
        back={() => {
          setOpenConfirmFile(false)
        }}
        enterManual={() => {
          changeStep(step + 1, true)
          setOpenConfirmFile(false)
        }}
      />
    </>
  )
}
