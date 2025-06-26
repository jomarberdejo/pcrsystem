"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Download, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/shared/datatable-pagination";
import { formatColumnKey } from "@/utils/column/formatColumnKey";
import { DatePickerWithRange } from "../date-range-picker";
import { DateRange } from "react-day-picker";
import StaffForm from "./staff-form";
import { filterDataByDateRange } from "@/utils/data-table/filterDataByDateRange";
import { PersonnelType } from "@/types";
import { computePersonnelStats } from "@/utils/data-table/computePersonnelStats";
import { logAction } from "@/actions";
import { getCurrentUser } from "@/lib/auth";
import { startOfMonth, endOfMonth } from "date-fns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterableColumns?: string[];
  onExport?: (data: TData[], exportTitle: string) => void;
  exportTitle: string;
  hasDateRange?: boolean;
  onRegister?: (type: "CREW" | "DRIVER", name: string, team: string) => void;
  currentUserRole?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  onExport,
  exportTitle,
  hasDateRange,
  onRegister,
  currentUserRole,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});

  console.log(currentUserRole);

  const filteredData = useMemo(() => {
    console.log(data);
    const mode = exportTitle === "PCR_CASES" ? "flat" : "nested";

    const filtered = filterDataByDateRange(data, dateRange, {
      mode,
    });

    if (
      exportTitle === "AMBULANCE_CREWS" ||
      exportTitle === "AMBULANCE_DRIVERS"
    ) {
      return computePersonnelStats(
        filtered as unknown as PersonnelType[],
        dateRange
      ) as unknown as TData[];
    }

    return filtered;
  }, [data, dateRange, exportTitle]);

  const registerType = exportTitle === "AMBULANCE_CREWS" ? "CREW" : "DRIVER";

  const table = useReactTable({
    data: filteredData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
  });

  const handleInputChange = (col: string, value: string) => {
    if (col === "ambulanceCrews") {
      table.getColumn(col)?.setFilterValue(value);

      if (value.trim() === "") {
        setSuggestions((prev) => ({ ...prev, [col]: [] }));
        return;
      }

      const allCrewMembers = filteredData.flatMap((item) => {
        const crewsStr = (item as any)[col];
        if (!crewsStr) return [];
        return crewsStr.split(",").map((crew: string) => crew.trim());
      });

      const uniqueCrewMembers = Array.from(new Set(allCrewMembers));

      const filteredCrewSuggestions = uniqueCrewMembers
        .filter((name) => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);

      setSuggestions((prev) => ({
        ...prev,
        [col]: filteredCrewSuggestions,
      }));
    } else {
      const column = table.getColumn(col);
      column?.setFilterValue(value);

      if (value.trim() === "") {
        setSuggestions((prev) => ({ ...prev, [col]: [] }));
        return;
      }

      const uniqueValues = Array.from(
        new Set(filteredData.map((item) => (item as any)[col]))
      )
        .filter((v) => v?.toLowerCase?.().includes(value.toLowerCase()))
        .slice(0, 5);

      setSuggestions((prev) => ({
        ...prev,
        [col]: uniqueValues,
      }));
    }
  };

  return (
    <div>
      <div className="flex items-center flex-wrap lg:flex-nowrap gap-4 py-4">
        {filterableColumns.map((col) => (
          <div className="relative" key={col}>
            <Input
              placeholder={`Search ${formatColumnKey(col)}...`}
              value={(table.getColumn(col)?.getFilterValue() as string) ?? ""}
              onChange={(event) => handleInputChange(col, event.target.value)}
              className="max-w-sm w-full border-border outline-ring/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
            />
            {suggestions[col]?.length > 0 && (
              <div className="absolute z-10 w-full mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg dark:border-gray-700">
                {suggestions[col].map((suggestion) => (
                  <div
                    key={suggestion}
                    onClick={() => {
                      table.getColumn(col)?.setFilterValue(suggestion);
                      setSuggestions((prev) => ({ ...prev, [col]: [] }));
                    }}
                    className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-700"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {(exportTitle === "PCR_CASES" ||
          (currentUserRole === "MDRRMO_ADMIN" &&
            exportTitle !== "PCR_CASES")) &&
          hasDateRange && (
            <DatePickerWithRange
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          )}

        {currentUserRole === "MDRRMO_ADMIN" && onExport && hasDateRange && (
          <div className="flex justify-end items-center">
            <Button
              variant="default"
              onClick={async () => {
                onExport(filteredData, exportTitle);
                const currentUser = await getCurrentUser();

                if (!currentUser) {
                  throw new Error("Not authenticated");
                }

                const adminId = currentUser.id;

                await logAction(`EXPORTED_DATA for (${exportTitle})`, adminId);
              }}
              disabled={filteredData.length === 0}
            >
              <Download />
              <span>Export to Excel</span>
            </Button>
          </div>
        )}

        {/* {onExport && !hasDateRange && (
          <div className="flex justify-end items-center">
            <Button
              variant="default"
              onClick={() => onExport(data, exportTitle)}
              disabled={data.length === 0}
            >
              <Download />
              <span>Export to Excelss</span>
            </Button>
          </div>
        )} */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 />
              <span>View</span>
              <ChevronsUpDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {onRegister && (
          <StaffForm type={registerType} onRegister={onRegister}>
            <span>Register New</span>
          </StaffForm>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // style={{
                      //   minWidth: header.column.columnDef.size,
                      //   maxWidth: header.column.columnDef.size,
                      // }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        minWidth: cell.column.columnDef.size,
                        maxWidth: cell.column.columnDef.size,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
