import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
// import ReactCountryFlag from "react-country-flag"
// import { socket } from "@/store";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "#",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "FirstName",
    header: "Full Name",
    cell: ({ row }) => row.original.FirstName + " " + row.original.LastName,
  },
  {
    accessorKey: "Email",
    header: "Email",
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: () => <Button variant="link">View</Button>,
  },
]
