import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import list from "@/public/table/List.svg"
import trash from "@/public/table/trash.svg"
import { Button } from "@/components/ui/button";
import { useDeleteTrainingCourseMutation } from "@/services/trainingCourses";
import { useState } from "react";
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
import EditTrainingCourseModel from "./edit-TrainingCourses";

 export type TrainingCoursesColumns = {
    uniqueID: string,
    name: string,
    // notes: string,
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
                        هل أنت متأكد من حذف المهارة "{itemName}"؟
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

export const TrainingCoursesColumns: ColumnDef<TrainingCoursesColumns>[] =[
    {
        accessorKey:"sequence",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ت</p>
        },
        cell: ({row}) => {
            return row.index + 1
        }
    },
    {
        accessorKey:"name",
        header: () => {
            return <p className=" font-vazirmatn font-normal text-base text-tableHeader">الاسم</p>
        },
    },
    // {
    //     accessorKey:"notes",
    //     header: () => {
    //         return <p className=" font-vazirmatn font-normal text-base text-tableHeader">ملاحظات</p>
    //     },
    // },
    {
        id: "actions",
        header: ({ column }) => {
            return (
                <Button variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Image src={list} alt="list" className=" size-5"/>
                </Button>
            )
        },
        cell: ({ row }) => {
            const { toast } = useToast();
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);
            const [deleteTrainingCourseMutation, { isLoading: isDeleting }] = useDeleteTrainingCourseMutation();
            const itemName = row.original.name;
            const handleDeleteClick = () => {
                setShowDeleteDialog(true);
            };
            const handleDelete = async () => {
                try {
                    await deleteTrainingCourseMutation({ uniqueID: row.original.uniqueID }).unwrap();
                    toast({
                        title: "تم حذف الدورة",
                        description: `${itemName} تم حذفها بنجاح.`,
                    });
                setShowDeleteDialog(false);

                } catch (error) {
                    toast({
                        title: "خطأ أثناء الحذف",
                        description: "حدث خطأ أثناء حذف الاشتراك. يرجى المحاولة مرة أخرى.",
                        variant: "destructive",
                    });
                } finally {
                    setShowDeleteDialog(false);
                }
            };

            const handleDeleteCancel = () => {
                setShowDeleteDialog(false);
            };
            return (
                <>
                <div className="flex items-center justify-end gap-3 pe-4">
                    <EditTrainingCourseModel id={row.original.uniqueID} name={row.original.name} />
                    <Button variant="ghost" className="p-0" onClick={handleDeleteClick} disabled={isDeleting}>
                        <Image src={trash} alt="trash" className=" size-5"/>
                    </Button>
                </div>

                    <DeleteConfirmationDialog
                        isOpen={showDeleteDialog}
                        onClose={handleDeleteCancel}
                        onConfirm={handleDelete}
                        itemName={itemName}
                        isDeleting={isDeleting}
                    />
                    </>
            )
        },
    }
]

export const TrainingCoursesColumnsNames = [
    {label: 'ت', dataIndex: 'sequence'},
    {label: 'الاسم', dataIndex: 'name'},
]
