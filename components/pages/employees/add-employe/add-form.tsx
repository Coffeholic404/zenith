"use client"
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
import userRounded from "@/public/add-employe/UserRounded.svg"
export default function AddForm() {
  return (
     <div className="">
        <Card className="max-w-[830px] ">
            <CardHeader className=" px-2 py-2 font-vazirmatn font-light text-subtext ">
                الصورة الشخصية
            </CardHeader>
            <CardContent>
                <Avatar className="size-24">
                    <AvatarImage src="" alt="@shadcn" />
                    <AvatarFallback className=" border border-sidebaractive bg-avatarClr">
                        <Image src={userRounded} alt="userRounded" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    
                </div>
            </CardContent>
        </Card>
     </div>
  )
}