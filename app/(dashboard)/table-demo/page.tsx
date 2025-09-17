import type { Metadata } from "next"
import { DataTable } from "@/components/data-table"
import { columns,columnsNames } from "@/components/table-columns"

export const metadata: Metadata = {
  title: "الجداول | لوحة التحكم",
  description: "صفحة عرض الجداول مع ميزات متقدمة",
}

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

export default function TablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">الجداول</h1>
        <p className="text-muted-foreground">جدول بيانات متقدم مع ميزات متعددة</p>
      </div>

      <DataTable loading={false} expandedStatus={true} columns={columns} columnsNames={columnsNames} data={data} />
    </div>
  )
}

