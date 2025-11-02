
import Image from 'next/image'
import React from 'react'
import userplus from "@/public/add-employe/UserPlus.svg"
import AddStudentForm from '@/components/pages/students/AddStudentForm'
function page() {
  return (
    <section className='w-full px-20 space-y-8 scroll-smooth pb-[50px]'>
      <header className=" flex items-center gap-3 max-w-[334px]">
        <div className=" size-12 bg-sidebaractive flex items-center justify-center rounded-md">
          <Image src={userplus} alt="userplus" className=" size-8"/>
        </div>
        <div className=" space-y-0.5">
          <h2 className=" font-vazirmatn font-extrabold text-lg text-black">إضافة موظف جديد</h2>
          <p className=" font-vazirmatn font-medium text-sm text-subtext">املا البيانات التالي لإضافة موضف جديد الى النظام</p>
        </div>
      </header>

      <AddStudentForm />
    </section>
  )
}

export default page