import { PersonnelType } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, PenIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const teamColorMap: Record<string, string> = {
  CHARLIE: "text-blue-500",
  ALPHA: "text-green-500",
  BRAVO: "text-red-500",
};

type Props = {
  setSelectedPersonnel: (personnel: PersonnelType) => void;
  setModalOpen: (value: boolean) => void;
};

export const staffColumns = ({
  setSelectedPersonnel,
  setModalOpen,
}: Props): ColumnDef<PersonnelType>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        TEAM
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const personnel = row.original;
      const teamColorClass = teamColorMap[personnel.team] || "text-gray-500";

      return (
        <span className={`font-medium ${teamColorClass}`}>
          {personnel.team}
        </span>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role/Designation
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const personnelRole = row.original;

      const formatRole =
        personnelRole.role === "BOTH" ? "DRIVER/CREW" : personnelRole.role;

      return <span className="font-medium">{formatRole}</span>;
    },
  },
  {
    accessorKey: "totalTransportCases",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Transport Cases
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "totalEmergencyCases",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Emergency Cases
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "totalNumberOfOperations",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Operations
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const personnel = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setSelectedPersonnel(personnel);
                setModalOpen(true);
              }}
            >
              <PenIcon className="w-[16px] mr-2" />
              Edit
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
