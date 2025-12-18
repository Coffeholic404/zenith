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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EmployeeCard from "@/components/pages/employees/employee-card";
import { useGetEmployeesQuery } from "@/services/employe";
import React, { useState } from "react";

export default function Page() {
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Controlled search term with URL persistence
  const [searchTerm, setSearchTerm] = React.useState<string>(searchParams.get("q") ?? "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState<string>(searchTerm);
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  // Persist debounced term in URL
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) params.set("q", debouncedSearchTerm);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const { data: employees, isLoading, isFetching, isError, error, refetch } = useGetEmployeesQuery({
    searchQuery: debouncedSearchTerm,
  });



  const handleAddEmployee = () => {
    router.push('/employees/add-employe');
  };
  const handleAddTrainer = () => {
    router.push('/employees/add-trainer');
  };


  if (!employees) return null;


  return (
    <div className=" space-y-6">
      <HeaderCards />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="font-vazirmatn">
          <p className="font-bold text-cardTxt">إدارة الموظفين</p>
          <p className="font-light text-subtext text-lg">
            دليل الموظفين والمدربين
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          <div className="relative flex-1 min-w-[200px] sm:min-w-[280px] lg:min-w-0 lg:flex-initial" aria-label="بحث عن الموظفين" aria-busy={isFetching}>
            <Image
              src={searchIcon}
              alt="magnifier icon"
              className="absolute inset-y-2 start-2 flex items-center pointer-events-none"
            />
            <Input
              id="search"
              role="searchbox"
              aria-label="حقل البحث"
              placeholder="بحث ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                } else if (e.key === "Enter") {
                  if (debounceRef.current) window.clearTimeout(debounceRef.current);
                  setDebouncedSearchTerm(searchTerm);
                }
              }}
              className="bg-white rounded-xl w-full p-4 ps-10 lg:min-w-[21rem] font-vazirmatn placeholder:text-placeholderClr placeholder:text-base placeholder:font-normal focus-visible:ring-1 focus-visible:ring-searchBg focus-visible:ring-offset-2"
            />
            {isFetching && (
              <div aria-hidden className="absolute inset-y-0 end-10 my-auto size-4 rounded-full border-2 border-searchBg border-t-transparent animate-spin" />
            )}
            {!!searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                }}
                aria-label="مسح البحث"
                className="absolute inset-y-0 end-2 my-auto size-6 flex items-center justify-center rounded-full bg-searchBg hover:bg-[#DAF1FF] text-[#666]"
              >
                ×
                <span className="sr-only">مسح</span>
              </button>
            )}
          </div>
          {/* <div className="bg-white size-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-searchBg shrink-0">
            <Image src={filterIcon} alt="filter icon" className="size-6" />
          </div> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-sidebaractive px-3 rounded-2xl shrink-0">
                <Image src={add} alt="add icon" className="size-5" />
                <Image src={ploy} alt="ploy icon" className="size-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-24 font-vazirmatn p-2 py-4 rounded-xl">
              <div className="flex flex-col gap-4">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleAddEmployee}>
                  <Image src={userrounded} alt="user rounded icon" className="size-6" />
                  <p className="font-normal text-base text-subtext">موظف</p>
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleAddTrainer}>
                  <Image src={userhearted} alt="user hearted icon" className="size-6" />
                  <p className="font-normal text-base text-sidebaractive">مدرب</p>
                </div>
              </div>
              <PopoverArrow />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Error state */}
      {isError && (
        <div role="alert" className="bg-[#FDECEC] border border-red-200 text-red-700 rounded-xl p-3 font-vazirmatn">
          حدث خطأ أثناء تحميل الموظفين. يرجى المحاولة مرة أخرى.
          <Button variant="outline" className="ml-2 rounded-xl" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {employees.result.data.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} isEdit={isEdit} setIsEdit={setIsEdit} />
        ))}

      </div>
    </div>
  );
}
