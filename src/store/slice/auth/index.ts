import { createSlice } from "@reduxjs/toolkit"
import { setCookie, removeCookie, getCookie } from "typescript-cookie"

export interface InitialStateType {
  token: string
}

const initialState: InitialStateType = {
  token: getCookie("token") || "",
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveUserInfo: (state: InitialStateType, action) => {
      const { token } = action.payload
      state.token = token
      setCookie("token", token, { expires: 30, path: "/" })
    },
    removeUserInfo: (state: InitialStateType) => {
      state.token = ""
      removeCookie("token")
    },
  },
})

export const token = (state: InitialStateType) => state.token
export const { saveUserInfo, removeUserInfo } = authSlice.actions
export default authSlice.reducer
