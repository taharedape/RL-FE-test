import { IInitialState } from "@/interfaces/IInitialState"
import { RootState } from "@/store"
import { createSlice } from "@reduxjs/toolkit"

const initialState: IInitialState = {
  deposit: {
    transactionType: null,
    currency: null,
    amount: null,
    location: null,
  },
}

export const transactionSlice = createSlice({
  name: "Beneficiaries",
  initialState,
  reducers: {
    setDepositLocation: (state, action) => {
      state.deposit.location = action.payload
    },
    setDepositAmount: (state, action) => {
      state.deposit.amount = action.payload
    },
    setDepositCurrency: (state, action) => {
      state.deposit.currency = action.payload
    },
    setDepositTransactionType: (state, action) => {
      state.deposit.transactionType = action.payload
      state.deposit.location = null
      state.deposit.currency = null
      state.deposit.amount = null
    },
    setDepositInitial: (state) => {
      state.deposit.transactionType = null
      state.deposit.location = null
      state.deposit.currency = null
      state.deposit.amount = null
    },
  },
})

export const {
  setDepositLocation,
  setDepositAmount,
  setDepositCurrency,
  setDepositTransactionType,
  setDepositInitial,
} = transactionSlice.actions

export const selectDeposit = (state: RootState) => state.transactions.deposit
