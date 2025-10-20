"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { planes } from "@/components/pages/adds/adds-columns";
import { NominatedParty } from "@/components/pages/adds/nominated/nominated-columns";
import { ChevronDown, Filter, SlidersHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import searchIcon from "@/public/table/Magnifer.svg";
import filterIcon from "@/public/table/Filter.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import NominatedModel from "./pages/adds/nominated/nominatedModel";

interface DataTableProps<TData, TValue, TNames> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnsNames: TNames[];
  loading?: boolean;
  expandedStatus?: boolean;
  type?: string;
}

export function DataTable<TData extends { email?: string } | planes | NominatedParty, TValue, TNames>({
  columns,
  data,
  columnsNames,
  loading = false,
  expandedStatus,
  type,
}: DataTableProps<TData, TValue, TNames>) 

{
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
  });

  // const toggleRowExpanded = (id: string) => {
  //   setExpandedRows((prev) => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };
  onExpandedChange: (updaterOrValue: React.SetStateAction<{}>) => {
    setExpanded(updaterOrValue);
    console.log("Updated expanded state:", updaterOrValue);
  };
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 ">
            <div className=" flex gap-2">
              <div className=" relative">
                <Image
                  src={searchIcon}
                  alt="magnifier icon"
                  className=" absolute inset-y-2  start-2 flex items-center  pointer-events-none"
                />
                <Input
                  id="search"
                  placeholder="بحث ..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className=" bg-searchBg rounded-xl block w-full p-4 ps-10 min-w-[21rem] font-vazirmatn placeholder:text-placeholderClr placeholder:text-base placeholder:font-normal focus-visible:ring-1 focus-visible:ring-searchBg focus-visible:ring-offset-2"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className=" size-10 p-0 rounded-xl bg-searchBg">
                    <Image src={filterIcon} alt="filter icon" className=" size-[22px]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={(
                      table.getColumn("name")?.getFilterValue() as
                      | string[]
                      | undefined
                    )?.includes("نشط")}
                    onCheckedChange={(value) => {
                      const filterValues =
                        (table
                          .getColumn("name")
                          ?.getFilterValue() as string[]) || [];
                      if (value) {
                        table
                          .getColumn("name")
                          ?.setFilterValue([...filterValues, "نشط"]);
                      } else {
                        table
                          .getColumn("name")
                          ?.setFilterValue(
                            filterValues.filter((val) => val !== "نشط")
                          );
                      }
                    }}
                  >
                    نشط
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(
                      table.getColumn("name")?.getFilterValue() as
                      | string[]
                      | undefined
                    )?.includes("غير نشط")}
                    onCheckedChange={(value) => {
                      const filterValues =
                        (table
                          .getColumn("name")
                          ?.getFilterValue() as string[]) || [];
                      if (value) {
                        table
                          .getColumn("name")
                          ?.setFilterValue([...filterValues, "غير نشط"]);
                      } else {
                        table
                          .getColumn("name")
                          ?.setFilterValue(
                            filterValues.filter((val) => val !== "غير نشط")
                          );
                      }
                    }}
                  >
                    غير نشط
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(
                      table.getColumn("name")?.getFilterValue() as
                      | string[]
                      | undefined
                    )?.includes("معلق")}
                    onCheckedChange={(value) => {
                      const filterValues =
                        (table
                          .getColumn("name")
                          ?.getFilterValue() as string[]) || [];
                      if (value) {
                        table
                          .getColumn("name")
                          ?.setFilterValue([...filterValues, "معلق"]);
                      } else {
                        table
                          .getColumn("name")
                          ?.setFilterValue(
                            filterValues.filter((val) => val !== "معلق")
                          );
                      }
                    }}
                  >
                    معلق
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="mr-2">
                    <Filter className="ml-2 h-4 w-4" />
                    الفلاتر
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={(
                      table.getColumn("status")?.getFilterValue() as
                        | string[]
                        | undefined
                    )?.includes("نشط")}
                    onCheckedChange={(value) => {
                      const filterValues =
                        (table
                          .getColumn("status")
                          ?.getFilterValue() as string[]) || [];
                      if (value) {
                        table
                          .getColumn("status")
                          ?.setFilterValue([...filterValues, "نشط"]);
                      } else {
                        table
                          .getColumn("status")
                          ?.setFilterValue(
                            filterValues.filter((val) => val !== "نشط")
                          );
                      }
                    }}
                  >
                    نشط
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(
                      table.getColumn("status")?.getFilterValue() as
                        | string[]
                        | undefined
                    )?.includes("غير نشط")}
                    onCheckedChange={(value) => {
                      const filterValues =
                        (table
                          .getColumn("status")
                          ?.getFilterValue() as string[]) || [];
                      if (value) {
                        table
                          .getColumn("status")
                          ?.setFilterValue([...filterValues, "غير نشط"]);
                      } else {
                        table
                          .getColumn("status")
                          ?.setFilterValue(
                            filterValues.filter((val) => val !== "غير نشط")
                          );
                      }
                    }}
                  >
                    غير نشط
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={(
                      table.getColumn("status")?.getFilterValue() as
                        | string[]
                        | undefined
                    )?.includes("معلق")}
                    onCheckedChange={(value) => {
                      const filterValues =
                        (table
                          .getColumn("status")
                          ?.getFilterValue() as string[]) || [];
                      if (value) {
                        table
                          .getColumn("status")
                          ?.setFilterValue([...filterValues, "معلق"]);
                      } else {
                        table
                          .getColumn("status")
                          ?.setFilterValue(
                            filterValues.filter((val) => val !== "معلق")
                          );
                      }
                    }}
                  >
                    معلق
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="ml-2 h-4 w-4" />
                    الأعمدة
                    <ChevronDown className="mr-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
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
                    ))}
                </DropdownMenuContent>
              </DropdownMenu> */}
              {/* <Button className=" P-0 size-10 rounded-xl bg-btnTxtClr hover:bg-btnTxtClr hover:brightness-110">
                <Plus strokeWidth={4} />
              </Button> */}
              {
                type === "nominated" && <NominatedModel />
                }
            </div>
          </div>

          <div className="rounded-md ">
            <Table >
              <TableHeader className=" bg-searchBg ">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className=" border-none">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="first:rounded-s-lg last:rounded-e-lg last:text-left">
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
              <TableBody className="">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: columns.length }).map(
                        (_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow

                        data-state={row.getIsSelected() && "selected"}
                        onClick={(e) => {
                          e.stopPropagation();

                          // Check if the row is already expanded
                          if (row.getIsExpanded()) {
                            row.toggleExpanded(false); // Collapse the row
                          } else {
                            table.toggleAllRowsExpanded(false); // Collapse others
                            row.toggleExpanded(true); // Expand the clicked row
                          }
                        }}
                        className={
                          expandedStatus
                            ? "cursor-pointer hover:bg-muted/50 border-none"
                            : "border-none text-tableRow"
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            className=" "
                            key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {/* {row.getIsExpanded() && expandedStatus && (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="bg-muted/50 p-4"
                          >
                            {row?.original?.email}
                          </TableCell>
                        </TableRow>
                      )} */}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      لا توجد نتائج.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 space-x-reverse py-4 rtl:space-x-reverse">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div>
                  تم تحديد {table.getFilteredSelectedRowModel().rows.length} من
                  أصل {table.getFilteredRowModel().rows.length} صف.
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                التالي
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
// function setExpanded(updaterOrValue: Updater<ExpandedState>): void {
//   throw new Error("Function not implemented.");
// }
