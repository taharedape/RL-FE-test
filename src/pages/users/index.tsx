import { LoadingLottie } from "@/components"
// import { columns } from "./components/columns"
// import { DataTable } from "./components/data-table"
import { useGetUsersQuery } from "@/store/api/authAPI/user"

const Users = () => {
  const { data, isLoading } = useGetUsersQuery({})
  console.info("Users data:", data)
  return isLoading ? (
    <div className="flex justify-center">
      <div className="w-64">
        <LoadingLottie />
      </div>
    </div>
  ) : (
    <div>Users Page</div>
    // <DataTable columns={columns} data={data} />
  )
}

export default Users
