'use client';

import * as React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { columns, userColumnsNames, type User } from '@/components/pages/users/users-columns';
import { UserFormModal } from '@/components/pages/users/user-form-modal';
import { useRouter } from 'next/navigation';
import { useGetUsersQuery } from '@/services/users';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import Image from 'next/image';
import searchIcon from '@/public/table/Magnifer.svg';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UsersTable() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const router = useRouter();

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPageNumber(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: usersData, isLoading } = useGetUsersQuery({
    pageNumber,
    pageSize: 10,
    ...(searchQuery && { searchQuery })
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: usersData?.result?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  const handlePreviousPage = () => {
    if (usersData?.result?.hasPrevious) {
      setPageNumber(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (usersData?.result?.hasNext) {
      setPageNumber(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-4 font-vazirmatn">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/users/register')} className=" bg-sidebaractive ">
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة مستخدم جديد
        </Button>
      </div>

      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="flex gap-2">
                <div className="relative">
                  <Image
                    src={searchIcon}
                    alt="magnifier icon"
                    className="absolute inset-y-2 start-2 flex items-center pointer-events-none"
                  />
                  <Input
                    id="search"
                    placeholder="بحث ..."
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                    className="bg-searchBg rounded-xl block w-full p-4 ps-10 min-w-[21rem] font-vazirmatn placeholder:text-placeholderClr placeholder:text-base placeholder:font-normal focus-visible:ring-1 focus-visible:ring-searchBg focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md">
              <Table>
                <TableHeader className="bg-searchBg">
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id} className="border-none">
                      {headerGroup.headers.map(header => (
                        <TableHead key={header.id} className="first:rounded-s-lg last:rounded-e-lg last:text-left">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: columns.length }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className="border-none text-tableRow"
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        لا توجد نتائج.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 space-x-reverse py-4 rtl:space-x-reverse">
              <div className="flex-1 text-sm text-muted-foreground">
                {usersData?.result && (
                  <div>
                    عرض {(pageNumber - 1) * 10 + 1} - {Math.min(pageNumber * 10, usersData.result.totalCount)} من أصل{' '}
                    {usersData.result.totalCount}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={!usersData?.result?.hasPrevious}
                >
                  السابق
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!usersData?.result?.hasNext}>
                  التالي
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
