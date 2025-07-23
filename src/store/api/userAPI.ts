import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = async (args: any, api: any, extraOptions: any) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json")
      const token = (getState() as any).auth.token
      if (token) headers.set("authorization", `Bearer ${token}`)

      return headers
    },
  })

  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401 || result.error?.status === 404) {
    clearCookie("token")
    window?.location?.reload()
  }

  return result
}

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery,
  endpoints: (builder) => ({
    getProfile: builder.query<any, void>({
      query: () => ({ url: "/users/getProfile", method: "GET" }),
    }),
  }),
})

export const { useGetProfileQuery } = userAPI
