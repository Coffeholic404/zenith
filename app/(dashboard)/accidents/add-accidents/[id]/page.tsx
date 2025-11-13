import Image from 'next/image'
import React from 'react'
import tor from "@/public/accidents/tor.svg"
export default function AddAccidents() {
  return (
   <section className='w-full h-full  px-20 space-y-8'>
      <header className=" flex items-center gap-3 max-w-[334px]">
        <div className=" size-12 bg-sidebaractive flex items-center justify-center rounded-md">
          <Image src={tor} alt="tor" className=" size-6"/>
        </div>
        <div className=" space-y-0.5">
          <h2 className=" font-vazirmatn font-extrabold text-lg text-black">إضافة حادث </h2>
          <p className=" font-vazirmatn font-medium text-sm text-subtext">املا البيانات التالي لإضافة حادث جديد الى النظام</p>
        </div>
      </header>

    </section>
  )
}