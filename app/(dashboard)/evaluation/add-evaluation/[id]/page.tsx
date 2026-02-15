'use client';
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AddEvualtions from '@/components/pages/evaluation/add-evualtions';
import { useGetCourseByIdQuery, CourseParticipant } from '@/services/courses';
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: course, isLoading: isCourseLoading } = useGetCourseByIdQuery({ uniqueID: id });
  const participants = course?.result?.participants as CourseParticipant[];
  console.log(participants);
  return (
    <div>
      <Card>
        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2">تقييم الطالب</CardHeader>
        <CardContent className=" space-y-4">
          <div className="evaluation-card grid grid-cols-5 place-content-center px-4 min-h-[81px] font-vazirmatn ">
            <p className=" text-evaluationTxtClr font-light text-[17px]">اسم المتدرب</p>
            <p className=" text-evaluationTxtClr font-light text-[17px]">تقيم اول</p>
            <p className=" text-evaluationTxtClr font-light text-[17px]">تقيم ثاني</p>
            <p className=" text-evaluationTxtClr font-light text-[17px]">تقيم ثالث</p>
            <p className=" text-evaluationTxtClr font-light text-[17px]">ملاحظات</p>
          </div>

          <AddEvualtions participants={participants} courseId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
