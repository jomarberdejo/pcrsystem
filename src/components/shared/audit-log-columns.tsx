import momentPH from "@/lib/moment";
import { AuditLogType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AuditLogType>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <span>{row.original.action}</span>,
  },
  {
    id: "user",
    header: "Performed By",
    cell: ({ row }) => <span>{row.original.user}</span>,
  },
  {
    accessorKey: "timestamp",
    header: "Date & Time",
    cell: ({ row }) => (
      <span>
        {momentPH(row.original.timestamp).format("MMMM D, YYYY - h:mm A")}
      </span>
    ),
  },
  // {
  //   accessorKey: "recordId",
  //   header: "Record ID",
  //   cell: ({ row }) => (
  //     <span>{row.original.recordId ? row.original.recordId : "—"}</span>
  //   ),
  // },
];
