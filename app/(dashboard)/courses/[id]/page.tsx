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
    const { data, isLoading, isError } = useGetCourseByIdQuery({ uniqueID:courseId })
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
                    <div className=' flex gap-4 font-vazirmatn self-end'>
                        <Button variant="outline" className=" px-6 rounded-xl">
                            <Image src={pen} alt="edit" />
                            تعديل
                        </Button>
                        <Button className=' border border-red-500 px-6 rounded-xl' variant="outline">
                            <Image src={trash} alt="delete" />
                            حذف
                        </Button>
                    </div>

                </CardContent>
            </Card>
            <div className=" grid grid-cols-[1fr_327px] gap-4">
                <Card className=" rounded-lg">
                    <CardHeader className=" flex flex-row items-center justify-between p-2 px-3 border-b border-solid border-[#DCDACE] mb-2">
                        <p className=" font-vazirmatn text-subtext text-sm">المدربون</p>
                        <p className=" font-vazirmatn text-subtext text-sm">5</p>
                    </CardHeader>

                    <CardContent className=" space-y-4 mt-3">
                        <Collapsible className=" bg-trainerCollapsBg rounded-xl ">
                            <CollapsibleTrigger className="  w-full py-3 rounded-xl px-2 flex justify-between items-center">
                                <p className=" font-vazirmatn text-collapsTxtClr  text-start">عرض المدربون</p>
                                <div className=" bg-white w-[56px] h-[33px] flex justify-center items-center rounded-xl font-vazirmatn text-collapsTxtClr">
                                    16
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className=" px-3 pb-4">
                                <Separator className=" bg-[#DCDACE]  w-[99%] mx-auto mb-2" />
                                <div className=" space-y-3">
                                    <div className=" flex flex-row items-center justify-between">
                                        <p className=" font-vazirmatn text-subtext text-sm">
                                            محمد علي
                                        </p>

                                    </div>
                                    <div className=" flex flex-row items-center justify-between">
                                        <p className=" font-vazirmatn text-subtext text-sm">
                                            علي محمد
                                        </p>

                                    </div>
                                </div>
                            </CollapsibleContent>

                        </Collapsible>
                        <Collapsible className=" bg-trainerCollapsBg rounded-xl ">
                            <CollapsibleTrigger className="  w-full py-3 rounded-xl px-2 flex justify-between items-center">
                                <p className=" font-vazirmatn text-collapsTxtClr  text-start">عرض المدربون</p>
                                <div className=" bg-white w-[56px] h-[33px] flex justify-center items-center rounded-xl font-vazirmatn text-collapsTxtClr">
                                    16
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className=" px-3 pb-4">
                                <Separator className=" bg-[#DCDACE]  w-[99%] mx-auto mb-2" />
                                <div className=" space-y-3">
                                    <div className=" flex flex-row items-center justify-between">
                                        <p className=" font-vazirmatn text-subtext text-sm">
                                            محمد علي
                                        </p>

                                    </div>
                                    <div className=" flex flex-row items-center justify-between">
                                        <p className=" font-vazirmatn text-subtext text-sm">
                                            علي محمد
                                        </p>

                                    </div>
                                </div>
                            </CollapsibleContent>

                        </Collapsible>
                    </CardContent>
                </Card>
                <Card className=" rounded-lg px-3 pb-2 space-y-4">
                    <CardHeader className=" flex -mx-3 flex-row items-center justify-between p-2 px-3 border-b border-solid border-[#DCDACE] mb-2">
                        <p className=" font-vazirmatn text-subtext text-sm">النشاطات</p>
                        <p className=" font-vazirmatn text-subtext text-sm">5</p>
                    </CardHeader>
                    <CardContent className=" border border-[#E8E8E8] py-3 px-3 rounded-lg space-y-3">
                        <div className=" font-vazirmatn flex justify-between items-center">
                            <div>
                                <p className=" font-semibold text-sm">نوع الدورة</p>
                                <p className=" text-[#868585]">2025 - 07 - 20</p>
                            </div>
                            <Badge className=" bg-badgeClr text-sidebaractive w-[60px] h-[24px] flex justify-center items-center py-3 rounded-[8px] font-vazirmatn font-medium text-sm ">G</Badge>
                        </div>
                        <div className=" font-vazirmatn space-y-2">
                            <div className=" flex items-center gap-2">
                                <Image src={map} alt="map" />
                                <p className=" text-[#868585] font-semibold text-[13px]">المكان</p>
                            </div>
                            <div className=" flex items-center gap-2">
                                <Image src={plain} alt="plain" />
                                <p className=" text-[#868585] font-semibold text-[13px]">الطائرة</p>
                            </div>
                        </div>
                        <div className=" w-full flex justify-center items-center">
                            <Button variant="outline" className=" bg-detalisBtnBg flex-1 font-vazirmatn font-normal text-md text-detalisTxtClr">
                                <Image src={eye} alt="eye" />
                                عرض التفاصيل
                            </Button>
                        </div>
                        <Separator className=" bg-[#DCDACE]  w-[99%] my-2" />
                        <div className=" flex items-center justify-evenly gap-4">
                            <Button variant="outline" className="font-vazirmatn font-normal text-md flex-1">
                                <Image src={pen} alt="pen" />
                                تعديل
                            </Button>
                            <Button variant="outline" className="font-vazirmatn font-normal text-md flex-1">
                                <Image src={trash} alt="trash" />
                                حذف
                            </Button>
                        </div>
                    </CardContent>
                    <CardContent className=" border border-[#E8E8E8] py-3 px-3 rounded-lg space-y-3">
                        <div className=" font-vazirmatn flex justify-between items-center">
                            <div>
                                <p className=" font-semibold text-sm">نوع الدورة</p>
                                <p className=" text-[#868585]">2025 - 07 - 20</p>
                            </div>
                            <Badge className=" bg-badgeClr text-sidebaractive w-[60px] h-[24px] flex justify-center items-center py-3 rounded-[8px] font-vazirmatn font-medium text-sm ">G</Badge>
                        </div>
                        <div className=" font-vazirmatn space-y-2">
                            <div className=" flex items-center gap-2">
                                <Image src={map} alt="map" />
                                <p className=" text-[#868585] font-semibold text-[13px]">المكان</p>
                            </div>
                            <div className=" flex items-center gap-2">
                                <Image src={plain} alt="plain" />
                                <p className=" text-[#868585] font-semibold text-[13px]">الطائرة</p>
                            </div>
                        </div>
                        <div className=" w-full flex justify-center items-center">
                            <Button variant="outline" className=" bg-detalisBtnBg flex-1 font-vazirmatn font-normal text-md text-detalisTxtClr">
                                <Image src={eye} alt="eye" />
                                عرض التفاصيل
                            </Button>
                        </div>
                        <Separator className=" bg-[#DCDACE]  w-[99%] my-2" />
                        <div className=" flex items-center justify-evenly gap-4">
                            <Button variant="outline" className="font-vazirmatn font-normal text-md flex-1">
                                <Image src={pen} alt="pen" />
                                تعديل
                            </Button>
                            <Button variant="outline" className="font-vazirmatn font-normal text-md flex-1">
                                <Image src={trash} alt="trash" />
                                حذف
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}