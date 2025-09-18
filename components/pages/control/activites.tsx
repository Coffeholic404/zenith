import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';
export default function Activites () {
    return (
        <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center justify-between">
                            <div className="text-sm font-medium space-y-1">
                                <p className=" font-vazirmatn font-semibold text-lg text-updatesClr">تدريب القفز الأساسي</p>
                                <p className="text-updatesClr font-vazirmatn font-extralight">10:00 ص <span>8 مشارك</span></p>
                            </div>
                            <Button variant="link" className="text-sm bg-updatesBtnClr text-btnTxtClr">
                                مكتمل
                            </Button>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <div className="text-sm font-medium space-y-1">
                                <p className=" font-vazirmatn font-semibold text-lg text-updatesClr">تدريب القفز الأساسي</p>
                                <p className="text-updatesClr font-vazirmatn font-extralight">10:00 ص <span>8 مشارك</span></p>
                            </div>
                            <Button variant="link" className="text-sm bg-updatesBtnClr text-btnTxtClr">
                                مكتمل
                            </Button>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <div className="text-sm font-medium space-y-1">
                                <p className=" font-vazirmatn font-semibold text-lg text-updatesClr">تدريب القفز الأساسي</p>
                                <p className="text-updatesClr font-vazirmatn font-extralight">10:00 ص <span>8 مشارك</span></p>
                            </div>
                            <Button variant="link" className="text-sm bg-updatesBtnClr text-btnTxtClr">
                                مكتمل
                            </Button>
                        </div>
                        <Button className=" bg-updatesBtnClr text-btnTxtClr hover:bg-updatesBtnClr">
                            <Eye className=" text-btnTxtClr"/>
                            عرض الكل
                        </Button>
                    </div>
    )   
}