import { EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover";
import phone from "@/public/employees/Phone.svg";
import pencil from "@/public/table/Pen.svg"
import trash from "@/public/employees/TrashBin.svg"
import Image from "next/image";
export default function EmployeeCard() {
  return (
    <Card className=" min-w-[22.625rem] max-w-[24.625rem] flex-1 shadow-none p-2">
      <CardContent className="  p-0 space-y-4">
        <div className=" flex items-center justify-between ">
          <div className=" flex gap-2">
            <Avatar className=" size-16">
              <AvatarImage src="/placeholder.svg" alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className=" font-vazirmatn pt-2">
              <p className=" font-medium text-lg text-cardTxt">احمد محمد</p>
              <p className=" text-sm text-subtext font-normal">
                {" "}
                العنوان الوظيفي
              </p>
            </div>
          </div>
          <div className="">
            <Popover>
              <PopoverTrigger className=" size-6 text-subtext">
                <EllipsisVertical className=" size-6 text-subtext" />
              </PopoverTrigger>
              <PopoverContent  className=" max-w-24 font-vazirmatn p-2 py-4 rounded-xl">
                <div className=" flex flex-col gap-4">
                  <div
                    className=" flex items-center gap-2 cursor-pointer"
                  >
                    <Image
                      src={pencil}
                      alt="user rounded icon"
                      className=" size-6"
                    />
                    <p className=" font-normal text-base text-subtext">
                      تعديل
                    </p>
                  </div>
                  <div className=" flex items-center gap-2 cursor-pointer">
                    <Image
                      src={trash}
                      alt="trash icon"
                      className=" size-6"
                    />
                    <p className=" font-normal text-base text-deleteTxt">
                      حذف
                    </p>
                  </div>
                </div>
                <PopoverArrow />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <Badge className=" text-[0.725rem] font-vazirmatn font-semibold text-cardTxt bg-studentClr ms-2">
            بغداد
          </Badge>
        </div>
        <Separator className="w-full mx-auto " />
        <CardFooter className="p-0  flex items-center justify-end">
          <div className=" flex items-center gap-2">
            <p className=" text-sm text-subtext font-semibold">09123456789</p>
            <Image src={phone} alt="phone" className=" size-6" />
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
