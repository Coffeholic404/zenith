import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
    return (
        <div className="space-y-4">
            {/* Course Header Card Skeleton */}
            <Card className="flex justify-center items-center py-4">
                <CardContent className="course-card min-w-[1170px] p-0 rounded-xl px-5 py-4 flex items-center justify-between border border-solid border-image-[linear-gradient(116.99deg,_#C0EEFD_1.09%,_#C2B2FD_33.87%,_#DDBAE4_72.11%,_#DCDACE_99.45%,_#3D53B8_99.45%)]">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-6 w-24 rounded-[10px]" />
                    </div>
                    <div className="flex gap-4 self-end">
                        <Skeleton className="h-10 w-28 rounded-xl" />
                        <Skeleton className="h-10 w-28 rounded-xl" />
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-[1fr_327px] gap-4">
                {/* Trainers Card Skeleton */}
                <Card className="rounded-lg">
                    <CardHeader className="flex flex-row items-center justify-between p-2 px-3 border-b border-solid border-[#DCDACE] mb-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>

                    <CardContent className="space-y-4 mt-3">
                        {/* Trainer Collapsible 1 */}
                        <div className="bg-trainerCollapsBg rounded-xl">
                            <div className="w-full py-3 rounded-xl px-2 flex justify-between items-center">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="w-[56px] h-[33px] rounded-xl" />
                            </div>
                        </div>

                        {/* Trainer Collapsible 2 */}
                        <div className="bg-trainerCollapsBg rounded-xl">
                            <div className="w-full py-3 rounded-xl px-2 flex justify-between items-center">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="w-[56px] h-[33px] rounded-xl" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activities Card Skeleton */}
                <Card className="rounded-lg px-3 pb-2 space-y-4">
                    <CardHeader className="flex -mx-3 flex-row items-center justify-between p-2 px-3 border-b border-solid border-[#DCDACE] mb-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>

                    {/* Activity Card 1 */}
                    <CardContent className="border border-[#E8E8E8] py-3 px-3 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="w-[60px] h-[24px] rounded-[8px]" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Separator className="bg-[#DCDACE] w-[99%] my-2" />
                        <div className="flex items-center justify-evenly gap-4">
                            <Skeleton className="h-10 flex-1 rounded-md" />
                            <Skeleton className="h-10 flex-1 rounded-md" />
                        </div>
                    </CardContent>

                    {/* Activity Card 2 */}
                    <CardContent className="border border-[#E8E8E8] py-3 px-3 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="w-[60px] h-[24px] rounded-[8px]" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Separator className="bg-[#DCDACE] w-[99%] my-2" />
                        <div className="flex items-center justify-evenly gap-4">
                            <Skeleton className="h-10 flex-1 rounded-md" />
                            <Skeleton className="h-10 flex-1 rounded-md" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
