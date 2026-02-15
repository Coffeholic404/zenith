'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import trash from '@/public/table/trash.svg';
import pen from '@/public/table/Pen.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import add from '@/public/employees/plus.svg';
import eye from '@/public/courses/Eye.svg';
import plain from '@/public/courses/Plain.svg';
import map from '@/public/courses/map.svg';
import React from 'react';
import { useGetCourseByIdQuery, CourseDetails, useDeleteCourseMutation } from '@/services/courses';
import Loading from '@/components/pages/courses/loading';
import Error from '@/components/pages/courses/error';
import { useRouter } from 'next/navigation';
import { useDeleteActivityMutation, ActivityItem } from '@/services/activity';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [isCourseDeleteDialogOpen, setIsCourseDeleteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const { id: courseId } = React.use(params);
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, isError } = useGetCourseByIdQuery({ uniqueID: courseId });
  const router = useRouter();
  const [deleteActivity, { isLoading: isDeletingActivity }] = useDeleteActivityMutation();
  const [deleteCourse, { isLoading: isDeletingCourse }] = useDeleteCourseMutation();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'Admin';
  // Group participants by trainer
  const trainerGroups = React.useMemo(() => {
    if (!data?.result?.participants) return new Map();

    const groups = new Map<string, { trainerName: string; students: any[] }>();

    data.result.participants.forEach((participant: any) => {
      const trainerId = participant.trainerId;
      const trainerName = participant.trainerName;

      if (!groups.has(trainerId)) {
        groups.set(trainerId, { trainerName, students: [] });
      }

      groups.get(trainerId)?.students.push(participant);
    });

    return groups;
  }, [data?.result?.participants]);

  if (isError) {
    return <Error />;
  }
  if (isLoading) {
    return <Loading />;
  }

  const handleDeleteActivity = async () => {
    if (!activityToDelete) return;

    try {
      await deleteActivity({ uniqueID: activityToDelete }).unwrap();

      // Show success toast
      toast({
        title: 'تم بنجاح',
        description: `تم حذف النشاط بنجاح`,
        variant: 'default'
      });

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setActivityToDelete(null);

      // Refresh the page to update the activity list
      router.refresh();
    } catch (error: any) {
      // Show error toast with the exact error message from API
      const errorMessage =
        error?.data?.errorMessages?.[0] || error?.data?.message || error?.message || 'حدث خطأ أثناء حذف النشاط';

      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive'
      });

      // Close the dialog even on error
      setIsDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await deleteCourse({ uniqueID: courseId }).unwrap();

      // Show success toast
      toast({
        title: 'تم بنجاح',
        description: `تم حذف الدورة بنجاح`,
        variant: 'default'
      });

      // Close the dialog
      setIsCourseDeleteDialogOpen(false);

      // Redirect to courses list
      router.push('/courses');
    } catch (error: any) {
      // Show error toast with the exact error message from API
      const errorMessage =
        error?.data?.errorMessages?.[0] || error?.data?.message || error?.message || 'حدث خطأ أثناء حذف الدورة';

      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive'
      });

      // Close the dialog even on error
      setIsCourseDeleteDialogOpen(false);
    }
  };

  return (
    <div className=" space-y-4">
      <Card className="  flex justify-center items-center py-4">
        <CardContent
          className=" course-card min-w-[1170px] p-0 rounded-xl px-5 py-4 flex items-center justify-between border border-solid  border-image-[linear-gradient(116.99deg,_#C0EEFD_1.09%,_#C2B2FD_33.87%,_#DDBAE4_72.11%,_#DCDACE_99.45%,_#3D53B8_99.45%)]
"
        >
          <div className=" space-y-2">
            <p className=" font-vazirmatn font-semibold text-[25px]">{data?.result?.character}</p>
            <p className=" font-vazirmatn font-light text-base text-[#868585]">
              {data?.result?.startDate ? new Date(data.result.startDate).toLocaleDateString() : ''}
            </p>
            <Badge className=" bg-badgeClr text-sidebaractive font-vazirmatn font-light text-sm rounded-[10px] py-1 px-4">
              {data?.result?.typeName}
            </Badge>
          </div>
          <div className=" flex gap-4 font-vazirmatn self-end">
            {!isAdmin && (
              <Button
                variant="outline"
                className=" px-6 rounded-xl"
                onClick={() => router.push(`/courses/edit-course/${courseId}`)}
              >
                <Image src={pen} alt="edit" />
                تعديل
              </Button>
            )}
            {!isAdmin && (
              <Button
                className=" border border-red-500 px-6 rounded-xl hover:bg-red-500 hover:text-white"
                variant="outline"
                onClick={() => setIsCourseDeleteDialogOpen(true)}
              >
                <Image src={trash} alt="delete" />
                حذف
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <div className=" grid grid-cols-[1fr_327px] gap-4">
        <Card className=" rounded-lg">
          <CardHeader className=" flex flex-row items-center justify-between p-2 px-3 border-b border-solid border-[#DCDACE] mb-2">
            <p className=" font-vazirmatn text-subtext text-sm">المدربون</p>
            <p className=" font-vazirmatn text-subtext text-sm">{trainerGroups.size}</p>
          </CardHeader>

          <CardContent className=" space-y-4 mt-3">
            {Array.from(trainerGroups.entries()).map(([trainerId, { trainerName, students }]) => (
              <Collapsible key={trainerId} className=" bg-trainerCollapsBg rounded-xl ">
                <CollapsibleTrigger className="  w-full py-3 rounded-xl px-2 flex justify-between items-center">
                  <p className=" font-vazirmatn text-collapsTxtClr  text-start">{trainerName}</p>
                  <div className=" bg-white w-[56px] h-[33px] flex justify-center items-center rounded-xl font-vazirmatn text-collapsTxtClr">
                    {students.length}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className=" px-3 pb-4">
                  <Separator className=" bg-[#DCDACE]  w-[99%] mx-auto mb-2" />
                  <div className=" space-y-3">
                    {students.map((student: any, index: number) => (
                      <div key={student.co_St_TrId || index} className=" flex flex-row items-center justify-between">
                        <p className=" font-vazirmatn text-subtext text-sm">{student.studentName}</p>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
        <Card className=" rounded-lg px-3 pb-2 space-y-4">
          <CardHeader className=" flex -mx-3 flex-row items-center justify-between p-2 px-3 border-b border-solid border-[#DCDACE] mb-2">
            <p className=" font-vazirmatn text-subtext text-sm">النشاطات</p>
            <div className=" flex gap-4 items-center">
              <p className=" font-vazirmatn text-subtext text-sm">
                {data?.result?.activitiesCount || data?.result?.activities?.length || 0}
              </p>
              {!isAdmin && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className=" bg-sidebaractive  px-3 rounded-2xl "
                      onClick={() => router.push(`/activities/add-activities/${data?.result?.uniqueID}`)}
                    >
                      <Image src={add} alt="add icon" className=" size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className=" bg-sidebaractive text-white">
                    <p className=" font-normal text-sm text-white font-vazirmatn">إضافة نشاط</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </CardHeader>
          {data?.result?.activities && data.result.activities.length > 0 ? (
            data.result.activities.map(activity => (
              <CardContent key={activity.uniqueID} className=" border border-[#E8E8E8] py-3 px-3 rounded-lg space-y-3">
                <div className=" font-vazirmatn flex justify-between items-center">
                  <div>
                    <p className=" font-semibold text-sm">{activity.typeName}</p>
                    <p className=" text-[#868585]">
                      {activity.date ? new Date(activity.date).toLocaleDateString('en-US') : ''}
                    </p>
                  </div>
                  <Badge className=" bg-badgeClr text-sidebaractive w-[60px] h-[24px] flex justify-center items-center py-3 rounded-[8px] font-vazirmatn font-medium text-sm ">
                    {activity.courseName || 'A'}
                  </Badge>
                </div>
                <div className=" font-vazirmatn space-y-2">
                  <div className=" flex items-center gap-2">
                    <Image src={map} alt="map" />
                    <p className=" text-[#868585] font-semibold text-[13px]">{activity.placeName}</p>
                  </div>
                  <div className=" flex items-center gap-2">
                    <Image src={plain} alt="plain" />
                    <p className=" text-[#868585] font-semibold text-[13px]">{activity.planeName}</p>
                  </div>
                </div>
                <div className=" w-full flex justify-center items-center">
                  <Button
                    variant="outline"
                    className=" bg-detalisBtnBg flex-1 font-vazirmatn font-normal text-md text-detalisTxtClr"
                    onClick={() => router.push(`/activities/${activity.uniqueID}`)}
                  >
                    <Image src={eye} alt="eye" />
                    عرض التفاصيل
                  </Button>
                </div>
                <Separator className=" bg-[#DCDACE]  w-[99%] my-2" />
                <div className=" flex items-center justify-evenly gap-4">
                  {!isAdmin && (
                    <Button
                      variant="outline"
                      className="font-vazirmatn font-normal text-md flex-1"
                      onClick={() => router.push(`/activities/edit-activity/${activity.uniqueID}`)}
                    >
                      <Image src={pen} alt="pen" />
                      تعديل
                    </Button>
                  )}
                  {!isAdmin && (
                    <Button
                      variant="outline"
                      className="font-vazirmatn font-normal text-md flex-1 hover:bg-red-500 hover:text-white"
                      onClick={() => {
                        setActivityToDelete(activity.uniqueID);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Image src={trash} alt="trash" />
                      حذف
                    </Button>
                  )}
                </div>
              </CardContent>
            ))
          ) : (
            <CardContent className=" border border-[#E8E8E8] py-3 px-3 rounded-lg">
              <p className=" font-vazirmatn text-center text-[#868585]">لا توجد نشاطات</p>
            </CardContent>
          )}
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="font-vazirmatn">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right text-cardTxt">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right text-subtext">
              هل أنت متأكد من حذف هذا النشاط؟
              <br />
              <span className="text-sm text-deleteTxt">لا يمكن التراجع عن هذا الإجراء.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-vazirmatn">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteActivity}
              disabled={isDeletingActivity}
              className="bg-red-600 hover:bg-red-700 font-vazirmatn"
            >
              {isDeletingActivity ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCourseDeleteDialogOpen} onOpenChange={setIsCourseDeleteDialogOpen}>
        <AlertDialogContent className="font-vazirmatn">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right text-cardTxt">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right text-subtext">
              هل أنت متأكد من حذف هذه الدورة؟
              <br />
              <span className="text-sm text-deleteTxt">
                لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع البيانات المرتبطة بها.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-vazirmatn">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={isDeletingCourse}
              className="bg-red-600 hover:bg-red-700 font-vazirmatn"
            >
              {isDeletingCourse ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
