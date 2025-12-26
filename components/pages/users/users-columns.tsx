"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import pen from "@/public/table/Pen.svg"
import trash from "@/public/table/trash.svg"
import list from "@/public/table/List.svg"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useDeleteUserMutation } from "@/services/users"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

// تعريف نوع البيانات - matching API response
export type User = {
  id: string
  userName: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
}

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
  isDeleting: boolean
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rtl" dir="rtl">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="text-right font-vazirmatn">
            تأكيد الحذف
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right font-vazirmatn">
            هل أنت متأكد من حذف المستخدم "{itemName}"؟
            <br />
            لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogCancel
            onClick={onClose}
            className="font-vazirmatn"
            disabled={isDeleting}
          >
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 font-vazirmatn"
            disabled={isDeleting}
          >
            {isDeleting ? "جاري الحذف..." : "حذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
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
      const router = useRouter()
      const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)
      const { toast } = useToast()

      const handleDeleteClick = () => {
        setShowDeleteDialog(true)
      }

      const handleDeleteConfirm = async () => {
        try {
          await deleteUser({ id: user.id }).unwrap()
          toast({
            title: `تم حذف المستخدم ${user.userName}`,
          })
          setShowDeleteDialog(false)
        } catch (error) {
          toast({
            title: `حدث خطأ أثناء حذف المستخدم ${user.userName}`,
            variant: "destructive",
          })
        }
      }

      const handleDeleteCancel = () => {
        setShowDeleteDialog(false)
      }

      return (
        <>
          <div className="flex items-center justify-end gap-3 pe-4">
            <Button variant="ghost" className="p-0 px-1" onClick={() => router.push(`/users/edit-user/${user.id}`)}>
              <Image src={pen} alt="pen" className="size-5"/>
            </Button>
            <Button
              variant="ghost"
              className="p-0 px-1"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Image src={trash} alt="trash" className="size-5"/>
            </Button>
          </div>
          <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            itemName={user.userName}
            isDeleting={isDeleting}
          />
        </>
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

