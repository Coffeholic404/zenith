"use client"
import Image from "next/image"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import { Button } from "@/components/ui/button"
import { EllipsisVertical } from 'lucide-react';
import pen from "@/public/table/Pen.svg"
import trash from "@/public/table/trash.svg"
import eye from "@/public/student/Eye.svg"
import { Badge } from "@/components/ui/badge"
import { type Student } from "@/services/students"
import { useRouter } from "next/navigation";
import { useDeleteStudentMutation } from "@/services/students";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverArrow,
} from "@/components/ui/popover";
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
import { useState } from "react"
function StudentCard({ student }: { student: Student }) {
    const router = useRouter();
    const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
    const { toast } = useToast();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const itemName = student.name;
    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };
    const handleDelete = async () => {
        try {
            const response = await deleteStudent(student.uniqueID).unwrap();

            // Check if the API response indicates success
            if (response?.isSuccess === false) {
                // API returned an error response
                const errorMessage = response?.errorMessages?.[0] ||
                    "حدث خطأ أثناء حذف الطالب. يرجى المحاولة مرة أخرى.";

                toast({
                    title: "خطأ أثناء حذف الطالب",
                    description: errorMessage,
                    variant: "destructive",
                });
                setShowDeleteDialog(false);
                return;
            }

            // Success case
            toast({
                title: "تم حذف الطالب",
                description: `تم حذف الطالب ${itemName} بنجاح.`,

            });
            setShowDeleteDialog(false);
        } catch (error: any) {
            // Extract error message from server response
            const errorMessage = error?.data?.errorMessages?.[0] ||
                error?.data?.message ||
                "حدث خطأ أثناء حذف الطالب. يرجى المحاولة مرة أخرى.";

            toast({
                title: "خطأ أثناء حذف الطالب",
                description: errorMessage,
                variant: "destructive",
            });
            setShowDeleteDialog(false);
        }
    }
    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
    };

    const profileImage = student.attachments?.filter(attachment => attachment.typeName === "صورة شخصية")[0];
    console.log(profileImage)
    return (
        <>
            <Card className="rounded-2xl">
                <CardHeader className=" flex items-center justify-between flex-row gap-2 p-2 px-3 ">
                    <div className=" flex items-center justify-start flex-row gap-2">
                        <Avatar className=" size-14">
                            <AvatarImage src={`http://aliali.runasp.net${profileImage?.file}`} alt={student.name} />
                            <AvatarFallback>{student.name.split(' ')[0].charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className=" font-vazirmatn font-black text-sm place-items-start pb-4">
                            {student.name}
                        </h4>
                    </div>
                    <Popover>
                        <PopoverTrigger>
                            <EllipsisVertical className=" size-5 text-[#7B7B7B] hover:text-[#222222] cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className=" w-[120px] rounded-xl">
                            <Button variant="ghost" className=" w-full" onClick={() => router.push(`/students/edit-student/${student.uniqueID}`)}>
                                <Image src={pen} alt="pen" className=" size-[18px]" />
                                <p className=" font-vazirmatn text-sm">تعديل</p>
                            </Button >
                            <Button variant="ghost" className=" hover:bg-red-400" onClick={handleDeleteClick}>
                                <Image src={trash} alt="trash" className="size-[18px]" />
                                <p className=" font-vazirmatn text-sm" >حذف</p>
                            </Button>

                            <Button variant="ghost" className="" onClick={() => router.push(`/students/${student.uniqueID}`)}>
                                <Image src={eye} alt="eye" className="size-[18px]" />
                                <p className=" font-vazirmatn text-sm">عرض</p>
                            </Button>
                        </PopoverContent>
                    </Popover>
                </CardHeader>
                <Separator className=" my-8 mb-6 text-[#CCCCCC] max-w-[284px] mx-auto border rounded-2xl border-[#CCCCCC]" />
                <CardFooter className=" flex  flex-row items-center gap-2 px-9 ">
                    {/* <Button variant="outline" className=" w-[130px] rounded-xl">
                            <Image src={pen} alt="pen" className=" size-[18px]" />
                            <p className=" font-vazirmatn text-sm">تعديل</p>
                        </Button >
                        <Button variant="outline" className=" w-[130px] rounded-xl">
                            <Image src={trash} alt="trash" className="size-[18px]" />
                            <p className=" font-vazirmatn text-sm">حذف</p>
                        </Button> */}
                    <Badge className=" bg-sidebaractive">
                        {student.hight}cm
                    </Badge>
                    <Badge className=" bg-sidebaractive">
                        {student.width}kg
                    </Badge>
                </CardFooter>
            </Card>
            <DeleteConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={handleDeleteCancel}
                onConfirm={handleDelete}
                itemName={itemName}
                isDeleting={isDeleting}
            />
        </>
    )
}

export const DeleteConfirmationDialog = ({
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
                        هل أنت متأكد من حذف الطالب "{itemName}"؟
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

export default StudentCard;
