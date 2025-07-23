import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Pagination from "@/components/ui/pagination"
import { ITransactionRespond, transferTypeItem } from "@/interfaces/Iwallet.ts"
import { useEffect, useState } from "react"
import { useGetTransactionsMutation } from "@/store/api/walletAPI"
import columns from "./columns"
import {
  PiSpinner,
  PiArrowsClockwise,
  PiHandCoins,
  PiMoneyWavy,
} from "react-icons/pi"
import Badge from "@/components/ui/badge"

const filters: Array<{
  id: "ALL" | "ADD_MONEY" | "SEND_MONEY" | "Exchange"
  name: string
  subItems?: {
    id: transferTypeItem[]
    name: string
  }[]
  icon?: JSX.Element
}> = [
  { id: "ALL", name: "All" },
  {
    id: "ADD_MONEY",
    name: "Deposit",
    subItems: [
      {
        id: [transferTypeItem.CASH_DELIVERY, transferTypeItem.CASH_PICKUP],
        name: "Cash",
      },
      { id: [transferTypeItem.ONLINE], name: "Electronic Transfer" },
      { id: [transferTypeItem.STABLE_COIN], name: "Stable Coin" },
    ],
    icon: <PiHandCoins size={16} />,
  },
  {
    id: "SEND_MONEY",
    name: "Send Money",
    subItems: [
      { id: [transferTypeItem.INTERNATIONAL], name: "International" },
      { id: [transferTypeItem.DOMESTIC], name: "Domestic" },
      { id: [transferTypeItem.CASH], name: "Cash" },
    ],

    icon: <PiMoneyWavy size={16} />,
  },
  { id: "Exchange", name: "Exchange", icon: <PiArrowsClockwise size={16} /> },
]

export default function TransactionTable({ pageSize }: { pageSize?: number }) {
  const [transactions, setTransactions] = useState<ITransactionRespond>()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  })
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [selectedFilter, setSelectedFilter] = useState<{
    filter: "ALL" | "ADD_MONEY" | "SEND_MONEY" | "Exchange"
    subItem?: transferTypeItem[]
  }>({ filter: "ALL", subItem: undefined })

  function tableFilterPart() {
    return (
      <div className="flex items-center gap-2">
        {filters.map((f) => (
          <Badge
            key={f.id}
            variant={
              selectedFilter.filter === f.id
                ? "activeFilterBadge"
                : "filterBadge"
            }
            subItems={f.subItems}
            activeSubItem={selectedFilter.subItem}
            onClick={() =>
              setSelectedFilter({ filter: f.id, subItem: undefined })
            }
            onChangeSubItem={(id) =>
              setSelectedFilter({ ...selectedFilter, subItem: id })
            }
          >
            {f.icon}
            {f.name}
          </Badge>
        ))}
      </div>
    )
  }
  const [getTransactionsRequest, getTransactionsRequestStatus] =
    useGetTransactionsMutation()

  async function getTransactions() {
    getTransactionsRequest({
      pageSize: pageSize || pagination.pageSize,
      page: pagination.pageIndex,
      status: ["PENDING", "SUCCESS", "FAILED", "PAYMENT_APPROVAL"],
      sourceType:
        selectedFilter?.filter !== "ALL" ? [selectedFilter?.filter] : undefined,
      transferType: selectedFilter.subItem,
    })
      .unwrap()
      .then((resp) => {
        setTransactions(resp)
      })
  }

  useEffect(() => {
    if (pageSize) setPagination({ pageIndex: 0, pageSize: pageSize })
    else getTransactions()
  }, [])

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    })
  }, [selectedFilter])

  useEffect(() => {
    getTransactions()
  }, [pagination])

  const table = useReactTable({
    data: transactions?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true,
    rowCount: transactions?.total || 0,
    pageCount: transactions?.total
      ? Math.ceil(transactions?.total / pagination.pageSize)
      : 0,
    state: {
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">{tableFilterPart()}</div>
      <Table className="text-center">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="pb-3" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {getTransactionsRequestStatus.isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-72 bg-[#22283108]"
              >
                <PiSpinner className="size-6 animate-spin m-auto" />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={
                  "border-none odd:bg-[#fafafa] even:bg-[#22283108] " +
                  (row.original.Status === "FAILED" ||
                  row.original.Status === "SUCCESS"
                    ? ""
                    : [
                        "UPLOAD_RECEIPT",
                        "VIEW_CANCEL",
                        "VIEW_REJECT",
                        "WAITING_FOR_PAYMENT",
                      ].includes(row.original.ActionStatus)
                    ? "!bg-[#e23a4a]/10 hover:!bg-[#e23a4a]/20"
                    : "")
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-left py-3" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-72 text-center">
                No transaction were found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-center space-x-2 py-4">
        <Pagination table={table} />
      </div>
    </div>
  )
}
