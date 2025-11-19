"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import React from "react"
import { useGetActivityByIdQuery, ActivityJumperWithId } from "@/services/activity"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id: activityId } = React.use(params);
    const [selectedJumperIndex, setSelectedJumperIndex] = useState<number | null>(null);
    const { data, isLoading, isError } = useGetActivityByIdQuery({ uniqueID: activityId });

    const activity = data?.result;
    const jumpers = activity?.jumpers || [];
    const selectedJumper = selectedJumperIndex !== null ? jumpers[selectedJumperIndex] : null;

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year} - ${month} - ${day}`;
    };

    // Get trainers for selected jumper
    const getTrainers = (jumper: ActivityJumperWithId | null) => {
        if (!jumper) return [];
        const trainers = [];
        if (jumper.trainer1Id && jumper.trainer1Name) {
            trainers.push({ name: jumper.trainer1Name, note: jumper.trainer1Note });
        }
        if (jumper.trainer2Id && jumper.trainer2Name) {
            trainers.push({ name: jumper.trainer2Name, note: jumper.trainer2Note });
        }
        if (jumper.trainer3Id && jumper.trainer3Name) {
            trainers.push({ name: jumper.trainer3Name, note: jumper.trainer3Note });
        }
        return trainers;
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card className="flex justify-center items-center py-4">
                    <CardContent className="min-w-[1170px] p-0 px-5 py-4">
                        <Skeleton className="h-8 w-20 mb-2" />
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-6 w-24 mb-4" />
                        <div className="flex gap-4">
                            <Skeleton className="h-16 flex-1" />
                            <Skeleton className="h-16 flex-1" />
                            <Skeleton className="h-16 flex-1" />
                            <Skeleton className="h-16 flex-1" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError || !activity) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-deleteTxt font-vazirmatn">حدث خطأ أثناء تحميل بيانات النشاط</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Card className="flex justify-center items-center py-4">
                <CardContent className="course-card min-w-[1170px] p-0 rounded-xl px-5 py-4 flex flex-col gap-3 items-start justify-center border border-solid border-image-[linear-gradient(116.99deg,_#C0EEFD_1.09%,_#C2B2FD_33.87%,_#DDBAE4_72.11%,_#DCDACE_99.45%,_#3D53B8_99.45%)]">
                    <div className="space-y-2">
                        <p className="font-vazirmatn font-semibold text-[25px]">{activity.courseName}</p>
                        <p className="font-vazirmatn font-light text-base text-[#868585]">
                            {activity.time} . {formatDate(activity.date)}
                        </p>
                        <Badge className="bg-badgeClr text-sidebaractive font-vazirmatn font-light text-sm rounded-[10px] py-1 px-4">
                            {activity.typeName}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-center gap-4 w-full font-vazirmatn">
                        <div className="bg-white flex-1 p-2 rounded-lg flex items-center justify-between px-3">
                            <p className="text-studentCheckboxClr">المكان</p>
                            <p>{activity.placeName}</p>
                        </div>
                        <div className="bg-white flex-1 p-2 rounded-lg flex items-center justify-between px-3">
                            <p className="text-studentCheckboxClr">الطائرة</p>
                            <p>{activity.planeName}</p>
                        </div>
                        <div className="bg-white flex-1 p-2 rounded-lg flex items-center justify-between px-3">
                            <p className="text-studentCheckboxClr">سرعة الرياح</p>
                            <p>{activity.windSpeed}</p>
                        </div>
                        <div className="bg-white flex-1 p-2 rounded-lg flex items-center justify-between px-3">
                            <p className="text-studentCheckboxClr">الوقت</p>
                            <p>{activity.time}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-[310px_435px_435px] gap-4">
                {/* Students List */}
                <div id="student-list">
                    <Card>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2 flex flex-row justify-between items-center">
                            الطلاب
                            <span>{jumpers.length}</span>
                        </CardHeader>
                        <Separator className="my-2" />
                        <CardContent className="px-2 space-y-1">
                            {jumpers.length === 0 ? (
                                <p className="text-center text-subtext font-vazirmatn text-sm py-4">
                                    لا يوجد طلاب
                                </p>
                            ) : (
                                jumpers.map((jumper, index) => (
                                    <div
                                        key={jumper.id}
                                        className={cn(
                                            "flex flex-row justify-between items-center hover:bg-mainBg p-3 py-2 rounded-lg cursor-pointer transition-colors",
                                            selectedJumperIndex === index && "bg-[#8870E733]/20 border border-sidebaractive"
                                        )}
                                        onClick={() => setSelectedJumperIndex(index)}
                                    >
                                        <p className="font-vazirmatn font-normal text-[16px] text-[#7B7B7B]">
                                            طالب {index + 1}
                                        </p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Trainers List */}
                <div id="trainer-list">
                    <Card>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2 flex flex-row justify-between items-center">
                            المدربون
                        </CardHeader>
                        <Separator className="my-2" />
                        <CardContent className="px-2">
                            {!selectedJumper ? (
                                <p className="text-center text-subtext font-vazirmatn text-sm py-4">
                                    اختر طالب لعرض المدربين
                                </p>
                            ) : getTrainers(selectedJumper).length === 0 ? (
                                <p className="text-center text-subtext font-vazirmatn text-sm py-4">
                                    لا يوجد مدربين
                                </p>
                            ) : (
                                getTrainers(selectedJumper).map((trainer, index) => (
                                    <div key={index}>
                                        <div className="py-2">
                                            <p className="font-vazirmatn font-normal text-[16px] text-[#7B7B7B]">
                                                {trainer.name}
                                            </p>
                                            {/* {trainer.note && (
                                                <p className="font-vazirmatn font-light text-[14px] text-subtext">
                                                    {trainer.note}
                                                </p>
                                            )} */}
                                        </div>
                                        {index < getTrainers(selectedJumper).length - 1 && (
                                            <Separator className="my-2" />
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Basic Info */}
                <div id="basic-info">
                    <Card>
                        <CardHeader className="font-vazirmatn text-subtext font-light text-[16px] px-3 py-2 flex flex-row justify-between items-center">
                            المعلومات الاساسية
                        </CardHeader>
                        <Separator className="my-2" />
                        <CardContent className="px-2 space-y-3">
                            {!selectedJumper ? (
                                <p className="text-center text-subtext font-vazirmatn text-sm py-4">
                                    اختر طالب لعرض المعلومات
                                </p>
                            ) : (
                                <>
                                    <div className="flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                        <p className="font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                            موقع الهبوط
                                        </p>
                                        <p className="font-vazirmatn font-normal text-[14px]">
                                            {selectedJumper.landings}
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                        <p className="font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                            عدد القفزات
                                        </p>
                                        <p className="font-vazirmatn font-normal text-[14px]">
                                            {selectedJumper.jumperCount}
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                        <p className="font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                            وقت السقوط الحر
                                        </p>
                                        <p className="font-vazirmatn font-normal text-[14px]">
                                            {selectedJumper.freefallTime}
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                        <p className="font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                            نوع القفزة
                                        </p>
                                        <p className="font-vazirmatn font-normal text-[14px]">
                                            {selectedJumper.typeOfJump}
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                        <p className="font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                            ارتفاع الخروج من الطائرة
                                        </p>
                                        <p className="font-vazirmatn font-normal text-[14px]">
                                            {selectedJumper.exitAltitude}
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                        <p className="font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                            ارتفاع السقوط الحر
                                        </p>
                                        <p className="font-vazirmatn font-normal text-[14px]">
                                            {selectedJumper.freefallAltitude}
                                        </p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center bg-mainBg p-3 py-3 rounded-lg">
                                        <p className="font-vazirmatn font-normal text-[16px] text-studentCheckboxClr">
                                            ارتفاع فتح المظلة
                                        </p>
                                        <p className="font-vazirmatn font-normal text-[14px]">
                                            {selectedJumper.deployAltitude}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
