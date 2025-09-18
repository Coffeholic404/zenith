import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
export default function QuickActions () {
    return (
        <div>
             <Card className=" shadow-none border rounded-2xl space-y-4">
                <CardHeader className="flex rounded-t-[15px] flex-row items-center justify-between space-y-0 pb-2 pt-2 bg-[linear-gradient(90.05deg,#8870E7_0.05%,#F61C4F_125.99%)]">
                    <CardTitle className=" font-vazirmatn font-bold text-xl text-white">إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent className=" flex flex-wrap justify-evenly items-center md:gap-4">
                    <Button className=" bg-[#8870E7]  min-w-[250px]">
                        <Plus />
                        إضافة طالب جديد
                    </Button>
                    <Button className=" bg-[#8870E7]  min-w-[250px]">
                        <Plus />
                          تسجيل حادث 
                    </Button>
                    <Button className=" bg-[#8870E7]  min-w-[250px]">
                        <Plus />
                          طلب شراء
                    </Button>
                    <Button className=" bg-[#8870E7]  min-w-[250px]">
                        <Plus />
                          إضافة نشاط جديد
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}