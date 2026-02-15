'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import searchIcon from '@/public/table/Magnifer.svg';
import filterIcon from '@/public/table/Filter.svg';
import { Button } from '@/components/ui/button';

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  showAddButton?: boolean;
}

export function DataTableSkeleton({ columnCount = 3, rowCount = 5, showAddButton = false }: DataTableSkeletonProps) {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Search and Filter Section Skeleton */}
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex gap-2">
              {/* Search Input Skeleton */}
              <div className="relative">
                <Image
                  src={searchIcon}
                  alt="magnifier icon"
                  className="absolute inset-y-2 start-2 flex items-center pointer-events-none opacity-50"
                />
                <Skeleton className="h-12 w-80 rounded-xl" />
              </div>
              {/* Filter Button Skeleton */}
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>

            {/* Add Button Section */}
            <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
              {showAddButton && <Skeleton className="h-10 w-24 rounded-xl" />}
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="rounded-md">
            <Table>
              {/* Table Header Skeleton */}
              <TableHeader className="bg-searchBg">
                <TableRow className="border-none">
                  {Array.from({ length: columnCount }).map((_, index) => (
                    <TableHead
                      key={index}
                      className={`${index === 0 ? 'rounded-s-lg' : ''} ${index === columnCount - 1 ? 'rounded-e-lg' : ''}`}
                    >
                      <Skeleton className="h-5 w-20 animate-pulse" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              {/* Table Body Skeleton */}
              <TableBody>
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                  <TableRow key={rowIndex} className="border-none">
                    {Array.from({ length: columnCount }).map((_, cellIndex) => (
                      <TableCell key={cellIndex} className="py-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {cellIndex === columnCount - 1 ? (
                            // Actions column - show button skeletons
                            <div className="flex gap-2">
                              <Skeleton className="h-8 w-8 rounded animate-pulse" />
                              <Skeleton className="h-8 w-8 rounded animate-pulse" />
                            </div>
                          ) : cellIndex === 0 ? (
                            // First column (sequence) - smaller skeleton
                            <Skeleton className="h-6 w-8 animate-pulse" />
                          ) : (
                            // Regular content columns
                            <Skeleton className="h-6 w-32 animate-pulse" />
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40 animate-pulse" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20 animate-pulse" />
              <Skeleton className="h-8 w-8 animate-pulse" />
              <Skeleton className="h-8 w-8 animate-pulse" />
              <Skeleton className="h-8 w-20 animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
