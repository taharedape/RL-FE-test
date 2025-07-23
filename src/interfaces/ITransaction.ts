export interface ITransaction {
  id: string
  to: string
  date: string
  amount: number
  currency: string
  status: "Pending" | "Approved"
}
