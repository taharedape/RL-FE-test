export interface UserBalance {
  overallBalance: number
  walletBalanceItems: Array<{
    balance: number
    balanceFormatted: string
    currency: string
    imgsrc: string
    items: {
      CASH: BalanceSubItem
      CORPORATE: BalanceSubItem
      INDIVIDUAL: BalanceSubItem
    }
    label: string
    overallBalance: number
    type: "DR" | "CR"
  }>
}

export interface BalanceSubItem {
  balance: number
  overallBalance: number
  type: "DR" | "CR"
  balanceFormatted: string
}
