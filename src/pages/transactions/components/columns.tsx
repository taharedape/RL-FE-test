import { ColumnDef } from "@tanstack/react-table"
import { ITransaction } from "@/interfaces/Iwallet.ts"
import { Link } from "react-router-dom"
import Badge from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Utilities } from "@/lib/Utilities"
import FormatNumberView from "@/components/common/FormatNumberView"

const columns: ColumnDef<ITransaction>[] = [
  // {
  //   id: "rowNumber",
  //   header: () => <div className="captionL text-muted-foreground">#</div>,
  //   cell: ({ row }) => <div className="captionL">{row.index + 1}</div>,
  // },
  {
    accessorKey: "RequestDate",
    header: () => (
      <div className="captionL text-muted-foreground">Date & Time</div>
    ),
    cell: ({ row }) => (
      <div className="captionL">
        {Utilities.formatDateTime(row.original.RequestDate)}
      </div>
    ),
  },
  {
    accessorKey: "RequestId",
    header: () => (
      <div className="captionL text-muted-foreground">Request ID</div>
    ),
    cell: ({ getValue }) => (
      <div className="captionL underline">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "TransactionType",
    header: () => <div className="captionL text-muted-foreground">Type</div>,
    cell: ({ row }) => (
      <div className="flex flex-col flex-wrap">
        {/* TODO: change 'Deposit' in next line to transaction type */}
        <span className="text-[#141414] captionL font-bold">
          {row.original.SourceType === "SEND_MONEY"
            ? "Send Money"
            : row.original.SourceType === "ADD_MONEY"
            ? "Deposit"
            : "Exchange"}
        </span>
        <span className="text-[#a5a7a6] captionL">
          {Utilities.getTypeLabel(row.original.TransactionType)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "to",
    header: () => <div className="captionL text-muted-foreground">To</div>,
    cell: ({ row }) => <div className="captionL">{row.original.FullName}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="captionL text-muted-foreground">Amount</div>,
    cell: ({ row }) => {
      const raw = row.original.Amount?.replace(/,/g, "") || ""
      const numeric = Number(raw)
      return isNaN(numeric) ? (
        ""
      ) : (
        <div className="flex items-center text-[#008767]">
          +
          <FormatNumberView
            currency={row.original.Currency}
            transactionType={row.original.TransactionType}
            value={row.original.Amount}
            withCountry
          />
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="captionL text-muted-foreground">Status</div>,
    cell: ({ row }) => {
      if (row.original.Status == "PENDING") {
        return (
          <Badge
            variant="secondary"
            className="py-1 px-3 rounded-full captionL bg-[#FFB82E1F] text-[#947100]"
          >
            Pending
          </Badge>
        )
      } else if (row.original.Status == "SUCCESS") {
        return (
          <Badge
            variant="secondary"
            className="py-1 px-3 rounded-full captionL bg-[#00876714] text-[#008767]"
          >
            Success
          </Badge>
        )
      } else {
        return (
          <Badge
            variant="secondary"
            className="py-1 px-3 rounded-full captionL bg-[#E23A4A14] text-[#E23A4A]"
          >
            Cancelled
          </Badge>
        )
      }
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="captionL text-muted-foreground">Actions</div>,
    cell: ({ row }) => {
      if (row.original.SourceType === "SEND_MONEY") {
        return (
          <Link to={`/send-money/process/${row.original.RequestId}`}>
            <Button variant="link" size="sm" className="px-0 text-blue-600">
              View Details
            </Button>
          </Link>
        )
      } else if (row.original.ActionStatus == "UPLOAD_RECEIPT") {
        return (
          <Link to={`/dashboard/deposit-process/${row.original.RequestId}`}>
            <Button variant="destructive" size="sm">
              Upload Receipt
            </Button>
          </Link>
        )
      } else if (row.original.ActionStatus == "VIEW_CANCEL") {
        return (
          <Link to={`/dashboard/deposit-process/${row.original.RequestId}`}>
            <Button variant="destructive" size="sm">
              View Cancellation
            </Button>
          </Link>
        )
      } else if (row.original.ActionStatus == "VIEW_REJECT") {
        return (
          <Link to={`/dashboard/deposit-process/${row.original.RequestId}`}>
            <Button variant="destructive" size="sm">
              View Rejection
            </Button>
          </Link>
        )
      } else if (row.original.ActionStatus == "VIEW_PROCESS") {
        return (
          <div className="flex gap-2 items-center">
            <Link to={`/dashboard/deposit-process/${row.original.RequestId}`}>
              <Button variant="link" size="sm" className="px-0 text-blue-600">
                View Details
              </Button>
            </Link>
            {row.original.ReceiptUrl?.length > 0 && (
              <>
                <span className="text-[#A5A7A6]">|</span>
                <a
                  href={row.original.ReceiptUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 text-blue-600"
                  >
                    Download
                  </Button>
                </a>
              </>
            )}
          </div>
        )
      } else if (row.original.ActionStatus == "WAITING_FOR_APPROVAL") {
        return (
          <Link to={`/dashboard/deposit-process/${row.original.RequestId}`}>
            <Button variant="link" size="sm" className="px-0 text-blue-600">
              Waiting for approval
            </Button>
          </Link>
        )
      } else if (row.original.ActionStatus == "WAITING_FOR_INSTRUCTED") {
        return (
          <Link to={`/dashboard/deposit-process/${row.original.RequestId}`}>
            <Button variant="link" size="sm" className="px-0 text-blue-600">
              Share Instructions
            </Button>
          </Link>
        )
      } else if (row.original.ActionStatus == "WAITING_FOR_PAYMENT") {
        return (
          <Link to={`/dashboard/deposit-process/${row.original.RequestId}`}>
            <Button variant="destructive" size="sm">
              Waiting payment
            </Button>
          </Link>
        )
      } else {
        return (
          <Link to={`/dashboard/deposit-process/${row.original.RequestId}`}>
            <Button variant="link" size="sm" className="px-0 text-blue-600">
              View Details
            </Button>
          </Link>
        )
      }
    },
  },
]

export default columns
