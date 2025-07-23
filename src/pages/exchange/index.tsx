import { useGetTransactionsQuery } from "@/store/api/authAPI/transactions"
// import { columns } from "./components/columns"
// import { DataTable } from "./components/data-table"
import { LoadingLottie } from "@/components"

const Exchange = () => {
  const { isLoading } = useGetTransactionsQuery({})

  return isLoading ? (
    <div className="flex justify-center">
      <div className="w-64">
        <LoadingLottie />
      </div>
    </div>
  ) : (
    <div>Exchange Page</div>
    // <DataTable columns={columns} data={data} />
  )
}

export default Exchange
