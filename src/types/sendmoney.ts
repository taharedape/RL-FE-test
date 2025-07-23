import { OptionItem } from "@/components/ui/select"

export enum TransferType {
  INTERNATIONAL = "INTERNATIONAL",
  DOMESTIC = "DOMESTIC",
  CASH = "CASH",
  STABLE_COIN = "STABLE_COIN",
}

export interface IGetBeneficiaries {
  Beneficiaries: Array<BeneficiariesAccount>
  PaymentInformation: Array<SendMoneyInfoRespItem>
  ReasonForTransfer: Array<OptionItem<null>>
}

export interface IBusinessReceiverAIValidatorRequest {
  Currency: string
  CountryCode: string
  PaymentMethodId: number
  Amount: number
  FeeType: FeeType
  FileInvoiceURL: string
  TransferType: TransferType
  BeneficiaryType: BeneficiaryType
}

export interface IBusinessReceiverAIValidatorRespond {
  Amount: number
  BeneficiaryType: BeneficiaryType
  FeeType: FeeType
  FileInvoiceURL: string
  PaymentInformation: Array<SendMoneyInfoRespItem>
  isMatch: boolean
  PaymentReference?: string
  ReasonForTransferValue?: string
  LastDate?: string
  Id?: number
}

export interface BeneficiariesAccount {
  Id: number
  FirstName: string
  LastName: string
  FullName: string
  Email: string
  LastDate?: string
  PaymentInformation: Array<SendMoneyInfoRespItem>
  PaymentReference?: string
  ReasonForTransferValue: string
}

export interface SendMoneyRecipientRequest {
  TransferType: TransferType
  ReceiverType: BeneficiaryType
  TransferMethod: FeeType | ""
  Amount: number
  CountryCode: string
  PaymentMethodId: number
}

export interface SendMoneyInfoResp {
  PaymentInformation: Array<SendMoneyInfoRespItem>
  ReceiverType: Array<OptionItem<null>>
  ReasonForTransfer: Array<OptionItem<null>>
}

export interface SendMoneyInfoRespItem {
  AccountId?: number
  CountryName: string
  CountryCode: string
  TransferType: TransferType
  Currencies: Array<SendMoneyInfoCurrencies>
  ReceiverType?: Array<{ name: string; title: string }>
  PickupLocation?: PickupLocation
}

export interface PickupLocation {
  addr: string
  city: string
  country: string
  email: string | null
  id: number
  label: string
  nickname: string
  value: string
}

export interface SendMoneyInfoCurrencies {
  CurrencyCode: string
  CurrencyId: number
  Amount?: string
  PaymentMethods: SendMoneyInfoPaymentMethod[]
  userBalance?: SendMoneyInfoUserBalance
  Network?: Array<{ Name: string; CurrencyCode: string }>
}
export interface SendMoneyInfoPaymentMethod {
  Id: number
  Name: string
  Label: string
  Description: string
  Arrival: string
  Fields: SendMoneyInfoField[]
  Fees: SendMoneyInfoFees
  TransactionLimits: { INDIVIDUAL: number; CORPORATE: number }
  isDisabled?: boolean
  Extra?: { Options: Array<{ Value: string; Label: string }>; Default: string }
}

export interface SendMoneyInfoField {
  Id?: number
  FieldName?: string
  FieldLabel?: string
  DisplayOrder?: number
  Type?: string
  DefaultValue?: string | SendMoneyObjField
  Validation: string
  ValidationErrorMessage: string
  IsRequired: boolean
  value?: string | SendMoneyObjField
}

export interface SendMoneyObjField {
  [key: string]: string | number
}

export interface SendMoneyInfoFees {
  [key: string]: string | null
}

export interface SendMoneyInfoUserBalance {
  currency: string
  balance: number
  overallBalance: number
  label: string
  imgsrc: string
  balanceFormatted: string
  type: "CR" | "DR"
}

export type FeeType = "BEN" | "OUR" | "SHA"

export interface AccountField {
  AccountFieldId: number
  FieldValue: string
}

export interface Receiver {
  Id: number | null
  FullName: string | null
  ReceiverType: BeneficiaryType
}

export interface ReceiverAccount {
  Id: number | null
  ReceiverId?: number
  Country: string
  Currency: string
  TransferType: TransferType
  PaymentMethodId: number
  AccountFields: AccountField[]
}

export interface CreateSendMoneyRequest {
  Amount: number
  FeeType?: FeeType
  Reason: string
  Reference?: string
  Beneficiary: Receiver
  Account: ReceiverAccount
}

export enum BeneficiaryType {
  INDIVIDUAL = "INDIVIDUAL",
  CORPORATE = "CORPORATE",
}

export interface ITransferType {
  Name: TransferType
  Title: string
  Description: string
  BeneficiaryType?: Array<{ name: BeneficiaryType; label: string }>
}
