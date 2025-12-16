'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger, PopoverArrow } from '@/components/ui/popover';
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
import { useToast } from '@/hooks/use-toast';

import { Badge } from '@/components/ui/badge';
import eye from '@/public/courses/Eye.svg';
import plain from '@/public/courses/Plain.svg';
import map from '@/public/courses/map.svg';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import pen from '@/public/table/Pen.svg';
import trash from '@/public/table/trash.svg';
import trash2 from '@/public/employees/TrashBin.svg';

import { useRouter } from 'next/navigation';
import { useDeleteAccidentMutation, AccidentItem } from '@/services/accident';
import { useGetCourseByIdQuery } from '@/services/courses';
import { useGetPlaceByIdQuery } from '@/services/place';
import { useGetPlaneByIdQuery } from '@/services/plane';
import { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

export default function AccidentCard({ accident }: { accident: AccidentItem }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deleteAccident, { isLoading: isDeleting }] = useDeleteAccidentMutation();
  const { toast } = useToast();

  const handleDeleteAccident = async (id: string) => {
    try {
      await deleteAccident({ id }).unwrap();

      // Show success toast
      toast({
        title: 'تم بنجاح',
        description: `تم حذف الحادث بنجاح`,
        variant: 'default'
      });

      // Close the dialog
      setIsDeleteDialogOpen(false);

      // Refresh the page to update the employee list
      router.refresh();
    } catch (error: any) {
      // Show error toast with the exact error message from API
      const errorMessage =
        error?.data?.errorMessages?.[0] || error?.data?.message || error?.message || 'حدث خطأ أثناء حذف الموظف';

      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive'
      });

      // Close the dialog even on error
      setIsDeleteDialogOpen(false);
    }
  };

  const router = useRouter();
  return (
    <>
      <Card className="w-full p-[17px] min-h-36">
        <CardContent className=" p-0 space-y-4">
          <div className=" flex justify-between items-start">
            <div className=" flex flex-col gap-2 w-full">
              <div className=" font-vazirmatn flex items-center justify-between">
                <p className=" text-cardTxt font-semibold">{accident.studentName}</p>
                <div className=" flex flex-col items-end gap-4 justify-center">
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical className=" size-5 text-[#7B7B7B] hover:text-[#222222] cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className=" w-[120px] rounded-xl">
                      <Button
                        variant="ghost"
                        className=" w-full"
                        onClick={() => router.push(`/accidents/edit-accidents/${accident.id}`)}
                      >
                        <Image src={pen} alt="pen" className=" size-[18px]" />
                        <p className=" font-vazirmatn text-sm">تعديل</p>
                      </Button>
                      <Button variant="ghost" className=" hover:bg-red-400" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Image src={trash} alt="trash" className="size-[18px]" />
                        <p className=" font-vazirmatn text-sm">حذف</p>
                      </Button>

                      <Button variant="ghost" className="" onClick={() => router.push(`/accidents/${accident.id}`)}>
                        <Image src={eye} alt="eye" className="size-[18px]" />
                        <p className=" font-vazirmatn text-sm">عرض</p>
                      </Button>
                    </PopoverContent>
                  </Popover>
                  {/* <Badge className=" bg-badgeClr cursor-pointer  text-sidebaractive py-[3px] px-[17px] rounded-[8px] font-vazirmatn font-light text-sm hover:bg-badgeClr">
                                {activity.createdAt?.substring(0, 10)}
                            </Badge> */}
                </div>
              </div>
              <div className=" w-full flex items-center justify-between gap-2">
                <p className=" text-[#868585] font-light text-sm">{accident.activityDate?.substring(0, 10)}</p>
                <Badge className=" self-start bg-badgeClr cursor-pointer  text-sidebaractive py-[3px] px-[17px] rounded-[8px] font-vazirmatn font-light text-sm hover:bg-badgeClr">
                  {accident.courseName}
                </Badge>
              </div>
              <div className=" font-vazirmatn space-y-2">
                <div className=" flex items-center gap-2">
                  <Image src={map} alt="map" />
                  <p className=" text-[#868585] font-semibold text-[13px]">{accident.placeName}</p>
                </div>
                {/* <div className=" flex items-center gap-2">
                                    <Image src={plain} alt="plain" />
                                    <p className=" text-[#868585] font-semibold text-[13px]">{planeTitle}</p>
                                </div> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="font-vazirmatn">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right text-cardTxt">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right text-subtext">
              هل أنت متأكد من حذف الحادث <span className="font-semibold text-cardTxt">{accident.activityName}</span>؟
              <br />
              <span className="text-sm text-deleteTxt">لا يمكن التراجع عن هذا الإجراء.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-vazirmatn">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteAccident(accident.id || '')}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 font-vazirmatn"
            >
              {isDeleting ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
