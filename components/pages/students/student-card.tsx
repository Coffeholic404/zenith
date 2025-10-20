import Image from "next/image"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import { Button } from "@/components/ui/button"
import { EllipsisVertical } from 'lucide-react';
import pen from "@/public/table/Pen.svg"
import trash from "@/public/table/trash.svg"
import eye from "@/public/student/Eye.svg"
import { type Student } from "@/services/students"

function StudentCard({ student }: { student: Student }) {
    return (
        <div className=" flex-1">
                <Card className="w-[22.375rem] rounded-2xl ">
                    <CardHeader className=" flex items-center justify-start flex-row gap-2 p-2 px-3 ">
                        <Avatar className=" size-14">
                            <AvatarImage src="/placeholder.svg" alt={student.name} />
                            <AvatarFallback>{student.name.split(' ')[0].charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className=" font-vazirmatn font-black text-sm place-items-start pb-4">
                            {student.name}
                        </h4>
                    </CardHeader>
                    <Separator className=" my-8 mb-6 text-[#CCCCCC] max-w-[284px] mx-auto border rounded-2xl border-[#CCCCCC]" />
                    <CardFooter className=" flex items-center justify-center flex-row gap-2 p-2 ">
                        <Button variant="outline" className=" w-[130px] rounded-xl">
                            <Image src={pen} alt="pen" className=" size-[18px]" />
                            <p className=" font-vazirmatn text-sm">تعديل</p>
                        </Button >
                        <Button variant="outline" className=" w-[130px] rounded-xl">
                            <Image src={trash} alt="trash" className="size-[18px]" />
                            <p className=" font-vazirmatn text-sm">حذف</p>
                        </Button>
                    </CardFooter>
                </Card>
        </div>
    )
}

export default StudentCard;
