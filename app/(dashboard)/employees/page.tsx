"use client"
import HeaderCards from "@/components/pages/employees/header-cards";
import Image from "next/image";
import searchIcon from "@/public/table/Magnifer.svg";
import filterIcon from "@/public/table/Filter.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ploy from "@/public/employees/Polygon.svg";
import add from "@/public/employees/plus.svg";
import userrounded from "@/public/sidebar/UserR.svg"
import userhearted from "@/public/employees/UserHeart.svg"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import EmployeeCard from "@/components/pages/employees/employee-card";
import { useGetEmployeesQuery } from "@/services/employe";

export default function Page() {
  const router = useRouter();
  const { data: employees, isLoading } = useGetEmployeesQuery({});

  
  
  const handleAddEmployee = () => {
    router.push('/employees/add-employe');
  };
  const handleAddTrainer = () => {
    router.push('/employees/add-trainer');
  };


  if(!employees) return null;
  console.log(employees.result.data);


  return (
    <div className=" space-y-6">
      <HeaderCards />
      <div className=" flex items-center justify-between">
        <div className=" font-vazirmatn">
          <p className=" font-bold text-cardTxt ">إدارة الموظفين</p>
          <p className=" font-light text-subtext text-lg">
            دليل الموظفين والمدربين
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
                <Image src={ploy} alt="ploy icon" className=" size-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" max-w-24 font-vazirmatn p-2 py-4 rounded-xl">
              <div className=" flex flex-col gap-4">
                <div 
                 className=" flex items-center gap-2 cursor-pointer"
                 onClick={handleAddEmployee}>
                  <Image src={userrounded} alt="user rounded icon" className=" size-6" />
                  <p className=" font-normal text-base text-subtext">موظف</p>
                </div>
                <div 
                 className=" flex items-center gap-2 cursor-pointer"
                 onClick={handleAddTrainer}>
                  <Image src={userhearted} alt="user hearted icon" className=" size-6" />
                  <p className=" font-normal text-base text-sidebaractive">مدرب</p>
                </div>
              </div>
              <PopoverArrow />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className=" flex flex-wrap gap-6">
        {employees.result.data.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
        
      </div>
    </div>
  );
}
