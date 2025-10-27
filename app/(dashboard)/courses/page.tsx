"use clinet"
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



export default function Page() {
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
          <Popover>
            <PopoverTrigger asChild>
              <Button className=" bg-sidebaractive  px-3 rounded-2xl">
                <Image src={add} alt="add icon" className=" size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" max-w-24 font-vazirmatn p-2 py-4 rounded-xl">
              <div className=" flex flex-col gap-4">
                <div
                  className=" flex items-center gap-2 cursor-pointer"
                >
                  <Image src={userrounded} alt="user rounded icon" className=" size-6" />
                  <p className=" font-normal text-base text-subtext">موظف</p>
                </div>
                <div
                  className=" flex items-center gap-2 cursor-pointer"
                >
                  <Image src={userhearted} alt="user hearted icon" className=" size-6" />
                  <p className=" font-normal text-base text-sidebaractive">مدرب</p>
                </div>
              </div>
              <PopoverArrow />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <CoursesCard />
      </div>
    </section>

  )
}