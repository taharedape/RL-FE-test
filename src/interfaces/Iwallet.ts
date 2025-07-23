import { BeneficiaryType, TransferType } from "@/types/sendmoney"

export interface IInstructionResponse {
  id: number
  details: Array<{ name: string; label: string; value: string }>
}

export interface AddMoneyRequest {
  Currency: string
  Amount: number
  Type: string
  InstructionId: number
  Country: string
}

export interface AddMoneyResponse {
  success: boolean
  message: string
  transactionId?: string
  requestId?: string
}

export interface ITransactionRespond {
  data: Array<ITransaction>
  page: number
  pageSize: number
  total: number
}

export interface ITransaction {
  Id: number
  FullName: string
  Amount: string
  Currency: string
  Description: string
  Status: "PENDING" | "FAILED" | "SUCCESS"
  TransactionType: "STABLE_COIN" | "CASH_PICKUP" | "CASH_DELIVERY" | "ONLINE"
  RequestId: string
  RequestDate: string
  ReceiptUrl: string | null
  SourceType: "SEND_MONEY" | "ADD_MONEY" | "EXCHANGE_MONEY"
  ActionStatus:
    | "UPLOAD_RECEIPT"
    | "VIEW_CANCEL"
    | "VIEW_PROCESS"
    | "WAITING_FOR_APPROVAL"
    | "VIEW_REJECT"
}

// Define TypeScript interfaces for the response
interface PaymentRequestCreated {
  amount: string
  currency: string
  country: string
  status: string
  errorMessage?: string
}

interface DestinationAccountInformation {
  name: string
  label: string
  value: string
}

interface DepositDetails {
  youRequestedToDeposit: string
  totalFees: number
  currency: string
  youWillReceive: string
  reference: number
}

interface InstructionShared {
  status: string
  errorMessage: string
  destinationAccountInformation: Array<DestinationAccountInformation>
  depositDetails: DepositDetails
}

interface PaymentUpload {
  uploadUrls: string[]
  status: string
  errorMessage?: string
}

interface PaymentApproval {
  status: string
  requestId: string
  errorMessage?: string
}

export interface TransactionDetailResponse {
  paymentRequestCreated: PaymentRequestCreated
  instructionShared: InstructionShared
  paymentUpload: PaymentUpload
  paymentApproval: PaymentApproval
  requestDate: Date
  ApproveOrCancelDate?: Date
  PaidOrRejectDate?: Date
  InstructionDate?: Date
  requestId: string
  instructionType: string
  crmUrls?: string[]
}

export interface SendMoneyDetailResponse {
  PickupLocationDetails?: {
    PickupDetailItems: Array<{
      label: string
      name: string
      value: string | null
    }>
    Status: "DEFAULT" | "PENDING" | "FAILED" | "SUCCESS"
  }
  KYCVerification: {
    DateTime?: Date
    Status: "DEFAULT" | "PENDING" | "FAILED" | "SUCCESS"
    FileURL?: string
    VerificationURL?: string
  }
  PaymentApproval: {
    DateTime?: Date
    Message: string
    Status: "DEFAULT" | "PENDING" | "FAILED" | "SUCCESS"
  }
  PaymentRequestCreated: {
    DateTime?: Date
    Amount: number
    Currency: string
    FullName: string
    Status: "DEFAULT" | "PENDING" | "FAILED" | "SUCCESS"
    TransferType: TransferType
    BeneficiaryType: BeneficiaryType
  }
  PaymentSummery: {
    DateTime?: Date
    DestinationAccountInformation: {
      Country: string
      Currency: string
      Network?: string
      TrackingCode?: string
      Fields: [{ [key: string]: string }]
    }
    Status: "DEFAULT" | "PENDING" | "FAILED" | "SUCCESS" | "REJECTED"
    TransferDetails: {
      Amount: number
      RequestId: string
      PaymentReference: string
      TotalFees: number
      WillGet: number
      WillCharge: number
      Get: number
      Charge: number
      BankReceiptUrls: Array<string>
      FeeType?: "BEN" | "SHA" | "OUR"
      HashId?: string
    }
  }
  DisplayButtons: {
    isActionButton: boolean
    isAmend: false
    isCancel: boolean
    isDispute: boolean
  }
  Amendment: {
    Requests: [
      {
        Id: 0
        Status: "REJECT" | "PENDING" | "APPROVE"
        RequestDate: Date
        Description: string
        Details: string
      }
    ]
  }
  Cancelled: {
    Requests: Array<{
      ChangeType: "CANCEL"
      Description: null
      Details: ""
      Id: number
      Reason: string
      RequestDate: string
      ReviewedBy: null
      ReviewedDate: null
      SendMoneyId: number
      SendMoneyStatus: "EXECUTED"
      Status: "PENDING" | "APPROVE" | "REJECT"
    }>
    CRMCancelReason?: string
  }
  Rejected: {
    Requests: Array<{
      ChangeType: "EXTRADOCS"
      Id: number
      Reason: string
      RequestDate: string
      Status: "APPROVE" | "REJECT"
    }>
  }
  Disputed: {
    Requests: Array<{
      ChangeType: "DISPUTE"
      Description: null
      Details: ""
      Id: number
      Reason: string
      RequestDate: string
      ReviewedBy: null
      ReviewedDate: null
      SendMoneyId: number
      SendMoneyStatus: "EXECUTED"
      Status: "PENDING" | "SUCCESS" | "FAILED"
    }>
  }
  DownloadUrls: Array<string>
  IsSendMoneyNew: boolean
}

interface IInstructionLocation {
  label: string
  code: string
}

interface IInstructionCurrency {
  label: string
  name: string
  locationCode: string
}

export interface IInstructionResponses {
  name: string
  label: string
  locations: IInstructionLocation[]
  currencies: IInstructionCurrency[]
}

export enum ActualStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  PROCESSING = "PROCESSING",
  INPROGRESS = "INPROGRESS",
  PAID = "PAID",
  REJECTED = "REJECTED",
  INSTRUCTED = "INSTRUCTED",
  APPROVED = "APPROVED",
  EXECUTED = "EXECUTED",
}

export interface getTransactionsRequest {
  page?: number
  pageSize?: number
  search?: string
  fromDate?: string
  toDate?: string
  currencies?: string[]
  creditType?: ("CORPORATE" | "INDIVIDUAL" | "CASH")[]
  status?: ("PENDING" | "SUCCESS" | "FAILED" | "TASK" | "PAYMENT_APPROVAL")[]
  sourceType?: ("ADD_MONEY" | "SEND_MONEY" | "Exchange")[]
  transferType?: transferTypeItem[]
  actualStatuses?: (ActualStatus | null)[]
}
export const enum transferTypeItem {
  "CASH",
  "CASH_DELIVERY",
  "CASH_PICKUP",
  "ONLINE",
  "STABLE_COIN",
  "INTERNATIONAL",
  "DOMESTIC",
}
