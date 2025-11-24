"use client"

import Image from "next/image"
import tornado from "@/public/accidents/tor.svg"
import AddAccidentForm from "@/components/pages/accidents/AddAccidentForm"

export default function AddAccidents() {
  return (
    <section className=" space-y-4">
      <header className=" flex items-center gap-3 max-w-[334px]">
        <div className=" size-12 bg-sidebaractive flex items-center justify-center rounded-xl">
          <Image src={tornado} alt="tornado" className=" size-6"/>
        </div>
        <div className=" space-y-0.5">
          <h2 className=" font-vazirmatn font-extrabold text-lg text-black">إضافة حادث جديد</h2>
          <p className=" font-vazirmatn font-medium text-sm text-subtext">املا البيانات التالي لإضافة حادث جديد الى النظام</p>
        </div>
      </header>

      <AddAccidentForm/>
    </section>
  )
}