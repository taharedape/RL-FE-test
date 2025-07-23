import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  IConfirmPasswordWithCodeRequest,
  ILoginRequest,
  ILoginResponse,
  IRestPasswordRequest,
  ISignupRequest,
} from "@/interfaces/IAuth"

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json")
      const token = (getState() as any).auth.token
      if (token) headers.set("authorization", `Bearer ${token}`)

      return headers
    },
  }),
  tagTypes: ["Category", "Product", "User"],
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation<void, ISignupRequest>({
      query: (data) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    restPassword: builder.mutation<void, IRestPasswordRequest>({
      query: (data) => ({
        url: "/auth/resetPassword",
        method: "POST",
        body: data,
      }),
    }),
    confirmPasswordWithCode: builder.mutation<{ token: string }, IConfirmPasswordWithCodeRequest>({
      query: (data) => ({
        url: "/auth/confirmPasswordWithCode",
        method: "POST",
        body: data,
      }),
    }),
  }),
})

export const { useSignupMutation, useLoginMutation, useConfirmPasswordWithCodeMutation, useRestPasswordMutation } =
  authAPI
