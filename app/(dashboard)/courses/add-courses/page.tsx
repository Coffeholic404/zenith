import Image from 'next/image'
import React from 'react'
import dip from "@/public/courses/Diploma.svg"
export default function AddCourses() {
  return (
   <section className='w-full h-full  px-20 space-y-8'>
      <header className=" flex items-center gap-3 max-w-[334px]">
        <div className=" size-12 bg-sidebaractive flex items-center justify-center rounded-md">
          <Image src={dip} alt="dip" className=" size-6"/>
        </div>
        <div className=" space-y-0.5">
          <h2 className=" font-vazirmatn font-extrabold text-lg text-black">إضافة دورة جديدة</h2>
          <p className=" font-vazirmatn font-medium text-sm text-subtext">املا البيانات التالي لإضافة نشاط جديد الى النظام</p>
        </div>
      </header>
        
    </section>
  )
}