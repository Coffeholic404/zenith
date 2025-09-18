"use client"

import * as React from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { columns, userColumnsNames } from "@/components/pages/users/users-columns"
import { UserFormModal } from "@/components/pages/users/user-form-modal"

// بيانات تجريبية للجدول
const data = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    status: "نشط",
    role: "مدير",
    createdAt: "2023-01-15T09:30:00",
  },
  {
    id: "2",
    name: "سارة علي",
    email: "sara@example.com",
    status: "غير نشط",
    role: "مستخدم",
    createdAt: "2023-02-20T14:20:00",
  },
  {
    id: "3",
    name: "محمد خالد",
    email: "mohamed@example.com",
    status: "نشط",
    role: "مشرف",
    createdAt: "2023-03-10T11:45:00",
  },
  {
    id: "4",
    name: "فاطمة أحمد",
    email: "fatima@example.com",
    status: "معلق",
    role: "مستخدم",
    createdAt: "2023-04-05T16:15:00",
  },
  {
    id: "5",
    name: "عمر حسن",
    email: "omar@example.com",
    status: "نشط",
    role: "مدير",
    createdAt: "2023-05-22T10:00:00",
  },
  {
    id: "6",
    name: "نورا سعيد",
    email: "noura@example.com",
    status: "غير نشط",
    role: "مستخدم",
    createdAt: "2023-06-18T13:30:00",
  },
  {
    id: "7",
    name: "خالد إبراهيم",
    email: "khaled@example.com",
    status: "نشط",
    role: "مشرف",
    createdAt: "2023-07-09T09:15:00",
  },
  {
    id: "8",
    name: "هدى محمود",
    email: "huda@example.com",
    status: "معلق",
    role: "مستخدم",
    createdAt: "2023-08-14T15:45:00",
  },
  {
    id: "9",
    name: "يوسف أحمد",
    email: "yousef@example.com",
    status: "نشط",
    role: "مدير",
    createdAt: "2023-09-30T11:20:00",
  },
  {
    id: "10",
    name: "ليلى عبدالله",
    email: "layla@example.com",
    status: "غير نشط",
    role: "مستخدم",
    createdAt: "2023-10-25T14:10:00",
  },
]

export function UsersTable() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة مستخدم جديد
        </Button>
      </div>
      <DataTable columns={columns} data={data} columnsNames={userColumnsNames} />
      <UserFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}

