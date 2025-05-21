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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterableColumns?: string[];
  onExport?: (data: TData[], exportTitle: string) => void;
  exportTitle: string;
  hasDateRange?: boolean;
  onRegister?: (type: "CREW" | "DRIVER", name: string, team: string) => void;
}

export function DataTable<
  TData extends { records?: { date?: string }[] } = {},
  TValue = unknown
>({
  columns,
  data,
  filterableColumns = [],
  onExport,
  exportTitle,
  hasDateRange,
  onRegister,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const filteredData = useMemo(() => {
    const mode =
      data && data.length > 0 && "records" in data[0] ? "nested" : "flat";

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

  return (
    <div>
      <div className="flex items-center flex-wrap lg:flex-nowrap gap-4 py-4">
        {filterableColumns.map((col) => (
          <Input
            key={col}
            placeholder={`Search ${formatColumnKey(col)}...`}
            value={(table.getColumn(col)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(col)?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-full border-border outline-ring/50"
          />
        ))}
        {hasDateRange && (
          <DatePickerWithRange
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        )}

        {onExport && hasDateRange && (
          <div className="flex justify-end items-center">
            <Button
              variant="default"
              onClick={() => onExport(filteredData, exportTitle)}
              disabled={filteredData.length === 0}
            >
              <Download />
              <span>Export to Excel</span>
            </Button>
          </div>
        )}

        {onExport && !hasDateRange && (
          <div className="flex justify-end items-center">
            <Button
              variant="default"
              onClick={() => onExport(data, exportTitle)}
              disabled={data.length === 0}
            >
              <Download />
              <span>Export to Excel</span>
            </Button>
          </div>
        )}

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
