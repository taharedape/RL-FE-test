import { createSlice } from "@reduxjs/toolkit"
import useLocalStorage from "@/hooks/useLocalStorage"

export interface InitialStateType {
  isSideBarOpen: boolean
}

const { saveData, getData } = useLocalStorage()

const initialState: InitialStateType = {
  isSideBarOpen:
    getData("side-bar-status") == null ? true : getData("side-bar-status"),
}

export const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSideBarOpen: (state: InitialStateType) => {
      state.isSideBarOpen = !state.isSideBarOpen
      saveData("side-bar-status", state.isSideBarOpen)
    },
  },
})

export const { toggleSideBarOpen } = app.actions
export default app.reducer
