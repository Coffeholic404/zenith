'use client';

import Image from 'next/image';
import tornado from '@/public/accidents/tor.svg';
import React from 'react';
import EditAccidentForm from '@/components/pages/accidents/EditAccidentForm';

export default function EditAccidents({ params }: { params: Promise<{ id: string }> }) {
  const { id: accidentId } = React.use(params);
  return (
    <section className=" space-y-4">
      <header className=" flex items-center gap-3 max-w-[334px]">
        <div className=" size-12 bg-sidebaractive flex items-center justify-center rounded-xl">
          <Image src={tornado} alt="tornado" className=" size-6" />
        </div>
        <div className=" space-y-0.5">
          <h2 className=" font-vazirmatn font-extrabold text-lg text-black">تعديل حادث</h2>
          <p className=" font-vazirmatn font-medium text-sm text-subtext">املا البيانات التالي لتعديل حادث في النظام</p>
        </div>
      </header>

      <EditAccidentForm accidentId={accidentId} />
    </section>
  );
}
