import HeaderCards from "@/components/pages/employees/header-cards";
import Image from "next/image";
import searchIcon from "@/public/table/Magnifer.svg";
import filterIcon from "@/public/table/Filter.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <div className=" space-y-4">
      <HeaderCards />
      <div className=" flex items-center justify-between">
        <div className=" font-vazirmatn">
          <p className=" font-bold text-cardTxt ">إدارة الموظفين</p>
          <p className=" font-light text-subtext text-lg">
            دليل الموظفين والمدربين
          </p>
        </div>

        <div className=" flex">
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
          <div className=" bg-white size-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-searchBg" >
            <Image 
              src={filterIcon}
              alt="filter icon"
              className=" size-6"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
