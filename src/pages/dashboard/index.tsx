import AccountBalance from "./components/AccountBalance"
import Tasks from "./components/Tasks"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import OverallChart from "./components/OverallChart"
import TransactionTable from "../transactions/components/TransactionTable"

export default function Dashboard() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-14">
      <AccountBalance />
      <Tasks />
      <OverallChart />
      <div className="flex flex-col items-center justify-between w-full">
        <div className="flex items-center justify-between w-full mb-8">
          <div className="text-[#141414] bodyLB">Recent Transactions</div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/wallet?tab=Transactions")}
          >
            View All Transactions
          </Button>
        </div>
        <TransactionTable pageSize={5} />
      </div>
    </div>
  )
}
