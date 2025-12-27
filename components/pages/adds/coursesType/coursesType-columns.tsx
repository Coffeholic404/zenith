import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import list from "@/public/table/List.svg"

import trash from "@/public/table/trash.svg"
import { Button } from "@/components/ui/button";
import { useDeleteTypeMutation} from "@/services/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import EditTypeModel from "./edit-coursesTypes";
export type CoursesType = {
    uniqueID: string,
    name: string,
}

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isDeleting
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    isDeleting: boolean;
}) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="rtl" dir="rtl">
                <AlertDialogHeader className="text-right">
                    <AlertDialogTitle className="text-right font-vazirmatn">
                        تأكيد الحذف
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-right font-vazirmatn">
                        هل أنت متأكد من حذف نوع الدورة "{itemName}"؟
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
    );
};


export const coursesTypeColumns: ColumnDef<CoursesType>[] = [
    {
        accessorKey: "sequence",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ت</p>
        },
        cell: ({ row }) => {
            return row.index + 1
        }
    },
    {
        accessorKey: "name",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الاسم</p>
        },
    },
    {
        id: "actions",
        header: ({ column }) => {
            return (
                <Button variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Image src={list} alt="list" className=" size-5" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const { data: session } = useSession();
            const userRole = session?.user?.role;
            const isAdmin = userRole === "Admin";
            if (isAdmin) return null;
            const [deleteType, { isLoading: isDeleting }] = useDeleteTypeMutation();
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);
            const { toast } = useToast();

            const handleDeleteClick = () => {
                setShowDeleteDialog(true);
            };

            const handleDeleteConfirm = async () => {
                try {
                    await deleteType({uniqueID: row.original.uniqueID}  ).unwrap();
                    toast({
                        title: "تم بنجاح",
                        description: "تم حذف نوع الدورة بنجاح",
                    });
                    setShowDeleteDialog(false);
                } catch (error: any) {
                    const errorMessage = error?.data?.errorMessages?.[0] ||
                        error?.data?.message ||
                        error?.message ||
                        "حدث خطأ أثناء الحذف";
                    toast({
                        title: "خطأ",
                        description: errorMessage,
                        variant: "destructive",
                    });
                }
            };

            const handleDeleteCancel = () => {
                setShowDeleteDialog(false);
            };

            return (
                <>
                    <div className="flex items-center justify-end gap-3 pe-4">
                        <EditTypeModel id={row.original.uniqueID} name={row.original.name} />
                        <Button
                            variant="ghost"
                            className="p-0 px-1"
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                        >
                            <Image src={trash} alt="trash" className=" size-5" />
                        </Button>
                    </div>

                    <DeleteConfirmationDialog
                        isOpen={showDeleteDialog}
                        onClose={handleDeleteCancel}
                        onConfirm={handleDeleteConfirm}
                        itemName={row.original.name}
                        isDeleting={isDeleting}
                    />
                </>
            )
        },
    }
]

export const coursesTypeColumnsNames = [
    { label: 'ت', dataIndex: 'sequence' },
    { label: 'الاسم', dataIndex: 'name' },
]
