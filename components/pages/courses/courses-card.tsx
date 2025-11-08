"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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

import { Badge } from "@/components/ui/badge"
import eye from "@/public/courses/Eye.svg"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import pen from "@/public/table/Pen.svg"
import trash from "@/public/table/trash.svg"
import trash2 from "@/public/employees/TrashBin.svg"

import { useRouter } from "next/navigation"
import { useDeleteCourseMutation, Course } from "@/services/courses"
import { useState } from "react";
export default function CoursesCard({ course }: { course: Course }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
    const { toast } = useToast();


    const handleDeleteCourse = async (id: string) => {
        try {
            await deleteCourse({ uniqueID: course.uniqueID }).unwrap();

            // Show success toast
            toast({
                title: "تم بنجاح",
                description: `تم حذف المقرر ${course.character} بنجاح`,
                variant: "default",
            });

            // Close the dialog
            setIsDeleteDialogOpen(false);

            // Refresh the page to update the employee list
            router.refresh();

        } catch (error: any) {
            // Show error toast with the exact error message from API
            const errorMessage = error?.data?.errorMessages?.[0] ||
                error?.data?.message ||
                error?.message ||
                "حدث خطأ أثناء حذف الموظف";

            toast({
                title: "خطأ",
                description: errorMessage,
                variant: "destructive",
            });

            // Close the dialog even on error
            setIsDeleteDialogOpen(false);
        }
    };

    const router = useRouter();
    return (
        <>
            <Card className="min-w-[363px] max-w-[25rem] p-[17px] flex-1">
                <CardContent className=" p-0 space-y-4">
                    <div className=" flex justify-between items-center">
                        <div className=" font-vazirmatn space-y-1">
                            <p className=" text-cardTxt font-semibold">{course.character}</p>
                            <p className=" text-[#868585] font-light text-sm">{course.typeName}</p>
                            <p className=" text-[#868585] font-light text-sm">{course.startDate?.substring(0, 10)}</p>
                        </div>
                        <Badge className=" bg-badgeClr text-sidebaractive py-[3px] px-[17px] rounded-[8px] font-vazirmatn font-light text-sm">
                            {course.status}
                        </Badge>
                    </div>
                    <Button onClick={() => router.push(`/courses/${course.uniqueID}`)} variant="outline" className=" bg-detalisBtnBg font-vazirmatn font-normal text-md text-detalisTxtClr">
                        <Image src={eye} alt="eye" />
                        عرض التفاصيل
                    </Button>
                    <Separator className=" my-4" />
                    <div className=" flex items-center justify-evenly gap-4">
                        <Button onClick={() => router.push(`/courses/edit-course/${course.uniqueID}`)} variant="outline" className="font-vazirmatn font-normal text-md flex-1">
                            <Image src={pen} alt="pen" />
                            تعديل
                        </Button>
                        <Button onClick={() => setIsDeleteDialogOpen(true)} variant="outline" className="font-vazirmatn font-normal text-md flex-1">
                            <Image src={trash} alt="trash" />
                            حذف
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="font-vazirmatn">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right text-cardTxt">
                            تأكيد الحذف
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-right text-subtext">
                            هل أنت متأكد من حذف الدورة <span className="font-semibold text-cardTxt">{course.character}</span>؟
                            <br />
                            <span className="text-sm text-deleteTxt">لا يمكن التراجع عن هذا الإجراء.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel className="font-vazirmatn">
                            إلغاء
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteCourse(course.uniqueID || "")}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 font-vazirmatn"
                        >
                            {isDeleting ? "جاري الحذف..." : "حذف"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>

    )
}