export interface IInitialState {
  deposit: {
    currency?: string | null
    transactionType?: string | null
    amount?: number | null
    location?: string | null
  }
}
