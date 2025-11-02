"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import eye from "@/public/courses/Eye.svg"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import pen from "@/public/table/Pen.svg"
import trash from "@/public/table/trash.svg"
import { useRouter } from "next/navigation"
export default function CoursesCard () {
    const router = useRouter();
    return (
        <Card className="max-w-[363px] p-[17px]">
                <CardContent className=" p-0 space-y-4">
                        <div className=" flex justify-between items-center">
                            <div className=" font-vazirmatn space-y-1">
                                <p className=" text-cardTxt font-semibold">GG</p>
                                <p className=" text-[#868585] font-light text-sm">نوع الدورة</p>
                                <p className=" text-[#868585] font-light text-sm">2025 - 07 - 20</p>
                            </div>
                            <Badge className=" bg-badgeClr text-sidebaractive py-[3px] px-[17px] rounded-[8px] font-vazirmatn font-light text-sm">مكتمل</Badge>
                        </div>
                        <Button  variant="outline" className=" bg-detalisBtnBg font-vazirmatn font-normal text-md text-detalisTxtClr">
                            <Image src={eye} alt="eye" />
                            عرض التفاصيل
                        </Button>
                        <Separator className=" my-4" />
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
    )
}