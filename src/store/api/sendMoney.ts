import { SendMoneyDetailResponse } from "@/interfaces/Iwallet"
import {
  BeneficiaryType,
  CreateSendMoneyRequest,
  IGetBeneficiaries,
  IBusinessReceiverAIValidatorRespond,
  IBusinessReceiverAIValidatorRequest,
  ITransferType,
  TransferType,
  SendMoneyRecipientRequest,
} from "@/types/sendmoney.ts"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const sendMoneyAPI = createApi({
  reducerPath: "sendMoneyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}`,
    prepareHeaders: (
      headers,
      { getState }: { getState: () => { auth?: { token?: string | null } } }
    ) => {
      // headers.set("Content-Type", "application/json")
      const token = getState().auth?.token
      if (token) headers.set("authorization", `Bearer ${token}`)

      return headers
    },
  }),
  endpoints: (builder) => ({
    getTransferType: builder.query<Array<ITransferType>, any>({
      query: () => ({ url: "/send-money/getTransferType", method: "GET" }),
    }),
    getQuickTransfer: builder.mutation<
      IGetBeneficiaries,
      {
        type: TransferType | null
        mode: BeneficiaryType | null
      }
    >({
      query: (props) => ({
        url: `/send-money/getQuickTransfer?TransferType=${props.type}&BeneficiaryType=${props.mode}`,
        method: "GET",
      }),
    }),
    getNewSendMoneySetup: builder.mutation({
      query: (props: {
        type: TransferType | null
        mode: BeneficiaryType | null
      }) => ({
        url: `/send-money/getNewSendMoneySetup?TransferType=${props.type}&BeneficiaryType=${props.mode}`,
        method: "GET",
      }),
    }),
    getBeneficiaries: builder.mutation<
      IGetBeneficiaries,
      {
        type: TransferType | null
        mode: BeneficiaryType | null
        name: string | null
      }
    >({
      query: (props: {
        type: TransferType | null
        mode: BeneficiaryType | null
        name: string | null
      }) => {
        const queries = `?Name=${props.name}&TransferType=${props.type}&BeneficiaryType=${props.mode}`
        return {
          url: `/send-money/getBeneficiaries${queries}`,
          method: "GET",
        }
      },
    }),
    createSendMoney: builder.mutation<{ code: string }, CreateSendMoneyRequest>(
      {
        query: (body) => ({
          url: "/send-money/CreateSendMoneyRequest",
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
        }),
      }
    ),
    businessReceiverAIValidator: builder.mutation<
      IBusinessReceiverAIValidatorRespond,
      IBusinessReceiverAIValidatorRequest
    >({
      query: (body: IBusinessReceiverAIValidatorRequest) => ({
        url: "/send-money/AiSendMoneyBusinessReceiverValidator",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getSendMoneyRecipient: builder.mutation<
      { Get: number; WillGet: number; Charge: number },
      SendMoneyRecipientRequest
    >({
      query: (body) => ({
        url: `/send-money/getSendMoneyRecipient`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getSendMoneyDetails: builder.query<SendMoneyDetailResponse, string>({
      query: (RequestId) => ({
        url: `/send-money/getSendMoneyDetails?RequestId=${RequestId}`,
        method: "GET",
      }),
    }),
    approveSendMoneyPayment: builder.mutation<string, string>({
      query: (RequestId) => ({
        url: `/send-money/ApproveSendMoneyPayment`,
        method: "POST",
        body: { RequestId },
        headers: { "Content-Type": "application/json" },
      }),
    }),
    cancelSendMoneyPayment: builder.mutation<string, string>({
      query: (RequestId) => ({
        url: `/send-money/CancelSendMoneyPayment`,
        method: "POST",
        body: { RequestId },
        headers: { "Content-Type": "application/json" },
      }),
    }),
    sendMoneyCancelRequest: builder.mutation<
      string,
      { RequestId: string; Reason: string }
    >({
      query: (body) => ({
        url: `/send-money/SendMoneyCancelRequest`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    paymentNotReceived: builder.mutation<string, string>({
      query: (RequestId) => ({
        url: `/send-money/SendMoneyDisputeRequest`,
        method: "POST",
        body: { RequestId },
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getExportSendMoneyDetails: builder.mutation<Blob, string>({
      query: (RequestId) => ({
        url: `/send-money/getExportSendMoneyDetails?RequestId=${RequestId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    sendMoneyAmendRequest: builder.mutation<
      string,
      {
        AccountName?: string
        AccountNumber?: string
        RoutingNumber?: string
        RequestId: string
      }
    >({
      query: (body) => ({
        url: `/send-money/SendMoneyAmendRequest`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    validateStableCoinAddress: builder.mutation<
      { isValid: boolean },
      {
        address: string
        currency: string
        network: string
      }
    >({
      query: (body) => ({
        url: `/send-money/ValidateStableCoinAddress`,
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
})

export const {
  useGetTransferTypeQuery,
  useGetQuickTransferMutation,
  useGetNewSendMoneySetupMutation,
  useGetBeneficiariesMutation,
  useGetSendMoneyRecipientMutation,
  useCreateSendMoneyMutation,
  useBusinessReceiverAIValidatorMutation,
  useGetSendMoneyDetailsQuery,
  useApproveSendMoneyPaymentMutation,
  useCancelSendMoneyPaymentMutation,
  useSendMoneyCancelRequestMutation,
  usePaymentNotReceivedMutation,
  useGetExportSendMoneyDetailsMutation,
  useSendMoneyAmendRequestMutation,
  useValidateStableCoinAddressMutation,
} = sendMoneyAPI
