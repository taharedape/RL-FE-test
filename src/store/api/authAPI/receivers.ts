import { authAPI } from "../authAPI"

const receiversApi = authAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReceiverAccounts: builder.query({
      query: () => ({
        url: "/receiver/getReceiverAccounts",
        method: "GET",
      }),
    }),
  }),
})

export const { useGetReceiverAccountsQuery } = receiversApi
