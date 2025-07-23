import FormatNumberView from "@/components/common/FormatNumberView"
import Badge from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ITransaction, ITransactionRespond } from "@/interfaces/Iwallet"
import { Utilities } from "@/lib/Utilities"
import { useGetTransactionsMutation } from "@/store/api/walletAPI"
import { useEffect, useState } from "react"
import { PiArrowRight, PiSpinner } from "react-icons/pi"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<ITransactionRespond>()
  const [getTransactionsRequest, getTransactionsRequestStatus] =
    useGetTransactionsMutation()

  async function getTransactions() {
    getTransactionsRequest({
      pageSize: 3,
      page: 0,
      status: ["TASK"],
    })
      .unwrap()
      .then((resp) => {
        setTasks(resp)
      })
  }

  useEffect(() => {
    getTransactions()
  }, [])

  function taskItem(task: ITransaction) {
    return (
      <div
        key={task.Id}
        className="bg-[#EDEDEE] rounded-xl border border-[#DEE0E0] px-6 py-3 w-full grid grid-cols-[16] items-center"
      >
        <div className="captionL col-span-2">
          {Utilities.formatDateTime(task.RequestDate)}
        </div>
        <div className="captionL underline">{task.RequestId}</div>
        <div className="flex flex-col flex-wrap col-span-2">
          <span className="text-[#141414] captionL font-bold">
            {task.SourceType === "SEND_MONEY"
              ? "Send Money"
              : task.SourceType === "ADD_MONEY"
              ? "Deposit"
              : "Exchange"}
          </span>
          <span className="text-[#a5a7a6] captionL">
            {Utilities.getTypeLabel(task.TransactionType)}
          </span>
        </div>
        <div className="captionS">You</div>
        <div className="flex items-center captionL col-span-2 text-[#008767]">
          +
          <FormatNumberView
            currency={"CAD"}
            transactionType={""}
            value={1000}
            withCountry
            className="captionL"
            subClass="text-[9px]"
          />
        </div>
        <div>
          <Badge
            variant="secondary"
            className="py-1 px-3 rounded-full captionL bg-[#FFB82E1F] text-[#947100]"
          >
            Pending
          </Badge>
        </div>
        <Link
          to={`/dashboard/deposit-process/${"row.original.RequestId"}`}
          className="col-span-2"
        >
          <Button variant="destructive" size="sm">
            Waiting for approval
          </Button>
        </Link>
      </div>
    )
  }

  return getTransactionsRequestStatus.isLoading ? (
    <div className="w-full h-32 flex flex-col items-center gap-1 border border-neutral-200 bg-[#22283108] rounded-3xl p-6">
      <PiSpinner className="size-6 animate-spin m-auto" />
    </div>
  ) : tasks?.data?.length ? (
    <div className="w-full flex flex-col items-center gap-1 border border-neutral-200 bg-[#22283108] rounded-3xl p-6">
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <span className="bodySB">⚠️ Tasks & Approvals</span>
          <span className="captionL">
            You have <strong>{tasks.total}</strong> pending tasks & 5 approval
            payments
          </span>
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={() => navigate("/wallet?tab=tasks")}
        >
          View All Tasks <PiArrowRight size={16} className="ml-2" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 w-full p-2 mt-3">
        {tasks?.data?.map((task) => taskItem(task))}
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col items-center gap-1 border border-neutral-200 bg-[#22283108] rounded-3xl p-6">
      <div className="bodyS font-semibold">✅ No Tasks Or Approvals!</div>
      <div className="captionL text-[#4C4C4C]">
        You don’t have any tasks or approvals!
      </div>
    </div>
  )
}
