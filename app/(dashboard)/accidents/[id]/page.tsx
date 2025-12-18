"use client"

import React from "react"
import { useGetAccidentByIdQuery } from "@/services/accident"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function AccidentDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data, isLoading } = useGetAccidentByIdQuery({ id });
    const accident = data?.result;

    if (isLoading) {
        return (
            <div className="p-6 space-y-6 w-full max-w-[1600px] mx-auto" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 h-full">
                        <Skeleton className="h-[600px] w-full rounded-3xl" />
                    </div>
                    <div className="md:col-span-1 space-y-6">
                        <Skeleton className="h-[200px] w-full rounded-3xl" />
                        <Skeleton className="h-[200px] w-full rounded-3xl" />
                        <Skeleton className="h-[300px] w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        )
    }

    if (!accident) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <p className="text-xl font-vazirmatn text-muted-foreground">لم يتم العثور على الحادث</p>
            </div>
        )
    }

    // Helper for rows in Basic Info
    const InfoRow = ({ label, value }: { label: string, value: string | number | undefined | null }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
            <span className="text-gray-500 font-medium text-sm">{label}</span>
            <span className="text-gray-900 font-semibold text-sm">{value || "-"}</span>
        </div>
    );

    return (
        <div className="p-6 w-full max-w-[1600px] mx-auto font-vazirmatn" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Right Column (Basic Info) - Takes 2 columns in the grid */}
                <div className="md:col-span-2 md:order-1">
                    <Card className="h-full border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                        <CardHeader className="pb-2 pt-8 px-8">
                            <CardTitle className="text-xl font-bold text-gray-400 text-right">المعلومات الاساسية</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4">
                            <div className="flex flex-col gap-1">
                                <InfoRow label="الاسم" value={accident.studentName} />
                                <InfoRow label="وقت فتح المظلة" value={accident.activityTime} />
                                <InfoRow label="اسم الدورة" value={accident.courseName} />
                                <InfoRow label="اسم النشاط" value={accident.activityName} />
                                <InfoRow label="عدد القفزات" value={accident.jumperCount} />
                                <InfoRow label="نوع القفز" value={accident.typeOfJump} />
                                <InfoRow label="اسم الطائرة" value={accident.planeName} />
                                <InfoRow label="وقت الخروج من الطائرة" value={accident.exitAltitude ? `${accident.exitAltitude} قدم` : "-"} />
                                <InfoRow label="ارتفاع فتح المظلة" value={accident.deployAltitude ? `${accident.deployAltitude} قدم` : "-"} />
                                <InfoRow label="وقت السقوط الحر" value={accident.freefallTime ? `${accident.freefallTime} ثانية` : "-"} />
                            </div>

                            <div className="mt-8 space-y-4">
                                <h3 className="text-gray-400 font-bold text-right">المدربون</h3>
                                <div className="flex flex-wrap gap-3 justify-start">
                                    {accident.trainer1Name && (
                                        <Badge variant="secondary" className="bg-blue-100/50 text-blue-500 hover:bg-blue-100 px-4 py-2 text-sm font-medium rounded-xl border-none">
                                            {accident.trainer1Name}
                                        </Badge>
                                    )}
                                    {accident.trainer2Name && (
                                        <Badge variant="secondary" className="bg-blue-100/50 text-blue-500 hover:bg-blue-100 px-4 py-2 text-sm font-medium rounded-xl border-none">
                                            {accident.trainer2Name}
                                        </Badge>
                                    )}
                                    {accident.trainer3Name && (
                                        <Badge variant="secondary" className="bg-blue-100/50 text-blue-500 hover:bg-blue-100 px-4 py-2 text-sm font-medium rounded-xl border-none">
                                            {accident.trainer3Name}
                                        </Badge>
                                    )}
                                    {!accident.trainer1Name && !accident.trainer2Name && !accident.trainer3Name && (
                                        <span className="text-gray-400 text-sm">لا يوجد مدربون مسجلون</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Content (Stack) - Left Side in RTL */}
                <div className="md:col-span-2 md:order-2 space-y-6">

                    {/* Equipment Card */}
                    {/* <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader className="pb-2 pt-6 px-6">
                            <CardTitle className="text-lg font-bold text-gray-400 text-right">المعدات</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="space-y-3">
                                <div className="text-right text-gray-500 font-medium pb-2 border-b border-gray-50 last:border-0">خوذة</div>
                                <div className="text-right text-gray-500 font-medium pb-2 border-b border-gray-50 last:border-0">خوذة</div>
                                <div className="text-right text-gray-500 font-medium pb-2 border-b border-gray-50 last:border-0">خوذة</div>
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Committee Card */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader className="pb-2 pt-6 px-6">
                            <CardTitle className="text-lg font-bold text-gray-400 text-right">لجنه الحادث</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="space-y-3">
                                {accident.committeeMembers && accident.committeeMembers.length > 0 ? (
                                    accident.committeeMembers.map((member) => (
                                        <div key={member.id} className="text-right text-gray-500 font-medium pb-2 border-b border-gray-50 last:border-0">
                                            {member.employeeName}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-right text-gray-400 text-sm">لا يوجد أعضاء لجنة</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report Card */}
                    <Card className="border-none shadow-sm bg-white rounded-3xl">
                        <CardHeader className="pb-2 pt-6 px-6">
                            <CardTitle className="text-lg font-bold text-gray-400 text-right">تقرير الحادث</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="bg-studentClr rounded-xl p-4 min-h-[120px]">
                                <p className="text-studentCheckboxClr text-sm leading-relaxed text-right">
                                    {accident.finalReport || "لا يوجد تقرير"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
