"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import trash from "@/public/table/trash.svg"
import pen from "@/public/table/Pen.svg"
import Image from "next/image"
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import eye from "@/public/courses/Eye.svg"
import plain from "@/public/courses/Plain.svg"
import map from "@/public/courses/map.svg"
import React from "react"
import { useGetCourseByIdQuery } from "@/services/courses";


export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id: courseId } = React.use(params);
    const [isOpen, setIsOpen] = useState(false)
    const { data, isLoading, isError } = useGetCourseByIdQuery({ uniqueID: courseId })
    console.log(data)
    return (
        <div className=" space-y-4">
            <Card className="  flex justify-center items-center py-4">
                <CardContent className=" course-card min-w-[1170px] p-0 rounded-xl px-5 py-4 flex items-center justify-between border border-solid  border-image-[linear-gradient(116.99deg,_#C0EEFD_1.09%,_#C2B2FD_33.87%,_#DDBAE4_72.11%,_#DCDACE_99.45%,_#3D53B8_99.45%)]
">
                    <div className=" space-y-2">
                        <p className=" font-vazirmatn font-semibold text-[25px]">G</p>
                        <p className=" font-vazirmatn font-light text-base text-[#868585]">09:00 . 2025 - 07 - 20</p>
                        <Badge className=" bg-badgeClr text-sidebaractive font-vazirmatn font-light text-sm rounded-[10px] py-1 px-4">قفز حر </Badge>
                    </div>


                </CardContent>
            </Card>
            <div className=" grid grid-cols-[310px_435px_435px] gap-4">
                <div id="student-list" className=" ">
                    <Card>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2 flex flex-row justify-between items-center">
                             الطلاب
                            <span>5</span>
                        </CardHeader>
                        <Separator className="my-2" />
                        <CardContent className=" px-2">
                                <div className=" flex flex-row justify-between items-center hover:bg-mainBg p-3 py-2 rounded-lg">
                                    <p className=" font-vazirmatn font-normal text-[16px] text-[#7B7B7B]">
                                        اسم الطالب
                                    </p>
                                    <Badge className=" font-vazirmatn font-light text-[14px] bg-studentClr text-sidebaractive py-2 rounded-md">
                                        0912345678
                                    </Badge>
                                </div>
                        </CardContent>
                    </Card>
                </div>
                <div id="trainer-list" className="">
                                        <Card>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2 flex flex-row justify-between items-center">
                             المدربون
                        </CardHeader>
                        <Separator className="my-2" />
                        <CardContent className=" px-2">
                               <p className=" font-vazirmatn font-normal text-[16px] text-[#7B7B7B]">some trainer</p>
                               <Separator className="my-2" />
                        </CardContent>
                    </Card>
                </div>
                <div id="basic-info" className="">
                                        <Card>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2 flex flex-row justify-between items-center">
                             المعلومات الاساسية
                            
                        </CardHeader>
                        <Separator className="my-2" />
                        <CardContent className=" px-2 space-y-3">
                                <div className=" flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                    <p className=" font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                        اسم الطالب
                                    </p>
                                    <p className=" font-vazirmatn font-normal text-[14px]">
                                        0912345678
                                    </p>
                                </div>
                                <div className=" flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                    <p className=" font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                        اسم الطالب
                                    </p>
                                    <p className=" font-vazirmatn font-normal text-[14px]">
                                        0912345678
                                    </p>
                                </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}