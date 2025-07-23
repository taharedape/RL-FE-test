import { authAPI } from "../authAPI"

const transactionsApi = authAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getTransaction: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
})

export const { useGetTransactionsQuery, useGetTransactionQuery } = transactionsApi
