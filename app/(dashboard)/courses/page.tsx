"use client"
import HeaderCards from "@/components/pages/employees/header-cards";
import ploy from "@/public/employees/Polygon.svg";
import add from "@/public/employees/plus.svg";
import userrounded from "@/public/sidebar/UserR.svg"
import userhearted from "@/public/employees/UserHeart.svg"
import Image from "next/image";
import searchIcon from "@/public/table/Magnifer.svg";
import filterIcon from "@/public/table/Filter.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover";
import CoursesCard from "@/components/pages/courses/courses-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";



export default function Page() {
  const router = useRouter();
  return (
    <section className=" space-y-6">
      <HeaderCards />
      <div className=" flex items-center justify-between flex-1">
        <div className=" font-vazirmatn">
          <p className=" font-bold text-cardTxt text-[23px]"> الدورات</p>
          <p className=" font-light text-subtext text-lg">
              إدارة وتنظيم الدورات التدريبية
          </p>
        </div>

        <div className=" flex items-center gap-4">
          <div className=" relative">
            <Image
              src={searchIcon}
              alt="magnifier icon"
              className=" absolute inset-y-2  start-2 flex items-center  pointer-events-none"
            />
            <Input
              id="search"
              placeholder="بحث ..."
              className=" bg-white rounded-xl block w-full p-4 ps-10 min-w-[21rem] font-vazirmatn placeholder:text-placeholderClr placeholder:text-base placeholder:font-normal focus-visible:ring-1 focus-visible:ring-searchBg focus-visible:ring-offset-2"
            />
          </div>
          <div className=" bg-white size-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-searchBg">
            <Image src={filterIcon} alt="filter icon" className=" size-6" />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className=" bg-sidebaractive  px-3 rounded-2xl" onClick={() => router.push("/courses/add-courses")}>
                <Image src={add} alt="add icon" className=" size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className=" bg-sidebaractive text-white">
              <p className=" font-normal text-sm text-white font-vazirmatn">إضافة دورة</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div>
        <CoursesCard />
      </div>
    </section>

  )
}