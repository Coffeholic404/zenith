"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import trash from "@/public/table/trash.svg"
import pen from "@/public/table/Pen.svg"
import Image from "next/image"
import person from "@/public/persion.png"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useGetStudentByIdQuery } from "@/services/students"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const tabs = [
    {
        value: "المهارات",
        label: "المهارات",
    },
    {
        value: "الدورات",
        label: "الدورات",
    },
    {
        value: "النشاطات",
        label: "النشاطات",
    },
    {
        value: "الحوادث",
        label: "الحوادث",
    },
]

function page({ params }: { params: Promise<{ id: string }> }) {
    const { id: studentID } = React.use(params);
    const { data: student, isLoading, isSuccess, isError } = useGetStudentByIdQuery({ uniqueID: studentID })
     const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year} - ${month} - ${day}`;
    };
    
    const basicInfo = [
        {
            label:"الاسم الثلاثي",
            value: student?.result?.name
        },
        {
            label: "الشهادة",
            value: student?.result?.degree
        },
        {
            label: "مواليد",
            value: formatDate(student?.result?.bdate || "")
        },
        {
            label: "الهاتف",
            value: student?.result?.phone
        },
        {
            label: "سنوات الخدمة",
            value: student?.result?.yearsOfServes
        },
        {
            label: "الجهة المرشحة",
            value: student?.result?.nominatedPartyName
        },
    ]



    return (
        <section className=' '>
            <div className='student-div relative rounded-xl w-full p-4 px-6 h-40 flex flex-col items-end justify-end'>
                <div className=' flex gap-4 font-vazirmatn'>
                    <Button variant="outline">
                        <Image src={pen} alt="edit" />
                        تعديل
                    </Button>
                    <Button className=' border border-red-500' variant="outline">
                        <Image src={trash} alt="delete" />
                        حذف
                    </Button>
                </div>
                <div className='absolute top-[60%] right-4 md:right-10'>
                    <div className=' student-img flex items-end gap-2'>
                        <Image src={person} alt="student" className=' size-32 rounded-2xl' />
                        <div>
                            <p className=' font-vazirmatn font-medium text-2xl'>name</p>
                            <Badge className=' font-vazirmatn bg-sidebaractive'>active</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-24 flex flex-col xl:flex-row gap-6 lg:gap-20'>
                <div className='space-y-6 w-full xl:min-w-[513px] xl:max-w-[513px]'>
                    {
                        basicInfo.map((item, index) => (
                            <div key={index} className='flex justify-between items-center border-b  pb-2 '>
                                <p className='font-vazirmatn font-bold text-[#868687]'>{item.label}</p>
                                <p className=' font-vazirmatn font-normal text-[#868687]'>{item.value}</p>
                            </div>
                        ))
                    }
                   
                </div>
                <div className='bg-mainBg rounded-[21px] w-full xl:min-w-[461px] xl:max-w-[461px] p-6'>
                    <Tabs defaultValue={tabs[0].value} className="w-full space-y-6">
                        <TabsList className="grid w-full grid-cols-4 bg-white place-content-center justify-items-center">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="font-vazirmatn font-bold text-[#868687] data-[state=active]:shadow-none data-[state=active]:text-[#199DEA] data-[state=active]:border-b data-[state=active]:rounded-none data-[state=active]:border-[#199DEA] px-0 py-1 w-fit"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value={tabs[0].value} className=''>
                            <div className=' space-y-6'>
                                <div className=' flex items-center justify-between'>
                                    <p className=' font-vazirmatn text-subtext font-light'>عدد المهارات الكلي </p>
                                    <p className=' font-vazirmatn font-medium text-[18px]'>5</p>
                                </div>
                                <div>
                                    <div>
                                        <p className=' font-vazirmatn text-[18px] text-[#7B7B7B]'>مهارة 1</p>
                                        <Separator className="my-3 text-black/[7%]" />
                                    </div>
                                    <div>
                                        <p className=' font-vazirmatn text-[18px] text-[#7B7B7B]'>مهارة 1</p>
                                        <Separator className="my-3 text-black/[7%]" />
                                    </div>
                                    <div>
                                        <p className=' font-vazirmatn text-[18px] text-[#7B7B7B]'>مهارة 1</p>
                                        <Separator className="my-3 text-black/[7%]" />
                                    </div>
                                    <div>
                                        <p className=' font-vazirmatn text-[18px] text-[#7B7B7B]'>مهارة 1</p>
                                        <Separator className="my-3 text-black/[7%]" />
                                    </div>
                                    <div>
                                        <p className=' font-vazirmatn text-[18px] text-[#7B7B7B]'>مهارة 1</p>
                                        <Separator className="my-3 text-black/[7%]" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </section>
    )
}

export default page