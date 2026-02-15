'use client';

import Image from 'next/image';
import medal from '@/public/activities/Medal.svg';
import EditActivitiesForm from '@/components/pages/activities/EditActivityForm';
import React from 'react';
export default function EditActivities({ params }: { params: Promise<{ id: string }> }) {
  const { id: activityId } = React.use(params);
  return (
    <section className=" space-y-4">
      <header className=" flex items-center gap-3 max-w-[334px]">
        <div className=" size-12 bg-sidebaractive flex items-center justify-center rounded-md">
          <Image src={medal} alt="medal" className=" size-8" />
        </div>
        <div className=" space-y-0.5">
          <h2 className=" font-vazirmatn font-extrabold text-lg text-black">تعديل نشاط</h2>
          <p className=" font-vazirmatn font-medium text-sm text-subtext">املا البيانات التالي لتعديل نشاط في النظام</p>
        </div>
      </header>

      <EditActivitiesForm activityId={activityId} />
    </section>
  );
}
