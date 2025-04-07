import { StaffType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const staffColumns: ColumnDef<StaffType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    size: 100,
  },

  {
    accessorKey: "totalTransportCases",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Transport Cases
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    size: 100,
    // filterFn: (row, columnId, filterValue) => {
    //   const cellValue = row.getValue(columnId) as number | string;

    //   // Ensure filterValue exists and convert both to strings for partial matching
    //   if (filterValue !== undefined && filterValue !== null) {
    //     return cellValue.toString().includes(filterValue.toString());
    //   }

    //   return true; // Show all if no filter is applied
    // },
  },
  {
    accessorKey: "totalEmergencyCases",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Emergency Cases
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    size: 100,

    // filterFn: (row, columnId, filterValue) => {
    //   const cellValue = row.getValue(columnId) as number | string;

    //   // Ensure filterValue exists and convert both to strings for partial matching
    //   if (filterValue !== undefined && filterValue !== null) {
    //     return cellValue.toString().includes(filterValue.toString());
    //   }

    //   return true; // Show all if no filter is applied
    // },
  },

  {
    accessorKey: "totalNumberOfOperations",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Number of Operations
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    size: 100,
    // filterFn: (row, columnId, filterValue) => {
    //   const cellValue = row.getValue(columnId) as number | string;

    //   // Ensure filterValue exists and convert both to strings for partial matching
    //   if (filterValue !== undefined && filterValue !== null) {
    //     return cellValue.toString().includes(filterValue.toString());
    //   }

    //   return true; // Show all if no filter is applied
    // },
  },
];
