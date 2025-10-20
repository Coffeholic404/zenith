"use client"
import HeaderCards from "@/components/pages/employees/header-cards";
import StudentCard from "@/components/pages/students/student-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useGetStudentsQuery } from "@/services/students";
import Image from "next/image";
import searchIcon from "@/public/table/Magnifer.svg";
import filterIcon from "@/public/table/Filter.svg";
import add from "@/public/employees/plus.svg";
import { useRouter } from "next/navigation";


export default function Page() {
  const { data, isLoading } = useGetStudentsQuery({});
  const router = useRouter();

  return (
    <div className=" space-y-6 ">
      <HeaderCards />
      <div className=" flex items-center justify-between flex-1">
        <div className=" font-vazirmatn">
          <p className=" font-bold text-cardTxt ">إدارة الطلاب</p>
          <p className=" font-light text-subtext text-lg">
            قائمة الطلاب المسجلين
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
              <Button className=" bg-sidebaractive  px-3 rounded-2xl" onClick={() => router.push("/students/add-student")}>
                <Image src={add} alt="add icon" className=" size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className=" bg-sidebaractive text-white">
              <p className=" font-normal text-sm text-white font-vazirmatn">إضافة طالب</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className=" flex items-center justify-start gap-y-4 flex-wrap">
          {data?.result?.data?.map((student) => (
            <StudentCard key={student.uniqueID} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}