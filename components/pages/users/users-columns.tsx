"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import pen from "@/public/table/Pen.svg"
import trash from "@/public/table/trash.svg"
import list from "@/public/table/List.svg"

import { Button } from "@/components/ui/button"

// تعريف نوع البيانات - matching API response
export type User = {
  id: string
  userName: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
}

// تعريف الأعمدة
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "sequence",
    header: () => {
      return <p className="font-vazirmatn font-normal text-base text-tableHeader">ت</p>
    },
    cell: ({ row }) => {
      return row.index + 1
    }
  },
  {
    accessorKey: "userName",
    header: () => {
      return <p className="font-vazirmatn font-normal text-base text-tableHeader">اسم المستخدم</p>
    },
  },
  {
    accessorKey: "email",
    header: () => {
      return <p className="font-vazirmatn font-normal text-base text-tableHeader">البريد الإلكتروني</p>
    },
    cell: ({ row }) => (
      <div dir="ltr" className="text-right">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => {
      return <p className="font-vazirmatn font-normal text-base text-tableHeader">الاسم الأول</p>
    },
  },
  {
    accessorKey: "lastName",
    header: () => {
      return <p className="font-vazirmatn font-normal text-base text-tableHeader">اسم العائلة</p>
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Image src={list} alt="list" className="size-5"/>
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex items-center justify-end gap-3 pe-4">
          <Button variant="ghost" className="p-0">
            <Image src={pen} alt="pen" className="size-5"/>
          </Button>
          <Button variant="ghost" className="p-0">
            <Image src={trash} alt="trash" className="size-5"/>
          </Button>
        </div>
      )
    },
  }
]

// تعريف أسماء الأعمدة
export const userColumnsNames = [
  { label: 'ت', dataIndex: 'sequence' },
  { label: 'اسم المستخدم', dataIndex: 'userName' },
  { label: 'البريد الإلكتروني', dataIndex: 'email' },
  { label: 'الاسم الأول', dataIndex: 'firstName' },
  { label: 'اسم العائلة', dataIndex: 'lastName' },
]

