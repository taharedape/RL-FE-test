import { useGetTransactionsQuery } from "@/store/api/authAPI/transactions"
import { LoadingLottie } from "@/components"
import TransactionTable from "./components/TransactionTable"

const Transactions = () => {
  const { isLoading } = useGetTransactionsQuery({})

  return isLoading ? (
    <div className="flex justify-center">
      <div className="w-64">
        <LoadingLottie />
      </div>
    </div>
  ) : (
    <TransactionTable pageSize={20} />
  )
}

export default Transactions
