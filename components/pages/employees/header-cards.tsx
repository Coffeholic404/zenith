
import { Card } from "@/components/ui/card";
import UserRounded from "@/public/add-employe/UserRounded.svg"
import Dep from "@/public/employees/Diploma.svg"
import people from "@/public/employees/UserHYellow.svg"
import Image from "next/image";
export default function HeaderCards() {
  return (
    <div className=" flex items-center  w-full gap-12">
        <Card className=" max-w-[16.875rem] flex-1 rounded-[10px] shadow-none bg-cardOne p-4">
            <div className=" flex items-center justify-start gap-[14px]">
                <div className=" size-12 flex items-center justify-center bg-studentClr rounded-sm">
                    <Image src={UserRounded} alt="user rounded" width={24} height={24} />
                </div>
                <div className=" font-vazirmatn space-y-2">
                    <p className="font-normal text-base text-cardTxt">إجمالي الموظفين</p>
                    <p className=" font-bold text-xl">5</p>
                </div>
            </div>
        </Card>
        <Card className=" max-w-[16.875rem] flex-1 rounded-[10px] shadow-none bg-cardTwo p-4">
            <div className=" flex items-center justify-start gap-[14px]">
                <div className=" size-12 flex items-center justify-center bg-studentClr rounded-sm">
                    <Image src={Dep} alt="user rounded" width={24} height={24} />
                </div>
                <div className=" font-vazirmatn space-y-2">
                    <p className="font-normal text-base text-cardTxt">إجمالي الموظفين</p>
                    <p className=" font-bold text-xl">5</p>
                </div>
            </div>
        </Card>
        <Card className=" max-w-[16.875rem] flex-1 rounded-[10px] shadow-none bg-cardThree p-4">
            <div className=" flex items-center justify-start gap-[14px]">
                <div className=" size-12 flex items-center justify-center bg-couresClr rounded-sm">
                    <Image src={people} alt="user rounded" width={24} height={24} />
                </div>
                <div className=" font-vazirmatn space-y-2">
                    <p className="font-normal text-base text-cardTxt">إجمالي الموظفين</p>
                    <p className=" font-bold text-xl">5</p>
                </div>
            </div>
        </Card>
        <Card className=" max-w-[16.875rem] flex-1 rounded-[10px] shadow-none bg-cardFour p-4">
            <div className=" flex items-center justify-start gap-[14px]">
                <div className=" size-12 flex items-center justify-center bg-employeeClr rounded-sm">
                    
                </div>
                <div className=" font-vazirmatn space-y-2">
                    <p className="font-normal text-base text-cardTxt">إجمالي الموظفين</p>
                    <p className=" font-bold text-xl">5</p>
                </div>
            </div>
        </Card>
    </div>
  );
}