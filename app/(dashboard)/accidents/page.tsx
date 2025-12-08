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
import { useGetAccidentsQuery } from "@/services/accident";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import searchIcon from "@/public/table/Magnifer.svg";
import filterIcon from "@/public/table/Filter.svg";
import add from "@/public/employees/plus.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import ActivitiesCard from "@/components/pages/activities/Activity-Card";
import ActivityCard from "@/components/pages/activities/Activity-Card";
import AccidentCard from "@/components/pages/accidents/Accident-Card";


export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = React.useState<string>(searchParams.get("q") ?? "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState<string>(searchTerm);
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) params.set("q", debouncedSearchTerm);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetAccidentsQuery({
    searchQuery: debouncedSearchTerm,
  });

  return (
    <div className=" space-y-6 ">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className=" font-vazirmatn">
          <p className=" font-bold text-cardTxt ">إدارة الحوادث</p>
          <p className=" font-light text-subtext text-lg">
            تنظيم وإدارة الحوادث
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          <div className="relative flex-1 min-w-[200px] sm:min-w-[280px] lg:min-w-0 lg:flex-initial" aria-label="بحث عن الطلاب" aria-busy={isFetching}>
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
          <div className="bg-white size-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-searchBg shrink-0">
            <Image src={filterIcon} alt="filter icon" className=" size-6" />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="bg-sidebaractive px-3 rounded-2xl shrink-0" onClick={() => router.push("/accidents/add-accidents")}>
                <Image src={add} alt="add icon" className=" size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className=" bg-sidebaractive text-white">
              <p className=" font-normal text-sm text-white font-vazirmatn">إضافة حادث</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-start gap-y-4 flex-wrap">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-1">
              <Card className="w-[22.375rem] rounded-2xl">
                <CardHeader className="flex items-center justify-start flex-row gap-2 p-2 px-3">
                  <Skeleton className="size-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </CardHeader>
                <Separator className="my-8 mb-6 text-[#CCCCCC] max-w-[284px] mx-auto border rounded-2xl border-[#CCCCCC]" />
                <CardFooter className="flex items-center justify-center flex-row gap-2 p-2">
                  <Skeleton className="w-[130px] h-10 rounded-xl" />
                  <Skeleton className="w-[130px] h-10 rounded-xl" />
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <>
          {isError && (
            <div role="alert" className="bg-[#FDECEC] border border-red-200 text-red-700 rounded-xl p-3 font-vazirmatn">
              حدث خطأ أثناء تحميل الطلاب. يرجى المحاولة مرة أخرى.
              <Button variant="outline" className="ml-2 rounded-xl" onClick={() => refetch()}>
                إعادة المحاولة
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data?.result?.data?.map((accident) => (
              <AccidentCard key={accident.id} accident={accident} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}