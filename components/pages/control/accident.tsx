import Image from "next/image"
import blackHole from "@/public/BlackHole.svg";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
export default function Accident () {
    return (
        <div className=" flex flex-col gap-4">
            <div className=" flex items-center justify-between border rounded-lg p-4">
                    <div className=" space-y-1 ">
                        <p className=" font-vazirmatn font-normal text-accidentTxtClr text-lg">تأخير في فتح المظلة</p>
                        <p className=" font-vazirmatn font-normal text-[#868585] text-sm ">2025 - 07 - 20 <span> .09:00</span></p>
                    </div>
                    <div className="bg-[#F5A7C0]  p-2 rounded-xl grid place-content-center">
                    <Image src={blackHole} alt="black hole"  />
                    </div>
            </div>
            <div className=" flex items-center justify-between border rounded-lg p-4">
                    <div className=" space-y-1 ">
                        <p className=" font-vazirmatn font-normal text-accidentTxtClr text-lg">تأخير في فتح المظلة</p>
                        <p className=" font-vazirmatn font-normal text-[#868585] text-sm ">2025 - 07 - 20 <span> .09:00</span></p>
                    </div>
                    <div className="bg-[#F5A7C0]  p-2 rounded-xl grid place-content-center">
                    <Image src={blackHole} alt="black hole"  />
                    </div>
            </div>
            <Button className=" bg-updatesBtnClr text-btnTxtClr hover:bg-updatesBtnClr">
                            <Eye className=" text-btnTxtClr"/>
                            عرض الكل
                        </Button>
        </div>
    )
}