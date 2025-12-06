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
import { BadgeInfo } from 'lucide-react';

import { useRouter } from "next/navigation"
import { useDeleteCourseMutation, Course, CourseDetails } from "@/services/courses"
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
export default function CoursesCard({ course }: { course: CourseDetails }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isActivitiesPopoverOpen, setIsActivitiesPopoverOpen] = useState(false);

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

    const handleShowActivities = () => {
        const activities = course.activities || [];

        if (activities.length === 0) {
            toast({
                title: "تنبيه",
                description: "لا توجد نشاطات لهذا المقرر",
                variant: "default",
            });
            return;
        }

        if (activities.length === 1) {
            // Navigate directly to the single activity
            router.push(`/activities/${activities[0].uniqueID}`);
        } else {
            // Open popover to show multiple activities
            setIsActivitiesPopoverOpen(true);
        }
    };

    const router = useRouter();
    return (
        <>
            <Card className="w-full p-[17px] min-h-36">
                <CardContent className=" p-0 space-y-4">
                    <div className=" flex justify-between items-center">
                        <div className=" font-vazirmatn space-y-1">
                            <p className=" text-cardTxt font-semibold">{course.character}</p>
                            <p className=" text-[#868585] font-light text-sm">{course.typeName}</p>
                            <p className=" text-[#868585] font-light text-sm">{course.startDate?.substring(0, 10)}</p>
                        </div>
                        <div className=" flex flex-col items-end gap-4 justify-center">
                            <Popover>
                                <PopoverTrigger>
                                    <EllipsisVertical className=" size-5 text-[#7B7B7B] hover:text-[#222222] cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent className=" w-[120px] rounded-xl">
                                    <Button variant="ghost" className=" w-full" onClick={() => router.push(`/courses/edit-course/${course.uniqueID}`)}>
                                        <Image src={pen} alt="pen" className=" size-[18px]" />
                                        <p className=" font-vazirmatn text-sm">تعديل</p>
                                    </Button >
                                    <Button variant="ghost" className=" hover:bg-red-400" onClick={() => setIsDeleteDialogOpen(true)}>
                                        <Image src={trash} alt="trash" className="size-[18px]" />
                                        <p className=" font-vazirmatn text-sm" >حذف</p>
                                    </Button>

                                    <Button variant="ghost" className="" onClick={() => router.push(`/courses/${course.uniqueID}`)}>
                                        <Image src={eye} alt="eye" className="size-[18px]" />
                                        <p className=" font-vazirmatn text-sm">عرض</p>
                                    </Button>
                                    <Button variant="ghost" className="" onClick={() => router.push(`/evaluation/add-evaluation/${course.uniqueID}`)}>
                                        <BadgeInfo className=" " />
                                        <p className=" font-vazirmatn text-sm">تقييم</p>
                                    </Button>
                                </PopoverContent>
                            </Popover>
                            <Badge className=" bg-badgeClr cursor-pointer  text-sidebaractive py-[3px] px-[17px] rounded-[8px] font-vazirmatn font-light text-sm hover:bg-badgeClr">
                                {course.status}
                            </Badge>
                        </div>
                    </div>
                    <div className=" flex justify-center items-center gap-4 flex-wrap">
                        <Button variant="outline" onClick={() => router.push(`/evaluation/${course.uniqueID}`)} className=" font-vazirmatn text-sm rounded-xl">عرض التقييمات</Button>
                        <Popover open={isActivitiesPopoverOpen} onOpenChange={setIsActivitiesPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className=" font-vazirmatn text-sm rounded-xl"
                                    onClick={handleShowActivities}
                                >
                                    عرض النشاطات
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className=" w-[280px] rounded-xl">
                                <div className="space-y-2">
                                    <p className="font-vazirmatn font-semibold text-sm text-cardTxt mb-3">
                                        اختر نشاط
                                    </p>
                                    {course.activities && course.activities.map((activity) => (
                                        <Button
                                            key={activity.uniqueID}
                                            variant="ghost"
                                            className="w-full justify-start font-vazirmatn text-sm"
                                            onClick={() => {
                                                router.push(`/activities/${activity.uniqueID}`);
                                                setIsActivitiesPopoverOpen(false);
                                            }}
                                        >
                                            <div className="flex flex-col items-start w-full">
                                                <span className="font-medium">{activity.typeName}</span>
                                                <span className="text-xs text-[#868585]">
                                                    {activity.date?.substring(0, 10)} - {activity.time}
                                                </span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
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