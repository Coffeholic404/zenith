import Image from "next/image";
import map from "@/public/main-page/map.svg"
import diploma from  "@/public/main-page/Diploma.svg"
import student from "@/public/main-page/Urounded.svg"
import employee from "@/public/main-page/Uheart.svg"
import plane from "@/public/main-page/Plain.svg"
export default function MiniCard() {
  return (


    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">

      <div className="flex gap-2 bg-white shadow p-3 rounded-md">
        <div className=" size-10 bg-placesClr rounded-md grid place-content-center">
            <Image src={map} alt="map icon"/>
        </div>
        <div>
            <p className=" font-vazirmatn font-bold text-lg">6 مناطق</p>
            <p className=" font-vazirmatn font-normal text-xs text-subtext">الاماكن</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white shadow p-3 rounded-md">
        <div className=" size-10 bg-couresClr rounded-md grid place-content-center">
            <Image src={diploma} alt="diploma icon"/>
        </div>
        <div>
            <p className=" font-vazirmatn font-bold text-lg">10 دورات</p>
            <p className=" font-vazirmatn font-normal text-xs text-subtext">الدورات</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white shadow p-3 rounded-md">
        <div className=" size-10 bg-studentClr rounded-md grid place-content-center">
            <Image src={student} alt="student icon"/>
        </div>
        <div>
            <p className=" font-vazirmatn font-bold text-lg">200 شخص</p>
            <p className=" font-vazirmatn font-normal text-xs text-subtext">الطلاب</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white shadow p-3 rounded-md">
        <div className=" size-10 bg-employeeClr rounded-md grid place-content-center">
            <Image src={employee} alt="employee icon"/>
        </div>
        <div>
            <p className=" font-vazirmatn font-bold text-lg">70 شخص</p>
            <p className=" font-vazirmatn font-normal text-xs text-subtext">الموظفين</p>
        </div>
      </div>

      <div className="flex gap-2 bg-white shadow p-3 rounded-md">
        <div className=" size-10 bg-couresClr rounded-md grid place-content-center">
            <Image src={plane} alt="plane icon"/>
        </div>
        <div>
            <p className=" font-vazirmatn font-bold text-lg">80 قطعة</p>
            <p className=" font-vazirmatn font-normal text-xs text-subtext">الطائرات</p>
        </div>
      </div>

    </div>
  );
}