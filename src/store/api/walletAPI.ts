import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  AddMoneyRequest,
  AddMoneyResponse,
  getTransactionsRequest,
  IInstructionResponse,
  IInstructionResponses,
  ITransactionRespond,
  TransactionDetailResponse,
} from "@/interfaces/Iwallet.ts"
import { UserBalance } from "@/types/wallet"

export const walletAPI = createApi({
  reducerPath: "walletAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      // headers.set("Content-Type", "application/json")
      const token = (getState() as any).auth.token
      if (token) headers.set("authorization", `Bearer ${token}`)

      return headers
    },
  }),
  tagTypes: ["Transactions", "TransactionDetailResponse"], // Define the tag type
  endpoints: (builder) => ({
    getUserBalance: builder.query<UserBalance, void>({
      query: () => ({ url: "/wallet/getUserBalances", method: "GET" }),
    }),
    getInstruction: builder.query<
      IInstructionResponse,
      {
        Currency: string
        Type: string
        Location?: string
        Amount: string | number
      }
    >({
      query: ({ Currency, Type, Location, Amount }) => ({
        url: `/wallet/getInstruction?Currency=${Currency}&Type=${Type}&Amount=${Amount}&Location=${
          Location ?? "US"
        }`,
        method: "GET",
      }),
    }),
    getExportInstruction: builder.mutation<
      Blob,
      {
        Currency: string
        Type: string
        Location?: string
        Amount: string | number
      }
    >({
      query: ({ Currency, Type, Location, Amount }) => ({
        url: `/wallet/getExportInstruction?Currency=${Currency}&Type=${Type}&Amount=${Amount}&Location=${
          Location ?? "US"
        }`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    addMoney: builder.mutation<AddMoneyResponse, AddMoneyRequest>({
      query: (body) => ({ url: "/wallet/addMoney", method: "POST", body }),
      invalidatesTags: ["Transactions", "TransactionDetailResponse"], // Invalidate transactions when addMoney is called
    }),
    cancelAddMoney: builder.mutation<
      void,
      { requestId: string; description: string }
    >({
      query: (body) => ({
        url: "/wallet/cancelAddMoney",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transactions", "TransactionDetailResponse"], // Invalidate transactions when addMoney is called
    }),
    updateAmountAddMoney: builder.mutation<
      void,
      { requestId: string; amount: number }
    >({
      query: (body) => ({
        url: "/wallet/updateAddMoneyAmount",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Transactions", "TransactionDetailResponse"], // Invalidate transactions when addMoney is called
    }),
    setUploadPaidReceipt: builder.mutation<
      any,
      { requestId: string; uploadFilePaths: string[] }
    >({
      query: (data) => ({
        url: "/wallet/setUploadPaidReceipt",
        method: "POST",
        body: {
          requestId: data.requestId,
          uploadFilePaths: data.uploadFilePaths,
        },
      }),
      invalidatesTags: ["Transactions", "TransactionDetailResponse"], // Invalidate transactions when addMoney is called
    }),
    getTransactions: builder.mutation<
      ITransactionRespond,
      getTransactionsRequest
    >({
      query: (body) => ({
        url: "/wallet/getTransactions",
        method: "POST",
        body,
      }),
    }),
    getTransactionDetail: builder.query<TransactionDetailResponse, string>({
      query: (transactionId) => ({
        url: `/wallet/getTransactionDetail/${transactionId}`,
        method: "GET",
      }),
      providesTags: ["TransactionDetailResponse"],
    }),
    getCurrencies: builder.query<void, void>({
      query: () => ({ url: "/wallet/getCurrencies", method: "GET" }),
    }),
    getInstructions: builder.query<IInstructionResponses[], void>({
      query: () => ({ url: "/wallet/getInstructions", method: "GET" }),
    }),
    uploadFile: builder.mutation<FormData, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append("file", file)

        return { url: "/upload/crm-file", method: "POST", body: formData }
      },
    }),
  }),
})

export const {
  useGetUserBalanceQuery,
  useGetInstructionQuery,
  useGetExportInstructionMutation,
  useAddMoneyMutation,
  useGetTransactionsMutation,
  useGetCurrenciesQuery,
  useGetTransactionDetailQuery,
  useUploadFileMutation,
  useSetUploadPaidReceiptMutation,
  useGetInstructionsQuery,
  useCancelAddMoneyMutation,
  useUpdateAmountAddMoneyMutation,
} = walletAPI
