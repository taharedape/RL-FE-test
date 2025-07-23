import { configureStore } from "@reduxjs/toolkit"
import { authAPI } from "./api/authAPI"
import authReducer from "./slice/auth"
import appReducer from "./slice/app"
import { transactionSlice } from "./slice/transaction/transactionSlice"
import { walletAPI } from "@/store/api/walletAPI.ts"
import { sendMoneyAPI } from "@/store/api/sendMoney.ts"
import { userAPI } from "@/store/api/userAPI.ts"

// export const socket = io("http://localhost:3000"); // Connect to NestJS WebSocket server

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [walletAPI.reducerPath]: walletAPI.reducer,
    [sendMoneyAPI.reducerPath]: sendMoneyAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    transactions: transactionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      walletAPI.middleware,
      sendMoneyAPI.middleware,
      userAPI.middleware,
    ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// // Listen for real-time updates from NestJS WebSocket server
// socket.on("initialTransactions", (transactions) => {
//   store.dispatch(setTransactions(transactions));
// });
//
// socket.on("newTransaction", (transaction) => {
//   store.dispatch(addTransaction(transaction));
// });
//
// socket.on("transactionUpdated", (updatedTransaction) => {
//   store.dispatch(updateStatus(updatedTransaction));
// });
